# Use Python 3.11 as the base image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /backend/app

# Copy the backend application code into the container
COPY ./backend/app ./backend/app

# Copy the frontend directory into the container
COPY ./frontend ./frontend

# Copy the requirements file and install dependencies
COPY requirements.txt .

# Install dependencies with Python 3.11
RUN pip install --no-cache-dir -r requirements.txt

# Copy the .env file into the container for environment variables
COPY .env .env

# Copy the wait-for-it.sh script
COPY wait-for-it.sh /wait-for-it.sh

# Ensure wait-for-it.sh is executable
RUN chmod +x /wait-for-it.sh

# Set environment variables (ensure the app uses the appropriate config)
ENV PYTHONPATH=/app

# Run FastAPI using Uvicorn with wait-for-it.sh to ensure DB readiness
CMD ["/wait-for-it.sh", "db:5432", "--", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"]