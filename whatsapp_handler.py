# whatsapp_handler.py

from twilio.rest import Client
from sqlalchemy.orm import Session
from datetime import date
import os
from dotenv import load_dotenv

from models import Patient, PatientDailyLog
from recovery_service import (
    get_personalized_plan,
    get_post_op_day,
    get_personalized_message
)

load_dotenv()

# ─────────────────────────────────────────
# Twilio credentials from .env
# ─────────────────────────────────────────
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")  # e.g. whatsapp:+14155238886

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_whatsapp_message(to_number: str, message: str):
    """
    Sends a WhatsApp message to the patient via Twilio.
    to_number format: whatsapp:+919876543210
    """
    client.messages.create(
        from_=TWILIO_WHATSAPP_NUMBER,
        to=f"whatsapp:{to_number}",
        body=message
    )


def format_plan_message(plan) -> str:
    """Formats the personalized plan into a readable WhatsApp message."""
    alert_emoji = {
        "normal": "✅",
        "caution": "⚠️",
        "danger": "🚨"
    }.get(plan.alert_level, "✅")

    return (
        f"🏥 *Post-Op Pal — Day {plan.post_op_day} Recovery Plan*\n\n"
        f"👋 Hello {plan.patient_name}!\n\n"
        f"🎯 *Today's Goal:*\n{plan.daily_goal}\n\n"
        f"💪 *Exercises:*\n{plan.exercises}\n\n"
        f"🥗 *Dietary Tip:*\n{plan.dietary_tip}\n\n"
        f"{alert_emoji} *Personal Message:*\n{plan.personalized_message}\n\n"
        f"─────────────────\n"
        f"Reply *log* to submit today's check-in\n"
        f"Reply *history* to see your progress"
    )


def format_history_message(patient_name: str, logs: list) -> str:
    """Formats last 7 days of logs into a readable WhatsApp message."""
    if not logs:
        return f"📋 No logs found yet, {patient_name}. Send *log* to submit your first check-in!"

    lines = [f"📊 *Recovery History — {patient_name}*\n"]
    for log in logs:
        emoji = "🟢" if (log.pain_score or 0) <= 4 else "🟡" if (log.pain_score or 0) <= 7 else "🔴"
        lines.append(
            f"{emoji} *Day {log.post_op_day}* ({log.log_date})\n"
            f"   Pain: {log.pain_score}/10 | Swelling: {log.swelling_level}\n"
            f"   Exercises done: {'Yes ✅' if log.completed_exercises else 'No ❌'}"
        )
    return "\n\n".join(lines)


def handle_incoming_message(
    from_number: str,
    message_body: str,
    db: Session
) -> str:
    """
    Main handler — processes incoming WhatsApp messages.
    Returns the reply string (also sends it via Twilio).
    """
    # Clean the message
    msg = message_body.strip().lower()

    # Find patient by WhatsApp number
    # Strip 'whatsapp:' prefix if present
    clean_number = from_number.replace("whatsapp:", "")
    patient = db.query(Patient).filter(
        Patient.whatsapp_number == clean_number
    ).first()

    if not patient:
        reply = (
            "👋 Welcome to Post-Op Pal!\n\n"
            "It seems your number is not registered yet. "
            "Please contact your hospital to get started. 🏥"
        )
        send_whatsapp_message(clean_number, reply)
        return reply

    # ─────────────────────────────────────────
    # Route: "plan" → Send personalized plan
    # ─────────────────────────────────────────
    if msg in ["plan", "my plan", "today", "recovery"]:
        try:
            plan = get_personalized_plan(patient_id=patient.id, db=db)
            reply = format_plan_message(plan)
        except Exception as e:
            reply = f"Sorry, I couldn't fetch your plan right now. Please try again. ({str(e)})"

    # ─────────────────────────────────────────
    # Route: "history" → Send last 7 days
    # ─────────────────────────────────────────
    elif msg in ["history", "progress", "my history"]:
        logs = (
            db.query(PatientDailyLog)
            .filter(PatientDailyLog.patient_id == patient.id)
            .order_by(PatientDailyLog.log_date.desc())
            .limit(7)
            .all()
        )
        reply = format_history_message(patient.name, logs)

    # ─────────────────────────────────────────
    # Route: "log" → Guide through check-in
    # ─────────────────────────────────────────
    elif msg in ["log", "checkin", "check in", "check-in"]:
        reply = (
            f"📋 *Daily Check-in — Day {get_post_op_day(patient.surgery_date)}*\n\n"
            f"Please reply in this format:\n\n"
            f"*pain/swelling/exercises*\n\n"
            f"Example:\n"
            f"*4/mild/yes*\n\n"
            f"Pain: 0-10 (0=none, 10=worst)\n"
            f"Swelling: none, mild, moderate, severe\n"
            f"Exercises: yes or no"
        )

    # ─────────────────────────────────────────
    # Route: Parse log submission (e.g. "4/mild/yes")
    # ─────────────────────────────────────────
    elif "/" in msg:
        try:
            parts = msg.split("/")
            pain_score = int(parts[0].strip())
            swelling_level = parts[1].strip()
            completed = parts[2].strip() in ["yes", "y", "true", "1"]

            # Validate
            if not (0 <= pain_score <= 10):
                raise ValueError("Pain score must be 0-10")
            if swelling_level not in ["none", "mild", "moderate", "severe"]:
                raise ValueError("Swelling must be: none, mild, moderate, severe")

            post_op_day = get_post_op_day(patient.surgery_date)

            # Save or update log
            existing = db.query(PatientDailyLog).filter(
                PatientDailyLog.patient_id == patient.id,
                PatientDailyLog.log_date == date.today()
            ).first()

            if existing:
                existing.pain_score = pain_score
                existing.swelling_level = swelling_level
                existing.completed_exercises = completed
                db.commit()
            else:
                new_log = PatientDailyLog(
                    patient_id=patient.id,
                    post_op_day=post_op_day,
                    pain_score=pain_score,
                    swelling_level=swelling_level,
                    completed_exercises=completed,
                    log_date=date.today()
                )
                db.add(new_log)
                db.commit()

            # Generate personalized response
            message, alert_level = get_personalized_message(
                pain_score=pain_score,
                swelling_level=swelling_level,
                completed_exercises=completed,
                post_op_day=post_op_day
            )

            alert_emoji = {"normal": "✅", "caution": "⚠️", "danger": "🚨"}.get(alert_level, "✅")
            reply = (
                f"{alert_emoji} *Check-in saved for Day {post_op_day}!*\n\n"
                f"{message}\n\n"
                f"Reply *plan* to see today's full recovery plan."
            )

        except (ValueError, IndexError) as e:
            reply = (
                f"❌ I couldn't understand that format.\n\n"
                f"Please reply like this:\n"
                f"*4/mild/yes*\n\n"
                f"(pain 0-10 / swelling level / exercises yes or no)\n\n"
                f"Error: {str(e)}"
            )

    # ─────────────────────────────────────────
    # Default: Help message
    # ─────────────────────────────────────────
    else:
        reply = (
            f"👋 Hello {patient.name}! I'm your Post-Op Pal 🏥\n\n"
            f"Here's what you can do:\n\n"
            f"📋 *plan* — Get today's recovery plan\n"
            f"✏️ *log* — Submit your daily check-in\n"
            f"📊 *history* — See your recovery progress\n\n"
            f"Just reply with one of the words above!"
        )

    send_whatsapp_message(clean_number, reply)
    return reply