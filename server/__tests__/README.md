# Backend API Tests

This directory contains unit and integration tests for the Vacation Management System backend API.

## Test Framework

- **Jest**: Testing framework with built-in assertions and mocking
- **Supertest**: HTTP assertion library for testing Express routes

## Test Structure

```
__tests__/
├── setup.js                    # Global test setup and teardown
├── routes/
│   ├── vacations.test.js      # Tests for vacation routes
│   └── users.test.js          # Tests for user routes
└── README.md                   # This file
```

## Running Tests

### Install Dependencies

First, make sure to install the test dependencies:

```bash
cd server
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

Automatically re-run tests when files change:

```bash
npm run test:watch
```

### Run Tests with Coverage

Generate a code coverage report:

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Test Coverage

### Vacation Routes (`vacations.test.js`)

✅ **GET /api/vacations**
- Returns all vacation requests
- Filters by user_id query parameter

✅ **POST /api/vacations**
- Creates vacation request with valid data
- Creates vacation request without optional reason
- Validates required fields (user_id, start_date, end_date)
- Validates date logic (start_date before end_date)
- Validates user existence

✅ **PATCH /api/vacations/:id/approve**
- Approves vacation request with comments
- Approves vacation request without comments
- Returns 404 for non-existent requests

✅ **PATCH /api/vacations/:id/reject**
- Rejects vacation request with comments
- Rejects vacation request without comments (optional)
- Returns 404 for non-existent requests

### User Routes (`users.test.js`)

✅ **GET /api/users**
- Returns all users
- Users are ordered by name

✅ **GET /api/users/role/:role**
- Returns users filtered by requester role
- Returns users filtered by validator role
- Returns empty array for non-existent role

✅ **GET /api/users/:id**
- Returns specific user by ID
- Returns 404 for non-existent user

## Test Database

Tests use the same SQLite database as development but run in test mode (`NODE_ENV=test`). The test setup:

1. Runs all migrations before tests
2. Seeds the database with test data
3. Cleans up database connections after tests

## Writing New Tests

When adding new routes or features, follow this pattern:

```javascript
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import app from '../../src/index.js'
import db from '../../src/config/database.js'

describe('Your Route Name', () => {
  afterAll(async () => {
    await db.destroy()
  })

  describe('GET /api/your-endpoint', () => {
    test('should do something', async () => {
      const response = await request(app)
        .get('/api/your-endpoint')
        .expect(200)

      expect(response.body).toHaveProperty('someProperty')
    })
  })
})
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Clean up**: Always close database connections in `afterAll`
3. **Use descriptive names**: Test names should clearly describe what they test
4. **Test edge cases**: Include tests for error conditions and validation
5. **Keep tests fast**: Avoid unnecessary database operations

## Troubleshooting

### Tests fail with "Cannot find module"

Make sure you've installed all dependencies:
```bash
npm install
```

### Database connection errors

Ensure migrations and seeds have been run:
```bash
npm run migrate:latest
npm run seed:run
```

### Port already in use

The test server doesn't actually listen on a port, so this shouldn't happen. If it does, check that `NODE_ENV=test` is set properly.
