# Hotel Management Backend

Backend for the hotel project. It uses Express and MongoDB.

## Run the project

Run these commands from the project folder (the folder containing the main package.json).

1. Add a `.env` file in that folder with your MongoDB connection:

```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/namo_raga_hotel
PORT=5000
```

2. Install packages. If the database is new, add the starter rooms once:

```bash
npm install
npm run seed
```

The seed command only adds missing rooms. It preserves existing room statuses and bookings, so it is safe to run again.

3. Start the app:

```bash
npm run dev
```

Open http://localhost:5000. For a normal start, use `npm start`.

For Vercel, set `MONGO_URI` in the project environment variables.

## Main API routes

- `GET /api/rooms` — list rooms; optional `?status=available`
- `GET /api/rooms/:id` — get one room
- `PATCH /api/rooms/:id/status` — change room status
- `GET /api/bookings` — list bookings; optional `?search=name`
- `POST /api/bookings` — create a booking and mark its room booked
- `POST /api/bookings/:id/checkout` — check out a guest and free the room
- `DELETE /api/bookings/:id` — cancel a booking

The database has two collections: `rooms` and `bookings`.
