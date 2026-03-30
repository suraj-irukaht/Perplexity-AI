# Perplexity AI (Backend)

Status: Work in Progress — last updated 2026-03-30 12:28 (local)
- Active development is ongoing; features and docs may evolve frequently.

A simple Node.js/Express backend with MongoDB (Mongoose) for authentication-related APIs. Runs on port 3000 by default.

## WIP roadmap (short-term)
- [ ] Add healthcheck endpoint (GET /health) to verify API is up
- [ ] Document auth routes with request/response examples
- [ ] Provide Docker setup for local MongoDB
- [ ] Add basic tests for config and DB connection

## Tech stack
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- dotenv, cookie-parser, express-validator, bcryptjs, nodemailer

## Project structure
- README.md (this file)
- backend/
  - package.json (scripts and dependencies)
  - server.js (app entry; starts server on port 3000)
  - src/
    - app.js (Express app setup and routes)
    - config/
      - config.js (loads and validates required environment variables)
      - database.js (MongoDB connection)
    - routes/
      - auth.route.js (auth endpoints; mounted at /api/auth)

Note: Only the backend is currently represented in this repository structure.

## Prerequisites
- Node.js 18+ and npm
- A running MongoDB instance (local or hosted)

## Environment variables
Create a .env file inside backend/ with the following keys. The app will exit on startup if any are missing.

- MONGO_URI: MongoDB connection string
- JWT_SECRET: Secret key for signing access tokens
- REFRESH_TOKEN: Secret key for signing refresh tokens
- CLIENT_ID: OAuth client ID (if applicable)
- CLIENT_SECRET: OAuth client secret (if applicable)
- GMAIL_USER: Gmail/SMTP user for email sending (if applicable)

Example backend/.env (values are placeholders):

MONGO_URI=mongodb://localhost:27017/perplexity_ai
JWT_SECRET=change_me_access_secret
REFRESH_TOKEN=change_me_refresh_secret
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
GMAIL_USER=your_gmail_user@example.com

## Install and run (development)
1. Navigate to the backend directory:
   - cd backend
2. Install dependencies:
   - npm install
3. Create the .env file as described above.
4. Start the dev server (uses nodemon):
   - npm run dev

- Server will start at: http://localhost:3000
- API base path (auth): /api/auth

## Scripts
- npm run dev: Start the server with nodemon (watches for changes)

## Troubleshooting
- If the server exits immediately, check that all required env vars are present in backend/.env.
- Ensure MongoDB is reachable via the MONGO_URI value.

## License
ISC (see package.json).