CREATE TABLE users 
  ( 
     id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
     oauth_client_id INT(11) NOT NULL, 
     first_name      VARCHAR (32) NOT NULL, 
     last_name       VARCHAR(32) NOT NULL, 
     email           VARCHAR(32) NOT NULL, 
     created_at      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
     CONSTRAINT users_oauth_clients_id_fk FOREIGN KEY (oauth_client_id) 
     REFERENCES oauth_clients (id) ON UPDATE CASCADE 
  ); 