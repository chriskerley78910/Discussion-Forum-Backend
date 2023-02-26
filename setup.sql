CREATE database forum;
CREATE USER 'chris'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON forum.* TO 'chris'@'%';
ALTER USER 'chris'@'%' IDENTIFIED WITH mysql_native_password BY 'password';