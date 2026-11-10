// =============================================
//  booking.js — New Booking Page Logic
//  Namo Raga Hotel
// =============================================

// Run when page loads
window.onload = function () {
  loadAvailableRooms();
  setMinDates();

  // Listen for room/date changes to show price preview
  document.getElementById("roomSelect").addEventListener("change", updatePrice);
  document.getElementById("checkIn").addEventListener("change", updatePrice);
  document.getElementById("checkOut").addEventListener("change", updatePrice);
};

// ---- LOAD ONLY AVAILABLE ROOMS INTO DROPDOWN ----
function loadAvailableRooms() {
  const rooms  = getRooms();
  const select = document.getElementById("roomSelect");

  const available = rooms.filter(r => r.status === "available");

  if (available.length === 0) {
    select.innerHTML = `<option value="">-- No rooms available --</option>`;
    return;
  }

  select.innerHTML = `<option value="">-- Choose a Room --</option>` +
    available.map(r =>
      `<option value="${r.id}" data-price="${r.price}">
        Room ${r.id} — ${r.type} (₹${r.price.toLocaleString()}/night)
      </option>`
    ).join("");
}

// ---- SET MIN DATE = TODAY ----
function setMinDates() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkIn").min  = today;
  document.getElementById("checkOut").min = today;
}

// ---- SHOW PRICE PREVIEW ----
function updatePrice() {
  const roomSelect = document.getElementById("roomSelect");
  const checkIn    = document.getElementById("checkIn").value;
  const checkOut   = document.getElementById("checkOut").value;
  const preview    = document.getElementById("pricePreview");

  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const price = selectedOption ? parseInt(selectedOption.getAttribute("data-price")) : 0;

  if (price && checkIn && checkOut) {
    const nights = calcNights(checkIn, checkOut);
    if (nights > 0) {
      const total = nights * price;
      document.getElementById("totalPrice").textContent = `₹${total.toLocaleString()} (${nights} night${nights > 1 ? 's' : ''})`;
      preview.style.display = "block";
    }
  }
}

// ---- SUBMIT BOOKING ----
function submitBooking(event) {
  event.preventDefault(); // stop page from refreshing

  const guestName = document.getElementById("guestName").value.trim();
  const phone     = document.getElementById("phone").value.trim();
  const email     = document.getElementById("email").value.trim();
  const roomId    = parseInt(document.getElementById("roomSelect").value);
  const checkIn   = document.getElementById("checkIn").value;
  const checkOut  = document.getElementById("checkOut").value;

  // Basic Validation
  if (!roomId) {
    alert("Please select a room!");
    return;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid 10-digit phone number!");
    return;
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    alert("Check-out date must be after check-in date!");
    return;
  }

  // Get price
  const rooms      = getRooms();
  const room       = rooms.find(r => r.id === roomId);
  const nights     = calcNights(checkIn, checkOut);
  const totalPrice = nights * room.price;

  // Create new booking object
  const newBooking = {
    id:        generateBookingId(),
    guestName: guestName,
    phone:     phone,
    email:     email,
    roomId:    roomId,
    roomType:  room.type,
    checkIn:   checkIn,
    checkOut:  checkOut,
    nights:    nights,
    amount:    totalPrice,
    bookedOn:  new Date().toISOString()
  };

  // Save booking
  const bookings = getBookings();
  bookings.push(newBooking);
  saveBookings(bookings);

  // Mark room as booked
  const updatedRooms = rooms.map(r =>
    r.id === roomId ? { ...r, status: "booked" } : r
  );
  saveRooms(updatedRooms);

  // Show success message
  document.getElementById("bookingForm").style.display = "none";
  const successMsg = document.getElementById("successMsg");
  successMsg.style.display = "block";
  document.getElementById("successDetails").textContent =
    `Booking ID: ${newBooking.id} | ${guestName} | Room ${roomId} | ${formatDate(checkIn)} → ${formatDate(checkOut)} | ₹${totalPrice.toLocaleString()}`;
}
