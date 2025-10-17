# Vacation Management System

A full-stack vacation management application built with Vue 3, Express, and SQLLite.

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Knex.js** - SQL query builder
- **SQLite** - Lightweight relational database

## Project Structure

```
vacation-management/
├── client/                 # Vue 3 frontend
│   ├── src/
│   │   ├── views/         # Page components
│   │   ├── router/        # Vue Router configuration
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Application entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database and configuration
│   │   ├── routes/        # API routes
│   │   ├── migrations/    # Database migrations
│   │   ├── seeds/         # Database seeds
│   │   └── index.js       # Server entry point
│   ├── .env.example
│   └── package.json
└── package.json           # Root package.json
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

### 2. Run Database Migrations

```bash
cd server
npm run migrate:latest
```

### 3. Seed the Database (Optional)

```bash
npm run seed:run
```

### 4. Start Development Servers

From the root directory:

```bash
cd ..
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Available Scripts

### Root Directory
- `npm run dev` - Start both client and server
- `npm run install:all` - Install dependencies for all projects

### Server Directory
- `npm run dev` - Start server with nodemon
- `npm run migrate:latest` - Run all migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run seed:run` - Run all seeds

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/vacations` - Get all vacations
- `GET /api/vacations/:id` - Get vacation by ID
- `POST /api/vacations` - Create new vacation
- `PUT /api/vacations/:id` - Update vacation
- `DELETE /api/vacations/:id` - Delete vacation

## Notes

- This is a local development project
- Frontend runs on port 3000
- Backend runs on port 5000
- Database is SQLite (file-based, no setup required)
- All data is stored in `server/database.sqlite`
