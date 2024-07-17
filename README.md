# production-tracking

Installation
To set up and run this project, follow the steps below:

Prerequisites
Make sure you have the following installed on your system:

Docker
Docker Compose (if not included with your Docker installation)
Steps
Clone the repository:

bash
Copy code
git clone <repository_url>
cd <repository_directory>
Build the Docker image:

bash
Copy code
docker-compose build
Run the Docker container:

bash
Copy code
docker-compose up
Access the application:
Open your web browser and navigate to http://localhost:80.

Directory Structure
The repository is structured as follows:

css
Copy code
<repository_directory>/
│
├── app/
│   ├── main.py
│   ├── ...
│
├── database/
│   ├── shoe_database.db
│   ├── users.db
│
├── Dockerfile
├── requirements.txt
├── docker-compose.yml
├── ...
app/: Contains the application code.
database/: Contains the SQLite database files.
Dockerfile: Defines the Docker image.
requirements.txt: Lists the Python dependencies.
docker-compose.yml: Configures the Docker services.
Environment Variables
The following environment variables are set in the Docker Compose file:

DB_PATH=/database/shoe_database.db: Path to the shoe database.
USERS_DB_PATH=/database/users.db: Path to the users database.
FLASK_ENV=development: Flask environment setting.
Additional Information
Ports: The application runs on port 80 inside the container and maps to port 80 on your local machine.
Volumes: The app and database directories are mounted as volumes to allow live changes during development.
Container Name: The container is named shoe_production_app.

By following these steps, you should be able to set up and run the project successfully. If you encounter any issues, please refer to the project's issue tracker on GitHub or the documentation.

Usage

To log into the application, use the default admin login details.
Username: admin
Password: shoepass
