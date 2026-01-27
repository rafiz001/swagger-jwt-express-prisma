import jwt from 'jsonwebtoken'
import { IJwtPayload } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const generateToken = (payload: IJwtPayload): string => {
  // Explicitly cast the options to avoid TypeScript issues
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
    algorithm: 'HS256'
  }
  
  return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string): IJwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as IJwtPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export const generateRefreshToken = (): string => {
  return require('crypto').randomBytes(40).toString('hex')
}

// Optional: Add token validation
export const validateToken = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

// Optional: Decode token without verification
export const decodeToken = (token: string): IJwtPayload | null => {
  try {
    return jwt.decode(token) as IJwtPayload
  } catch {
    return null
  }
}