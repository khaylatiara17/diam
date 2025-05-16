<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'bacotz_db');

// Admin default credentials
define('ADMIN_EMAIL', 'admin@cot.com');
define('ADMIN_PASSWORD', 'b@c0tz9876'); // Only used for initial setup

// Database connection and other functions
function getConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS
        );
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

// Session configuration
session_start();

// Check if user is logged in as admin
function isAdminLoggedIn() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

// Require admin authentication
function requireAdmin() {
    if (!isAdminLoggedIn()) {
        header('Location: ../login.html');
        exit();
    }
}
