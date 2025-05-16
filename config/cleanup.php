<?php
require_once 'database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Cleanup old records and optimize tables
    $tables = ['kontak_kita', 'blog', 'layanan'];
    
    foreach ($tables as $table) {
        // Delete records older than 1 year
        $db->exec("DELETE FROM $table WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)");
        // Optimize table
        $db->exec("OPTIMIZE TABLE $table");
    }
    
    echo "Database cleanup completed successfully\n";
} catch(PDOException $e) {
    die("Database cleanup failed: " . $e->getMessage());
}
