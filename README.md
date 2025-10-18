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

### Testing

- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library for API testing

### Quick Setup (Recommended)

Run the automated setup command that installs all dependencies, runs migrations, and seeds the database:

```bash
npm run setup
```

Then start the application:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Manual Setup

If you prefer to set up step by step:

#### 1. Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

#### 2. Run Database Migrations

```bash
cd server
npm run migrate:latest
```

#### 3. Seed the Database

```bash
npm run seed:run
```

This will create 5 users (3 requesters and 2 validators). No vacation requests are pre-seeded.

#### 4. Start Development Servers

From the root directory:

```bash
cd ..
npm run dev
```

This will start both the frontend and backend servers.

### Run All Tests

```bash
cd server
npm test
```

### Run Tests in Watch Mode

Automatically re-run tests when files change:

```bash
npm run test:watch
```

## Database Schema

### Users Table

- `id` - Primary key
- `name` - User's full name
- `role` - Either 'requester' or 'validator'
- `created_at`, `updated_at` - Timestamps

### Vacation Requests Table

- `id` - Primary key
- `user_id` - Foreign key to users table
- `start_date` - Vacation start date
- `end_date` - Vacation end date
- `reason` - Optional reason for the request
- `status` - 'pending', 'approved', or 'rejected'
- `comments` - Manager's comments (especially for rejections)
- `created_at` - Request creation timestamp

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/role/:role` - Get users by role (requester/validator)

### Vacation Requests

- `GET /api/vacations` - Get all vacation requests (with user info)
- `GET /api/vacations/:id` - Get vacation request by ID
- `POST /api/vacations` - Create new vacation request
- `PUT /api/vacations/:id` - Update vacation request
- `DELETE /api/vacations/:id` - Delete vacation request

## Notes

- This is a local development project
- Frontend runs on port 3000
- Backend runs on port 5000
- Database is SQLite (file-based, no setup required)
- All data is stored in `server/database.sqlite`
