// =============================================
//  dashboard.js — Dashboard Page Logic
//  Namo Raga Hotel
// =============================================

window.onload = async function () {
  await loadDashboard();
};

async function loadDashboard() {
  let rooms = [];
  let bookings = [];
  try {
    [rooms, bookings] = await Promise.all([
      HotelAPI.getRooms(),
      HotelAPI.getBookings()
    ]);
  } catch (e) {
    rooms = getRooms();
    bookings = getBookings();
  }

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
        <td colspan="5" class="table-empty-cell">
          <div class="empty-state">
            <div class="empty-icon-wrap"><i class="fa-solid fa-bell-concierge"></i></div>
            <h4>No Bookings Registered Yet</h4>
            <p>All rooms are currently vacant and ready for new guests.</p>
            <a href="booking.html" class="btn-action-primary" style="margin-top:10px;display:inline-flex;">
              <i class="fa-solid fa-plus"></i> Make First Booking
            </a>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = recent.map(b => {
    const guestName = b.guestName ? b.guestName.trim() : "Guest";
    const initial = guestName.charAt(0).toUpperCase();
    const roomType = b.roomType || "Luxury";
    const phone = b.phone || "No phone provided";

    return `
      <tr>
        <td>
          <span class="booking-id-badge">
            <i class="fa-solid fa-receipt"></i> ${b.id}
          </span>
        </td>
        <td>
          <div class="guest-cell">
            <div class="guest-avatar">${initial}</div>
            <div class="guest-info">
              <span class="guest-name">${guestName}</span>
              <span class="guest-meta"><i class="fa-solid fa-phone"></i> ${phone}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="room-pill-cell">
            <span class="room-badge-gold">${roomIcon(roomType)} Room ${b.roomId}</span>
            <span class="room-type-tag">${roomType} Room</span>
          </div>
        </td>
        <td>
          <div class="date-range-cell">
            <div class="date-in">
              <i class="fa-regular fa-calendar-check text-green"></i> 
              <span>${formatDate(b.checkIn)}</span>
            </div>
            <div class="date-arrow">&rarr;</div>
            <div class="date-out">
              <i class="fa-regular fa-calendar-xmark text-red"></i> 
              <span>${formatDate(b.checkOut)}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="status-action-cell">
            <span class="status-pill-confirmed">
              <span class="pulse-dot-sm"></span> Confirmed
            </span>
            <a href="guests.html" class="btn-row-action" title="Manage Guest in Registry">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Helper: safely set text content
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
