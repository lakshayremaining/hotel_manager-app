require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    hotel: "Namo Raga Hotel API",
    time: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Namo Raga Hotel Backend API is running. Check /api/health or /api/rooms");
});

app.listen(PORT, () => {
  console.log(`🏨 Namo Raga Hotel Server running on http://localhost:${PORT}`);
});
