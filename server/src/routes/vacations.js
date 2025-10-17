import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// Input validation helper
const validateVacationRequest = (data) => {
  const errors = []
  
  if (!data.user_id) {
    errors.push('user_id is required')
  }
  
  if (!data.start_date) {
    errors.push('start_date is required')
  }
  
  if (!data.end_date) {
    errors.push('end_date is required')
  }
  
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    
    if (startDate > endDate) {
      errors.push('start_date must be before or equal to end_date')
    }
    
    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      errors.push('start_date cannot be in the past')
    }
  }
  
  return errors
}

// GET all vacation requests with user info
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query
    
    let query = db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .orderBy('vacation_requests.created_at', 'desc')
    
    // Filter by user_id if provided (for requesters to see only their requests)
    if (user_id) {
      query = query.where('vacation_requests.user_id', '=', user_id)
    }
    
    const requests = await query
    
    res.json(requests)
  } catch (error) {
    console.error('Error fetching vacation requests:', error)
    res.status(500).json({ error: 'Failed to fetch vacation requests', message: error.message })
  }
})

// POST create new vacation request (Submit a vacation request)
router.post('/', async (req, res) => {
  try {
    // Validate input
    const validationErrors = validateVacationRequest(req.body)
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        errors: validationErrors 
      })
    }
    
    // Verify user exists
    const user = await db('users').where({ id: req.body.user_id }).first()
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Create vacation request with default status 'pending'
    const requestData = {
      user_id: req.body.user_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      reason: req.body.reason || null,
      status: 'pending',
      comments: null
    }
    
    const [id] = await db('vacation_requests').insert(requestData)
    
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

// PATCH approve vacation request
router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { comments } = req.body
    
    // Check if request exists
    const existingRequest = await db('vacation_requests').where({ id }).first()
    if (!existingRequest) {
      return res.status(404).json({ error: 'Vacation request not found' })
    }
    
    // Update status to approved
    await db('vacation_requests')
      .where({ id })
      .update({
        status: 'approved',
        comments: comments || null
      })
    
    // Fetch updated request with user info
    const request = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .where('vacation_requests.id', '=', id)
      .first()
    
    res.json(request)
  } catch (error) {
    console.error('Error approving vacation request:', error)
    res.status(500).json({ error: 'Failed to approve vacation request', message: error.message })
  }
})

// PATCH reject vacation request
router.patch('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const { comments } = req.body
    
    // Check if request exists
    const existingRequest = await db('vacation_requests').where({ id }).first()
    if (!existingRequest) {
      return res.status(404).json({ error: 'Vacation request not found' })
    }
    
    // Update status to rejected (comments are optional)
    await db('vacation_requests')
      .where({ id })
      .update({
        status: 'rejected',
        comments: comments || null
      })
    
    // Fetch updated request with user info
    const request = await db('vacation_requests')
      .join('users', 'vacation_requests.user_id', '=', 'users.id')
      .select(
        'vacation_requests.*',
        'users.name as user_name',
        'users.role as user_role'
      )
      .where('vacation_requests.id', '=', id)
      .first()
    
    res.json(request)
  } catch (error) {
    console.error('Error rejecting vacation request:', error)
    res.status(500).json({ error: 'Failed to reject vacation request', message: error.message })
  }
})

export default router
