# Outreach Bot Project Setup
This guide will walk you through setting up the database for the Outreach Bot project locally.

## Prerequisites
Before you begin, make sure you have the following installed:

PostgreSQL
pgAdmin or a similar PostgreSQL management tool (optional, but helpful for visual management of your database)
## Database Setup
Follow these steps to set up your database:

### 1. Create the Database
First, you'll need to create the database. You can do this via the command line or through pgAdmin.

Using the Command Line:

Open your command line tool.
Connect to PostgreSQL with the psql command line tool:
bash
Copy code
psql -U postgres
Run the following SQL command to create the database:
sql
Copy code
CREATE DATABASE outreach_bot_db;
Exit psql with:
sql
Copy code
\q
Using pgAdmin:

Open pgAdmin and connect to your PostgreSQL server.
Right-click on "Databases", select "Create", then "Database...".
Name the database outreach_bot_db and save.
### 2. Create the Tables
With the database created, you'll now need to set up the tables. You can execute the SQL commands provided in this README directly in psql or through pgAdmin's query tool.

Connect to the newly created database:
bash
Copy code
psql -U postgres -d outreach_bot_db
Execute the SQL commands provided below to create the necessary tables:
sql
Copy code
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  encrypted_password VARCHAR(255) NOT NULL,
  professional_position VARCHAR(100),
  username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE templates (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category VARCHAR(100),
  content TEXT,
  title VARCHAR(255)
);

-- Continue with the rest of the table creation commands here...
Repeat the process for each CREATE TABLE command provided above.

## Configuration
After setting up the database, you'll need to configure your application to connect to it:

Rename the .env.example file to .env.
Update the .env file with your PostgreSQL credentials and the name of the database you created:
makefile
Copy code
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=outreach_bot_db
## Running the Application
With your database set up and your application configured, you're now ready to run the application. Follow the instructions in the main project README for starting your application.