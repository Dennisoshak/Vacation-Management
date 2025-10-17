import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db('users').select('*').orderBy('name')
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users', message: error.message })
  }
})

// GET users by role
router.get('/role/:role', async (req, res) => {
  try {
    const users = await db('users')
      .where({ role: req.params.role })
      .select('*')
      .orderBy('name')
    
    res.json(users)
  } catch (error) {
    console.error('Error fetching users by role:', error)
    res.status(500).json({ error: 'Failed to fetch users', message: error.message })
  }
})

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.params.id })
      .first()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user', message: error.message })
  }
})

export default router
