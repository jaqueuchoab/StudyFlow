import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from '../server/src/routes/auth.js'
import disciplineRoutes from '../server/src/routes/disciplines.js'
import activityRoutes from '../server/src/routes/activities.js'
import dashboardRoutes from '../server/src/routes/dashboard.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/disciplines', disciplineRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/dashboard', dashboardRoutes)

export default app
