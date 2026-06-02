# schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


# ─────────────────────────────────────────
# INPUT: What the patient sends us daily
# ─────────────────────────────────────────
class DailyLogInput(BaseModel):
    patient_id: int
    pain_score: int = Field(..., ge=0, le=10, description="Pain level from 0 to 10")
    swelling_level: str = Field(..., pattern="^(none|mild|moderate|severe)$")
    completed_exercises: bool
    notes: Optional[str] = None


# ─────────────────────────────────────────
# OUTPUT: What we send back to the patient
# ─────────────────────────────────────────
class PersonalizedPlanResponse(BaseModel):
    patient_name: str
    post_op_day: int
    daily_goal: str
    exercises: str
    dietary_tip: str
    personalized_message: str   # Dynamic message based on their pain/swelling
    alert_level: str            # 'normal', 'caution', 'danger'


# ─────────────────────────────────────────
# OUTPUT: Confirmation after saving a log
# ─────────────────────────────────────────
class LogSavedResponse(BaseModel):
    success: bool
    message: str
    post_op_day: int
    alert_level: str