// =============================================
//  rooms.js — Rooms Page Logic
//  Namo Raga Hotel
// =============================================

// Beautiful room images from Unsplash
const ROOM_IMAGES = {
  "Single":  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80",
  "Double":  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80",
  "Suite":   "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80",
  "Deluxe":  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&q=80",
};

window.onload = function () {
  renderRooms("all");
};

// ---- FILTER ROOMS ----
function filterRooms(filter, btn) {
  // Update active button
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderRooms(filter);
}

// ---- RENDER ROOM CARDS ----
function renderRooms(filter) {
  const rooms = getRooms();
  const grid  = document.getElementById("roomsGrid");

  const filtered = filter === "all" ? rooms : rooms.filter(r => r.status === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#aaa;font-size:1rem;padding:20px;">No rooms found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(room => `
    <div class="room-card">
      <img 
        src="${ROOM_IMAGES[room.type] || ROOM_IMAGES['Single']}" 
        alt="${room.type} Room ${room.id}"
        loading="lazy"
      />
      <div class="room-card-body">
        <div class="room-number">${roomIcon(room.type)} Room ${room.id}</div>
        <div class="room-type">${room.type} Room</div>
        <div class="room-price">₹${room.price.toLocaleString('en-IN')} / night</div>
        <span class="room-status ${room.status === 'available' ? 'status-available' : 'status-booked'}">
          ${room.status === 'available' ? '🟢 Available' : '🔴 Booked'}
        </span>
        ${room.status === "available"
          ? `<a href="booking.html" class="btn-book-room">Book This Room</a>`
          : `<p style="margin-top:14px;font-size:0.78rem;color:#999;text-align:center;letter-spacing:1px;">CURRENTLY OCCUPIED</p>`
        }
      </div>
    </div>
  `).join("");
}
