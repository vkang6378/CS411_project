CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  access_token_secret VARCHAR(255) NOT NULL,
  screen_name VARCHAR(255) NOT NULL
);




