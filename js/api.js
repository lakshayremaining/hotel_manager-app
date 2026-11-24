// =============================================
//  api.js — PHP + MySQL Backend API Client
//  Lakshay Luxury Hotels
// =============================================

function getApiBasePath() {
  const loc = window.location;
  if (loc.pathname.includes("/HOTEL/")) {
    return "/HOTEL/php_backend";
  }
  return "./php_backend";
}

const API_BASE_URL = getApiBasePath();

const HotelAPI = {
  // Check if backend is reachable
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health.php`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch all rooms (optional query: 'available', 'booked')
  async getRooms(status) {
    const url = status
      ? `${API_BASE_URL}/rooms.php?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/rooms.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  // Fetch single room by ID
  async getRoom(roomId) {
    const res = await fetch(`${API_BASE_URL}/rooms.php?id=${encodeURIComponent(roomId)}`);
    if (!res.ok) throw new Error("Room not found");
    return await res.json();
  },

  // Fetch all bookings (with optional search query)
  async getBookings(search = "") {
    const url = search
      ? `${API_BASE_URL}/bookings.php?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/bookings.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  // Create a new booking directly in MySQL database
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE_URL}/bookings.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Booking failed");
    return data;
  },

  // Check out guest & free the room in MySQL database
  async checkOutGuest(bookingId) {
    const res = await fetch(`${API_BASE_URL}/bookings.php?action=checkout&id=${encodeURIComponent(bookingId)}`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed");
    return data;
  },
};
