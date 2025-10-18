import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import app from '../../src/index.js'
import db from '../../src/config/database.js'

describe('Vacation Routes', () => {
  let testUserId

  beforeAll(async () => {
    // Get a test user ID
    const user = await db('users').where({ role: 'requester' }).first()
    testUserId = user.id
  })

  afterAll(async () => {
    await db.destroy()
  })

  describe('GET /api/vacations', () => {
    test('should return all vacation requests', async () => {
      const response = await request(app)
        .get('/api/vacations')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('user_name')
        expect(response.body[0]).toHaveProperty('status')
      }
    })

    test('should filter vacation requests by user_id', async () => {
      const response = await request(app)
        .get(`/api/vacations?user_id=${testUserId}`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      response.body.forEach(vacation => {
        expect(vacation.user_id).toBe(testUserId)
      })
    })
  })

  describe('POST /api/vacations', () => {
    test('should create a new vacation request with valid data', async () => {
      const newRequest = {
        user_id: testUserId,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        reason: 'Test vacation'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(newRequest)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.user_id).toBe(testUserId)
      expect(response.body.status).toBe('pending')
      expect(response.body.start_date).toBe('2025-12-01')
      expect(response.body.end_date).toBe('2025-12-05')
      expect(response.body.reason).toBe('Test vacation')
    })

    test('should create vacation request without reason (optional)', async () => {
      const newRequest = {
        user_id: testUserId,
        start_date: '2025-12-10',
        end_date: '2025-12-15'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(newRequest)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.reason).toBeNull()
    })

    test('should return 400 when user_id is missing', async () => {
      const invalidRequest = {
        start_date: '2025-12-01',
        end_date: '2025-12-05'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(invalidRequest)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.errors).toContain('user_id is required')
    })

    test('should return 400 when start_date is missing', async () => {
      const invalidRequest = {
        user_id: testUserId,
        end_date: '2025-12-05'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(invalidRequest)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.errors).toContain('start_date is required')
    })

    test('should return 400 when end_date is missing', async () => {
      const invalidRequest = {
        user_id: testUserId,
        start_date: '2025-12-01'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(invalidRequest)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.errors).toContain('end_date is required')
    })

    test('should return 400 when start_date is after end_date', async () => {
      const invalidRequest = {
        user_id: testUserId,
        start_date: '2025-12-10',
        end_date: '2025-12-05'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(invalidRequest)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.errors).toContain('start_date must be before or equal to end_date')
    })

    test('should return 404 when user does not exist', async () => {
      const invalidRequest = {
        user_id: 99999,
        start_date: '2025-12-01',
        end_date: '2025-12-05'
      }

      const response = await request(app)
        .post('/api/vacations')
        .send(invalidRequest)
        .expect(404)

      expect(response.body.error).toBe('User not found')
    })
  })

  describe('PATCH /api/vacations/:id/approve', () => {
    let vacationId

    beforeAll(async () => {
      // Create a test vacation request
      const [id] = await db('vacation_requests').insert({
        user_id: testUserId,
        start_date: '2025-12-20',
        end_date: '2025-12-25',
        reason: 'Test for approval',
        status: 'pending'
      })
      vacationId = id
    })

    test('should approve a vacation request', async () => {
      const response = await request(app)
        .patch(`/api/vacations/${vacationId}/approve`)
        .send({ comments: 'Approved for testing' })
        .expect(200)

      expect(response.body.status).toBe('approved')
      expect(response.body.comments).toBe('Approved for testing')
    })

    test('should approve without comments', async () => {
      // Create another request
      const [id] = await db('vacation_requests').insert({
        user_id: testUserId,
        start_date: '2026-01-10',
        end_date: '2026-01-15',
        status: 'pending'
      })

      const response = await request(app)
        .patch(`/api/vacations/${id}/approve`)
        .send({})
        .expect(200)

      expect(response.body.status).toBe('approved')
    })

    test('should return 404 for non-existent vacation request', async () => {
      const response = await request(app)
        .patch('/api/vacations/99999/approve')
        .send({})
        .expect(404)

      expect(response.body.error).toBe('Vacation request not found')
    })
  })

  describe('PATCH /api/vacations/:id/reject', () => {
    let vacationId

    beforeAll(async () => {
      // Create a test vacation request
      const [id] = await db('vacation_requests').insert({
        user_id: testUserId,
        start_date: '2026-02-01',
        end_date: '2026-02-05',
        reason: 'Test for rejection',
        status: 'pending'
      })
      vacationId = id
    })

    test('should reject a vacation request with comments', async () => {
      const response = await request(app)
        .patch(`/api/vacations/${vacationId}/reject`)
        .send({ comments: 'Insufficient coverage' })
        .expect(200)

      expect(response.body.status).toBe('rejected')
      expect(response.body.comments).toBe('Insufficient coverage')
    })

    test('should reject without comments (optional)', async () => {
      // Create another request
      const [id] = await db('vacation_requests').insert({
        user_id: testUserId,
        start_date: '2026-03-01',
        end_date: '2026-03-05',
        status: 'pending'
      })

      const response = await request(app)
        .patch(`/api/vacations/${id}/reject`)
        .send({})
        .expect(200)

      expect(response.body.status).toBe('rejected')
    })

    test('should return 404 for non-existent vacation request', async () => {
      const response = await request(app)
        .patch('/api/vacations/99999/reject')
        .send({ comments: 'Test' })
        .expect(404)

      expect(response.body.error).toBe('Vacation request not found')
    })
  })
})
