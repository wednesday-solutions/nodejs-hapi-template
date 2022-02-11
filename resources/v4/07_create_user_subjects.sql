create table user_subjects (
  id int not null AUTO_INCREMENT PRIMARY KEY, 
  user_id int not null, 
  subject_id int not null, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
  updated_at DATETIME NULL on UPDATE CURRENT_TIMESTAMP, 
  deleted_at DATETIME NULL, 
  INDEX (user_id), 
  INDEX (subject_id), 
  UNIQUE(user_id, subject_id), 
  CONSTRAINT user_subjects__idx__subject_id FOREIGN KEY (subject_id) REFERENCES subjects (id) ON UPDATE CASCADE, 
  CONSTRAINT user_subjects__idx__user_id FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
);
