from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database
from ..utils.auth import get_current_user

router = APIRouter(prefix="/data", tags=["Data"])

@router.get("/steps-calories")
def get_steps_and_calories(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    latest_steps = db.query(models.Steps).filter_by(user_id=current_user).order_by(models.Steps.timestamp.desc()).first()
    latest_calories = db.query(models.Calories).filter_by(user_id=current_user).order_by(models.Calories.timestamp.desc()).first()

    steps = latest_steps.step_count if latest_steps else 0
    calories = latest_calories.calories_burned if latest_calories else 0.0

    return {
        "steps": steps,
        "calories": calories,
        "timestamp": latest_steps.timestamp if latest_steps else None
    }
