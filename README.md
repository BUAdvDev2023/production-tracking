# Shoe Production Tracking System

This project is a web-based application for tracking shoe production, managing shoe models, and user accounts.

## Features

- User authentication with role-based access control (User, Product Engineer, Admin)
- Shoe data entry and viewing
- Shoe model management (for Product Engineers and Admins)
- Data visualization with charts (for Product Engineers and Admins)
- User account management (for Admins)
- HTTPS support with self-signed certificates
- Database backup functionality
- Password expiration and reset mechanism

## Prerequisites

Make sure you have the following installed on your system:

- Docker
- Docker Compose (if not included with your Docker installation)

## Installation

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
    Open your web browser and navigate to `https://localhost:5273`.

    Note: You may see a security warning because of the self-signed certificate. This is expected in a development environment.

## Directory Structure

- `app/`: Contains the application code.
  - `static/`: Contains static files (CSS, JavaScript).
  - `templates/`: Contains HTML templates.
  - `main.py`: The main Flask application file.
- `database/`: Contains the database files.
- `Dockerfile`: Defines the Docker image.
- `requirements.txt`: Lists the Python dependencies.
- `docker-compose.yml`: Configures the Docker services.

## Environment Variables

The following environment variables are set in the Docker Compose file:

- `SHOE_DB_PATH=/database/shoes.db`: Path to the shoe database.
- `USERS_DB_PATH=/database/users.db`: Path to the users database.
- `MODELS_DB_PATH=/database/models.db`: Path to the shoe models database.
- `FLASK_ENV=development`: Flask environment setting.

## Login

The application starts with a default admin account and two more accounts for testing purposes:

1. Admin Account:
   - Username: `admin`
   - Password: `shoepass`

2. Production Engineer Account:
   - Username: `Peter`
   - Password: `prod`

3. User Account:
   - Username: `Terry`
   - Password: `op`

## Security

- The application uses HTTPS with a self-signed certificate for development purposes.
- Passwords are hashed before storing in the database.
- Role-based access control is implemented to restrict access to certain features.
- Password expiration is enforced for non-admin users (90 days).

## Additional Information

- **Ports**: The application runs on port `5273` inside the container and maps to port `5273` on your local machine.
- **Volumes**: The `app` and `database` directories are mounted as volumes to allow live changes during development.
- **Container Name**: The container is named `shoe_production_app`.

## Development

The application uses a single-page application (SPA) approach with client-side routing. The main JavaScript file (`app/static/app.js`) handles the routing and rendering of different views.

To make changes to the frontend, edit the JavaScript files in the `app/static/js/` directory. For backend changes, modify `main.py`.

## New Features

- **Database Backup**: Admins can now perform manual backups of the database. Automatic backups are scheduled weekly.
- **Password Reset**: Users are required to reset their password after 90 days (except for admin accounts).
- **Data Visualization**: Enhanced charting capabilities for viewing shoe production data.
- **Shoe Model Management**: Improved interface for creating, editing, and deleting shoe models.

## Troubleshooting

If you encounter any issues, please check the following:

1. Ensure Docker and Docker Compose are installed and running.
2. Check if the required ports are not in use by other applications.
3. Verify that the database files have the correct permissions.

For any persistent issues, please refer to the project's issue tracker on GitHub.