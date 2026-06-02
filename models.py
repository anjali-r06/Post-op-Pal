# models.py — Complete file

from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    Date, DateTime, ForeignKey, CheckConstraint
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


# ─────────────────────────────────────────
# EXISTING MODEL: Patient
# ─────────────────────────────────────────
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    whatsapp_number = Column(String(20), unique=True, nullable=False)
    surgery_type = Column(String(100), nullable=False)  # e.g., 'knee_replacement'
    surgery_date = Column(Date, nullable=False)
    preferred_language = Column(String(10), default="en")  # 'en' or 'hi'
    status = Column(String(30), default="PENDING_ACTIVATION")  # ACTIVE, PENDING_ACTIVATION
    activation_token = Column(String(200), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationship to daily logs
    daily_logs = relationship("PatientDailyLog", back_populates="patient")

    def __repr__(self):
        return f"<Patient id={self.id} name={self.name} surgery={self.surgery_type}>"


# ─────────────────────────────────────────
# NEW MODEL 1: RecoveryTemplate
# ─────────────────────────────────────────
class RecoveryTemplate(Base):
    """
    Day-wise recovery content library per surgery type.
    """
    __tablename__ = "recovery_templates"

    id = Column(Integer, primary_key=True, index=True)
    surgery_type = Column(String(100), nullable=False)
    post_op_day = Column(Integer, nullable=False)
    daily_goal = Column(Text, nullable=False)
    exercises = Column(Text, nullable=False)
    dietary_tip = Column(Text, nullable=False)
    pain_threshold_caution = Column(Integer, default=7)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<RecoveryTemplate surgery={self.surgery_type} day={self.post_op_day}>"


# ─────────────────────────────────────────
# NEW MODEL 2: PatientDailyLog
# ─────────────────────────────────────────
class PatientDailyLog(Base):
    """
    Each patient's daily self-reported recovery data.
    """
    __tablename__ = "patient_daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    log_date = Column(Date, nullable=False, server_default=func.current_date())
    post_op_day = Column(Integer, nullable=False)
    pain_score = Column(
        Integer,
        CheckConstraint("pain_score BETWEEN 0 AND 10"),
        nullable=True
    )
    swelling_level = Column(
        String(20),
        CheckConstraint("swelling_level IN ('none', 'mild', 'moderate', 'severe')"),
        nullable=True
    )
    completed_exercises = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationship back to Patient
    patient = relationship("Patient", back_populates="daily_logs")

    def __repr__(self):
        return f"<PatientDailyLog patient_id={self.patient_id} day={self.post_op_day} pain={self.pain_score}>"