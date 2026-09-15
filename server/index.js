import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './src/routes/auth.js'
import disciplineRoutes from './src/routes/disciplines.js'
import activityRoutes from './src/routes/activities.js'
import dashboardRoutes from './src/routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/disciplines', disciplineRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Servidor StudyFlow rodando na porta ${PORT} (http://localhost:${PORT})`)
})
