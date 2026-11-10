// =============================================
//  app.js — Shared Data & Helper Functions
//  Namo Raga Hotel
// =============================================

// ---- ROOM DATA (10 rooms pre-loaded) ----
const DEFAULT_ROOMS = [
  { id: 101, type: "Single",  price: 1200, status: "available" },
  { id: 102, type: "Single",  price: 1200, status: "available" },
  { id: 103, type: "Double",  price: 2000, status: "available" },
  { id: 104, type: "Double",  price: 2000, status: "available" },
  { id: 105, type: "Suite",   price: 4500, status: "available" },
  { id: 201, type: "Single",  price: 1200, status: "available" },
  { id: 202, type: "Double",  price: 2000, status: "available" },
  { id: 203, type: "Suite",   price: 4500, status: "available" },
  { id: 204, type: "Deluxe",  price: 3000, status: "available" },
  { id: 205, type: "Deluxe",  price: 3000, status: "available" },
];

// ---- INITIALIZE ROOMS (only first time) ----
function initRooms() {
  if (!localStorage.getItem("namoRagaRooms")) {
    localStorage.setItem("namoRagaRooms", JSON.stringify(DEFAULT_ROOMS));
  }
}

// ---- GET ALL ROOMS ----
function getRooms() {
  return JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
}

// ---- SAVE ALL ROOMS ----
function saveRooms(rooms) {
  localStorage.setItem("namoRagaRooms", JSON.stringify(rooms));
}

// ---- GET ALL BOOKINGS ----
function getBookings() {
  return JSON.parse(localStorage.getItem("namoRagaBookings")) || [];
}

// ---- SAVE ALL BOOKINGS ----
function saveBookings(bookings) {
  localStorage.setItem("namoRagaBookings", JSON.stringify(bookings));
}

// ---- GENERATE A UNIQUE BOOKING ID ----
function generateBookingId() {
  const count = getBookings().length + 1;
  return "NRH-" + String(count).padStart(3, "0");
}

// ---- FORMAT DATE (e.g. 2026-11-10 → 10 Nov 2026) ----
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ---- CALCULATE NIGHTS ----
function calcNights(checkIn, checkOut) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 0;
}

// ---- ROOM TYPE ICON ----
function roomIcon(type) {
  const icons = {
    "Single": "🛏️",
    "Double": "🛏️🛏️",
    "Suite":  "👑",
    "Deluxe": "⭐"
  };
  return icons[type] || "🛏️";
}

// ---- Run init on every page load ----
initRooms();
