from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/arduino", tags=["Arduino"])

# In-memory storage for real-time data
arduino_data = {"steps": 0, "calories": 0.0}


class ArduinoData(BaseModel):
    steps: int
    calories: float


@router.post("/data")
async def update_arduino_data(data: ArduinoData):
    arduino_data["steps"] = data.steps
    arduino_data["calories"] = data.calories
    return {"message": "Data updated successfully"}


@router.get("/data")
async def get_arduino_data():
    return arduino_data
