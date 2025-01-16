from sqlalchemy import Column, Integer, String, Float
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)


class Steps(Base):
    __tablename__ = "steps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    step_count = Column(Integer, nullable=False)
    timestamp = Column(String, nullable=False)


class Calories(Base):
    __tablename__ = "calories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    calories_burned = Column(Float, nullable=False)
    timestamp = Column(String, nullable=False)
