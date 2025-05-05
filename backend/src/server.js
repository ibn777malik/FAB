// backend/src/server.js
const express = require('express')
const { loadJson } = require('./dao/jsonDao')
const cors = require('cors')      

// Create the Express app
const app = express()
const PORT = process.env.PORT || 4000

// Routes
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middleware/authMiddleware')
const rolesRoutes = require('./routes/roles')
const propertiesRoutes = require('./routes/properties')

// Add CORS middleware *before* any routes:
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}))

// Middlewares
app.use(express.json())  // parse JSON bodies (only need this once)

// Public endpoints
app.get('/', (req, res) => res.send('Welcome to the CRM API'))
app.get('/health', (req, res) => res.send('OK'))
app.get('/test/users', async (req, res) => {
  const users = await loadJson('users.json')
  res.json(users)
})

// Auth routes (register & login)
app.use('/auth', authRoutes)

// Public property routes
app.get('/api/properties', async (req, res) => {
  const properties = await loadJson('properties.json')
  res.json(properties)
})

app.get('/api/properties/:id', async (req, res) => {
  const properties = await loadJson('properties.json')
  const property = properties.find(p => p.id === req.params.id)
  if (!property) return res.status(404).json({ message: 'Property not found.' })
  res.json(property)
})

// Protected API routes
app.use('/api/roles', authMiddleware, rolesRoutes)

// Use the protected property routes for all other property operations
// This will only apply to POST, PUT, DELETE since we've handled GET separately
app.use('/api/properties', authMiddleware, propertiesRoutes)

// Start server
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`))