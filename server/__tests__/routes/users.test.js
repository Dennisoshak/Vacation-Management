import { describe, test, expect, afterAll } from '@jest/globals'
import request from 'supertest'
import app from '../../src/index.js'
import db from '../../src/config/database.js'

describe('User Routes', () => {
  afterAll(async () => {
    await db.destroy()
  })

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      
      // Check user structure
      const user = response.body[0]
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(['requester', 'validator']).toContain(user.role)
    })

    test('should return users ordered by name', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)

      const names = response.body.map(user => user.name)
      const sortedNames = [...names].sort()
      expect(names).toEqual(sortedNames)
    })
  })

  describe('GET /api/users/role/:role', () => {
    test('should return only requester users', async () => {
      const response = await request(app)
        .get('/api/users/role/requester')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      
      response.body.forEach(user => {
        expect(user.role).toBe('requester')
      })
    })

    test('should return only validator users', async () => {
      const response = await request(app)
        .get('/api/users/role/validator')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      
      response.body.forEach(user => {
        expect(user.role).toBe('validator')
      })
    })

    test('should return empty array for non-existent role', async () => {
      const response = await request(app)
        .get('/api/users/role/admin')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(0)
    })
  })

  describe('GET /api/users/:id', () => {
    test('should return a specific user by ID', async () => {
      // Get a user first
      const users = await db('users').select('*').limit(1)
      const userId = users[0].id

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200)

      expect(response.body).toHaveProperty('id', userId)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('role')
    })

    test('should return 404 for non-existent user ID', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404)

      expect(response.body.error).toBe('User not found')
    })
  })
})
