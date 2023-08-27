#!/bin/bash

mysql -u root -p <<MYSQL_SCRIPT
CREATE DATABASE wizard_cats;
CREATE USER 'Admin'@'localhost' IDENTIFIED BY 'Password';
GRANT ALL PRIVILEGES ON wizard_cats.* TO 'Admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
MYSQL_SCRIPT
