import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET all vacation requests with user info
router.get('/', async (req, res) => {
  try {
    const requests = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .orderBy('vacation_requests.created_at', 'desc')
    
    res.json(requests)
  } catch (error) {
    console.error('Error fetching vacation requests:', error)
    res.status(500).json({ error: 'Failed to fetch vacation requests', message: error.message })
  }
})

// GET vacation request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .where('vacation_requests.id', '=', req.params.id)
      .first()
    
    if (!request) {
      return res.status(404).json({ error: 'Vacation request not found' })
    }
    
    res.json(request)
  } catch (error) {
    console.error('Error fetching vacation request:', error)
    res.status(500).json({ error: 'Failed to fetch vacation request', message: error.message })
  }
})

// POST create new vacation request
router.post('/', async (req, res) => {
  try {
    const [id] = await db('vacation_requests').insert(req.body)
    
    // Fetch the created request with user info
    const request = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .where('vacation_requests.id', '=', id)
      .first()
    
    res.status(201).json(request)
  } catch (error) {
    console.error('Error creating vacation request:', error)
    res.status(500).json({ error: 'Failed to create vacation request', message: error.message })
  }
})

// PUT update vacation request
router.put('/:id', async (req, res) => {
  try {
    const updated = await db('vacation_requests')
      .where({ id: req.params.id })
      .update(req.body)
    
    if (!updated) {
      return res.status(404).json({ error: 'Vacation request not found' })
    }
    
    const request = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .where('vacation_requests.id', '=', req.params.id)
      .first()
    
    res.json(request)
  } catch (error) {
    console.error('Error updating vacation request:', error)
    res.status(500).json({ error: 'Failed to update vacation request', message: error.message })
  }
})

// DELETE vacation request
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('vacation_requests')
      .where({ id: req.params.id })
      .del()
    
    if (!deleted) {
      return res.status(404).json({ error: 'Vacation request not found' })
    }
    
    res.json({ message: 'Vacation request deleted successfully' })
  } catch (error) {
    console.error('Error deleting vacation request:', error)
    res.status(500).json({ error: 'Failed to delete vacation request', message: error.message })
  }
})

export default router
