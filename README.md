# StayManager 🏠

A responsive PG and guest-house management app with a React/Vite frontend and an Express/MongoDB API. It is designed for room occupancy, resident records, rent tracking, staff, attendance, and maintenance.

## Features

- Dashboard overview for occupancy, guests, rent, and maintenance
- Rooms, Guests, Payments, Staff, Attendance, and Maintenance pages
- Shared create/edit forms, search, status filters, and delete actions
- Payment status action for marking rent as paid
- Responsive sidebar, tables, and forms for desktop and mobile
- Demo mode with browser-local storage
- Optional API mode with JWT login and MongoDB persistence

## Technology

- Frontend: React, Vite, React Router, Bootstrap, custom CSS
- Backend: Node.js, Express, Mongoose, MongoDB
- Authentication: bcrypt password hashing and JWT bearer tokens

## Start the frontend in demo mode

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. In demo mode, any non-empty email and password will enter the frontend. This mode stores demo records in the current browser and is not secure authentication.

## Enable the backend

1. Make sure MongoDB is running locally or create a MongoDB database.
2. Copy `server/.env.example` to `server/.env`.
3. Set `MONGODB_URI` and replace `JWT_SECRET` with a unique random secret at least 32 characters long.
4. In a terminal:

   ```bash
   cd server
   npm install
   npm run dev
   ```

5. In the project root, copy `.env.example` to `.env` and set `VITE_API_BASE_URL=http://localhost:5000/api`.
6. Start or restart the frontend:

   ```bash
   npm run dev
   ```

7. On the login page, choose **First time here? Set up administrator** to create the first API administrator. Later, sign in with that account.

The API health endpoint is `http://localhost:5000/api/health`. When API mode is enabled, the app uses the authenticated API for CRUD operations rather than storing residents and other records in browser local storage.

## Main API routes

- `POST /api/auth/register` for initial administrator setup
- `POST /api/auth/login` and `GET /api/auth/me`
- CRUD endpoints for `/api/rooms`, `/api/guests`, `/api/payments`, `/api/staff`, `/api/attendance`, and `/api/maintenance`

Protected API requests use `Authorization: Bearer <token>`.

## Important notes

This is an actively developed portfolio project, not a production-ready property-management service. Before using it with real resident or payment data, add formal security review, rate limiting, automated tests, backups, audit logs, deployment configuration, and carefully managed secrets. Demo data is fictional.

## Author

Aditya Gujar
