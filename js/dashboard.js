// =============================================
//  dashboard.js — Dashboard Page Logic
//  Namo Raga Hotel
// =============================================

window.onload = function () {
  loadDashboard();
};

function loadDashboard() {
  const rooms    = getRooms();
  const bookings = getBookings();

  const available = rooms.filter(r => r.status === "available").length;
  const booked    = rooms.filter(r => r.status === "booked").length;
  const guests    = bookings.length;

  // Stat cards
  setEl("availableRooms", available);
  setEl("bookedRooms",    booked);
  setEl("totalGuests",    guests);

  // Hero bar (index.html)
  setEl("heroAvail",  available);
  setEl("heroGuests", guests);

  // Recent Bookings table
  const tbody  = document.getElementById("recentBookingsBody");
  if (!tbody) return;

  const recent = bookings.slice(-5).reverse();

  if (recent.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:#aaa;padding:25px;">
          No bookings yet. <a href="booking.html" style="color:#b8963e;">Make a booking?</a>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = recent.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.guestName}</td>
      <td>Room ${b.roomId}</td>
      <td>${formatDate(b.checkIn)}</td>
      <td>${formatDate(b.checkOut)}</td>
    </tr>
  `).join("");
}

// Helper: safely set text content
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
