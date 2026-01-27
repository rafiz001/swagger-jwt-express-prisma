import { Request, Response, NextFunction } from 'express'
import { isValidEmail, isValidPassword, isValidRole } from '../utils/validators'
import { Role } from '@prisma/client'

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    })
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
    })
  }

  if (role && !isValidRole(role)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid role specified' 
    })
  }

  next()
}

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    })
  }

  next()
}