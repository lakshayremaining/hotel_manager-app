const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "10-digit phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    roomId: {
      type: Number,
      required: true,
      ref: "Room",
    },
    roomType: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "checked_out", "cancelled"],
      default: "active",
    },
    bookedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
