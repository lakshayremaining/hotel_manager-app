-- ==============================================================
-- Namo Raga Luxury Hotel Management System Database Schema
-- Database: hotel_db
-- Compatible with XAMPP MySQL / MariaDB
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `hotel_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_db`;

-- 1. Table: rooms
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

-- 2. Table: bookings
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

-- ==============================================================
-- Initial Seed Data for Rooms
-- ==============================================================
INSERT INTO `rooms` (`id`, `type`, `price`, `status`, `badge`, `floor`, `size`, `guests`, `bed`, `view`, `rating`, `reviews`, `image`, `amenities`, `perks`) VALUES
(101, 'Single', 1200.00, 'available', 'Cozy Choice', '1st Floor, East Wing', '260 sq. ft', '1-2 Guests', 'Queen Bed', 'Courtyard View', '4.8', '94', 
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "43-inch Smart TV"]', 
 'Free cancellation up to 24 hours before check-in'),

(102, 'Single', 1200.00, 'available', 'Solo Retreat', '1st Floor, East Wing', '270 sq. ft', '1-2 Guests', 'Queen Bed', 'Rose Garden View', '4.8', '112', 
 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Rain Shower"]', 
 'Free cancellation, dedicated work desk'),

(103, 'Double', 2000.00, 'available', 'Twin Luxury', '1st Floor, Central Wing', '350 sq. ft', '2-3 Guests', 'Twin Beds', 'Poolside View', '4.9', '138', 
 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "Deep Soak Tub"]', 
 'Free cancellation, 24-hour in-room dining'),

(104, 'Double', 2000.00, 'available', 'Classic Double', '1st Floor, West Wing', '360 sq. ft', '2 Adults, 1 Child', 'King Bed', 'Fountain Garden', '4.9', '165', 
 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "50-inch Smart TV"]', 
 'Free cancellation, afternoon tea service'),

(105, 'Suite', 4500.00, 'available', 'Royal Suite', '1st Floor, Palace Front', '620 sq. ft', '3-4 Guests', 'Master King Bed', 'Palace Lawns', '5.0', '204', 
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80', 
 '["High-Speed Wi-Fi", "Private Butler", "Jacuzzi", "Mini Bar"]', 
 'Complimentary airport transfer and breakfast included'),

(201, 'Single', 1200.00, 'available', 'Executive Solo', '2nd Floor, North Wing', '280 sq. ft', '1-2 Guests', 'Queen Bed', 'City Heritage View', '4.8', '82', 
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Coffee Machine"]', 
 'Quiet zone, blackout curtains'),

(202, 'Double', 2000.00, 'available', 'Grand Double', '2nd Floor, Central Wing', '380 sq. ft', '2-3 Guests', 'King Bed', 'Sunset View', '4.9', '147', 
 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80', 
 '["Free Wi-Fi", "Air Conditioning", "Private Balcony", "Premium Sound System"]', 
 'Free cancellation, complimentary wine'),

(203, 'Suite', 4500.00, 'available', 'Presidential Suite', '2nd Floor, Royal Wing', '600 sq. ft', '4 Guests', 'Super King Bed', 'Full Heritage Vista', '5.0', '280', 
 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80', 
 '["Butler Service", "Private Dining", "Jacuzzi Spa", "Dedicated Lounge Access"]', 
 'VIP Check-in & private chauffeur'),

(204, 'Deluxe', 3000.00, 'available', 'Deluxe King', '2nd Floor, West Wing', '420 sq. ft', '2-3 Guests', 'California King', 'Garden & Pool View', '4.9', '172', 
 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80', 
 '["Free Wi-Fi", "Climate Control", "Espresso Bar", "Marble Bathroom"]', 
 'Complimentary evening cocktails'),

(205, 'Deluxe', 3000.00, 'available', 'Deluxe Twin', '2nd Floor, West Wing', '410 sq. ft', '2 Adults, 1 Child', 'Twin Double Beds', 'Courtyard & Fountain', '4.8', '135', 
 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=700&q=80', 
 '["Free Wi-Fi", "Climate Control", "Smart TV", "Organic Toiletries"]', 
 'Late check-out upon request')
ON DUPLICATE KEY UPDATE 
  `type`=VALUES(`type`), `price`=VALUES(`price`), `badge`=VALUES(`badge`), 
  `floor`=VALUES(`floor`), `size`=VALUES(`size`), `guests`=VALUES(`guests`), 
  `bed`=VALUES(`bed`), `view`=VALUES(`view`), `image`=VALUES(`image`), 
  `amenities`=VALUES(`amenities`), `perks`=VALUES(`perks`);
