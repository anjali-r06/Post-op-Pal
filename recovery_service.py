# recovery_service.py

from sqlalchemy.orm import Session
from datetime import date, datetime
from models import Patient, RecoveryTemplate, PatientDailyLog
from schemas import PersonalizedPlanResponse


def get_post_op_day(surgery_date: date) -> int:
    """Calculate how many days since surgery."""
    today = date.today()
    delta = today - surgery_date
    return delta.days + 1  # Day 1 = surgery day


def get_personalized_message(
    pain_score: int,
    swelling_level: str,
    completed_exercises: bool,
    post_op_day: int
) -> tuple[str, str]:
    """
    Generate a personalized message and alert level
    based on the patient's reported symptoms.
    Returns: (message, alert_level)
    """

    # --- DANGER: Needs immediate attention ---
    if pain_score >= 8:
        return (
            "⚠️ Your pain level is very high. Please contact your doctor or hospital immediately. "
            "Do NOT try to push through this pain.",
            "danger"
        )

    if swelling_level == "severe":
        return (
            "⚠️ Severe swelling can be a sign of complications. Please call your hospital today. "
            "Keep your leg elevated and apply ice.",
            "danger"
        )

    # --- CAUTION: Monitor closely ---
    if pain_score >= 6:
        return (
            "Your pain is moderate today. Rest more than usual, apply ice for 20 minutes, "
            "and avoid exercises that increase pain. If it doesn't improve, call your doctor.",
            "caution"
        )

    if swelling_level == "moderate":
        return (
            "You have moderate swelling today. Keep your leg elevated as much as possible "
            "and reduce walking. This is common but worth monitoring.",
            "caution"
        )

    # --- NORMAL: Encouraging messages ---
    if completed_exercises and pain_score <= 3:
        return (
            f"🌟 Excellent work on Day {post_op_day}! You completed your exercises and your pain "
            f"is well controlled. You are recovering beautifully — keep it up!",
            "normal"
        )

    if completed_exercises:
        return (
            f"Good job completing your exercises today! Your recovery is on track. "
            f"Stay consistent and you'll see great progress.",
            "normal"
        )

    return (
        f"You're doing well on Day {post_op_day}. Remember to complete your exercises "
        f"when you feel ready, and stay hydrated throughout the day.",
        "normal"
    )


def get_personalized_plan(patient_id: int, db: Session) -> PersonalizedPlanResponse:
    """
    Main function: fetches patient data + today's template
    and returns a fully personalized recovery plan.
    """

    # Step 1: Get patient from DB
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise ValueError(f"Patient with id {patient_id} not found.")

    # Step 2: Calculate post-op day
    post_op_day = get_post_op_day(patient.surgery_date)

    # Step 3: Get today's recovery template
    # If no exact match, get the closest earlier day's template
    template = (
        db.query(RecoveryTemplate)
        .filter(
            RecoveryTemplate.surgery_type == patient.surgery_type,
            RecoveryTemplate.post_op_day <= post_op_day
        )
        .order_by(RecoveryTemplate.post_op_day.desc())
        .first()
    )

    if not template:
        raise ValueError(f"No recovery template found for {patient.surgery_type}.")

    # Step 4: Get today's log (if patient has already submitted one)
    today_log = (
        db.query(PatientDailyLog)
        .filter(
            PatientDailyLog.patient_id == patient_id,
            PatientDailyLog.log_date == date.today()
        )
        .first()
    )

    # Step 5: Generate personalized message
    if today_log:
        message, alert_level = get_personalized_message(
            pain_score=today_log.pain_score or 0,
            swelling_level=today_log.swelling_level or "none",
            completed_exercises=today_log.completed_exercises or False,
            post_op_day=post_op_day
        )
    else:
        # No log yet today — send a gentle motivational default
        message = (
            f"Good morning! Today is Day {post_op_day} of your recovery. "
            f"Please complete your check-in by reporting your pain level and exercises."
        )
        alert_level = "normal"

    # Step 6: Build and return the response
    return PersonalizedPlanResponse(
        patient_name=patient.name,
        post_op_day=post_op_day,
        daily_goal=template.daily_goal,
        exercises=template.exercises,
        dietary_tip=template.dietary_tip,
        personalized_message=message,
        alert_level=alert_level
    )
