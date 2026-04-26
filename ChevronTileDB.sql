CREATE DATABASE chevrontileinc;

USE chevrontileinc;

CREATE TABLE estimates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    project_type VARCHAR(100),
    square_footage INT,
    budget_range VARCHAR(50),
    project_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM estimates;