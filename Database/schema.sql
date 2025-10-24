-- Creazione database
CREATE DATABASE IF NOT EXISTS issuenet;
USE issuenet;

-- Drop delle tabelle in ordine di dipendenza per evitare errori di foreign key
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Tabella User
CREATE TABLE users (
    `id_user` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'project_manager', 'developer', 'tester') DEFAULT 'developer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Project
CREATE TABLE projects (
    `id_project` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `created_by` INT NOT NULL,
    `status` ENUM('active', 'archived') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Tabella Issue
CREATE TABLE issues (
    `id_issue` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    `status` ENUM('todo', 'in_progress', 'in_review', 'done') DEFAULT 'todo',
    `type` ENUM('bug', 'feature', 'task', 'improvement') DEFAULT 'bug',
    `id_project` INT NOT NULL,
    `assigned_to` INT,
    `created_by` INT NOT NULL,
    `estimated_hours` DECIMAL(5,2),
    `actual_hours` DECIMAL(5,2),
    due_date DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_project) REFERENCES projects(id_project) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id_user) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Tabella Comments
CREATE TABLE comments (
    `id_comment` INT PRIMARY KEY AUTO_INCREMENT,
    `id_issue` INT NOT NULL,
    `id_user` INT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_issue) REFERENCES issues(id_issue) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);