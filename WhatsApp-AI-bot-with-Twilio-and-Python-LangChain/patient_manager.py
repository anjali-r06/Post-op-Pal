"""
patient_manager.py – PostOpPal
Stores patient profiles and generates personalized recovery plans.
"""

import sqlite3
import datetime
import os
import json

PATIENT_DB = os.getenv("PATIENT_DB", "patients.db")


# ── DB init ───────────────────────────────────────────────────────────────────
def _init_db() -> None:
    conn = sqlite3.connect(PATIENT_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id      TEXT PRIMARY KEY,
            name            TEXT,
            age             INTEGER,
            surgery_type    TEXT,
            surgery_date    TEXT,
            doctor_name     TEXT,
            allergies       TEXT,
            medications     TEXT,
            notes           TEXT,
            created_at      TEXT,
            updated_at      TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS recovery_plans (
            patient_id      TEXT PRIMARY KEY,
            plan_json       TEXT,
            generated_at    TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id      TEXT,
            from_number     TEXT,
            role            TEXT,
            message         TEXT,
            timestamp       TEXT
        )
    """)
    conn.commit()
    conn.close()


_init_db()


# ── Patient CRUD ──────────────────────────────────────────────────────────────
def save_patient(patient_id: str, **kwargs) -> None:
    """Create or update a patient profile."""
    conn = sqlite3.connect(PATIENT_DB)
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # Check if exists
    row = conn.execute(
        "SELECT patient_id FROM patients WHERE patient_id = ?", (patient_id,)
    ).fetchone()

    if row:
        # Update only provided fields
        fields = {k: v for k, v in kwargs.items() if v is not None}
        fields["updated_at"] = now
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        values = list(fields.values()) + [patient_id]
        conn.execute(f"UPDATE patients SET {set_clause} WHERE patient_id = ?", values)
    else:
        conn.execute(
            """INSERT INTO patients
               (patient_id, name, age, surgery_type, surgery_date,
                doctor_name, allergies, medications, notes, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                patient_id,
                kwargs.get("name"),
                kwargs.get("age"),
                kwargs.get("surgery_type"),
                kwargs.get("surgery_date"),
                kwargs.get("doctor_name"),
                kwargs.get("allergies"),
                kwargs.get("medications"),
                kwargs.get("notes"),
                now, now,
            ),
        )
    conn.commit()
    conn.close()


def get_patient(patient_id: str) -> dict | None:
    """Fetch a patient profile by ID."""
    conn = sqlite3.connect(PATIENT_DB)
    row = conn.execute(
        """SELECT patient_id, name, age, surgery_type, surgery_date,
                  doctor_name, allergies, medications, notes, created_at
           FROM patients WHERE patient_id = ?""",
        (patient_id,),
    ).fetchone()
    conn.close()

    if not row:
        return None

    return {
        "patient_id":   row[0],
        "name":         row[1],
        "age":          row[2],
        "surgery_type": row[3],
        "surgery_date": row[4],
        "doctor_name":  row[5],
        "allergies":    row[6],
        "medications":  row[7],
        "notes":        row[8],
        "created_at":   row[9],
    }


def days_since_surgery(patient: dict) -> int | None:
    """Return how many days have passed since surgery."""
    if not patient or not patient.get("surgery_date"):
        return None
    try:
        sd = datetime.datetime.fromisoformat(patient["surgery_date"]).date()
        return (datetime.date.today() - sd).days
    except (ValueError, TypeError):
        return None


# ── Recovery plan ─────────────────────────────────────────────────────────────
def save_recovery_plan(patient_id: str, plan: str) -> None:
    """Save a generated recovery plan."""
    conn = sqlite3.connect(PATIENT_DB)
    conn.execute(
        """INSERT OR REPLACE INTO recovery_plans (patient_id, plan_json, generated_at)
           VALUES (?, ?, ?)""",
        (patient_id, plan, datetime.datetime.now(datetime.timezone.utc).isoformat()),
    )
    conn.commit()
    conn.close()


def get_recovery_plan(patient_id: str) -> str | None:
    """Fetch the stored recovery plan for a patient."""
    conn = sqlite3.connect(PATIENT_DB)
    row = conn.execute(
        "SELECT plan_json FROM recovery_plans WHERE patient_id = ?", (patient_id,)
    ).fetchone()
    conn.close()
    return row[0] if row else None


# ── Chat history ──────────────────────────────────────────────────────────────
def save_chat(patient_id: str, from_number: str, role: str, message: str) -> None:
    """Append a message to chat history (role: 'user' or 'assistant')."""
    conn = sqlite3.connect(PATIENT_DB)
    conn.execute(
        """INSERT INTO chat_history (patient_id, from_number, role, message, timestamp)
           VALUES (?, ?, ?, ?, ?)""",
        (
            patient_id, from_number, role, message,
            datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ),
    )
    conn.commit()
    conn.close()


def get_chat_history(patient_id: str, limit: int = 10) -> list[dict]:
    """Return the last *limit* messages for a patient."""
    conn = sqlite3.connect(PATIENT_DB)
    rows = conn.execute(
        """SELECT role, message, timestamp FROM chat_history
           WHERE patient_id = ?
           ORDER BY id DESC LIMIT ?""",
        (patient_id, limit),
    ).fetchall()
    conn.close()
    return [{"role": r[0], "message": r[1], "timestamp": r[2]} for r in reversed(rows)]


# ── Prompt builder ────────────────────────────────────────────────────────────
def build_patient_context(patient_id: str, wearable_data: dict | None = None) -> str:
    """Build a rich context string to inject into the AI prompt."""
    patient = get_patient(patient_id)
    if not patient:
        return f"Patient ID: {patient_id} (no profile on file)"

    days = days_since_surgery(patient)
    days_str = f"{days} days ago" if days is not None else "unknown"

    lines = [
        f"Patient ID     : {patient['patient_id']}",
        f"Name           : {patient['name'] or 'Not provided'}",
        f"Age            : {patient['age'] or 'Not provided'}",
        f"Surgery        : {patient['surgery_type'] or 'Not provided'}",
        f"Surgery date   : {patient['surgery_date'] or 'Not provided'} ({days_str})",
        f"Doctor         : {patient['doctor_name'] or 'Not provided'}",
        f"Allergies      : {patient['allergies'] or 'None known'}",
        f"Medications    : {patient['medications'] or 'Not provided'}",
        f"Notes          : {patient['notes'] or 'None'}",
    ]

    if wearable_data:
        lines += [
            f"Heart rate     : {wearable_data.get('heart_rate')} bpm",
            f"Steps today    : {wearable_data.get('steps')}",
            f"Sleep last night: {wearable_data.get('sleep_hours')} hrs",
        ]

    plan = get_recovery_plan(patient_id)
    if plan:
        lines.append(f"\nRecovery Plan:\n{plan}")

    return "\n".join(lines)


def build_recovery_plan_prompt(patient_id: str) -> str:
    """Build a prompt asking Gemini to generate a personalized recovery plan."""
    patient = get_patient(patient_id)
    if not patient:
        return ""

    days = days_since_surgery(patient)

    return f"""You are an expert post-operative care specialist.

Create a detailed, personalized week-by-week recovery plan for this patient:

Name         : {patient['name'] or 'Patient'}
Age          : {patient['age'] or 'Unknown'}
Surgery type : {patient['surgery_type'] or 'General surgery'}
Days post-op : {days if days is not None else 'Unknown'}
Allergies    : {patient['allergies'] or 'None'}
Medications  : {patient['medications'] or 'Not specified'}
Doctor notes : {patient['notes'] or 'None'}

The plan should include:
1. 📅 Week-by-week milestones (activity, diet, wound care)
2. 💊 Medication reminders relevant to surgery type
3. 🚶 Activity progression (rest → light walking → normal)
4. 🍽️ Diet recommendations for healing
5. ⚠️ Warning signs to watch for
6. 📞 When to contact the doctor immediately

Keep it friendly, clear, and easy to follow via WhatsApp.
Use emojis for readability. Be specific to this patient's surgery type."""