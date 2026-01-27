import express from 'express'
import dotenv from 'dotenv'

// Load environment variables FIRST
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 1. Basic middleware without any patterns first
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 2. Test with NO CORS first
// app.use(cors()) // Comment out for now

// 3. Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' })
})

// 4. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// 5. Import and use routes ONE BY ONE
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)

// 6. 404 handler - Fix this pattern
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found: ' + req.originalUrl
  })
})

// 7. Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`)
  console.log(`🔗 Test: http://localhost:${PORT}/test`)
  console.log(`🔗 Health: http://localhost:${PORT}/health`)
})

export default app