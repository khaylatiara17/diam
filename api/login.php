<?php
require_once 'handler.php';
session_start();

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        throw new Exception('Email and password are required');
    }

    $api = new ApiHandler();
    $admin = $api->verifyAdmin($email, $password);

    if ($admin) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_role'] = $admin['role'];

        echo json_encode([
            'success' => true,
            'redirect' => 'admin/dashboard.html'
        ]);
    } else {
        throw new Exception('Invalid credentials');
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
