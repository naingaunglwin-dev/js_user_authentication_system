# Sample User Authentication System

A minimal Node.js application with vanilla JavaScript (no frameworks) that demonstrates user authentication using PostgreSQL.

## Project Description
This project showcases a simple authentication flow: register, login, get current user, and manage projects. It uses PostgreSQL for storage and a lightweight HTTP server without Express or other frameworks.

## Prerequisites
- Node.js (LTS, preferably 18+)
- PostgreSQL server running and accessible
- Basic PostgreSQL client (psql or pg tools)

## Setup
- Clone the repository
  - `git clone https://github.com/your-username/user_authentication_system.git`
  - `cd user_authentication_system`
- Install dependencies
  - `npm install`
- Copy environment defaults for development
  - Windows: `copy .env.example .env.development`
  - macOS/Linux: `cp .env.example .env.development`
- Update database credentials in `.env.development` (keys used by the app):
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
  - You may also set `PORT` and optional `APP_NAME`, `JWT_SECRET`, `JWT_EXPIRES` if you customize them.
- Ensure the database exists (see DB Setup below) and is accessible with the credentials you provided.
- Build and run migrations, then start the dev server:
  - `npm run migrate`   # creates tables from `db/sql/table.sql`
  - `npm run dev`       # starts the HTTP server with file watching

## Database Setup
The app reads DB settings from config and expects a PostgreSQL database. Create a database named by `DB_NAME` and grant access to `DB_USER` with the password `DB_PASS`.
- Example (psql):
  - `psql -h <host> -p <port> -U <DB_USER>`
  - `CREATE DATABASE <DB_NAME>;`
  
Alternatively, use `createdb`:
  - `createdb -h <host> -p <port> -U <DB_USER> <DB_NAME>`

## Migration
- Migration script reads and executes SQL from `db/sql/table.sql` to create the necessary tables (`users`, `projects`).
- Run:
  - `npm run migrate`

## Development, Endpoints & Usage
The built-in HTTP server exposes vanilla Node.js endpoints defined in `index.js`:
- POST `/register` — Create a new user. Body: `{ email, password }`. Returns: `{ id, email }` or error.
- POST `/login` — Authenticate a user. Body: `{ email, password }`. On success, returns `{ id, access_token }` and sets `Authorization: Bearer <token>` header.
- GET `/users/me` — Get the currently authenticated user. Requires Bearer token. Returns: `{ id, email }`.
- GET `/projects` — List projects for the authenticated user. Requires Bearer token. Returns: `{ owner_id, projects }`.
- POST `/projects` — Create a project. Body: `{ name, description, owner_id }`. Requires Bearer token and `owner_id` must match current user id. Returns: project details.

Notes:
- All endpoints accept and respond with JSON (except where indicated for auth headers).
- JWTs are issued on login and must be provided as `Authorization: Bearer <token>`.

## Environment Variables (used by the app)
- NODE_ENV: development (default) or production
- PORT: server port (required by config)
- DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS: database credentials
- JWT_SECRET, JWT_EXPIRES: token signing configuration
- APP_NAME, API_URL, API_KEY: optional app metadata and API access (not required for core auth)

## Quick Troubleshooting
- If the server fails to start due to missing env vars, ensure `.env.development` (or your active environment file) defines the required keys `DB_NAME` and `PORT` at minimum.
- Ensure that PostgreSQL accepts connections from your host/user and that the database exists.

## File References
- Core server: `index.js`  
- Migration script: `bin/migration.js`  
- SQL schema: `db/sql/table.sql`  
- DB helpers: `db/helper.js`, `db/pool.js`  
- Config: `config.js`  
- Dependencies: `package.json`

