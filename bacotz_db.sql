-- Drop database if exists and create new
DROP DATABASE IF EXISTS bacotz_db;
CREATE DATABASE bacotz_db;
USE bacotz_db;

-- Create admin table
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: b@c0tz9876)
INSERT INTO admin (name, email, password, role) VALUES 
('Admin', 'admin@cot.com', '$2a$10$YourPasswordHashHere', 'admin');

-- Create applications table
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(50) NOT NULL,
  amount BIGINT NOT NULL,
  tenure INT NOT NULL,
  purpose TEXT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create profil table
CREATE TABLE profil (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create portofolio/layanan table
CREATE TABLE layanan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    gambar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create kontak table
CREATE TABLE kontak (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alamat VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create kontak_kita table
CREATE TABLE kontak_kita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    pesan TEXT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create blog table
CREATE TABLE blog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    konten TEXT NOT NULL,
    telepon VARCHAR(20),
    gambar VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add application status field to kontak_kita table
ALTER TABLE kontak_kita 
ADD COLUMN status_aplikasi ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Add indexes for better performance
ALTER TABLE kontak ADD INDEX idx_email (email);
ALTER TABLE kontak_kita ADD INDEX idx_email (email);
ALTER TABLE blog ADD INDEX idx_judul (judul);

-- Insert sample data for profil
INSERT INTO profil (nama, deskripsi) VALUES 
('Bacotz Group', 'Bringing Advanced Cashflow Optimization Through Zeal');

-- Insert sample data for layanan
INSERT INTO layanan (judul, deskripsi) VALUES 
('Pendanaan Rumah', 'Solusi pendanaan rumah yang dirancang khusus untuk memberikan kemudahan dan fleksibilitas finansial bagi Anda.'),
('Pendanaan Kendaraan', 'Miliki Kendaraan Impian dengan Cara Berkelas & Berintegritas!'),
('Pendanaan Modal Kerja', 'Solusi pendanaan untuk kebutuhan modal kerja bisnis Anda.');

-- Insert sample data for kontak
INSERT INTO kontak (alamat, email, telepon) VALUES 
('Jl. Mangga 14 No.6, Jakarta Barat, DKI Jakarta 11510', 'cs@bacotzgroup.com', '(021) 1234-5678');

-- Insert sample data for kontak_kita
INSERT INTO kontak_kita (email, pesan) VALUES 
('customer@example.com', 'Saya tertarik dengan layanan pendanaan rumah.');

-- Insert sample data for blog
INSERT INTO blog (judul, konten, telepon) VALUES 
('Tips Memilih Pendanaan yang Tepat', 'Berikut adalah beberapa tips penting dalam memilih pendanaan yang sesuai dengan kebutuhan Anda...', '0812-3456-7890');

-- Create trigger for updated_at timestamps
DELIMITER //
CREATE TRIGGER before_update_trigger
BEFORE UPDATE ON profil
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//

CREATE TRIGGER before_update_layanan
BEFORE UPDATE ON layanan
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//

CREATE TRIGGER before_update_kontak
BEFORE UPDATE ON kontak
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//

CREATE TRIGGER before_update_kontak_kita
BEFORE UPDATE ON kontak_kita
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//

CREATE TRIGGER before_update_blog
BEFORE UPDATE ON blog
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//
DELIMITER ;