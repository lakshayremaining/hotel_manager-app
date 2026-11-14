require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("../backend/config/db");

const roomRoutes = require("../backend/routes/roomRoutes");
const bookingRoutes = require("../backend/routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB is connected for all API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      error: "Database connection error",
      details: err.message,
      help: "Please ensure MONGO_URI is set in your .env or Vercel Environment Variables.",
    });
  }
});

// Mount Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    hotel: "Namo Raga Hotel API",
    platform: process.env.VERCEL ? "Vercel Serverless" : "Local Node Server",
    time: new Date().toISOString(),
  });
});

// Serve static frontend when running locally via Express
app.use(express.static(path.join(__dirname, "..")));

// Only call listen if run directly (local), Vercel invokes module.exports
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🏨 Namo Raga Hotel running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
