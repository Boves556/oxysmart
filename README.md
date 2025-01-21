To log in:
email: enechukwulucky@gmail.com
password: Lucky123

To run this on github codespaces:
```
docker-compose up --build
```


# Dockerization Challenges and Solutions

## 4.1.1 Steps Taken for Dockerization

### 1. Dockerizing the Backend
- **Dockerfile**:
  - Used Python 3.11 as the base image.
  - Installed dependencies using `requirements.txt`.
  - Configured the `.env` file for environment variables.
  - Included a `wait-for-it.sh` script to ensure the backend waits for the database to be ready.

### 2. Dockerizing the Database
- Added a PostgreSQL service in `docker-compose.yml`:
  - Used the official `postgres:12` image.
  - Configured the database using an `.env` file.
  - Set up volume mounts to:
    - Persist data.
    - Initialize the database with a `db_init` folder.

### 3. Dockerizing the Frontend
- Configured Nginx to serve static files from the `frontend/static` directory.
- Created a custom `nginx.conf` to:
  - Serve static files.
  - Proxy API requests to the FastAPI backend.

### 4. Configuring `docker-compose.yml`
- Defined services for:
  - `db`: PostgreSQL database.
  - `webapi_app`: FastAPI backend.
  - `nginx`: Frontend and reverse proxy.

---

## 4.1.2 Challenges and Issues Faced

### 1. Backend Not Connecting to the Database
- **Issue**: The FastAPI backend attempted to connect to `localhost:5432` instead of the `db` container.
- **Solution**:
  - Updated the database URL in the `.env` file to use the container name (`db`) instead of `localhost`.
  - Verified the database was running and accessible within the Docker network.

### 2. Nginx Rewrite and Redirection Errors
- **Issue**: Misconfiguration in `nginx.conf` caused infinite redirection when serving static files.
- **Solution**:
  - Updated `nginx.conf`:
    - Added `try_files $uri /index.html;` to serve `index.html` for Single Page Applications (SPAs).
    - Proxied `/api/` routes to the backend.
  - **Remaining Problem**: This solution did not work due to reasons unknown before the project submission.

### 3. Static Files Not Found
- **Issue**: The Dockerfile for the backend did not copy the `frontend/static` directory.
- **Solutions Tried**:
  1. Updated the Dockerfile to copy the entire `frontend` directory.
  2. Mounted the `frontend/static` directory in the Nginx service using `docker-compose.yml`.
  - **Remaining Problem**: These solutions did not resolve the issue.

---

## 4.1.3 Persistent Errors in Codespaces
While testing in GitHub Codespaces, additional issues surfaced:

### 1. Nginx Static File Issues
- **Issue**: Static files were not served correctly due to incorrect paths in `nginx.conf`.
- **Attempted Resolution**:
  - Fixed the root path in `nginx.conf`.
  - Ensured `try_files` served the correct resources.
  - **Remaining Problem**: The issue persisted for reasons unknown.

### 2. Frontend File Structure Issues
- **Issue**: Static files were not loading as expected, potentially due to incorrect paths or file structure.
- **Remaining Problem**: This issue was not resolved before the project deadline.

---

## 4.1.4 Conclusion
Despite efforts to address service communication, static file serving, and database initialization issues, some problems persisted. Future work could focus on:

- Debugging the Nginx configuration for static file serving.
- Verifying file structure and paths in the frontend directory.
- Testing database and backend connectivity in an isolated Docker environment.

---

### Notes
- This README reflects the challenges and attempted solutions during the Dockerization process.
- Further debugging and testing are required to resolve the remaining issues.

