from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..utils.auth import get_current_user
from datetime import datetime, date
from sqlalchemy.sql import func

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

@router.get("/data-history")
def get_calories_history(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    """Fetch calorie burn history grouped by minute."""
    calorie_entries = (
        db.query(
            func.date_trunc('minute', models.Calories.timestamp).label("minute"),
            func.sum(models.Calories.calories_burned).label("calories_burned"),
        )
        .filter(models.Calories.user_id == current_user)
        .group_by(func.date_trunc('minute', models.Calories.timestamp))
        .order_by("minute")
        .all()
    )
    return [{"timestamp": entry.minute, "calories burnt": entry.calories_burned} for entry in calorie_entries]
