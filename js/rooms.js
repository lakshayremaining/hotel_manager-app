// =============================================
//  rooms.js — Rooms Page Logic
//  Namo Raga Hotel
// =============================================

// Rich metadata for all rooms (Specs, View, Bed, Amenities, Ratings)
const ROOM_DETAILS = {
  101: {
    badge: "Cozy Choice",
    floor: "1st Floor, East Wing",
    size: "260 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "Courtyard View",
    rating: "4.8",
    reviews: "94",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "43-inch Smart TV"],
    perks: "Free cancellation up to 24 hours before check-in"
  },
  102: {
    badge: "Solo Retreat",
    floor: "1st Floor, East Wing",
    size: "270 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "Rose Garden View",
    rating: "4.8",
    reviews: "112",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Rain Shower"],
    perks: "Free cancellation, dedicated work desk"
  },
  103: {
    badge: "Twin Luxury",
    floor: "1st Floor, Central Wing",
    size: "350 sq. ft",
    guests: "2-3 Guests",
    bed: "Twin Beds",
    view: "Poolside View",
    rating: "4.9",
    reviews: "138",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "Deep Soak Tub"],
    perks: "Free cancellation, 24-hour in-room dining"
  },
  104: {
    badge: "Classic Double",
    floor: "1st Floor, West Wing",
    size: "360 sq. ft",
    guests: "2 Adults, 1 Child",
    bed: "King Bed",
    view: "Fountain Garden",
    rating: "4.9",
    reviews: "165",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "50-inch Smart TV"],
    perks: "Free cancellation, afternoon tea service"
  },
  105: {
    badge: "Royal Suite",
    floor: "1st Floor, Palace Front",
    size: "620 sq. ft",
    guests: "3-4 Guests",
    bed: "Master King Bed",
    view: "Palace Lawns",
    rating: "5.0",
    reviews: "204",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80",
    amenities: ["High-Speed Wi-Fi", "Private Butler", "Jacuzzi", "Mini Bar"],
    perks: "Complimentary airport transfer and breakfast included"
  },
  201: {
    badge: "Executive Solo",
    floor: "2nd Floor, North Wing",
    size: "280 sq. ft",
    guests: "1-2 Guests",
    bed: "Queen Bed",
    view: "City Heritage View",
    rating: "4.8",
    reviews: "88",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80",
    amenities: ["High-Speed Wi-Fi", "Air Conditioning", "Daily Breakfast", "Workstation"],
    perks: "Express check-in and complimentary laundry"
  },
  202: {
    badge: "Garden Double",
    floor: "2nd Floor, East Wing",
    size: "370 sq. ft",
    guests: "2 Adults, 1 Child",
    bed: "King Bed",
    view: "Terrace Garden",
    rating: "4.9",
    reviews: "152",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Buffet Breakfast", "Welcome Refreshment"],
    perks: "Free cancellation and flexible early check-in"
  },
  203: {
    badge: "Maharaja Suite",
    floor: "2nd Floor, Royal Wing",
    size: "720 sq. ft",
    guests: "4 Guests",
    bed: "Emperor King Bed",
    view: "Palace Panoramic View",
    rating: "5.0",
    reviews: "230",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80",
    amenities: ["Fiber Wi-Fi", "24-Hour Butler", "Marble Spa Bath", "Living Lounge"],
    perks: "High tea service, private chauffeur, and flexible checkout"
  },
  204: {
    badge: "Deluxe Premium",
    floor: "2nd Floor, West Wing",
    size: "440 sq. ft",
    guests: "2-3 Guests",
    bed: "California King Bed",
    view: "Courtyard Fountain",
    rating: "4.9",
    reviews: "178",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Gourmet Breakfast", "55-inch 4K TV"],
    perks: "Free cancellation and complimentary spa access"
  },
  205: {
    badge: "Deluxe Signature",
    floor: "2nd Floor, South Wing",
    size: "460 sq. ft",
    guests: "2 Adults, 1 Child",
    bed: "California King Bed",
    view: "Rooftop Pool View",
    rating: "4.9",
    reviews: "192",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Gourmet Breakfast", "Pool Access"],
    perks: "Free cancellation, private balcony, welcome fruit basket"
  }
};

// Fallback details generator if custom room exists
function getDetails(room) {
  if (ROOM_DETAILS[room.id]) {
    return ROOM_DETAILS[room.id];
  }
  const floor = room.id >= 200 ? "2nd Floor" : "1st Floor";
  return {
    badge: "Luxury Collection",
    floor: `${floor}, Executive`,
    size: room.type === "Suite" ? "650 sq. ft" : (room.type === "Deluxe" ? "440 sq. ft" : "320 sq. ft"),
    guests: room.type === "Suite" ? "3-4 Guests" : (room.type === "Single" ? "1-2 Guests" : "2 Adults"),
    bed: room.type === "Suite" ? "Master King Bed" : (room.type === "Single" ? "Queen Bed" : "King Bed"),
    view: "Courtyard View",
    rating: "4.9",
    reviews: "120",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Daily Breakfast", "Smart TV"],
    perks: "Free cancellation up to 24 hours before check-in"
  };
}

let allFetchedRooms = [];

window.onload = async function () {
  const grid = document.getElementById("roomsGrid");
  if (grid) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gold);"><i class="fa fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Loading luxury accommodations...</p></div>`;
  }
  try {
    allFetchedRooms = await HotelAPI.getRooms();
  } catch (e) {
    allFetchedRooms = getRooms();
  }
  renderRooms("all");
};

// ---- FILTER ROOMS ----
function filterRooms(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderRooms(filter);
}

// ---- RENDER ROOM CARDS (CLEAN & HUMANIZED) ----
function renderRooms(filter) {
  const rooms = allFetchedRooms.length > 0 ? allFetchedRooms : getRooms();
  const grid  = document.getElementById("roomsGrid");

  const filtered = filter === "all" ? rooms : rooms.filter(r => r.status === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 1px solid var(--border-gold);">
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--dark);margin-bottom:6px;">No Accommodations Found</h3>
        <p style="color:#888;font-size:0.85rem;">Please select a different category above to view available rooms.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(room => {
    const details = getDetails(room);

    return `
      <div class="room-card">
        <!-- Image & Floating Labels -->
        <div class="room-card-img-wrap">
          <img 
            src="${details.image}" 
            alt="${room.type} Room ${room.id}"
            loading="lazy"
          />
          <span class="room-card-badge-top">${details.badge}</span>
          <span class="room-card-floor-tag">${details.floor}</span>
          <div class="room-card-rating">
            <span>★ ${details.rating}</span>
            <small>(${details.reviews})</small>
          </div>
        </div>

        <div class="room-card-body">
          <!-- Room Title & Status -->
          <div class="room-card-header-row">
            <div>
              <div class="room-number">Room ${room.id}</div>
              <div class="room-type">${room.type} Room</div>
            </div>
            <span class="room-status ${room.status === 'available' ? 'status-available' : 'status-booked'}">
              ${room.status === 'available' ? 'Available' : 'Occupied'}
            </span>
          </div>

          <!-- Structured Specifications Grid -->
          <div class="room-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Area</span>
              <span class="spec-value">${details.size}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Capacity</span>
              <span class="spec-value">${details.guests}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Bed Type</span>
              <span class="spec-value">${details.bed}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">View</span>
              <span class="spec-value">${details.view}</span>
            </div>
          </div>

          <!-- Key Amenities (Clean Text Pills) -->
          <div class="room-amenities-wrap">
            ${details.amenities.map(a => `<span class="amenity-pill">${a}</span>`).join('')}
          </div>

          <!-- Booking Perks Trust Line -->
          <div class="room-perk-banner">
            <span>${details.perks}</span>
          </div>

          <!-- Pricing & Action -->
          <div class="room-card-footer">
            <div class="room-price-wrap">
              <div class="room-price">₹${room.price.toLocaleString('en-IN')}</div>
              <div class="room-price-sub">per night &bull; taxes included</div>
            </div>
            ${room.status === "available"
              ? `<a href="booking.html" class="btn-book-room">Book Now &rarr;</a>`
              : `<span class="btn-room-disabled">Occupied</span>`
            }
          </div>
        </div>
      </div>
    `;
  }).join("");
}
