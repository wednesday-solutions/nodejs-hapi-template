CREATE TABLE bookings
(
  id integer NOT NULL AUTO_INCREMENT,
  user_id integer NOT NULL,
  cab_id integer NOT NULL,
  pickup_location varchar(100) NOT NULL,
  drop_location varchar(100) NOT NULL,
  fare float NOT NULL DEFAULT 0,
  distance float NOT NULL DEFAULT 0,
  driver_id integer NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT pk_bookings PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (cab_id) REFERENCES cabs (id),

  CONSTRAINT fk_bookings_driver FOREIGN KEY (driver_id) REFERENCES drivers (id),

  CONSTRAINT fk_bookings_userid FOREIGN KEY (user_id) REFERENCES users (id)
);
