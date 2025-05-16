<?php
require_once 'config.php';

function verifyLogin($email, $password) {
    $conn = getConnection();
    
    try {
        $stmt = $conn->prepare("SELECT id, name, password, role FROM admin WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Update last login time
            $updateStmt = $conn->prepare("UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            
            // Set session variables
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_name'] = $user['name'];
            $_SESSION['admin_role'] = $user['role'];
            
            return true;
        }
        
        return false;
    } catch(PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        return false;
    }
}

function requireLogin() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: ../login.html');
        exit();
    }
}
