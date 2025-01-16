import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from .. import models, schemas, database
from ..utils.auth import decode_jwt, get_current_user, SECRET_KEY, ALGORITHM
import jwt

# Router configuration
router = APIRouter(prefix="/users", tags=["Users"])

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Logger configuration
logger = logging.getLogger("uvicorn.error")

ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expiry duration


def hash_password(password: str) -> str:
    """Hashes a plain-text password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    """
    Create a JWT token with an expiration time.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/signup", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """
    Handles user signup by validating input, hashing the password,
    and storing user data in the database.
    """
    logger.info("Signup request received for email: %s", user.email)

    # Hash the password before saving
    hashed_password = hash_password(user.password)

    # Check if the email is already registered
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        logger.warning("Email already registered: %s", user.email)
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create a new user
    try:
        new_user = models.User(
            name=user.name,
            email=user.email,
            hashed_password=hashed_password,
            age=user.age,
            height=user.height,
            weight=user.weight,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info("User created successfully: %s", new_user.email)
        return new_user
    except Exception as e:
        logger.error("Error during user creation: %s", str(e))
        db.rollback()
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred. Please try again."
        )


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    """Handles user login."""
    logger.info("Login request received for email: %s", user.email)

    # Verify user credentials
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        logger.warning("Invalid login attempt for email: %s", user.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate a JWT token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    logger.info("Login successful for email: %s", user.email)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(
    db: Session = Depends(database.get_db),
    current_user_id: int = Depends(get_current_user),
):
    """Fetches the current logged-in user's info."""
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/token")
def get_token(
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user),  # Validate user
):
    """
    Retrieve a token for the currently logged-in user.
    """
    db_user = db.query(models.User).filter(models.User.id == current_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Generate a token for the user
    token = create_access_token(data={"sub": str(db_user.id)})
    return {"token": token}
