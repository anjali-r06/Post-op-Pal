# recovery_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from datetime import date
import os

from models import Patient, PatientDailyLog, RecoveryTemplate
from schemas import DailyLogInput, PersonalizedPlanResponse, LogSavedResponse
from recovery_service import get_personalized_plan, get_post_op_day, get_personalized_message

# ─────────────────────────────────────────
# Database setup
# ─────────────────────────────────────────
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    """Dependency — gives each request its own DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─────────────────────────────────────────
# Router
# ─────────────────────────────────────────
router = APIRouter(
    prefix="/recovery",
    tags=["Personalized Recovery"]
)


# ─────────────────────────────────────────
# ROUTE 1: Get today's personalized plan
# ─────────────────────────────────────────
@router.get("/plan/{patient_id}", response_model=PersonalizedPlanResponse)
def get_plan(patient_id: int, db: Session = Depends(get_db)):
    """
    Returns today's personalized recovery plan for a patient.
    Automatically calculates their post-op day and picks the right template.
    """
    try:
        plan = get_personalized_plan(patient_id=patient_id, db=db)
        return plan
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ─────────────────────────────────────────
# ROUTE 2: Submit daily check-in log
# ─────────────────────────────────────────
@router.post("/log", response_model=LogSavedResponse)
def submit_daily_log(log_input: DailyLogInput, db: Session = Depends(get_db)):
    """
    Patient submits their daily check-in.
    Saves to DB and returns a personalized response based on their symptoms.
    """

    # Check patient exists
    patient = db.query(Patient).filter(Patient.id == log_input.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    # Calculate post-op day
    post_op_day = get_post_op_day(patient.surgery_date)

    # Check if log already exists for today
    existing_log = db.query(PatientDailyLog).filter(
        PatientDailyLog.patient_id == log_input.patient_id,
        PatientDailyLog.log_date == date.today()
    ).first()

    if existing_log:
        # Update existing log
        existing_log.pain_score = log_input.pain_score
        existing_log.swelling_level = log_input.swelling_level
        existing_log.completed_exercises = log_input.completed_exercises
        existing_log.notes = log_input.notes
        db.commit()
        db.refresh(existing_log)
    else:
        # Create new log
        new_log = PatientDailyLog(
            patient_id=log_input.patient_id,
            post_op_day=post_op_day,
            pain_score=log_input.pain_score,
            swelling_level=log_input.swelling_level,
            completed_exercises=log_input.completed_exercises,
            notes=log_input.notes,
            log_date=date.today()
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)

    # Generate personalized message based on their input
    message, alert_level = get_personalized_message(
        pain_score=log_input.pain_score,
        swelling_level=log_input.swelling_level,
        completed_exercises=log_input.completed_exercises,
        post_op_day=post_op_day
    )

    return LogSavedResponse(
        success=True,
        message=message,
        post_op_day=post_op_day,
        alert_level=alert_level
    )


# ─────────────────────────────────────────
# ROUTE 3: Get last 7 days of logs
# ─────────────────────────────────────────
@router.get("/history/{patient_id}")
def get_history(patient_id: int, db: Session = Depends(get_db)):
    """
    Returns the last 7 daily logs for a patient.
    Useful for the hospital dashboard to track recovery progress.
    """

    # Check patient exists
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    # Fetch last 7 logs, newest first
    logs = (
        db.query(PatientDailyLog)
        .filter(PatientDailyLog.patient_id == patient_id)
        .order_by(PatientDailyLog.log_date.desc())
        .limit(7)
        .all()
    )

    return {
        "patient_name": patient.name,
        "surgery_type": patient.surgery_type,
        "total_logs": len(logs),
        "logs": [
            {
                "date": log.log_date,
                "post_op_day": log.post_op_day,
                "pain_score": log.pain_score,
                "swelling_level": log.swelling_level,
                "completed_exercises": log.completed_exercises,
                "notes": log.notes,
            }
            for log in logs
        ]
    }