CREATE database chris;
CREATE USER 'chris'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON chris.* TO 'chris'@'%';
ALTER USER 'chris'@'%' IDENTIFIED WITH mysql_native_password BY 'password';