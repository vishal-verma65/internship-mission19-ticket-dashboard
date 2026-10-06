# Ticket Lock Dashboard

Real-time ticket locking with Node.js, Express and Socket.io. The backend holds lock state in memory, so two agents can never work on the same ticket, and locks are released automatically when a frontend disconnects.

## Stack

- **Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose)
- **Frontend:** React (Vite), Tailwind CSS v4, socket.io-frontend

## Project structure

```
ticket-lock-dashboard/
  render.yaml                Render blueprint (backend)
  backend/
    src/
      config/                db connection, allowed origins
      models/Ticket.js
      controllers/
      routes/
      sockets/
        lockStore.js         in-memory Map: ticketId -> socket.id
        ticketHandlers.js    join_dashboard, lock_ticket, unlock_ticket, disconnect
        index.js             Socket.io setup
      app.js
      backend.js
      seed.js
  frontend/
    vercel.json              Vercel SPA config
    src/
      lib/socket.js
      hooks/useTicketLocks.js
      components/
      App.jsx
```

## How locking works

| Event | Direction | Behavior |
| --- | --- | --- |
| `join_dashboard` | frontend to backend | backend replies with the current lock state |
| `lock_ticket` | frontend to backend | Rejected if already locked, otherwise locked and broadcast to everyone |
| `unlock_ticket` | frontend to backend | Only the lock owner can unlock, then broadcast |
| `lock_state` | backend to all clients | Full map of `{ ticketId: socketId }` |

**Ghost disconnects:** on `disconnect`, the backend scans the Map, releases every ticket held by that `socket.id`, and broadcasts the new state. Ping settings (`pingInterval: 10s`, `pingTimeout: 5s`) mean a closed laptop lid or dead connection is detected in about 15 seconds.

## Run locally

Requires Node 18+ and a MongoDB instance (local or Atlas).

```bash
# backend
cd backend
npm install
npm run seed      # optional: adds sample tickets
npm run dev       # http://localhost:5000

# frontend (new terminal)
cd frontend
npm install
npm run dev       # http://localhost:5173
```

## Environment variables

**backend/.env**

| Variable | Description |
| --- | --- |
| `PORT` | backend port (Render sets this automatically) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated, no trailing slash |

**frontend/.env**

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL |

## Deploy

### 1. Database (MongoDB Atlas)

Create a free cluster, add a database user, and allow network access from anywhere (`0.0.0.0/0`) so Render can connect. Copy the connection string.

Optionally seed it from your machine by setting `MONGO_URI` in `backend/.env` to the Atlas string and running `npm run seed`.

### 2. Backend on Render

1. Push this repo to GitHub.
2. In Render: **New > Blueprint** and select the repo (uses `render.yaml`), or **New > Web Service** with root directory `backend`, build command `npm install`, start command `npm start`.
3. Set environment variables:
   - `MONGO_URI` = your Atlas string
   - `CLIENT_URL` = your Vercel URL (add after step 3, then redeploy)
4. Confirm `https://<your-service>.onrender.com/health` returns `{"status":"ok"}`.

### 3. Frontend on Vercel

1. In Vercel: **Add New > Project**, import the repo.
2. Set **Root Directory** to `frontend`. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` = your Render URL (no trailing slash).
4. Deploy, then copy the Vercel URL into `CLIENT_URL` on Render.

## Notes

- Render's free tier sleeps after inactivity. The first request after a sleep takes about 30 to 60 seconds, and all in-memory locks are cleared on restart.
- Lock state lives in one Node process. Running multiple instances would need the Socket.io Redis adapter and a shared store.
- To allow preview deployments, add several origins to `CLIENT_URL`, separated by commas.
