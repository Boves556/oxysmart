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
chmod +x third_script.sh
```

then run:
```
./third_script.sh
```



#Challenges we faced while using Shell Scripts in the Project on GitHub Codespaces:#
After we had issues running our project on github codespaces with docker, we decided to create shell scripts that could easily run our code.
**4.2.1 Objective
**The primary goal of using shell scripts in this project was to automate the setup, configuration, and execution of the backend application just as docker would. This included:
Setting up a Python virtual environment and installing dependencies.
Installing and configuring PostgreSQL.
Restoring a database dump.
Running the backend application using uvicorn.

**4.2.2 Approach
**We started with a single shell script designed to:
Create and activate a Python virtual environment.
Install dependencies from requirements.txt.
Update system packages.
Install PostgreSQL and start its service.
Set up a PostgreSQL user and database.
Configure PostgreSQL authentication methods.
Restore a database dump from a file.
Launch the backend server using uvicorn.

**4.2.3 Challenges Faced
**Interactive Commands:
The command sudo -i used to switch to the root user opened an interactive root shell.
This caused the script to exit prematurely as Codespaces is not designed to handle such interactions seamlessly within a non-interactive shell script.
Context Switching:
When using sudo -u postgres psql, the shell script required executing SQL commands. Codespaces sometimes failed to recognize the context correctly due to the environment isolation, leading to authentication errors.
Script Exit Issues:
The sudo -i command exited into a new root shell, preventing subsequent commands from executing. This disrupted the flow of the script, requiring a manual restart.
Error Logs:
Errors such as "peer authentication failed" occurred due to PostgreSQL’s default authentication settings, which needed to be modified in pg_hba.conf.
Configuration changes required a service restart (sudo service postgresql restart), which sometimes did not sync properly in the Codespaces environment.
Backend Server Launch:
The uvicorn server launch needed to happen after all the configurations and database setups. If earlier steps failed, the server could not start.

** 4.2.4 Solutions we tried Implementing
**Splitting the Script:
We divided the original shell script into three separate scripts:
First Script: Handles Python virtual environment setup, dependency installation, system updates, and starting PostgreSQL.
Second Script: Manages PostgreSQL user and database setup, authentication configuration, and database restoration.
Third Script: Starts the backend server using uvicorn.
Environment Isolation:
Ensured that each script executed independently to avoid context switching issues.
Error Handling:
Added set -e to ensure the script stopped on any error, making debugging easier.
Used echo statements to provide detailed logs for each step.
Testing in Codespaces:
After splitting the scripts, we tested them sequentially in Codespaces to ensure compatibility.
Updated PostgreSQL authentication settings (pg_hba.conf) programmatically and restarted the service.
However we still encountered some errors when we tried to login to our system using the user details on our dump file. Unfortunately, we did not have time to try and solve these errors before the submission of the project. We attached a picture of the errors we got below:



