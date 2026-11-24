<?php
// ==============================================================
// Health / Status Check Endpoint
// GET /php_backend/health.php
// ==============================================================

require_once __DIR__ . '/db.php';

try {
    $rCount = (int)$pdo->query("SELECT COUNT(*) FROM rooms")->fetchColumn();
    $bCount = (int)$pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();

    echo json_encode([
        'status'   => 'online',
        'hotel'    => 'Namo Raga Luxury Hotel (PHP + MySQL Backend)',
        'platform' => 'XAMPP Apache / MySQL',
        'time'     => date('c'),
        'database' => [
            'connected'      => true,
            'total_rooms'    => $rCount,
            'total_bookings' => $bCount
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error'  => $e->getMessage()
    ]);
}
