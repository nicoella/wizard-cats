#!/bin/bash

mysql -u root -p <<MYSQL_SCRIPT
CREATE DATABASE wizard_cats;
CREATE USER 'Admin'@'localhost' IDENTIFIED BY 'Password';
GRANT ALL PRIVILEGES ON wizard_cats.* TO 'Admin'@'localhost';
FLUSH PRIVILEGES;
USE wizard_cats;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    games_played INT DEFAULT 0,
    wins INT DEFAULT 0
);
EXIT;
MYSQL_SCRIPT
