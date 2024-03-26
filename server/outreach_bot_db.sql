CREATE DATABASE outreach_bot_db;

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

CREATE TABLE custom_messages (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(id),
  content TEXT,
  title VARCHAR(255)
);

CREATE TABLE searches (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(id),
  criteria_json JSON
);

CREATE TABLE contacts (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  linkedin_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  current_position VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  email VARCHAR(255) UNIQUE
);

CREATE TABLE outreach (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  search_id INT REFERENCES searches(id),
  contact_id INT REFERENCES contacts(id),
  message_id INT,  -- This could be linked to either templates or custom_messages. Additional logic may be needed to handle this.
  status VARCHAR(50),
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE attachments (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(id),
  file_name VARCHAR(255),
  content_type VARCHAR(50),
  data BYTEA
);
