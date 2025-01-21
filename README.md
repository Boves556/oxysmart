To log in:
email: enechukwulucky@gmail.com
password: Lucky123!

To run the code:
```
chmod +x setup_and_run.sh
```
then run:
```
./setup_and_run.sh
```

after it loads, run:
```
chmod +x second_script.sh
```
then run:
```
./second_script.sh
```

after it loads, run 'exit' then run:

```
pip install -r backend/requirements.txt
```

```
chmod +x third_script.sh
```

then run:
```
./third_script.sh
```



# Challenges we faced Using Shell Scripts in GitHub Codespaces

## 4.2.1 Objective
The primary goal of using shell scripts in this project was to automate the setup, configuration, and execution of the backend application, functioning as an alternative to Docker. This included:

- Setting up a Python virtual environment and installing dependencies.
- Installing and configuring PostgreSQL.
- Restoring a database dump.
- Running the backend application using `uvicorn`.

## 4.2.2 Approach
We implemented a shell script solution with the following functionalities:

1. **Python Environment Setup**:
   - Created and activated a Python virtual environment.
   - Installed dependencies from `requirements.txt`.

2. **System Updates and PostgreSQL Installation**:
   - Updated system packages.
   - Installed PostgreSQL and started its service.

3. **Database Configuration**:
   - Set up a PostgreSQL user and database.
   - Configured PostgreSQL authentication methods.
   - Restored a database dump from a file.

4. **Backend Application Launch**:
   - Ran the backend server using `uvicorn`.

## 4.2.3 Challenges Faced
1. **Interactive Commands**:
   - Using `sudo -i` opened an interactive root shell, causing the script to exit prematurely, as Codespaces does not handle such interactions seamlessly.

2. **Context Switching**:
   - Running commands like `sudo -u postgres psql` required executing SQL commands, but Codespaces occasionally failed to recognize the context correctly due to environment isolation, leading to authentication errors.

3. **Script Exit Issues**:
   - The `sudo -i` command exited into a new root shell, disrupting the script flow and requiring manual intervention.

4. **Error Logs**:
   - Errors such as "peer authentication failed" arose due to PostgreSQL's default authentication settings.
   - Modifications to `pg_hba.conf` required a service restart (`sudo service postgresql restart`), which sometimes failed to sync properly within the Codespaces environment.

5. **Backend Server Launch**:
   - The `uvicorn` server could not launch if earlier steps failed, halting the project execution.

## 4.2.4 Solutions Implemented
### 1. Splitting the Script
To address flow and context issues, we divided the original shell script into three parts:

- **First Script**:
  - Handles Python virtual environment setup, dependency installation, system updates, and starting PostgreSQL.
- **Second Script**:
  - Manages PostgreSQL user and database setup, authentication configuration, and database restoration.
- **Third Script**:
  - Starts the backend server using `uvicorn`.

### 2. Environment Isolation
Each script was designed to execute independently, avoiding context-switching issues.

### 3. Error Handling
- Added `set -e` to ensure the script stopped on encountering any error, simplifying debugging.
- Used `echo` statements for detailed logging at each step.

### 4. Testing in Codespaces
- Sequentially tested each script in Codespaces for compatibility.
- Programmatically updated PostgreSQL authentication settings (`pg_hba.conf`) and restarted the service.

## 4.2.5 Remaining Issues
Despite these efforts, errors persisted when logging into the system using user details from the database dump. Unfortunately, time constraints prevented further debugging of these issues before project submission.

## 4.2.6 Conclusion
While the implemented solutions improved the workflow and addressed many challenges, some issues remain unresolved. Future efforts could focus on resolving database authentication errors and further refining the scripts for seamless integration in Codespaces.

---




