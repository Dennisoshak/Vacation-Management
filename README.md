# Vacation Management System

A full-stack vacation management application built with Vue 3, Express, and PostgreSQL.

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

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

### 2. Configure Environment Variables (Optional)

Copy the example environment file in the server directory:

```bash
cp server/.env.example server/.env
```

The SQLite database file will be created automatically when you run migrations.

### 3. Run Database Migrations

```bash
cd server
npm run migrate:latest
```

### 4. Seed the Database (Optional)

```bash
npm run seed:run
```

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers concurrently.

Or start them separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## Available Scripts

### Root Directory
- `npm run dev` - Start both client and server in development mode
- `npm run install:all` - Install dependencies for all projects
- `npm run build` - Build the client for production
- `npm start` - Start the production server

### Client Directory
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server Directory
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production mode
- `npm run migrate:latest` - Run all migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run migrate:make <name>` - Create a new migration
- `npm run seed:run` - Run all seeds
- `npm run seed:make <name>` - Create a new seed

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/vacations` - Get all vacations
- `GET /api/vacations/:id` - Get vacation by ID
- `POST /api/vacations` - Create new vacation
- `PUT /api/vacations/:id` - Update vacation
- `DELETE /api/vacations/:id` - Delete vacation

## Development

The frontend development server runs on port 3000 and proxies API requests to the backend on port 5000. This is configured in `client/vite.config.js`.

## Production Build

```bash
# Build the client
npm run build

# Start the production server
npm start
```

## License

ISC
