import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET all vacations
router.get('/', async (req, res) => {
  try {
    const vacations = await db('vacations').select('*')
    res.json(vacations)
  } catch (error) {
    console.error('Error fetching vacations:', error)
    res.status(500).json({ error: 'Failed to fetch vacations' })
  }
})

// GET vacation by ID
router.get('/:id', async (req, res) => {
  try {
    const vacation = await db('vacations')
      .where({ id: req.params.id })
      .first()
    
    if (!vacation) {
      return res.status(404).json({ error: 'Vacation not found' })
    }
    
    res.json(vacation)
  } catch (error) {
    console.error('Error fetching vacation:', error)
    res.status(500).json({ error: 'Failed to fetch vacation' })
  }
})

// POST create new vacation
router.post('/', async (req, res) => {
  try {
    const [vacation] = await db('vacations')
      .insert(req.body)
      .returning('*')
    
    res.status(201).json(vacation)
  } catch (error) {
    console.error('Error creating vacation:', error)
    res.status(500).json({ error: 'Failed to create vacation' })
  }
})

// PUT update vacation
router.put('/:id', async (req, res) => {
  try {
    const [vacation] = await db('vacations')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*')
    
    if (!vacation) {
      return res.status(404).json({ error: 'Vacation not found' })
    }
    
    res.json(vacation)
  } catch (error) {
    console.error('Error updating vacation:', error)
    res.status(500).json({ error: 'Failed to update vacation' })
  }
})

// DELETE vacation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('vacations')
      .where({ id: req.params.id })
      .del()
    
    if (!deleted) {
      return res.status(404).json({ error: 'Vacation not found' })
    }
    
    res.json({ message: 'Vacation deleted successfully' })
  } catch (error) {
    console.error('Error deleting vacation:', error)
    res.status(500).json({ error: 'Failed to delete vacation' })
  }
})

export default router
