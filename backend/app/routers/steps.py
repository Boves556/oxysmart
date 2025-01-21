from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..utils.auth import get_current_user
from datetime import datetime, date
from sqlalchemy.sql import func

router = APIRouter(prefix="/steps", tags=["Steps"])


@router.post("/data-visualization")
def log_steps(
    step_data: schemas.StepData,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    step_entry = models.Steps(
        user_id=current_user,
        step_count=step_data.step_count,
        timestamp=datetime.utcnow(),
    )
    db.add(step_entry)
    db.commit()
    return {"message": "Steps logged successfully"}


@router.get("/current-day")
def get_steps_for_today(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    """Fetch steps for the current day."""
    today = date.today()
    step_entry = (
        db.query(models.Steps)
        .filter(models.Steps.user_id == current_user, models.Steps.timestamp >= today)
        .order_by(models.Steps.timestamp.desc())
        .first()
    )
    if step_entry:
        return {"steps": step_entry.step_count}
    return {"steps": 0}


@router.get("/data-history")
def get_steps_history(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),
):
    """Fetch step count history grouped by minute."""
    step_entries = (
        db.query(
            func.date_trunc('minute', models.Steps.timestamp).label("minute"),
            func.sum(models.Steps.step_count).label("step_count"),
        )
        .filter(models.Steps.user_id == current_user)
        .group_by(func.date_trunc('minute', models.Steps.timestamp))
        .order_by("minute")
        .all()
    )
    return [{"timestamp": entry.minute, "steps": entry.step_count} for entry in step_entries]

