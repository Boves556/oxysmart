from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import user, steps, calories, data, arduino  # Import the arduino router
from .database import Base, engine

# Initialize database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with allowed origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router, prefix="/api/v1")
app.include_router(steps.router)
app.include_router(calories.router)
app.include_router(data.router)
app.include_router(arduino.router, prefix="/api/v1")  # Ensure this line is included

# Serve static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


# Routes to serve the main HTML pages
@app.get("/")
async def root():
    return FileResponse("frontend/templates/index.html")


@app.get("/signup")
async def signup():
    return FileResponse("frontend/templates/signup.html")


@app.get("/login")
async def login():
    return FileResponse("frontend/templates/login.html")


@app.get("/dashboard")
async def dashboard():
    return FileResponse("frontend/templates/dashboard.html")


@app.get("/data-visualization")
async def data_visualization():
    return FileResponse("frontend/templates/data-visualization.html")

@app.get("/emergency")
async def emergency():
    return FileResponse("frontend/templates/emergency.html")

@app.get("/health-alerts")
async def health_alerts():
    return FileResponse("frontend/templates/health-alerts.html")

@app.get("/history")
async def history():
    return FileResponse("frontend/templates/history.html")

@app.get("/user-info")
async def user_info():
    return FileResponse("frontend/templates/user-info.html")
