// =============================================
//  app.js — Shared Helper Functions
//  Lakshay Luxury Hotels
// =============================================

// Format date string (e.g. 2026-11-24 → 24 Nov 2026)
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Calculate nights between two dates
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 0;
}

// Room type badge/icon helper
function roomIcon(type) {
  return "";
}
