const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// GET /api/rooms - Get all rooms (optional query: ?status=available)
router.get("/", async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const rooms = await Room.find(filter).sort({ id: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms/:id - Get single room by room number
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findOne({ id: Number(req.params.id) });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/rooms/:id/status - Update room status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["available", "booked", "maintenance"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const room = await Room.findOneAndUpdate(
      { id: Number(req.params.id) },
      { status },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
