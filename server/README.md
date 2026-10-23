# StayManager API

Express + MongoDB API scaffold for the StayManager frontend.

## Setup

1. Install Node.js 20 or newer and make sure MongoDB is running (local or hosted).
2. Open a terminal in the `server` folder.
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env`.
5. Set `MONGODB_URI` and generate a long random `JWT_SECRET` (at least 32 characters). Never commit `.env`.
6. Start the API with `npm run dev`.

The API listens on port 5000 by default. Check `GET /api/health` for status.

## First administrator

Create the initial administrator using `POST /api/auth/register` with JSON containing `name`, `email`, and a password of at least 10 characters. Initial setup is allowed only when there are no users; after that, new account creation requires a valid administrator token. Sign in using `POST /api/auth/login`.

Send the returned token as `Authorization: Bearer <token>` for protected endpoints.

## API routes

- `GET /api/auth/me`
- `GET /api/rooms`, `POST /api/rooms`, `GET /api/rooms/:id`, `PUT /api/rooms/:id`, `DELETE /api/rooms/:id`
- The same CRUD routes are available for `guests`, `payments`, `staff`, `attendance`, and `maintenance`.

## Important integration note

The current React pages use browser local storage so the demo works without a server. The API is scaffolded separately and is not yet wired into those pages; connect the frontend authentication and data services to this API before describing the project as a fully integrated MERN application.

## Security notes

Use HTTPS in deployment, use a unique secret, limit database network access, and don't store real resident details in demo environments. The login screen in the frontend is demo-only and is not the API authentication flow.
