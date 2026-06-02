"""
wearable_api.py – PostOpPal
REST API endpoints for smartwatch / wearable device data ingestion.

Devices POST their data here → stored in DB → used in AI responses.

Endpoints:
  POST /api/wearable/data                  – push latest readings
  GET  /api/wearable/<patient_id>          – fetch latest readings
  GET  /api/wearable/<patient_id>/history  – full history
  POST /api/wearable/alert                 – device sends an alert directly
"""

import os
import sqlite3
import datetime
import logging
from typing import Optional

from flask import Blueprint, request, jsonify
from wearable_helper import save_wearable_data, get_wearable_data, wearable_risk

LOGGER = logging.getLogger("postoppal.wearable_api")

WEARABLE_DB      = os.getenv("WEARABLE_DB", "wearable_data.db")
WEARABLE_API_KEY = os.getenv("WEARABLE_API_KEY", "")

wearable_bp = Blueprint("wearable_api", __name__)


# ── DB: extended history table ────────────────────────────────────────────────
def _init_history_db() -> None:
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS wearable_history (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id      TEXT,
            heart_rate      REAL,
            steps           INTEGER,
            sleep_hours     REAL,
            spo2            REAL,
            temperature     REAL,
            systolic_bp     REAL,
            diastolic_bp    REAL,
            device_id       TEXT,
            source          TEXT,
            recorded_at     TEXT
        )
    """)
    conn.commit()
    conn.close()


_init_history_db()


# ── Auth helper ───────────────────────────────────────────────────────────────
def _check_api_key() -> bool:
    """If WEARABLE_API_KEY is set in .env, verify the request header."""
    if not WEARABLE_API_KEY:
        return True   # No key configured → open access (dev mode)
    key = (
        request.headers.get("X-API-Key")
        or request.headers.get("Authorization", "").replace("Bearer ", "")
    )
    return key == WEARABLE_API_KEY


# ── Risk level ordering ───────────────────────────────────────────────────────
# FIX: Python string comparison ("LOW" < "MEDIUM") is alphabetical, not by
# severity.  "HIGH" < "LOW" alphabetically, which would always produce wrong
# results.  Use an integer rank instead.
_RISK_RANK = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}


def _higher_risk(current: str, candidate: str) -> str:
    """Return whichever of two risk labels is more severe."""
    return candidate if _RISK_RANK.get(candidate, 0) > _RISK_RANK.get(current, 0) else current


# ── Risk analysis (extended) ──────────────────────────────────────────────────
def analyze_vitals(data: dict) -> dict:
    """
    Analyze all vitals and return risk level + specific alerts.
    Returns: { "risk": "LOW/MEDIUM/HIGH", "alerts": [...] }
    """
    alerts: list = []
    risk = "LOW"

    hr       = data.get("heart_rate")
    spo2     = data.get("spo2")
    temp     = data.get("temperature")
    sys_bp   = data.get("systolic_bp")
    dias_bp  = data.get("diastolic_bp")
    sleep    = data.get("sleep_hours")
    steps    = data.get("steps")

    # Heart rate
    if hr is not None:
        if hr < 40 or hr > 130:
            alerts.append(f"🚨 Critical heart rate: {hr} bpm")
            risk = _higher_risk(risk, "HIGH")
        elif hr < 50 or hr > 110:
            alerts.append(f"⚠️ Abnormal heart rate: {hr} bpm")
            risk = _higher_risk(risk, "MEDIUM")

    # SpO2
    if spo2 is not None:
        if spo2 < 90:
            alerts.append(f"🚨 Critical oxygen saturation: {spo2}%")
            risk = _higher_risk(risk, "HIGH")
        elif spo2 < 94:
            alerts.append(f"⚠️ Low oxygen saturation: {spo2}%")
            risk = _higher_risk(risk, "MEDIUM")

    # Temperature (Celsius)
    if temp is not None:
        if temp > 39.0:
            alerts.append(f"🚨 High fever: {temp}°C")
            risk = _higher_risk(risk, "HIGH")
        elif temp > 37.5:
            alerts.append(f"⚠️ Mild fever: {temp}°C")
            risk = _higher_risk(risk, "MEDIUM")

    # Blood pressure
    if sys_bp is not None and dias_bp is not None:
        if sys_bp > 180 or dias_bp > 120:
            alerts.append(f"🚨 Hypertensive crisis: {sys_bp}/{dias_bp} mmHg")
            risk = _higher_risk(risk, "HIGH")
        elif sys_bp > 140 or dias_bp > 90:
            alerts.append(f"⚠️ High blood pressure: {sys_bp}/{dias_bp} mmHg")
            risk = _higher_risk(risk, "MEDIUM")
        elif sys_bp < 90 or dias_bp < 60:
            alerts.append(f"⚠️ Low blood pressure: {sys_bp}/{dias_bp} mmHg")
            risk = _higher_risk(risk, "MEDIUM")

    # Sleep
    if sleep is not None:
        if sleep < 3:
            alerts.append(f"🚨 Very low sleep: {sleep} hrs")
            risk = _higher_risk(risk, "HIGH")
        elif sleep < 5:
            alerts.append(f"⚠️ Low sleep: {sleep} hrs")
            risk = _higher_risk(risk, "MEDIUM")

    # Steps (very low mobility post-op)
    if steps is not None and steps < 500:
        alerts.append(f"⚠️ Very low activity: {steps} steps")
        risk = _higher_risk(risk, "MEDIUM")

    return {"risk": risk, "alerts": alerts}


def _save_to_history(patient_id: str, data: dict) -> None:
    """Append a reading to the wearable_history table."""
    conn = sqlite3.connect(WEARABLE_DB)
    conn.execute(
        """INSERT INTO wearable_history
           (patient_id, heart_rate, steps, sleep_hours, spo2, temperature,
            systolic_bp, diastolic_bp, device_id, source, recorded_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (
            patient_id,
            data.get("heart_rate"),
            data.get("steps"),
            data.get("sleep_hours"),
            data.get("spo2"),
            data.get("temperature"),
            data.get("systolic_bp"),
            data.get("diastolic_bp"),
            data.get("device_id", "unknown"),
            data.get("source", "api"),
            data.get("recorded_at") or datetime.datetime.now(datetime.timezone.utc).isoformat(),
        ),
    )
    conn.commit()
    conn.close()


# ── Send WhatsApp alert via Twilio ────────────────────────────────────────────
def _send_whatsapp_alert(patient_id: str, alerts: list, vitals: dict) -> None:
    """
    If vitals are HIGH risk, send an automatic WhatsApp alert to the patient.
    Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env
    and the patient's phone number stored in the session DB.
    """
    try:
        import sqlite3 as _sq
        SESSION_DB  = os.getenv("SESSION_DB", "sessions.db")
        conn        = _sq.connect(SESSION_DB)
        row         = conn.execute(
            "SELECT from_number FROM sessions WHERE patient_id = ?", (patient_id,)
        ).fetchone()
        conn.close()

        if not row:
            LOGGER.warning("No WhatsApp number found for patient %s", patient_id)
            return

        to_number = row[0]

        TWILIO_SID   = os.getenv("TWILIO_ACCOUNT_SID")
        TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
        FROM_NUMBER  = os.getenv("TWILIO_FROM_NUMBER", "whatsapp:+14155238886")

        if not TWILIO_SID or not TWILIO_TOKEN:
            LOGGER.warning("Twilio credentials not set — cannot send alert")
            return

        from twilio.rest import Client as TwilioClient
        client = TwilioClient(TWILIO_SID, TWILIO_TOKEN)

        alert_text   = "\n".join(alerts)
        message_body = (
            f"🚨 *PostOpPal Health Alert*\n\n"
            f"Your wearable detected abnormal readings:\n\n"
            f"{alert_text}\n\n"
            f"Please contact your doctor immediately or call 112.\n\n"
            f"📊 Full vitals: HR={vitals.get('heart_rate')} bpm | "
            f"SpO2={vitals.get('spo2')}% | Temp={vitals.get('temperature')}°C"
        )

        client.messages.create(
            body=message_body,
            from_=FROM_NUMBER,
            to=to_number,
        )
        LOGGER.info("WhatsApp alert sent to %s for patient %s", to_number, patient_id)

    except Exception as e:
        LOGGER.exception("Failed to send WhatsApp alert: %s", e)


# ── Routes ────────────────────────────────────────────────────────────────────

@wearable_bp.route("/api/wearable/data", methods=["POST"])
def receive_wearable_data():
    """
    Smartwatch / HTTP Shortcuts POSTs data here.

    Expected JSON body:
    {
        "patient_id":   "1023",
        "heart_rate":   85,
        "steps":        6000,
        "sleep_hours":  7.5,
        "spo2":         98,          (optional)
        "temperature":  36.8,        (optional, Celsius)
        "systolic_bp":  120,         (optional)
        "diastolic_bp": 80,          (optional)
        "device_id":    "bolt_band"  (optional)
    }

    Headers (if WEARABLE_API_KEY is set in .env):
        X-API-Key: your_key_here
    """
    if not _check_api_key():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    patient_id = data.get("patient_id")
    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    hr    = data.get("heart_rate")
    steps = data.get("steps", 0)
    sleep = data.get("sleep_hours", 0)

    if hr is None:
        return jsonify({"error": "heart_rate is required"}), 400

    # Save latest reading (for AI context)
    save_wearable_data(patient_id, hr, steps, sleep)

    # Save full history
    _save_to_history(patient_id, data)

    # Analyze vitals (uses fixed _higher_risk)
    analysis = analyze_vitals(data)
    risk     = analysis["risk"]
    alerts   = analysis["alerts"]

    LOGGER.info(
        "Wearable data received – patient=%s hr=%s spo2=%s temp=%s risk=%s",
        patient_id, hr, data.get("spo2"), data.get("temperature"), risk,
    )

    # Auto-send WhatsApp alert if HIGH risk
    if risk == "HIGH" and alerts:
        _send_whatsapp_alert(patient_id, alerts, data)

    return jsonify({
        "status":     "ok",
        "patient_id": patient_id,
        "risk":       risk,
        "alerts":     alerts,
        "message":    "Data received" + (" — alert sent!" if risk == "HIGH" else ""),
    }), 200


@wearable_bp.route("/api/wearable/<patient_id>", methods=["GET"])
def get_latest_wearable(patient_id: str):
    """Fetch the latest wearable reading for a patient."""
    if not _check_api_key():
        return jsonify({"error": "Unauthorized"}), 401

    data = get_wearable_data(patient_id)
    if not data:
        return jsonify({"error": "No data found for this patient"}), 404

    risk     = wearable_risk(data)
    analysis = analyze_vitals(data)

    return jsonify({
        "patient_id": patient_id,
        "vitals":     data,
        "risk":       risk,
        "alerts":     analysis["alerts"],
    }), 200


@wearable_bp.route("/api/wearable/<patient_id>/history", methods=["GET"])
def get_wearable_history(patient_id: str):
    """Fetch historical wearable readings for a patient."""
    if not _check_api_key():
        return jsonify({"error": "Unauthorized"}), 401

    limit = min(int(request.args.get("limit", 50)), 500)  # cap at 500

    conn = sqlite3.connect(WEARABLE_DB)
    rows = conn.execute(
        """SELECT heart_rate, steps, sleep_hours, spo2, temperature,
                  systolic_bp, diastolic_bp, device_id, recorded_at
           FROM wearable_history
           WHERE patient_id = ?
           ORDER BY id DESC LIMIT ?""",
        (patient_id, limit),
    ).fetchall()
    conn.close()

    history = [
        {
            "heart_rate":   r[0],
            "steps":        r[1],
            "sleep_hours":  r[2],
            "spo2":         r[3],
            "temperature":  r[4],
            "systolic_bp":  r[5],
            "diastolic_bp": r[6],
            "device_id":    r[7],
            "recorded_at":  r[8],
        }
        for r in rows
    ]

    return jsonify({
        "patient_id": patient_id,
        "count":      len(history),
        "history":    history,
    }), 200


@wearable_bp.route("/api/wearable/alert", methods=["POST"])
def receive_device_alert():
    """
    Device sends a direct SOS / fall / emergency alert.

    Expected JSON:
    {
        "patient_id": "1023",
        "alert_type": "fall_detected" | "sos" | "irregular_heartbeat",
        "message":    "Optional details"
    }
    """
    if not _check_api_key():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    patient_id = data.get("patient_id")
    alert_type = data.get("alert_type", "unknown")
    message    = data.get("message", "")

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    LOGGER.warning("Device alert – patient=%s type=%s msg=%s", patient_id, alert_type, message)

    alert_messages = {
        "fall_detected":       "🚨 Fall detected by your wearable!",
        "sos":                 "🆘 SOS triggered on your wearable!",
        "irregular_heartbeat": "🚨 Irregular heartbeat detected!",
    }

    alert_text = alert_messages.get(alert_type, f"🚨 Alert: {alert_type}")
    if message:
        alert_text += f"\n{message}"

    _send_whatsapp_alert(patient_id, [alert_text], {})

    return jsonify({
        "status":     "ok",
        "patient_id": patient_id,
        "alert_type": alert_type,
        "message":    "Alert received and forwarded to patient.",
    }), 200