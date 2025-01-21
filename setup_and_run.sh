#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create a virtual environment and activate it
echo "Creating and activating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install required Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Update system packages
echo "Updating system packages..."
sudo apt update

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo service postgresql start

# Switch to root user
sudo -i
exit