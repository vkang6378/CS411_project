--Create the database
CREATE DATABASE event_recommendation;

--Use the database
USE event_recommendation;

--Create the users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  CONSTRAINT username_unique UNIQUE (username)
);

--Create the liked_posts table
CREATE TABLE liked_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id VARCHAR(50) NOT NULL,
  content TEXT,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

--Create the event table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE,
  location VARCHAR(100),
  description TEXT
);

--Create the event_keyword table
CREATE TABLE event_keywords (
  event_id INT NOT NULL,
  keyword VARCHAR(50) NOT NULL,
  CONSTRAINT fk.event_id FOREIGN KEY (event_id) REFERENCES events(id)
);












