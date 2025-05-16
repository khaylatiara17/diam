<?php
require_once 'database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Read SQL file
    $sql = file_get_contents('../bacotz_db.sql');
    
    // Execute SQL commands
    $db->exec($sql);
    
    echo "Database initialized successfully\n";
} catch(PDOException $e) {
    die("Database initialization failed: " . $e->getMessage());
}
