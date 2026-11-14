# Namo Raga Hotel — Backend API (Node.js + Express + MongoDB)

## 📁 Architecture Overview
```text
backend/
├── config/
│   └── db.js            # MongoDB Mongoose connection
├── models/
│   ├── Room.js          # Room Mongoose schema & specifications
│   └── Booking.js       # Booking Mongoose schema
├── routes/
│   ├── roomRoutes.js    # /api/rooms endpoints
│   └── bookingRoutes.js # /api/bookings endpoints
├── .env                 # Environment variables (PORT, MONGO_URI)
├── package.json         # Dependencies & scripts
├── seed.js              # Initial database seeder (10 rooms)
└── server.js            # Express server entry point
```

---

## 🚀 Getting Started

### 1. MongoDB Setup
You can use either:
- **MongoDB Atlas (Recommended - Free Cloud DB)**:
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
  2. Click **Connect** > **Drivers** > copy the connection string.
  3. Paste it in `backend/.env`:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/namo_raga_hotel?retryWrites=true&w=majority
     PORT=5000
     ```
- **Local MongoDB**:
  Ensure MongoDB service is running locally, then in `backend/.env`:
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/namo_raga_hotel
  PORT=5000
  ```

### 2. Seed Default Hotel Rooms
Populate the database with the 10 hotel rooms and luxury specifications:
```bash
cd backend
npm run seed
```

### 3. Start the Server
- **Development mode** (auto-reloads on file changes):
  ```bash
  cd backend
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```
The API server will run on `http://localhost:5000`.

---

## 📡 REST API Reference

### Rooms Endpoints
| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | `?status=available` | Get all rooms or filter by availability |
| `GET` | `/api/rooms/:id` | — | Get single room details (e.g. `/api/rooms/101`) |
| `PATCH` | `/api/rooms/:id/status` | `{ "status": "available" \| "booked" \| "maintenance" }` | Update room status |

### Bookings Endpoints
| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookings` | `?search=guestName` | Fetch all bookings or search by name/phone/ID |
| `POST` | `/api/bookings` | JSON object (see below) | Create a new booking & auto-mark room as booked |
| `POST` | `/api/bookings/:id/checkout` | — | Check out guest & free the room |
| `DELETE`| `/api/bookings/:id` | — | Cancel booking & release room |

#### Booking POST Body Example:
```json
{
  "guestName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "roomId": 105,
  "checkIn": "2026-11-20",
  "checkOut": "2026-11-23",
  "nights": 3,
  "amount": 13500
}
```
