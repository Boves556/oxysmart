from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int
    height: float
    weight: float


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    name: str
    email: EmailStr
    age: int
    height: float
    weight: float

    class Config:
        orm_mode = True


class StepData(BaseModel):
    step_count: int


class CalorieData(BaseModel):
    calories_burned: float


class UserUpdate(BaseModel):
    name: str = None
    age: int = None
    height: float = None
    weight: float = None
