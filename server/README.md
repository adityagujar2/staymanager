# StayManager API

Express + MongoDB API for the StayManager React application.

## Setup

1. Install Node.js 20 or newer and make sure MongoDB is running (local or hosted).
2. Open a terminal in the `server` folder.
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env`.
5. Set `MONGODB_URI` and replace `JWT_SECRET` with a unique random secret of at least 32 characters. Never commit `.env`.
6. Start the API with `npm run dev`.

The API listens on port 5000 by default. Check `GET /api/health` for status.

## First administrator

Open the frontend with `VITE_API_BASE_URL=http://localhost:5000/api` configured, then choose **First time here? Set up administrator** on the login page. The initial administrator is allowed only when the database has no users; after that, account creation requires an administrator token. You can also call `POST /api/auth/register` with `name`, `email`, and a password of at least 10 characters.

Sign in using `POST /api/auth/login`. Send the returned token as `Authorization: Bearer <token>` for protected endpoints.

## API routes

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- CRUD routes for `rooms`, `guests`, `payments`, `staff`, `attendance`, and `maintenance`

Each resource has collection `GET` and `POST` routes and record `GET`, `PUT`, and `DELETE` routes.

## Security notes

Use HTTPS in deployment, use a unique secret, limit database network access, and don't store real resident details in demo environments. The frontend demo mode is not production authentication. Add rate limiting, logging, backups, and automated tests before production use.
