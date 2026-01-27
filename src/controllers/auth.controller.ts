import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { 
  generateToken, 
  generateRefreshToken 
} from '../utils/jwt'
import { IAuthResponse, IJwtPayload } from '../types'
import { prisma } from '../lib/db'





const SALT_ROUNDS = 10

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'USER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Generate tokens
    const jwtPayload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const token = generateToken(jwtPayload)
    const refreshToken = generateRefreshToken()

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    // Create log
    await prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    })

    const response: IAuthResponse = {
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token,
        refreshToken
      }
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        refreshTokens: {
          where: {
            expiresAt: { gt: new Date() }
          }
        }
      }
    })

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or account disabled'
      })
      return
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Generate tokens
    const jwtPayload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const token = generateToken(jwtPayload)
    
    // Generate new refresh token
    const refreshToken = generateRefreshToken()
    
    // Invalidate old refresh tokens and save new one
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    })

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Create log
    await prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response: IAuthResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token required'
      })
      return
    }

    // Find valid refresh token
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      })
      return
    }

    // Generate new tokens
    const jwtPayload: IJwtPayload = {
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role
    }

    const newToken = generateToken(jwtPayload)
    const newRefreshToken = generateRefreshToken()

    // Replace old refresh token
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id }
    })

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenRecord.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = tokenRecord.user

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: userWithoutPassword,
        token: newToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    console.error('Refresh error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      })
    }

    // Create log if user is authenticated
    if (req.user) {
      await prisma.userLog.create({
        data: {
          userId: req.user.userId,
          action: 'LOGOUT',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      })
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}