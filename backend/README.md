# Cab Booking Backend

Express + MongoDB + Socket.IO backend for the customer and driver mobile apps in this repo.

## Features

- OTP auth for customers
- JWT access + refresh sessions
- Customer profile, bootstrap, wallet and trip history
- Ride estimation, booking, cancellation and active ride lookup
- Driver availability, assignment, arrival, OTP verification and trip completion
- Socket.IO ride lifecycle events
- Redis-backed cache abstraction with in-memory fallback for local development

## Run

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start MongoDB and Redis
4. Run `npm run dev`

## Notes

- Redis is optional in code so local development can run without it, but production should provide Redis.
- Payment webhooks are stubbed with signature verification and persistence hooks; provider integration can be added without changing API shape.
