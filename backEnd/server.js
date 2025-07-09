import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

// Route imports
import journalsRouter from './routes/journals.js'
import journalLinesRouter from './routes/journalLines.js'
import segmentsRouter from './routes/segments.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Health Check
app.get('/api/ping', (req, res) => {
  res.json({ message: '✅ OK' })
})

// Routes
app.use('/api/journals', journalsRouter)
app.use('/api/journal-lines', journalLinesRouter)
app.use('/api', segmentsRouter)   // ✅ энэ мөр л гол

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`)
})
