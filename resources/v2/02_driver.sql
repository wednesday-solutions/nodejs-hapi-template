CREATE TABLE drivers
(
  id integer NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  phone_no varchar(10) NOT NULL,
  cab_id integer NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,  
  CONSTRAINT pk_drivers PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (cab_id) REFERENCES cabs (id)
);