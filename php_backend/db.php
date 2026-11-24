<?php
// ==============================================================
// Database Configuration and Connection Handler (PDO)
// Namo Raga Luxury Hotel - XAMPP MySQL
// ==============================================================

// Set JSON headers and CORS for all API responses
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = '127.0.0.1';
$db   = 'hotel_db';
$user = 'root';
$pass = ''; // Default XAMPP password is blank
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // If database does not exist yet, attempt to connect without db name and create it
    try {
        $tempPdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
        $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $ex) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Database connection failed',
            'details' => $ex->getMessage(),
            'hint'    => 'Make sure Apache and MySQL are running in your XAMPP Control Panel.'
        ]);
        exit();
    }
}
