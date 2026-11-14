const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const Room = require("./models/Room");

const DEFAULT_ROOMS = [
  {
    id: 101,
    type: "Single",
    price: 1200,
    status: "available",
    badge: "Cozy Choice",
    floor: "1st Floor, East Wing",
    size: "260 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "Courtyard View",
    rating: "4.8",
    reviews: "94",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "43-inch Smart TV"],
    perks: "Free cancellation up to 24 hours before check-in",
  },
  {
    id: 102,
    type: "Single",
    price: 1200,
    status: "available",
    badge: "Solo Retreat",
    floor: "1st Floor, East Wing",
    size: "270 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "Rose Garden View",
    rating: "4.8",
    reviews: "112",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Rain Shower"],
    perks: "Free cancellation, dedicated work desk",
  },
  {
    id: 103,
    type: "Double",
    price: 2000,
    status: "available",
    badge: "Twin Luxury",
    floor: "1st Floor, Central Wing",
    size: "350 sq. ft",
    guests: "2-3 Guests",
    bed: "Twin Beds",
    view: "Poolside View",
    rating: "4.9",
    reviews: "138",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "Deep Soak Tub"],
    perks: "Free cancellation, 24-hour in-room dining",
  },
  {
    id: 104,
    type: "Double",
    price: 2000,
    status: "available",
    badge: "Classic Double",
    floor: "1st Floor, West Wing",
    size: "360 sq. ft",
    guests: "2 Adults, 1 Child",
    bed: "King Bed",
    view: "Fountain Garden",
    rating: "4.9",
    reviews: "165",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "50-inch Smart TV"],
    perks: "Free cancellation, afternoon tea service",
  },
  {
    id: 105,
    type: "Suite",
    price: 4500,
    status: "available",
    badge: "Executive Suite",
    floor: "1st Floor, Royal Wing",
    size: "520 sq. ft",
    guests: "3-4 Guests",
    bed: "King Bed + Sofa Bed",
    view: "Panoramic City View",
    rating: "5.0",
    reviews: "204",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80",
    amenities: ["High-speed Wi-Fi", "Living Room Area", "Jacuzzi", "Complimentary Mini Bar"],
    perks: "Priority concierge & airport pickup",
  },
  {
    id: 201,
    type: "Single",
    price: 1200,
    status: "available",
    badge: "Skyline Single",
    floor: "2nd Floor, East Wing",
    size: "260 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "Morning Skyline View",
    rating: "4.7",
    reviews: "82",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Coffee Machine"],
    perks: "Quiet zone, blackout curtains",
  },
  {
    id: 202,
    type: "Double",
    price: 2000,
    status: "available",
    badge: "Grand Double",
    floor: "2nd Floor, Central Wing",
    size: "380 sq. ft",
    guests: "2-3 Guests",
    bed: "King Bed",
    view: "Sunset View",
    rating: "4.9",
    reviews: "147",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Private Balcony", "Premium Sound System"],
    perks: "Free cancellation, complimentary wine",
  },
  {
    id: 203,
    type: "Suite",
    price: 4500,
    status: "available",
    badge: "Presidential Suite",
    floor: "2nd Floor, Royal Wing",
    size: "600 sq. ft",
    guests: "4 Guests",
    bed: "Super King Bed",
    view: "Full Heritage Vista",
    rating: "5.0",
    reviews: "280",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80",
    amenities: ["Butler Service", "Private Dining", "Jacuzzi Spa", "Dedicated Lounge Access"],
    perks: "VIP Check-in & private chauffeur",
  },
  {
    id: 204,
    type: "Deluxe",
    price: 3000,
    status: "available",
    badge: "Deluxe King",
    floor: "2nd Floor, West Wing",
    size: "420 sq. ft",
    guests: "2-3 Guests",
    bed: "California King",
    view: "Garden & Pool View",
    rating: "4.9",
    reviews: "172",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
    amenities: ["Free Wi-Fi", "Climate Control", "Espresso Bar", "Marble Bathroom"],
    perks: "Complimentary evening cocktails",
  },
  {
    id: 205,
    type: "Deluxe",
    price: 3000,
    status: "available",
    badge: "Deluxe Twin",
    floor: "2nd Floor, West Wing",
    size: "410 sq. ft",
    guests: "2 Adults, 1 Child",
    bed: "Twin Double Beds",
    view: "Courtyard & Fountain",
    rating: "4.8",
    reviews: "135",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=700&q=80",
    amenities: ["Free Wi-Fi", "Climate Control", "Smart TV", "Organic Toiletries"],
    perks: "Late check-out upon request",
  },
];

async function seed() {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/namo_raga_hotel";
    await mongoose.connect(connUri);
    console.log("Connected to MongoDB for seeding...");

    // Remove existing rooms to re-seed cleanly
    await Room.deleteMany({});
    await Room.insertMany(DEFAULT_ROOMS);

    console.log(`✅ Successfully seeded ${DEFAULT_ROOMS.length} rooms!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
