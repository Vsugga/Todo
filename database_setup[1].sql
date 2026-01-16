-- SQL queries to create the todo app database tables

-- Create the database (run this first if the database doesn't exist)
CREATE DATABASE IF NOT EXISTS todo;
USE todo;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_id ON todos(user_id);

-- Optional: Create an index on email for faster login queries
CREATE INDEX IF NOT EXISTS idx_email ON users(email);