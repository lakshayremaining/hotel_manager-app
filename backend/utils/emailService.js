const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function sendBookingConfirmationEmail(booking) {
  if (!resend) {
    console.warn("⚠️ RESEND_API_KEY not configured. Skipping confirmation email.");
    return { success: false, reason: "No API key" };
  }

  if (!booking.email) {
    return { success: false, reason: "No recipient email provided" };
  }

  const fromAddress = process.env.EMAIL_FROM || "Namo Raga Hotel <onboarding@resend.dev>";

  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f5f0; margin: 0; padding: 20px; color: #222; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8dfcf; }
      .header { background: #131b26; padding: 30px 20px; text-align: center; color: #c5a880; }
      .header h1 { margin: 0; font-size: 26px; letter-spacing: 2px; }
      .header p { margin: 6px 0 0; color: #e5c392; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
      .content { padding: 30px 25px; }
      .greeting { font-size: 18px; font-weight: 600; color: #131b26; margin-bottom: 15px; }
      .booking-card { background: #faf8f5; border-left: 4px solid #c5a880; padding: 18px 20px; border-radius: 6px; margin: 20px 0; }
      .booking-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; border-bottom: 1px dashed #e5dfd3; padding-bottom: 6px; }
      .booking-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      .label { color: #666; }
      .value { font-weight: 600; color: #131b26; }
      .price-highlight { font-size: 18px; color: #b38b4d; font-weight: 700; }
      .footer { background: #f0ece3; padding: 20px; text-align: center; font-size: 12px; color: #777; }
      .footer a { color: #b38b4d; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>NAMO RAGA</h1>
        <p>Luxury Hotel & Suites</p>
      </div>
      <div class="content">
        <div class="greeting">Dear ${booking.guestName},</div>
        <p>Thank you for choosing <strong>Namo Raga Hotel</strong>. We are delighted to confirm that your reservation has been successfully booked!</p>
        
        <div class="booking-card">
          <div class="booking-row">
            <span class="label">Booking ID:</span>
            <span class="value" style="color:#b38b4d;">${booking.id}</span>
          </div>
          <div class="booking-row">
            <span class="label">Room:</span>
            <span class="value">Room ${booking.roomId} (${booking.roomType})</span>
          </div>
          <div class="booking-row">
            <span class="label">Check-In Date:</span>
            <span class="value">${booking.checkIn}</span>
          </div>
          <div class="booking-row">
            <span class="label">Check-Out Date:</span>
            <span class="value">${booking.checkOut}</span>
          </div>
          <div class="booking-row">
            <span class="label">Total Stay:</span>
            <span class="value">${booking.nights} Night${booking.nights > 1 ? 's' : ''}</span>
          </div>
          <div class="booking-row">
            <span class="label">Total Amount:</span>
            <span class="value price-highlight">₹${Number(booking.amount || 0).toLocaleString()}</span>
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #555;">
          Our reception is open 24/7. Should you require airport pickup, early check-in, or special dietary arrangements, feel free to reply directly to this email or call us at <strong>+91 98765 43210</strong>.
        </p>
        <p style="font-size: 14px; color: #555;">We look forward to hosting you for an unforgettable luxury experience.</p>
      </div>
      <div class="footer">
        <p><strong>Namo Raga Hotel</strong> &bull; 12 Palace Road, Jaipur, Rajasthan</p>
        <p>&copy; 2026 Namo Raga Hotel. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to: [booking.email],
      subject: `Booking Confirmed: Room ${booking.roomId} at Namo Raga Hotel (${booking.id})`,
      html: emailHtml,
    });
    console.log(`📧 Confirmation email sent to ${booking.email}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to send confirmation email via Resend:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendBookingConfirmationEmail };
