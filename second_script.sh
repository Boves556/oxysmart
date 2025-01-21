#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Switch to PostgreSQL user
echo "Setting up PostgreSQL database and user..."
sudo -u postgres psql <<PSQL
CREATE USER oxysmart_user WITH PASSWORD 'oxysmart';
CREATE DATABASE oxysmart OWNER oxysmart_user;
GRANT ALL PRIVILEGES ON DATABASE oxysmart TO oxysmart_user;
PSQL

# Update PostgreSQL authentication method
echo "Updating PostgreSQL authentication method..."
sudo sed -i 's/^local[[:space:]]\+all[[:space:]]\+all[[:space:]]\+peer$/local   all             all                                     md5/' /etc/postgresql/12/main/pg_hba.conf

# Restart PostgreSQL service
echo "Restarting PostgreSQL service..."
sudo service postgresql restart

# Restore database from dump file
echo "Restoring database from dump file..."
PGPASSWORD="oxysmart" psql -U oxysmart_user -d oxysmart -f dump.sql
