create table oauth_client_resources (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  oauth_client_id INT NOT NULL, 
  resource_type VARCHAR(36) NOT NULL, 
  resource_id VARCHAR(36) NOT NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME NULL on UPDATE CURRENT_TIMESTAMP, 
  CONSTRAINT oauth_client_resources_oauth_client_id_resource_uindex UNIQUE (
    oauth_client_id, resource_type, resource_id
  ), 
  CONSTRAINT oauth_client_resources_oauth_clients_id_fk FOREIGN KEY (oauth_client_id) REFERENCES oauth_clients (id) ON UPDATE CASCADE,
  INDEX(resource_type),
  INDEX(resource_id)
);
