<?php
// ==============================================================
// Auto-installer / Schema migration helper
// Automatically sets up tables and default rooms if not present
// ==============================================================
require_once __DIR__ . '/db.php';

function autoMigrate($pdo) {
    // 1. Create rooms table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `rooms` (
          `id` INT PRIMARY KEY,
          `type` VARCHAR(50) NOT NULL,
          `price` DECIMAL(10,2) NOT NULL,
          `status` ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
          `badge` VARCHAR(100) DEFAULT '',
          `floor` VARCHAR(100) DEFAULT '',
          `size` VARCHAR(100) DEFAULT '',
          `guests` VARCHAR(100) DEFAULT '',
          `bed` VARCHAR(100) DEFAULT '',
          `view` VARCHAR(100) DEFAULT '',
          `rating` VARCHAR(10) DEFAULT '4.8',
          `reviews` VARCHAR(10) DEFAULT '100',
          `image` TEXT,
          `amenities` TEXT,
          `perks` TEXT,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. Create bookings table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `bookings` (
          `id` VARCHAR(50) PRIMARY KEY,
          `guestName` VARCHAR(150) NOT NULL,
          `phone` VARCHAR(20) NOT NULL,
          `email` VARCHAR(150) DEFAULT '',
          `roomId` INT NOT NULL,
          `roomType` VARCHAR(50) NOT NULL,
          `checkIn` DATE NOT NULL,
          `checkOut` DATE NOT NULL,
          `nights` INT NOT NULL DEFAULT 1,
          `amount` DECIMAL(10,2) NOT NULL,
          `status` ENUM('active', 'checked_out', 'cancelled') NOT NULL DEFAULT 'active',
          `bookedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Check if rooms table is empty, if so, populate default rooms
    $count = $pdo->query("SELECT COUNT(*) FROM `rooms`")->fetchColumn();
    if ($count == 0) {
        $sql = file_get_contents(__DIR__ . '/database.sql');
        if ($sql) {
            $pdo->exec($sql);
        }
    }
}

// Run auto migration
autoMigrate($pdo);
