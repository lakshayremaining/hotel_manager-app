<?php
// ==============================================================
// Rooms API Endpoint
// Supported Methods:
// - GET /php_backend/rooms.php            -> List all rooms (optional: ?status=available&type=Single)
// - GET /php_backend/rooms.php?id=101     -> Get single room
// - POST /php_backend/rooms.php (PATCH status) -> Update room status
// ==============================================================

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/setup.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to format room row (e.g. JSON decode amenities array)
function formatRoom($row) {
    if (!$row) return null;
    $row['id'] = (int)$row['id'];
    $row['price'] = (float)$row['price'];
    if (!empty($row['amenities'])) {
        $decoded = json_decode($row['amenities'], true);
        $row['amenities'] = is_array($decoded) ? $decoded : explode(',', $row['amenities']);
    } else {
        $row['amenities'] = [];
    }
    return $row;
}

if ($method === 'GET') {
    // Single room by ID
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = ?");
        $stmt->execute([(int)$_GET['id']]);
        $room = $stmt->fetch();
        if ($room) {
            echo json_encode(formatRoom($room));
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Room not found']);
        }
        exit();
    }

    // List rooms with optional status / type filters
    $sql = "SELECT * FROM rooms WHERE 1=1";
    $params = [];

    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $sql .= " AND status = ?";
        $params[] = $_GET['status'];
    }

    if (isset($_GET['type']) && !empty($_GET['type'])) {
        $sql .= " AND type = ?";
        $params[] = $_GET['type'];
    }

    $sql .= " ORDER BY id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rooms = $stmt->fetchAll();

    $result = array_map('formatRoom', $rooms);
    echo json_encode($result);
    exit();
}

// Update status: Supports POST with action or PATCH
if ($method === 'POST' || $method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $roomId = isset($_GET['id']) ? (int)$_GET['id'] : (isset($input['id']) ? (int)$input['id'] : 0);
    $status = isset($input['status']) ? trim($input['status']) : '';

    $allowedStatuses = ['available', 'booked', 'maintenance'];
    if (!$roomId || !in_array($status, $allowedStatuses, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid roomId and status (available, booked, maintenance) are required']);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE rooms SET status = ? WHERE id = ?");
    $stmt->execute([$status, $roomId]);

    if ($stmt->rowCount() > 0 || true) {
        $fetch = $pdo->prepare("SELECT * FROM rooms WHERE id = ?");
        $fetch->execute([$roomId]);
        $updatedRoom = $fetch->fetch();
        echo json_encode([
            'success' => true,
            'message' => "Room $roomId status updated to $status",
            'room'    => formatRoom($updatedRoom)
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Room not found or unchanged']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
