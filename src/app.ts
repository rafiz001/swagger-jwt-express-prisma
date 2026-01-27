import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.spec'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

// Other middleware
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger UI
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Authentication API Documentation'
}))

// Serve Swagger JSON specification
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(swaggerSpec)
})


// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Auth API'
  })
})
/*
// 404 handler
app.use('*', (req, res) => { 
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})
*/

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export default app