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

# Switch to PostgreSQL user and set up database and user
echo "Setting up PostgreSQL database and user..."
sudo -u postgres psql <<EOF
CREATE USER oxysmart_user WITH PASSWORD 'oxysmart';
CREATE DATABASE oxysmart OWNER oxysmart_user;
GRANT ALL PRIVILEGES ON DATABASE oxysmart TO oxysmart_user;
EOF

# Update PostgreSQL authentication method
echo "Updating PostgreSQL authentication method..."
sudo sed -i 's/^local[[:space:]]\+all[[:space:]]\+all[[:space:]]\+peer$/local   all             all                                     md5/' /etc/postgresql/12/main/pg_hba.conf

# Restart PostgreSQL service
echo "Restarting PostgreSQL service..."
sudo service postgresql restart

# Restore database from dump file
echo "Restoring database from dump file..."
PGPASSWORD="oxysmart" psql -U oxysmart_user -d oxysmart -f dump.sql

# Start the backend server
echo "Starting the backend server..."
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
