const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { sendBookingConfirmationEmail } = require("../utils/emailService");

// Helper to generate NRH-xxx booking ID
async function generateBookingId() {
  const count = await Booking.countDocuments();
  return "NRH-" + String(count + 1).padStart(3, "0");
}

// GET /api/bookings - List bookings (optional query: ?status=active)
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings - Create new booking
router.post("/", async (req, res) => {
  try {
    const { guestName, phone, email, roomId, checkIn, checkOut, nights, amount } = req.body;

    if (!guestName || !phone || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    // Verify room exists and is available
    const room = await Room.findOne({ id: Number(roomId) });
    if (!room) {
      return res.status(404).json({ error: `Room ${roomId} does not exist` });
    }

    if (room.status !== "available") {
      return res.status(400).json({ error: `Room ${roomId} is currently not available (${room.status})` });
    }

    // Generate unique booking ID
    const bookingId = await generateBookingId();

    const booking = new Booking({
      id: bookingId,
      guestName,
      phone,
      email: email || "",
      roomId: room.id,
      roomType: room.type,
      checkIn,
      checkOut,
      nights: Number(nights),
      amount: Number(amount),
      status: "active",
    });

    await booking.save();

    // Mark room as booked
    room.status = "booked";
    await room.save();

    // Send confirmation email via Resend if email is provided
    let emailStatus = null;
    if (booking.email) {
      // Send asynchronously without blocking the response
      sendBookingConfirmationEmail(booking)
        .then(result => {
          if (!result.success) {
            console.log("Email dispatch result:", result);
          }
        })
        .catch(err => console.error("Error triggering confirmation email:", err.message));
      emailStatus = "Confirmation email queued";
    }

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking,
      emailStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings/:id/checkout - Check out a guest & free the room
router.post("/:id/checkout", async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "checked_out";
    await booking.save();

    // Free the associated room
    await Room.findOneAndUpdate({ id: booking.roomId }, { status: "available" });

    res.json({
      message: `Guest ${booking.guestName} checked out successfully. Room ${booking.roomId} is now available.`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel/Delete a booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Free room if booking was active
    if (booking.status === "active") {
      await Room.findOneAndUpdate({ id: booking.roomId }, { status: "available" });
    }

    await Booking.deleteOne({ id: req.params.id });

    res.json({ message: "Booking removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
