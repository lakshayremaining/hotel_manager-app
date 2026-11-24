// =============================================
//  api.js — PHP + MySQL Backend API Client for Namo Raga Hotel
// =============================================

// Automatically detect whether accessed via XAMPP (http://localhost/HOTEL/...) or local dev server
function getApiBasePath() {
  const loc = window.location;
  if (loc.pathname.includes("/HOTEL/")) {
    return "/HOTEL/php_backend";
  }
  // If running directly on root or subfolder
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
    try {
      const url = status
        ? `${API_BASE_URL}/rooms.php?status=${encodeURIComponent(status)}`
        : `${API_BASE_URL}/rooms.php`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("Backend unavailable, falling back to local data:", err.message);
      const localRooms = JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
      return status ? localRooms.filter(r => r.status === status) : localRooms;
    }
  },

  // Fetch single room by ID
  async getRoom(roomId) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms.php?id=${encodeURIComponent(roomId)}`);
      if (!res.ok) throw new Error("Room not found");
      return await res.json();
    } catch (err) {
      const localRooms = JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
      return localRooms.find(r => r.id === Number(roomId));
    }
  },

  // Fetch all bookings (with optional search query)
  async getBookings(search = "") {
    try {
      const url = search
        ? `${API_BASE_URL}/bookings.php?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/bookings.php`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("Backend unavailable, falling back to local bookings:", err.message);
      const localBookings = JSON.parse(localStorage.getItem("namoRagaBookings")) || [];
      if (!search) return localBookings;
      const q = search.toLowerCase();
      return localBookings.filter(
        b =>
          (b.guestName && b.guestName.toLowerCase().includes(q)) ||
          (b.phone && b.phone.includes(q)) ||
          (b.id && b.id.toLowerCase().includes(q))
      );
    }
  },

  // Create a new booking (saved directly into MySQL database)
  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      return data;
    } catch (err) {
      console.error("Booking error:", err.message);
      throw err;
    }
  },

  // Check out guest & free the room in MySQL database
  async checkOutGuest(bookingId) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings.php?action=checkout&id=${encodeURIComponent(bookingId)}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      return data;
    } catch (err) {
      console.error("Checkout error:", err.message);
      throw err;
    }
  },
};
