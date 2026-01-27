import { Router } from 'express'
import { 
  register, 
  login, 
  refresh, 
  logout, 
  getProfile 
} from '../controllers/auth.controller'
import { 
  authenticate, 
  authorize 
} from '../middleware/auth'
import { 
  validateRegister, 
  validateLogin 
} from '../middleware/validation'
import { Role } from '@prisma/client'

const router = Router()

// Public routes
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// Protected routes
router.get('/profile', authenticate, getProfile)

// Admin only routes
router.get('/admin', authenticate, authorize(Role.ADMIN), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome Admin!',
    user: req.user 
  })
})

// Moderator or Admin routes
router.get('/moderator', authenticate, authorize(Role.ADMIN, Role.MODERATOR), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome Moderator/Admin!',
    user: req.user 
  })
})

export default router