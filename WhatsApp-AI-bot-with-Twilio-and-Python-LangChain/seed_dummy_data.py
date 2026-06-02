"""
seed_dummy_data.py – PostOpPal
Run this once to populate the database with dummy patients for testing.

Usage:
    python seed_dummy_data.py
"""

import sqlite3
import datetime
import os

SESSION_DB = os.getenv("SESSION_DB", "sessions.db")
PATIENT_DB = os.getenv("PATIENT_DB", "patients.db")
WEARABLE_DB = os.getenv("WEARABLE_DB", "wearable_data.db")

# ── Dummy patients ────────────────────────────────────────────────────────────
DUMMY_PATIENTS = [
    {
        "patient_id":   "1001",
        "whatsapp":     "whatsapp:+911234567890",   # change to your number for testing
        "name":         "Rajesh Kumar",
        "age":          52,
        "surgery_type": "Knee Replacement (Total Knee Arthroplasty)",
        "surgery_date": (datetime.date.today() - datetime.timedelta(days=5)).isoformat(),
        "doctor_name":  "Dr. Arvind Sharma",
        "allergies":    "Penicillin",
        "medications":  "Ibuprofen 400mg twice daily, Pantoprazole 40mg once daily",
        "notes":        "Patient has mild hypertension. Avoid NSAIDs if pain worsens.",
    },
    {
        "patient_id":   "1002",
        "whatsapp":     "whatsapp:+919876543210",
        "name":         "Priya Mehta",
        "age":          34,
        "surgery_type": "Appendectomy (Laparoscopic)",
        "surgery_date": (datetime.date.today() - datetime.timedelta(days=2)).isoformat(),
        "doctor_name":  "Dr. Sunita Rao",
        "allergies":    "None",
        "medications":  "Amoxicillin 500mg three times daily, Paracetamol 500mg as needed",
        "notes":        "Laparoscopic — 3 small incisions. Light diet for first week.",
    },
    {
        "patient_id":   "1003",
        "whatsapp":     "whatsapp:+917654321098",
        "name":         "Mohammed Irfan",
        "age":          45,
        "surgery_type": "Cardiac Bypass Surgery (CABG)",
        "surgery_date": (datetime.date.today() - datetime.timedelta(days=10)).isoformat(),
        "doctor_name":  "Dr. Rakesh Gupta",
        "allergies":    "Aspirin, Latex",
        "medications":  "Warfarin 5mg daily, Metoprolol 25mg twice daily, Atorvastatin 40mg",
        "notes":        "Sternotomy incision — no lifting over 2kg. Cardiac rehab starts week 4.",
    },
    {
        "patient_id":   "1004",
        "whatsapp":     "whatsapp:+916543210987",
        "name":         "Anita Desai",
        "age":          28,
        "surgery_type": "Caesarean Section (C-Section)",
        "surgery_date": (datetime.date.today() - datetime.timedelta(days=3)).isoformat(),
        "doctor_name":  "Dr. Meena Pillai",
        "allergies":    "None",
        "medications":  "Iron supplements, Calcium, Paracetamol 650mg as needed",
        "notes":        "Breastfeeding. Avoid strenuous activity. Incision care critical.",
    },
    {
        "patient_id":   "1005",
        "whatsapp":     "whatsapp:+915432109876",
        "name":         "Suresh Patel",
        "age":          60,
        "surgery_type": "Hip Replacement (Total Hip Arthroplasty)",
        "surgery_date": (datetime.date.today() - datetime.timedelta(days=7)).isoformat(),
        "doctor_name":  "Dr. Vikram Nair",
        "allergies":    "Sulfa drugs",
        "medications":  "Enoxaparin 40mg daily, Tramadol 50mg as needed, Omeprazole 20mg",
        "notes":        "Diabetic patient. Blood sugar monitoring required. No hip flexion > 90 degrees.",
    },
]

DUMMY_WEARABLE = [
    {"patient_id": "1001", "heart_rate": 88,  "steps": 1200, "sleep_hours": 6.5, "spo2": 97, "temperature": 37.1},
    {"patient_id": "1002", "heart_rate": 75,  "steps": 500,  "sleep_hours": 7.0, "spo2": 99, "temperature": 36.8},
    {"patient_id": "1003", "heart_rate": 65,  "steps": 300,  "sleep_hours": 5.5, "spo2": 96, "temperature": 37.3},
    {"patient_id": "1004", "heart_rate": 82,  "steps": 800,  "sleep_hours": 4.5, "spo2": 98, "temperature": 36.9},
    {"patient_id": "1005", "heart_rate": 72,  "steps": 600,  "sleep_hours": 7.5, "spo2": 97, "temperature": 37.0},
]

DUMMY_RECOVERY_PLANS = {
    "1001": """📋 *Recovery Plan – Knee Replacement (Rajesh Kumar)*

📅 *Week 1 (Days 1–7)*
• Rest with leg elevated above heart level
• Ice knee 20 mins every 2 hours
• Walk only with walker/crutches as instructed
• Do gentle ankle pumps every hour to prevent clots
• 🍽️ High protein diet (eggs, dal, paneer) to aid healing

📅 *Week 2 (Days 8–14)*
• Start physiotherapy exercises (quad sets, straight leg raises)
• Reduce pain meds gradually
• Short walks 3–4 times daily (5–10 mins each)
• Stairs with support only

📅 *Week 3–4*
• Increase walking distance daily
• Stationary cycling if cleared by Dr. Sharma
• Resume light daily activities

⚠️ *Call Dr. Sharma immediately if:*
• Knee becomes red, hot, or very swollen
• Fever above 38°C
• Calf pain or swelling (DVT sign)
• Wound discharge or opening

💊 *Medications*
• Ibuprofen 400mg with food — do NOT take on empty stomach
• Pantoprazole protects stomach — take 30 mins before meals""",

    "1002": """📋 *Recovery Plan – Appendectomy (Priya Mehta)*

📅 *Days 1–3*
• Rest completely, avoid any lifting
• Clear liquids only → progress to soft foods
• Keep incision sites dry and clean
• Pain is normal — Paracetamol as needed

📅 *Days 4–7*
• Light walking around the house
• Soft diet (khichdi, curd, soup)
• Shower carefully — pat incisions dry
• Return to Dr. Rao for wound check

📅 *Week 2*
• Resume light activities
• Avoid driving for 1 week
• No gym or heavy lifting for 4 weeks

⚠️ *Call Dr. Rao immediately if:*
• Fever above 38°C
• Increasing belly pain
• Redness/swelling around any incision
• Nausea/vomiting that won't stop

💊 *Medications*
• Complete full Amoxicillin course — do NOT stop early
• Paracetamol only as needed for pain""",

    "1003": """📋 *Recovery Plan – Cardiac Bypass (Mohammed Irfan)*

📅 *Week 1–2*
• Complete bed rest with gradual sitting
• Deep breathing exercises every hour (prevents pneumonia)
• NO lifting anything over 2kg — sternum healing
• Heart rate and BP monitoring twice daily
• Warfarin — take at same time every day

📅 *Week 3–4*
• Short walks indoors (5 mins, 3x daily)
• Cardiac rehab referral from Dr. Gupta
• Low sodium, low fat diet

📅 *Week 5–6*
• Increase walks to 15–20 mins
• No driving for 6 weeks
• Emotional support important — mood changes are normal

⚠️ *Emergency — Call 112 if:*
• Chest pain or pressure
• Shortness of breath at rest
• Sudden dizziness or fainting
• Sternal wound opens or discharges

💊 *Medications — CRITICAL*
• Warfarin — never skip, no self-dose changes
• Avoid Aspirin (allergy noted)
• Metoprolol — never stop suddenly""",

    "1004": """📋 *Recovery Plan – C-Section (Anita Desai)*

📅 *Days 1–3*
• Rest as much as possible — sleep when baby sleeps
• Incision care: keep dry, check daily for redness
• Accept all help offered — do not push yourself
• Breastfeeding supported — good for healing hormones

📅 *Days 4–7*
• Short gentle walks at home
• No stairs more than necessary
• Iron + Calcium daily — critical for recovery
• Stay hydrated (3L water/day for breastfeeding)

📅 *Week 2–4*
• Gradually increase activity
• No driving for 4–6 weeks
• No lifting anything heavier than baby
• Incision scar massage after 6 weeks (once healed)

⚠️ *Call Dr. Pillai immediately if:*
• Fever above 38°C
• Heavy bleeding (more than normal period)
• Incision opens, reddens, or has discharge
• Signs of depression or anxiety (normal but needs support)

💊 *Medications*
• Iron — take with Vitamin C juice for absorption
• Paracetamol safe while breastfeeding""",

    "1005": """📋 *Recovery Plan – Hip Replacement (Suresh Patel)*

📅 *Week 1*
• Use walker at all times — no weight without it
• Hip precautions: NO bending hip > 90°, NO crossing legs
• Elevated toilet seat required
• Blood sugar checks 2x daily (diabetic care)
• Enoxaparin injection as prescribed (clot prevention)

📅 *Week 2*
• Start physiotherapy — hip strengthening exercises
• Progress from walker to crutches if cleared
• Diabetic diet — high protein, low sugar for wound healing

📅 *Week 3–4*
• Increase walking distance
• Stationary bike if cleared by Dr. Nair
• No driving for 6 weeks

⚠️ *Call Dr. Nair immediately if:*
• Hip pain suddenly worsens (dislocation sign)
• Leg becomes cold, pale, or numb
• Wound shows redness or discharge
• Blood sugar consistently above 200 mg/dL

💊 *Medications*
• Enoxaparin injection — critical for clot prevention
• Tramadol — take with food, avoid alcohol
• Check blood sugar before Tramadol doses""",
}


# ── Seed functions ────────────────────────────────────────────────────────────
def seed_sessions():
    conn = sqlite3.connect(SESSION_DB)
    conn.execute("""CREATE TABLE IF NOT EXISTS sessions(
        from_number TEXT PRIMARY KEY,
        patient_id  TEXT,
        created_at  TEXT
    )""")
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for p in DUMMY_PATIENTS:
        conn.execute(
            "INSERT OR REPLACE INTO sessions(from_number, patient_id, created_at) VALUES (?,?,?)",
            (p["whatsapp"], p["patient_id"], now),
        )
    conn.commit()
    conn.close()
    print(f"✅ Sessions seeded ({len(DUMMY_PATIENTS)} patients)")


def seed_patients():
    conn = sqlite3.connect(PATIENT_DB)
    conn.execute("""CREATE TABLE IF NOT EXISTS patients (
        patient_id TEXT PRIMARY KEY, name TEXT, age INTEGER,
        surgery_type TEXT, surgery_date TEXT, doctor_name TEXT,
        allergies TEXT, medications TEXT, notes TEXT,
        created_at TEXT, updated_at TEXT
    )""")
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for p in DUMMY_PATIENTS:
        conn.execute(
            """INSERT OR REPLACE INTO patients
               (patient_id, name, age, surgery_type, surgery_date,
                doctor_name, allergies, medications, notes, created_at, updated_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            (
                p["patient_id"], p["name"], p["age"], p["surgery_type"],
                p["surgery_date"], p["doctor_name"], p["allergies"],
                p["medications"], p["notes"], now, now,
            ),
        )
    conn.commit()
    conn.close()
    print(f"✅ Patients seeded ({len(DUMMY_PATIENTS)} profiles)")


def seed_recovery_plans():
    conn = sqlite3.connect(PATIENT_DB)
    conn.execute("""CREATE TABLE IF NOT EXISTS recovery_plans (
        patient_id TEXT PRIMARY KEY, plan_json TEXT, generated_at TEXT
    )""")
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for patient_id, plan in DUMMY_RECOVERY_PLANS.items():
        conn.execute(
            "INSERT OR REPLACE INTO recovery_plans(patient_id, plan_json, generated_at) VALUES (?,?,?)",
            (patient_id, plan, now),
        )
    conn.commit()
    conn.close()
    print(f"✅ Recovery plans seeded ({len(DUMMY_RECOVERY_PLANS)} plans)")


def seed_wearable():
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute("""CREATE TABLE IF NOT EXISTS wearable (
        from_number TEXT PRIMARY KEY, heart_rate REAL,
        steps REAL, sleep_hours REAL, updated_at TEXT
    )""")
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    for w in DUMMY_WEARABLE:
        conn.execute(
            """INSERT OR REPLACE INTO wearable
               (from_number, heart_rate, steps, sleep_hours, updated_at)
               VALUES (?,?,?,?,?)""",
            (w["patient_id"], w["heart_rate"], w["steps"], w["sleep_hours"], now),
        )
    conn.commit()
    conn.close()
    print(f"✅ Wearable data seeded ({len(DUMMY_WEARABLE)} readings)")


def print_summary():
    print("\n" + "="*55)
    print("📋 DUMMY PATIENTS CREATED")
    print("="*55)
    for p in DUMMY_PATIENTS:
        days = (datetime.date.today() - datetime.date.fromisoformat(p["surgery_date"])).days
        print(f"\n🔹 Patient ID : {p['patient_id']}")
        print(f"   Name       : {p['name']}")
        print(f"   Surgery    : {p['surgery_type']}")
        print(f"   Days post-op: {days} days")
        print(f"   WhatsApp   : {p['whatsapp']}")
        print(f"   QR Code msg: POSTOPPAL_PATIENT_{p['patient_id']}")
    print("\n" + "="*55)
    print("💡 TO TEST: Send this message on WhatsApp to your bot:")
    print(f"   POSTOPPAL_PATIENT_1001")
    print("   Then ask: 'Is my pain normal?'")
    print("="*55 + "\n")


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n🌱 Seeding PostOpPal dummy data...\n")
    seed_sessions()
    seed_patients()
    seed_recovery_plans()
    seed_wearable()
    print_summary()