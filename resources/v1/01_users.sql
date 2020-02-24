create table users(
  id int(11) not null AUTO_INCREMENT PRIMARY KEY, 
  first_name varchar(32) not null, 
  last_name varchar(32) not null,
  email varchar(32) not null, 
  created_at datetime default CURRENT_TIMESTAMP not null
);
