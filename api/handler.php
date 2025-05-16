<?php
require_once '../config/database.php';

class ApiHandler {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function verifyAdmin($email, $password) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM admin WHERE email = ?");
            $stmt->execute([$email]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && password_verify($password, $admin['password'])) {
                $this->updateLastLogin($admin['id']);
                return $admin;
            }
            return false;
        } catch(PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            return false;
        }
    }

    private function updateLastLogin($adminId) {
        $stmt = $this->db->prepare("UPDATE admin SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$adminId]);
    }

    public function saveApplication($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO kontak_kita (email, pesan, status_aplikasi) 
                VALUES (?, ?, 'pending')
            ");
            return $stmt->execute([$data['email'], $data['pesan']]);
        } catch(PDOException $e) {
            error_log("Application save error: " . $e->getMessage());
            return false;
        }
    }
}
