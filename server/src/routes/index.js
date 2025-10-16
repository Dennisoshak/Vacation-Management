import express from 'express'
import vacationRoutes from './vacations.js'

const router = express.Router()

// Mount route modules
router.use('/vacations', vacationRoutes)

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Vacation Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      vacations: '/api/vacations'
    }
  })
})

export default router
