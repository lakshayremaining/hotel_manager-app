// =============================================
//  login.js — Guest Portal & My Room Lookup
// =============================================

async function handleGuestLogin(event) {
  event.preventDefault();
  
  const identifier = document.getElementById("guestIdentifier").value.trim().toLowerCase();
  const btn = document.getElementById("searchStayBtn");
  const resultDiv = document.getElementById("stayResult");
  const loginBox = document.getElementById("loginBox");

  if (!identifier) {
    alert("Please enter your registered Email or Phone number.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Searching Database...`;

  try {
    // Fetch all bookings from backend
    const bookings = await HotelAPI.getBookings();
    
    // Find active booking matching email or phone
    const userBookings = bookings.filter(b => {
      const email = (b.email || "").toLowerCase();
      const phone = (b.phone || "").toLowerCase();
      return email === identifier || phone === identifier;
    });

    if (!userBookings || userBookings.length === 0) {
      alert("Koi booking nahi mili is Email/Phone ke sath! Please check details or book a new stay.");
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> View My Room &amp; Stay`;
      return;
    }

    // Get the most recent booking
    const activeBooking = userBookings[0];
    
    // Fetch room details
    let room = null;
    try {
      room = await HotelAPI.getRoom(activeBooking.roomId);
    } catch (e) {
      console.warn("Could not load full room info:", e);
    }

    renderGuestRoom(activeBooking, room);

  } catch (err) {
    alert("Error fetching your stay details: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> View My Room &amp; Stay`;
  }
}

function renderGuestRoom(booking, room) {
  const resultDiv = document.getElementById("stayResult");
  const loginBox = document.getElementById("loginBox");
  
  const roomImage = room && room.image ? room.image : "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80";
  const roomSize = room && room.size ? room.size : "350 sq. ft";
  const roomView = room && room.view ? room.view : "Palace & Garden View";
  const roomBed = room && room.bed ? room.bed : "King Luxury Bed";
  const roomFloor = room && room.floor ? room.floor : "1st Floor";
  const amenities = room && room.amenities ? room.amenities : ["Free High-Speed Wi-Fi", "Air Conditioning", "Daily Gourmet Breakfast", "Smart TV"];

  resultDiv.innerHTML = `
    <div class="booking-card" style="padding:0; overflow:hidden; border:1px solid rgba(212,175,55,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.15);">
      <!-- HEADER BANNER -->
      <div style="background:linear-gradient(135deg, #0b0c10 0%, #1e2430 100%); color:#fff; padding:25px 30px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; border-bottom:2px solid var(--gold);">
        <div>
          <span style="background:var(--gold); color:#000; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:4px; text-transform:uppercase; letter-spacing:1px;">Active Guest</span>
          <h2 style="font-family:'Cormorant Garamond',serif; font-size:2rem; margin-top:8px; color:#fff;">Welcome back, ${booking.guestName}!</h2>
          <p style="color:#c9c3b8; font-size:0.85rem;"><i class="fa-solid fa-receipt" style="color:var(--gold);"></i> Booking Reference: <strong>${booking.id}</strong></p>
        </div>
        <div>
          <button onclick="logoutGuest()" class="btn-primary" style="background:transparent; border:1px solid var(--gold); color:var(--gold); padding:8px 16px; border-radius:6px; cursor:pointer;">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Switch Account
          </button>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; padding:30px;">
        
        <!-- ROOM CARD -->
        <div>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--dark); margin-bottom:15px;">Your Assigned Room</h3>
          <div style="border-radius:12px; overflow:hidden; border:1px solid #eee; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            <div style="position:relative; height:200px;">
              <img src="${roomImage}" alt="Room ${booking.roomId}" style="width:100%; height:100%; object-fit:cover;"/>
              <div style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.75); color:var(--gold-light); font-weight:700; padding:5px 12px; border-radius:20px; font-size:0.85rem; border:1px solid var(--gold);">
                Room #${booking.roomId}
              </div>
            </div>
            <div style="padding:18px;">
              <h4 style="font-size:1.2rem; color:var(--dark); font-weight:600; margin-bottom:6px;">${booking.roomType} Room</h4>
              <p style="color:#666; font-size:0.85rem; margin-bottom:12px;"><i class="fa-solid fa-location-dot" style="color:var(--gold); margin-right:5px;"></i> ${roomFloor} &bull; ${roomView}</p>
              
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.8rem; color:#555; background:#faf7f2; padding:12px; border-radius:8px;">
                <div><i class="fa-solid fa-bed" style="color:var(--gold); margin-right:5px;"></i> ${roomBed}</div>
                <div><i class="fa-solid fa-ruler-combined" style="color:var(--gold); margin-right:5px;"></i> ${roomSize}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- STAY & BILLING DETAILS -->
        <div>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--dark); margin-bottom:15px;">Reservation Summary</h3>
          <div style="background:#faf7f2; border:1px solid #ebd9b4; border-radius:12px; padding:20px;">
            <div style="margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed #d6c39e;">
              <div style="font-size:0.8rem; color:#888; text-transform:uppercase;">Check-In & Check-Out</div>
              <div style="font-size:1rem; font-weight:600; color:var(--dark); margin-top:4px;">
                <i class="fa-solid fa-calendar-check" style="color:var(--gold); margin-right:6px;"></i> 
                ${booking.checkIn} &rarr; ${booking.checkOut} (${booking.nights} Night${booking.nights > 1 ? 's' : ''})
              </div>
            </div>

            <div style="margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed #d6c39e;">
              <div style="font-size:0.8rem; color:#888; text-transform:uppercase;">Registered Contact</div>
              <div style="font-size:0.9rem; color:var(--dark); margin-top:4px;">
                <div><i class="fa-solid fa-phone" style="color:var(--gold); margin-right:6px;"></i> ${booking.phone}</div>
                ${booking.email ? `<div style="margin-top:3px;"><i class="fa-solid fa-envelope" style="color:var(--gold); margin-right:6px;"></i> ${booking.email}</div>` : ''}
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
              <div>
                <span style="font-size:0.8rem; color:#888; text-transform:uppercase;">Total Bill</span>
                <div style="font-size:1.5rem; font-weight:700; color:var(--gold); font-family:'Cormorant Garamond',serif;">
                  ₹${Number(booking.amount).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style="background:#e6f4ea; color:#137333; font-weight:600; font-size:0.8rem; padding:5px 12px; border-radius:20px; border:1px solid #b7e1cd;">
                  <i class="fa-solid fa-circle-check"></i> Confirmed
                </span>
              </div>
            </div>
          </div>

          <!-- AMENITIES -->
          <div style="margin-top:20px;">
            <div style="font-size:0.85rem; font-weight:600; color:var(--dark); margin-bottom:8px;">Included Luxury Inclusions:</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${amenities.map(a => `<span style="background:#fff; border:1px solid #e0d8cc; padding:4px 10px; border-radius:15px; font-size:0.75rem; color:#555;"><i class="fa-solid fa-check" style="color:var(--gold); margin-right:4px;"></i>${a}</span>`).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  loginBox.style.display = "none";
  resultDiv.style.display = "block";
}

function logoutGuest() {
  document.getElementById("stayResult").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("guestIdentifier").value = "";
}
