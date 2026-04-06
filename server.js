import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'changeme'

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (password === ACCESS_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
})

app.post('/api/auth-workshop', (req, res) => {
  const { password } = req.body
  const workshopPassword = ACCESS_PASSWORD.split('').reverse().join('')
  if (password === workshopPassword) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, message: 'Invalid workshop password' })
  }
})

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
