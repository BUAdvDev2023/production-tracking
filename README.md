# Installation

To set up and run this project, follow the steps below:

## Prerequisites

Make sure you have the following installed on your system:

- Docker
- Docker Compose (if not included with your Docker installation)

## Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/BUAdvDev2023/production-tracking.git
    cd production-tracking
    ```

2. **Build the Docker image**:
    ```bash
    docker-compose build
    ```

3. **Run the Docker container**:
    ```bash
    docker-compose up
    ```

4. **Access the application**:
    Open your web browser and navigate to `http://localhost:5273`.

## Directory Structure

- `app/`: Contains the application code.
- `database/`: Contains the database files.
- `Dockerfile`: Defines the Docker image.
- `requirements.txt`: Lists the Python dependencies.
- `docker-compose.yml`: Configures the Docker services.

## Environment Variables

The following environment variables are set in the Docker Compose file:

- `DB_PATH=/database/shoe_database.db`: Path to the shoe database.
- `USERS_DB_PATH=/database/users.db`: Path to the users database.
- `FLASK_ENV=development`: Flask environment setting.

## Login

The application starts with a default admin login with the usename 'admin' and password 'shoepass'.

## Additional Information

- **Ports**: The application runs on port `5273` inside the container and maps to port `5273` on your local machine.
- **Volumes**: The `app` and `database` directories are mounted as volumes to allow live changes during development.
- **Container Name**: The container is named `shoe_production_app`.

By following these steps, you should be able to set up and run the project successfully. If you encounter any issues, please refer to the project's issue tracker on GitHub or the documentation.

