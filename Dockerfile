# Dockerfile
FROM python:3.12.2-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy the app directory contents into the container at /app
COPY app/ /app

# Copy the database directory contents into the container at /database
COPY database/ /database

# Copy static directory contents into the container at /app/static
COPY app/static /app/static

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install sqlite3
RUN apt-get update && apt-get install -y sqlite3

# Make port 80 available to the world outside this container
EXPOSE 80

# Update the DB_PATH to point to the new location of the database
ENV DB_PATH=/database/shoe_database.db
ENV USERS_DB_PATH=/database/users.db
ENV SHOE_MODELS_DB_PATH=/database/shoes.db

CMD ["python", "main.py"]


