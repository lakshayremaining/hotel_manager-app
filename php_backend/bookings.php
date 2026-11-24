<?php
// ==============================================================
// Bookings API Endpoint
// Supported Methods:
// - GET  /php_backend/bookings.php               -> List all bookings (?status=active&search=...)
// - POST /php_backend/bookings.php               -> Create a new booking
// - POST /php_backend/bookings.php?action=checkout&id=NRH-001 -> Check out guest & free room
// ==============================================================

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/setup.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to format booking record
function formatBooking($row) {
    if (!$row) return null;
    $row['roomId'] = (int)$row['roomId'];
    $row['nights'] = (int)$row['nights'];
    $row['amount'] = (float)$row['amount'];
    return $row;
}

// -------------------------------------------------------------------------
// GET: Fetch Bookings
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $sql = "SELECT * FROM bookings WHERE 1=1";
    $params = [];

    if (!empty($status)) {
        $sql .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $sql .= " AND (guestName LIKE ? OR phone LIKE ? OR id LIKE ?)";
        $wildcard = "%$search%";
        $params[] = $wildcard;
        $params[] = $wildcard;
        $params[] = $wildcard;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll();

    echo json_encode(array_map('formatBooking', $bookings));
    exit();
}

// -------------------------------------------------------------------------
// POST: Create Booking OR Checkout
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!$input) {
        $input = $_POST;
    }

    $action = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : 'create');

    // Action 1: CHECKOUT
    if ($action === 'checkout') {
        $bookingId = isset($_GET['id']) ? trim($_GET['id']) : (isset($input['id']) ? trim($input['id']) : '');
        if (empty($bookingId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Booking ID is required for checkout']);
            exit();
        }

        // Fetch booking
        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch();

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            exit();
        }

        try {
            $pdo->beginTransaction();

            // Mark booking as checked_out
            $uStmt = $pdo->prepare("UPDATE bookings SET status = 'checked_out' WHERE id = ?");
            $uStmt->execute([$bookingId]);

            // Free the associated room
            $rStmt = $pdo->prepare("UPDATE rooms SET status = 'available' WHERE id = ?");
            $rStmt->execute([(int)$booking['roomId']]);

            $pdo->commit();

            echo json_encode([
                'success' => true,
                'message' => "Guest {$booking['guestName']} checked out successfully. Room {$booking['roomId']} is now available.",
                'booking' => formatBooking($booking)
            ]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Checkout failed: ' . $e->getMessage()]);
        }
        exit();
    }

    // Action 2: CREATE BOOKING
    $guestName = isset($input['guestName']) ? trim($input['guestName']) : '';
    $phone     = isset($input['phone']) ? trim($input['phone']) : '';
    $email     = isset($input['email']) ? trim($input['email']) : '';
    $roomId    = isset($input['roomId']) ? (int)$input['roomId'] : 0;
    $checkIn   = isset($input['checkIn']) ? trim($input['checkIn']) : '';
    $checkOut  = isset($input['checkOut']) ? trim($input['checkOut']) : '';
    $nights    = isset($input['nights']) ? (int)$input['nights'] : 1;
    $amount    = isset($input['amount']) ? (float)$input['amount'] : 0;

    // Validation
    if (empty($guestName) || empty($phone) || !$roomId || empty($checkIn) || empty($checkOut)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please fill all required fields: Guest Name, Phone, Room, Check-in, Check-out']);
        exit();
    }

    try {
        $pdo->beginTransaction();

        // 1. Check if room exists and is available
        $rCheck = $pdo->prepare("SELECT * FROM rooms WHERE id = ? FOR UPDATE");
        $rCheck->execute([$roomId]);
        $room = $rCheck->fetch();

        if (!$room) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['error' => "Room $roomId does not exist"]);
            exit();
        }

        if ($room['status'] !== 'available') {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => "Room $roomId is currently {$room['status']}"]);
            exit();
        }

        // Calculate amount if not passed or 0
        if ($amount <= 0 && $nights > 0) {
            $amount = (float)$room['price'] * $nights;
        }

        // 2. Generate unique booking ID (NRH-001, NRH-002, etc.)
        $cStmt = $pdo->query("SELECT COUNT(*) FROM bookings");
        $count = (int)$cStmt->fetchColumn();
        $bookingId = 'NRH-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        // Make sure ID is unique in case of prior deletions
        $idCheck = $pdo->prepare("SELECT COUNT(*) FROM bookings WHERE id = ?");
        $idCheck->execute([$bookingId]);
        if ((int)$idCheck->fetchColumn() > 0) {
            $bookingId = 'NRH-' . time();
        }

        // 3. Insert into bookings
        $ins = $pdo->prepare("
            INSERT INTO bookings (id, guestName, phone, email, roomId, roomType, checkIn, checkOut, nights, amount, status, bookedOn)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
        ");
        $ins->execute([
            $bookingId,
            $guestName,
            $phone,
            $email,
            $roomId,
            $room['type'],
            $checkIn,
            $checkOut,
            $nights,
            $amount
        ]);

        // 4. Update room status to booked
        $updRoom = $pdo->prepare("UPDATE rooms SET status = 'booked' WHERE id = ?");
        $updRoom->execute([$roomId]);

        $pdo->commit();

        // Fetch inserted booking
        $fStmt = $pdo->prepare("SELECT * FROM bookings WHERE id = ?");
        $fStmt->execute([$bookingId]);
        $newBooking = $fStmt->fetch();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Booking confirmed and recorded in database successfully!',
            'booking' => formatBooking($newBooking)
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'error'   => 'Booking transaction failed',
            'details' => $e->getMessage()
        ]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
