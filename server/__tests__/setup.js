import db from '../src/config/database.js'

// Set test environment
process.env.NODE_ENV = 'test'

// Global test setup
beforeAll(async () => {
  // Run migrations
  await db.migrate.latest()
  
  // Run seeds
  await db.seed.run()
})

// Clean up after all tests
afterAll(async () => {
  await db.destroy()
})

// Clean up between tests (optional)
afterEach(async () => {
  // You can add cleanup logic here if needed
})
