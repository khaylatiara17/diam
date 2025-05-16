<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode([
        'authenticated' => false,
        'redirect' => '../login.html'
    ]);
    exit();
}

echo json_encode([
    'authenticated' => true,
    'user' => [
        'name' => $_SESSION['admin_name'],
        'role' => $_SESSION['admin_role']
    ]
]);
