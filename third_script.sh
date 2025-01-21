#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Start the backend server
echo "Starting the backend server..."
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
