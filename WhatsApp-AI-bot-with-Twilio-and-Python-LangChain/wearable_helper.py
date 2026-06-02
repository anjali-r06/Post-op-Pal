"""
wearable_helper.py – PostOpPal
Stores and retrieves wearable health data (heart rate, steps, sleep)
per user, and computes a simple post-op risk level.
"""

import sqlite3
import datetime
import os
from typing import Optional

WEARABLE_DB = os.getenv("WEARABLE_DB", "wearable_data.db")


# ── DB init ───────────────────────────────────────────────────────────────────
def _init_db() -> None:
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS wearable (
            from_number TEXT PRIMARY KEY,
            heart_rate  REAL,
            steps       REAL,
            sleep_hours REAL,
            updated_at  TEXT
        )
    """)
    conn.commit()
    conn.close()


_init_db()


# ── Public API ────────────────────────────────────────────────────────────────
def save_wearable_data(from_number: str, hr, steps, sleep) -> None:
    """Persist the latest wearable reading for a user."""
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute(
        """INSERT OR REPLACE INTO wearable
           (from_number, heart_rate, steps, sleep_hours, updated_at)
           VALUES (?, ?, ?, ?, ?)""",
        (
            from_number,
            float(hr),
            float(steps),
            float(sleep),
            datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ),
    )
    conn.commit()
    conn.close()


def get_wearable_data(from_number: str) -> Optional[dict]:
    """Return the latest wearable reading for a user, or None if not found."""
    conn = sqlite3.connect(WEARABLE_DB)
    row = conn.execute(
        "SELECT heart_rate, steps, sleep_hours, updated_at FROM wearable WHERE from_number = ?",
        (from_number,),
    ).fetchone()
    conn.close()

    if not row:
        return None

    return {
        "heart_rate":  row[0],
        "steps":       row[1],
        "sleep_hours": row[2],
        "updated_at":  row[3],
    }


# ── Risk level ordering helper ────────────────────────────────────────────────
_RISK_ORDER = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "UNKNOWN": -1}


def _higher_risk(a: str, b: str) -> str:
    """Return whichever risk level is more severe."""
    return a if _RISK_ORDER.get(a, -1) >= _RISK_ORDER.get(b, -1) else b


def wearable_risk(data: Optional[dict]) -> str:
    """
    Return a simple risk label based on wearable readings.

    Also considers spo2 and temperature if present in the data dict
    (populated when data comes from the extended wearable_history table).

    Risk levels:
      HIGH    – heart rate dangerously low/high, critical SpO2, or high fever
      MEDIUM  – borderline heart rate, low activity, poor sleep, or mild SpO2/temp
      LOW     – all readings within healthy post-op range
      UNKNOWN – no data available
    """
    if not data:
        return "UNKNOWN"

    hr    = data.get("heart_rate",  0) or 0
    steps = data.get("steps",       0) or 0
    sleep = data.get("sleep_hours", 0) or 0
    spo2  = data.get("spo2")
    temp  = data.get("temperature")

    risk = "LOW"

    # ── Heart rate ────────────────────────────────────────────────────────────
    if hr < 40 or hr > 130:
        risk = _higher_risk(risk, "HIGH")
    elif hr < 50 or hr > 110:
        risk = _higher_risk(risk, "MEDIUM")

    # ── Sleep ─────────────────────────────────────────────────────────────────
    if sleep < 3:
        risk = _higher_risk(risk, "HIGH")
    elif sleep < 5:
        risk = _higher_risk(risk, "MEDIUM")

    # ── Steps (very low mobility post-op) ─────────────────────────────────────
    if steps < 500:
        risk = _higher_risk(risk, "MEDIUM")

    # ── SpO2 (if available) ───────────────────────────────────────────────────
    if spo2 is not None:
        if spo2 < 90:
            risk = _higher_risk(risk, "HIGH")
        elif spo2 < 94:
            risk = _higher_risk(risk, "MEDIUM")

    # ── Temperature in °C (if available) ─────────────────────────────────────
    if temp is not None:
        if temp > 39.0:
            risk = _higher_risk(risk, "HIGH")
        elif temp > 37.5:
            risk = _higher_risk(risk, "MEDIUM")

    return risk