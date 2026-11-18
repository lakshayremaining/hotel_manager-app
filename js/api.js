// =============================================
//  api.js — Backend API Client for Namo Raga Hotel
// =============================================

// Determine base API URL dynamically for Vercel and Local environments
const isLocalAltPort =
  window.location.protocol === "file:" ||
  (window.location.hostname === "localhost" && window.location.port !== "5000") ||
  (window.location.hostname === "127.0.0.1" && window.location.port !== "5000");

const API_BASE_URL = isLocalAltPort ? "http://localhost:5000/api" : "/api";

const HotelAPI = {
  // Check if backend is reachable
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch all rooms (optional query: 'available', 'booked')
  async getRooms(status) {
    try {
      const url = status ? `${API_BASE_URL}/rooms?status=${status}` : `${API_BASE_URL}/rooms`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Backend unavailable, falling back to local data:", err.message);
      // Fallback to local storage if API is temporarily unavailable
      const localRooms = JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
      return status ? localRooms.filter(r => r.status === status) : localRooms;
    }
  },

  // Fetch single room
  async getRoom(roomId) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
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
        ? `${API_BASE_URL}/bookings?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/bookings`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
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

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      return data;
    } catch (err) {
      console.warn("Backend unavailable, saving locally:", err.message);
      // Local fallback
      const bookings = JSON.parse(localStorage.getItem("namoRagaBookings")) || [];
      const newId = "NRH-" + String(bookings.length + 1).padStart(3, "0");
      const fallbackBooking = {
        ...bookingData,
        id: newId,
        bookedOn: new Date().toISOString(),
      };
      bookings.push(fallbackBooking);
      localStorage.setItem("namoRagaBookings", JSON.stringify(bookings));

      // Update room in localStorage
      const rooms = JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
      const updatedRooms = rooms.map(r => (r.id === bookingData.roomId ? { ...r, status: "booked" } : r));
      localStorage.setItem("namoRagaRooms", JSON.stringify(updatedRooms));

      return { message: "Booking saved locally", booking: fallbackBooking };
    }
  },

  // Check out guest & free the room
  async checkOutGuest(bookingId) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/checkout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      return data;
    } catch (err) {
      // Local fallback
      let bookings = JSON.parse(localStorage.getItem("namoRagaBookings")) || [];
      const b = bookings.find(item => item.id === bookingId);
      if (b) {
        let rooms = JSON.parse(localStorage.getItem("namoRagaRooms")) || [];
        rooms = rooms.map(r => (r.id === b.roomId ? { ...r, status: "available" } : r));
        localStorage.setItem("namoRagaRooms", JSON.stringify(rooms));
        bookings = bookings.filter(item => item.id !== bookingId);
        localStorage.setItem("namoRagaBookings", JSON.stringify(bookings));
      }
      return { message: "Checkout completed locally" };
    }
  },
};
