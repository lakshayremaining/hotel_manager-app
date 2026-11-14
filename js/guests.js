// =============================================
//  guests.js — Guests / Bookings Page Logic
//  Namo Raga Hotel
// =============================================

let allBookings = []; // store all bookings for search

// Run when page loads
window.onload = async function () {
  const tbody = document.getElementById("guestsBody");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--gold);"><i class="fa fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Loading guest directory...</p></td></tr>`;
  }
  try {
    allBookings = await HotelAPI.getBookings();
  } catch (e) {
    allBookings = getBookings();
  }
  renderGuests(allBookings);
};

// ---- RENDER GUESTS TABLE ----
function renderGuests(bookings) {
  const tbody = document.getElementById("guestsBody");
  if (!tbody) return;

  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:#aaa;padding:30px;">
          No guests found. <a href="booking.html" style="color:var(--gold);">Make a booking?</a>
        </td>
      </tr>`;
    return;
  }

  // Show newest bookings first
  const sorted = [...bookings];

  tbody.innerHTML = sorted
    .map(b => {
      const guestName = b.guestName ? b.guestName.trim() : "Guest";
      const initial = guestName.charAt(0).toUpperCase();
      const roomType = b.roomType || "Luxury";

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
              <span class="guest-meta">${b.email || "No email registered"}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight:600;color:var(--dark);"><i class="fa-solid fa-phone" style="color:var(--gold);margin-right:4px;"></i> ${
            b.phone
          }</span>
        </td>
        <td>
          <div class="room-pill-cell">
            <span class="room-badge-gold">${roomIcon(roomType)} Room ${b.roomId}</span>
            <span class="room-type-tag">${roomType} Room</span>
          </div>
        </td>
        <td>
          <div class="date-range-cell">
            <div class="date-in"><i class="fa-solid fa-plane-arrival"></i> ${formatDate(b.checkIn)}</div>
            <div class="date-out"><i class="fa-solid fa-plane-departure"></i> ${formatDate(b.checkOut)}</div>
          </div>
        </td>
        <td>
          <span class="nights-pill">
            <i class="fa-regular fa-moon"></i> ${b.nights || 1} Night${b.nights > 1 ? "s" : ""}
          </span>
        </td>
        <td>
          <span class="price-strong">₹${Number(b.amount || 0).toLocaleString()}</span>
        </td>
        <td>
          <button class="btn-checkout" onclick="checkOut('${b.id}')">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Check Out
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// ---- CHECK OUT A GUEST ----
async function checkOut(bookingId) {
  const confirmed = confirm("Are you sure you want to check out this guest?");
  if (!confirmed) return;

  try {
    await HotelAPI.checkOutGuest(bookingId);
    allBookings = await HotelAPI.getBookings();
    renderGuests(allBookings);
    alert("Guest has been checked out successfully and the room is now available.");
  } catch (err) {
    alert(`Checkout error: ${err.message}`);
  }
}

// ---- SEARCH GUESTS ----
function searchGuests() {
  const query = document.getElementById("searchGuest").value.toLowerCase();
  const filtered = allBookings.filter(
    b =>
      (b.guestName && b.guestName.toLowerCase().includes(query)) ||
      (b.phone && b.phone.includes(query)) ||
      (b.id && b.id.toLowerCase().includes(query))
  );
  renderGuests(filtered);
}
