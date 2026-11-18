const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Suite", "Deluxe"],
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    badge: { type: String, default: "" },
    floor: { type: String, default: "" },
    size: { type: String, default: "" },
    guests: { type: String, default: "" },
    bed: { type: String, default: "" },
    view: { type: String, default: "" },
    rating: { type: String, default: "4.8" },
    reviews: { type: String, default: "100" },
    image: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    perks: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
