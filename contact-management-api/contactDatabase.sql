
create database contactApp;
use contactApp;
show tables;
select * from users;
ALTER TABLE users
  MODIFY COLUMN security_question VARCHAR(255) NULL;
