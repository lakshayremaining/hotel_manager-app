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
    hotel: "Lakshay Luxary Hotels API",
    time: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Lakshay Luxary Hotels Backend API is running. Check /api/health or /api/rooms");
});

app.listen(PORT, () => {
  console.log(`🏨 Lakshay Luxary Hotels Server running on http://localhost:${PORT}`);
});
