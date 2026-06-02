"""
wearable_sync.py – PostOpPal
Wearable data sync for BOLT / Boult and other Android wearables.
 
⚠️  IMPORTANT: Google Fit REST API was shut down on June 30 2025.
    Server-side polling of Google Fit is NO LONGER POSSIBLE.
    This file now uses a PUSH model instead:
 
    BOLT band → GOBOULT Fit app → Health Connect (Android)
               → HTTP Shortcuts / Tasker / custom app
               → POST /api/wearable/sync  (this server)
 
Two modes that still work:
  1. PUSH ENDPOINT  – phone app / automation tool POSTs data here
                      (recommended, works with any band)
  2. MANUAL ENTRY   – patient types "wearable <hr> <steps> <sleep>"
                      in WhatsApp (fallback, zero setup)
 
Setup for BOLT band (GOBOULT Fit → Health Connect → server):
  1. Install "GOBOULT Fit" from Play Store → pair your BOLT band.
  2. Install "Health Connect" from Play Store.
  3. Open GOBOULT Fit → Profile → Connected Apps → enable Health Connect.
  4. Install "HTTP Shortcuts" from Play Store.
  5. Import the shortcut template below and set YOUR_SERVER_URL.
  6. In HTTP Shortcuts, set it to run every 15 minutes.
 
HTTP Shortcuts JSON template (save as shortcut.json and import):
  See WEARABLE_SETUP.md generated alongside this file.
 
Requirements (server side):
  pip install flask schedule   # schedule kept for legacy compat
"""
 
import os
import json
import time
import logging
import threading
import datetime
import argparse
import sqlite3
from typing import Optional
 
import schedule
 
from wearable_helper import save_wearable_data, WEARABLE_DB
 
LOGGER = logging.getLogger("postoppal.wearable_sync")
logging.basicConfig(level=logging.INFO)
 
# ── Config ────────────────────────────────────────────────────────────────────
POLL_INTERVAL_MINUTES = int(os.getenv("WEARABLE_POLL_MINUTES", "15"))
TOKEN_DIR             = os.getenv("WEARABLE_TOKEN_DIR", "tokens")  # kept for legacy
WEARABLE_API_KEY      = os.getenv("WEARABLE_API_KEY", "")
 
os.makedirs(TOKEN_DIR, exist_ok=True)
 
 
# ── DB: extended history table ────────────────────────────────────────────────
def _ensure_history_table() -> None:
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS wearable_history (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id   TEXT,
            heart_rate   REAL,
            steps        INTEGER,
            sleep_hours  REAL,
            spo2         REAL,
            temperature  REAL,
            systolic_bp  REAL,
            diastolic_bp REAL,
            device_id    TEXT,
            source       TEXT,
            recorded_at  TEXT
        )
    """)
    conn.commit()
    conn.close()
 
 
_ensure_history_table()
 
 
# ── Save extended vitals to history table ─────────────────────────────────────
def _save_extended(
    patient_id: str,
    hr: float,
    steps: int,
    sleep: float,
    spo2: Optional[float] = None,
    temperature: Optional[float] = None,
    systolic_bp: Optional[float] = None,
    diastolic_bp: Optional[float] = None,
    device_id: str = "unknown",
    source: str = "push",
) -> None:
    """Append a reading to the wearable_history table."""
    try:
        conn = sqlite3.connect(WEARABLE_DB)
        conn.execute(
            """INSERT INTO wearable_history
               (patient_id, heart_rate, steps, sleep_hours, spo2, temperature,
                systolic_bp, diastolic_bp, device_id, source, recorded_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            (
                patient_id, hr, steps, sleep, spo2, temperature,
                systolic_bp, diastolic_bp,
                device_id, source,
                datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        LOGGER.error("Failed to save extended vitals: %s", e)
 
 
# ── Master ingest function (called by push endpoint) ─────────────────────────
def ingest_push_vitals(patient_id: str, data: dict) -> dict:
    """
    Accept vitals from a phone-side push (Health Connect / HTTP Shortcuts).
    Saves to both wearable (latest) and wearable_history tables.
    Returns a vitals summary dict.
 
    Expected keys in data:
        heart_rate   (required)
        steps        (optional, default 0)
        sleep_hours  (optional, default 0)
        spo2         (optional)
        temperature  (optional, Celsius)
        systolic_bp  (optional)
        diastolic_bp (optional)
        device_id    (optional)
    """
    hr          = float(data.get("heart_rate", 0))
    steps       = int(float(data.get("steps", 0)))
    sleep       = float(data.get("sleep_hours", 0))
    spo2        = data.get("spo2")
    temperature = data.get("temperature")
    systolic_bp = data.get("systolic_bp")
    diastolic_bp= data.get("diastolic_bp")
    device_id   = data.get("device_id", "unknown")
 
    # Save latest (used by AI context)
    save_wearable_data(patient_id, hr, steps, sleep)
 
    # Save to history
    _save_extended(
        patient_id, hr, steps, sleep,
        spo2=float(spo2) if spo2 is not None else None,
        temperature=float(temperature) if temperature is not None else None,
        systolic_bp=float(systolic_bp) if systolic_bp is not None else None,
        diastolic_bp=float(diastolic_bp) if diastolic_bp is not None else None,
        device_id=device_id,
        source="health_connect_push",
    )
 
    vitals = {
        "patient_id":  patient_id,
        "heart_rate":  hr,
        "steps":       steps,
        "sleep_hours": sleep,
        "spo2":        spo2,
        "temperature": temperature,
        "systolic_bp": systolic_bp,
        "diastolic_bp":diastolic_bp,
        "device_id":   device_id,
        "synced_at":   datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "source":      "health_connect_push",
    }
    LOGGER.info("Push vitals ingested – patient=%s hr=%s steps=%s sleep=%s spo2=%s",
                patient_id, hr, steps, sleep, spo2)
    return vitals
 
 
# ── Legacy: list patients with token files (returns empty now) ────────────────
def _get_all_patient_ids() -> list:
    """
    Previously returned patients with Google Fit OAuth token files.
    Google Fit REST API is shut down — now returns patients with
    recent push data from the DB instead.
    """
    try:
        conn = sqlite3.connect(WEARABLE_DB)
        rows = conn.execute(
            """SELECT DISTINCT patient_id FROM wearable_history
               WHERE recorded_at > datetime('now', '-24 hours')"""
        ).fetchall()
        conn.close()
        return [r[0] for r in rows]
    except Exception as e:
        LOGGER.error("Could not list active patients: %s", e)
        return []
 
 
# ── Background "watchdog" — checks for stale data, logs warnings ──────────────
_POLL_RUNNING = False
 
 
def _check_stale_patients() -> None:
    """
    Warn if any patient hasn't pushed data in > 2 × POLL_INTERVAL.
    This replaces the old Google Fit poll loop.
    """
    threshold_hours = max(1.0, (POLL_INTERVAL_MINUTES * 2) / 60.0)
    try:
        conn = sqlite3.connect(WEARABLE_DB)
        stale = conn.execute(
            """SELECT patient_id, MAX(recorded_at) as last_seen
               FROM wearable_history
               GROUP BY patient_id
               HAVING last_seen < datetime('now', ? )""",
            (f"-{threshold_hours} hours",),
        ).fetchall()
        conn.close()
        for pid, last in stale:
            LOGGER.warning(
                "Patient %s has not pushed wearable data since %s "
                "(> %.1f hrs ago). Check their phone automation is running.",
                pid, last, threshold_hours,
            )
    except Exception as e:
        LOGGER.error("Stale-data check failed: %s", e)
 
 
def start_background_poller() -> None:
    """
    Start a background thread that periodically checks for stale data.
    Call this once when your Flask app starts.
 
    NOTE: This no longer polls Google Fit (API shut down Jun 2025).
          Data must be pushed from the patient's phone via
          POST /api/wearable/sync or POST /api/wearable/data.
    """
    global _POLL_RUNNING
    if _POLL_RUNNING:
        return
    _POLL_RUNNING = True
 
    schedule.every(POLL_INTERVAL_MINUTES).minutes.do(_check_stale_patients)
    LOGGER.info(
        "Wearable watchdog started — checking for stale push data every %d min. "
        "Google Fit REST API is no longer used (shut down Jun 2025). "
        "Patients must push data from their phones.",
        POLL_INTERVAL_MINUTES,
    )
 
    def _run():
        _check_stale_patients()  # run once on startup
        while True:
            schedule.run_pending()
            time.sleep(30)
 
    t = threading.Thread(target=_run, daemon=True, name="wearable-watchdog")
    t.start()
 
 
# ── Flask Blueprint for push sync endpoint ────────────────────────────────────
from flask import Blueprint, request as flask_request, jsonify
 
sync_bp = Blueprint("wearable_sync", __name__)
 
 
def _auth_ok() -> bool:
    if not WEARABLE_API_KEY:
        return True
    key = (
        flask_request.headers.get("X-API-Key")
        or flask_request.headers.get("Authorization", "").replace("Bearer ", "")
    )
    return key == WEARABLE_API_KEY
 
 
@sync_bp.route("/api/wearable/sync", methods=["POST"])
def push_sync():
    """
    Phone app / HTTP Shortcuts pushes Health Connect data here.
 
    Body:
    {
        "patient_id":   "1023",
        "heart_rate":   82,
        "steps":        5400,
        "sleep_hours":  6.5,
        "spo2":         97,          (optional)
        "temperature":  36.6,        (optional, Celsius)
        "systolic_bp":  118,         (optional)
        "diastolic_bp": 76,          (optional)
        "device_id":    "bolt_band"  (optional)
    }
 
    Headers:
        X-API-Key: <your WEARABLE_API_KEY>   (if set in .env)
 
    Set up HTTP Shortcuts on patient's phone to call this every 15 min.
    Read values from Health Connect via HTTP Shortcuts' built-in
    Health Connect data source (Android 14+) or via the Tasker
    Health Connect plugin.
    """
    if not _auth_ok():
        return jsonify({"error": "Unauthorized"}), 401
 
    data = flask_request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or empty JSON body"}), 400
 
    patient_id = data.get("patient_id")
    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400
 
    if data.get("heart_rate") is None:
        return jsonify({"error": "heart_rate is required"}), 400
 
    vitals = ingest_push_vitals(patient_id, data)
 
    return jsonify({
        "status":     "ok",
        "patient_id": patient_id,
        "vitals":     vitals,
        "message":    "Vitals received and saved.",
    }), 200
 
 
@sync_bp.route("/api/wearable/sync/status", methods=["GET"])
def sync_status():
    """Returns which patients have pushed data recently."""
    if not _auth_ok():
        return jsonify({"error": "Unauthorized"}), 401
 
    patients = _get_all_patient_ids()
    return jsonify({
        "patients_active_24h":   patients,
        "poll_interval_minutes": POLL_INTERVAL_MINUTES,
        "watchdog_running":      _POLL_RUNNING,
        "sync_mode":             "push_only",
        "note": (
            "Google Fit REST API was shut down June 30 2025. "
            "Data must be pushed from patients' phones via POST /api/wearable/sync. "
            "See WEARABLE_SETUP.md for HTTP Shortcuts setup guide."
        ),
    }), 200
 
 
# ── CLI helper ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PostOpPal Wearable Sync")
    parser.add_argument("--status",  action="store_true", help="Show active patients")
    parser.add_argument("--test",    action="store_true", help="Push a test reading")
    parser.add_argument("--patient", type=str, default="test_patient", help="Patient ID")
    args = parser.parse_args()
 
    if args.status:
        ids = _get_all_patient_ids()
        print(f"\n📊 Patients with push data in last 24h: {ids or 'none'}\n")
 
    elif args.test:
        print(f"\n🧪 Pushing test vitals for patient: {args.patient}")
        result = ingest_push_vitals(args.patient, {
            "heart_rate":  75,
            "steps":       3200,
            "sleep_hours": 7.0,
            "spo2":        98.0,
            "temperature": 36.7,
            "device_id":   "cli_test",
        })
        print("\n✅ Test vitals saved:")
        for k, v in result.items():
            print(f"   {k:15}: {v}")
 
    else:
        print("\nPostOpPal Wearable Sync – Push Mode")
        print("=" * 45)
        print("Google Fit REST API was shut down June 30 2025.")
        print("Use --status to see active patients.")
        print("Use --test   to push a test reading.\n")
        parser.print_help()