CREATE TABLE cabs
(
  id integer NOT NULL AUTO_INCREMENT,
  coordinates point NOT NULL,
  car_model varchar(100) NOT NULL,
  vehicle_number varchar(8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT pk_cabs PRIMARY KEY (id)
);