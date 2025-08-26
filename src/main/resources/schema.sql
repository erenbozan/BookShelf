-- BookShelf Database Schema
-- This script creates the users and books tables for the BookShelf application

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bookShelf;

-- Use the bookShelf database
USE bookShelf;

-- Drop tables if exists (for development purposes)
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_enabled BOOLEAN DEFAULT TRUE,
    is_account_non_expired BOOLEAN DEFAULT TRUE,
    is_account_non_locked BOOLEAN DEFAULT TRUE,
    is_credentials_non_expired BOOLEAN DEFAULT TRUE,
    
    -- Add indexes for better performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create books table
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    isbn VARCHAR(50) UNIQUE,
    publisher VARCHAR(100),
    publication_year INT,
    genre VARCHAR(50),
    page_count INT,
    language VARCHAR(20) DEFAULT 'English',
    cover_image_url VARCHAR(500),
    file_url VARCHAR(500),
    status ENUM('AVAILABLE', 'BORROWED', 'RESERVED', 'UNAVAILABLE', 'LOST') DEFAULT 'AVAILABLE',
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Add indexes for better performance
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_isbn (isbn),
    INDEX idx_genre (genre),
    INDEX idx_status (status),
    INDEX idx_owner_id (owner_id),
    INDEX idx_publication_year (publication_year)
);

-- Insert a sample admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (username, email, password, first_name, last_name, role) 
VALUES ('admin', 'admin@bookshelf.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin', 'User', 'ADMIN');

-- Insert a sample regular user (password: user123)
INSERT INTO users (username, email, password, first_name, last_name, role) 
VALUES ('user', 'user@bookshelf.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Regular', 'User', 'USER');

-- Insert sample books
INSERT INTO books (title, author, description, isbn, publisher, publication_year, genre, page_count, language, owner_id) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', '978-0743273565', 'Scribner', 1925, 'Fiction', 180, 'English', 1),
('To Kill a Mockingbird', 'Harper Lee', 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.', '978-0446310789', 'Grand Central Publishing', 1960, 'Fiction', 281, 'English', 1),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism and surveillance society.', '978-0451524935', 'Signet Classic', 1949, 'Science Fiction', 328, 'English', 2);

-- Show the created table structures
DESCRIBE users;
DESCRIBE books;

-- Show sample data
SELECT id, username, email, first_name, last_name, role, created_at FROM users;
SELECT id, title, author, genre, status, owner_id FROM books;

