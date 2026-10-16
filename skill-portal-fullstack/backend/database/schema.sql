CREATE DATABASE IF NOT EXISTS skill_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skill_portal;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  skill VARCHAR(80) NOT NULL DEFAULT 'React',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO students (name, email, skill) VALUES
('Aarav Patil', 'aarav.demo@example.com', 'React'),
('Anaya Sharma', 'anaya.demo@example.com', 'Python'),
('Ishaan Deshmukh', 'ishaan.demo@example.com', 'SQL');
