// =============================================
//  booking.js — New Booking Page Logic
//  Namo Raga Hotel
// =============================================

// Run when page loads
window.onload = async function () {
  await loadAvailableRooms();
  setMinDates();

  // Listen for room/date changes to show price preview
  document.getElementById("roomSelect").addEventListener("change", updatePrice);
  document.getElementById("checkIn").addEventListener("change", updatePrice);
  document.getElementById("checkOut").addEventListener("change", updatePrice);
};

let cachedRooms = [];

// ---- LOAD ONLY AVAILABLE ROOMS INTO DROPDOWN ----
async function loadAvailableRooms() {
  const select = document.getElementById("roomSelect");
  select.innerHTML = `<option value="">-- Loading available rooms... --</option>`;

  try {
    const rooms = await HotelAPI.getRooms("available");
    cachedRooms = rooms;

    if (!rooms || rooms.length === 0) {
      select.innerHTML = `<option value="">-- No rooms available --</option>`;
      return;
    }

    select.innerHTML =
      `<option value="">-- Choose a Room --</option>` +
      rooms
        .map(
          r =>
            `<option value="${r.id}" data-price="${r.price}">
              Room ${r.id} — ${r.type} (₹${Number(r.price).toLocaleString()}/night)
            </option>`
        )
        .join("");
  } catch (err) {
    console.error("Error loading rooms:", err);
    select.innerHTML = `<option value="">-- Error loading rooms --</option>`;
  }
}

// ---- SET MIN DATE = TODAY ----
function setMinDates() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkIn").min = today;
  document.getElementById("checkOut").min = today;
}

// ---- SHOW PRICE PREVIEW ----
function updatePrice() {
  const roomSelect = document.getElementById("roomSelect");
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const preview = document.getElementById("pricePreview");

  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const price = selectedOption ? parseInt(selectedOption.getAttribute("data-price")) : 0;

  if (price && checkIn && checkOut) {
    const nights = calcNights(checkIn, checkOut);
    if (nights > 0) {
      const total = nights * price;
      document.getElementById("totalPrice").textContent = `₹${total.toLocaleString()} (${nights} night${
        nights > 1 ? "s" : ""
      })`;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  } else {
    preview.style.display = "none";
  }
}

// ---- SUBMIT BOOKING ----
async function submitBooking(event) {
  event.preventDefault();

  const guestName = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const roomId = parseInt(document.getElementById("roomSelect").value);
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

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

  const room = cachedRooms.find(r => r.id === roomId) || { price: 2000, type: "Luxury" };
  const nights = calcNights(checkIn, checkOut);
  const totalPrice = nights * room.price;

  const submitBtn = event.target.querySelector("button[type='submit']");
  const originalText = submitBtn ? submitBtn.innerHTML : "Confirm Booking";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Processing Booking...`;
  }

  try {
    const result = await HotelAPI.createBooking({
      guestName,
      phone,
      email,
      roomId,
      roomType: room.type,
      checkIn,
      checkOut,
      nights,
      amount: totalPrice,
    });

    const bookingId = result.booking ? result.booking.id : "NRH-CONFIRMED";

    // Show success message
    document.getElementById("bookingForm").style.display = "none";
    const successMsg = document.getElementById("successMsg");
    successMsg.style.display = "block";
    document.getElementById("successDetails").textContent =
      `Booking ID: ${bookingId} | ${guestName} | Room ${roomId} | ${formatDate(checkIn)} → ${formatDate(
        checkOut
      )} | ₹${totalPrice.toLocaleString()}`;
  } catch (err) {
    alert(`Booking failed: ${err.message}`);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}
