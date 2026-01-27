import { User, Role } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'

// Extend JwtPayload interface
export interface IJwtPayload extends JwtPayload {
  userId: string
  email: string
  role: Role
}

export interface IUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: Role
  isActive: boolean
  lastLogin: Date | null // Make sure this matches the Prisma schema
  createdAt: Date
  updatedAt: Date
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface IRegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: Role
}

export interface IAuthResponse {
  success: boolean
  message: string
  data?: {
    user: IUser
    token: string
    refreshToken: string
  }
  error?: string
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload
    }
  }
}