from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..utils.auth import get_current_user
from datetime import datetime, date

router = APIRouter(prefix="/calories", tags=["Calories"])


@router.post("/data-visualization")
def log_calories(
    calorie_data: schemas.CalorieData,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    calorie_entry = models.Calories(
        user_id=current_user,
        calories_burned=calorie_data.calories_burned,
        timestamp=datetime.utcnow(),
    )
    db.add(calorie_entry)
    db.commit()
    return {"message": "Calories logged successfully"}


@router.get("/current-day")
def get_calories_for_today(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    """Fetch calories for the current day."""
    today = date.today()
    calorie_entry = (
        db.query(models.Calories)
        .filter(
            models.Calories.user_id == current_user, models.Calories.timestamp >= today
        )
        .order_by(models.Calories.timestamp.desc())
        .first()
    )
    if calorie_entry:
        return {"calories": calorie_entry.calories_burned}
    return {"calories": 0.0}
