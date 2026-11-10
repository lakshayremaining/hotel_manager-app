// =============================================
//  guests.js — Guests / Bookings Page Logic
//  Namo Raga Hotel
// =============================================

let allBookings = []; // store all bookings for search

// Run when page loads
window.onload = function () {
  allBookings = getBookings();
  renderGuests(allBookings);
};

// ---- RENDER GUESTS TABLE ----
function renderGuests(bookings) {
  const tbody = document.getElementById("guestsBody");

  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:#aaa;padding:30px;">
          No guests found. <a href="booking.html" style="color:var(--gold);">Make a booking?</a>
        </td>
      </tr>`;
    return;
  }

  // Show newest bookings first
  const sorted = [...bookings].reverse();

  tbody.innerHTML = sorted.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>
        <strong>${b.guestName}</strong><br/>
        <small style="color:#aaa;">${b.email || ''}</small>
      </td>
      <td>${b.phone}</td>
      <td>Room ${b.roomId} <br/><small style="color:#aaa;">${b.roomType}</small></td>
      <td>${formatDate(b.checkIn)}</td>
      <td>${formatDate(b.checkOut)}</td>
      <td><strong>₹${b.amount ? b.amount.toLocaleString() : '—'}</strong></td>
      <td>
        <button class="btn-checkout" onclick="checkOut('${b.id}')">
          <i class="fa fa-sign-out-alt"></i> Check Out
        </button>
      </td>
    </tr>
  `).join("");
}

// ---- CHECK OUT A GUEST ----
function checkOut(bookingId) {
  const confirmed = confirm("Are you sure you want to check out this guest?");
  if (!confirmed) return;

  // Find the booking
  let bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) return;

  // Free the room
  let rooms = getRooms();
  rooms = rooms.map(r =>
    r.id === booking.roomId ? { ...r, status: "available" } : r
  );
  saveRooms(rooms);

  // Remove the booking
  bookings = bookings.filter(b => b.id !== bookingId);
  saveBookings(bookings);

  // Re-render
  allBookings = bookings;
  renderGuests(allBookings);

  alert(`✅ ${booking.guestName} has been checked out. Room ${booking.roomId} is now available.`);
}

// ---- SEARCH GUESTS ----
function searchGuests() {
  const query = document.getElementById("searchGuest").value.toLowerCase();
  const filtered = allBookings.filter(b =>
    b.guestName.toLowerCase().includes(query) ||
    b.phone.includes(query) ||
    b.id.toLowerCase().includes(query)
  );
  renderGuests(filtered);
}
