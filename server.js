import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import nodemailer from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'changeme'
const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || GMAIL_USER

let transporter = null
if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    tls: { rejectUnauthorized: false },
    family: 4,
  })
}

// In-memory verification codes: { email: { code, name, expiresAt } }
const verificationCodes = {}

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// Site auth
app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (password === ACCESS_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
})

// Workshop: send verification code
app.post('/api/workshop/send-code', async (req, res) => {
  const { name, email } = req.body
  console.log(`[send-code] Request: name=${name}, email=${email}`)

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' })
  }
  if (!transporter) {
    console.log('[send-code] ERROR: Gmail not configured. GMAIL_USER:', GMAIL_USER ? 'set' : 'NOT SET')
    return res.status(500).json({ success: false, message: 'Email service not configured' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  verificationCodes[email] = { code, name, expiresAt: Date.now() + 10 * 60 * 1000 }
  console.log(`[send-code] Code for ${email}: ${code}`)

  try {
    await transporter.sendMail({
      from: `Kiro Workshop <${GMAIL_USER}>`,
      to: email,
      subject: 'Kiro Workshop — Your Verification Code',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:2rem">
          <h2 style="color:#1e293b;margin-bottom:0.5rem">🛠️ Kiro Workshop Access</h2>
          <p style="color:#64748b;font-size:0.9rem">Hi ${name},</p>
          <p style="color:#64748b;font-size:0.9rem">Your verification code is:</p>
          <div style="background:#f1f5f9;border-radius:8px;padding:1.2rem;text-align:center;margin:1rem 0">
            <span style="font-size:2rem;font-weight:700;letter-spacing:0.3em;color:#1e293b">${code}</span>
          </div>
          <p style="color:#94a3b8;font-size:0.8rem">This code expires in 10 minutes.</p>
        </div>
      `,
    })
    console.log(`[send-code] Email sent to ${email}`)
    res.json({ success: true })
  } catch (err) {
    console.error('[send-code] Failed:', err.message)
    res.status(500).json({ success: false, message: 'Failed to send email: ' + err.message })
  }
})

// Workshop: verify code
app.post('/api/workshop/verify-code', (req, res) => {
  const { email, code } = req.body
  const entry = verificationCodes[email]

  if (!entry) {
    return res.status(401).json({ success: false, message: 'No code found for this email. Request a new one.' })
  }
  if (Date.now() > entry.expiresAt) {
    delete verificationCodes[email]
    return res.status(401).json({ success: false, message: 'Code expired. Request a new one.' })
  }
  if (entry.code !== code) {
    return res.status(401).json({ success: false, message: 'Invalid code' })
  }

  delete verificationCodes[email]
  res.json({ success: true, name: entry.name })
})

// Workshop: submit knowledge check results
app.post('/api/workshop/submit-results', async (req, res) => {
  const { name, email, score, total, pct, passed, answers, questions } = req.body

  if (!transporter) {
    return res.status(500).json({ success: false, message: 'Email service not configured' })
  }

  const rows = questions.map((q, i) => {
    const userAnswer = answers[q.id] !== undefined ? q.options[answers[q.id]] : 'Not answered'
    const correctAnswer = q.options[q.correct]
    const isCorrect = answers[q.id] === q.correct
    return `<tr>
      <td style="padding:8px;border:1px solid #e2e8f0;vertical-align:top;width:40%;font-size:0.85rem">${i + 1}. ${q.question}</td>
      <td style="padding:8px;border:1px solid #e2e8f0;color:${isCorrect ? '#16a34a' : '#dc2626'};font-size:0.85rem">${userAnswer}</td>
      <td style="padding:8px;border:1px solid #e2e8f0;font-size:0.85rem">${correctAnswer}</td>
      <td style="padding:8px;border:1px solid #e2e8f0;text-align:center">${isCorrect ? '✅' : '❌'}</td>
    </tr>`
  }).join('')

  const explanations = questions.map((q, i) =>
    `<div style="margin-bottom:0.8rem"><div style="font-weight:600;font-size:0.85rem;color:#1e293b">${i + 1}. ${q.question}</div><div style="font-size:0.82rem;color:#64748b">${q.explanation}</div></div>`
  ).join('')

  const now = new Date().toLocaleString()
  const resultHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:2rem">
      <h2 style="color:#1e293b">Kiro Workshop — Knowledge Check Results</h2>
      <p style="color:#64748b;font-size:0.9rem">Participant: <strong>${name}</strong> (${email})<br/>Date: ${now}</p>
      <div style="padding:1rem;border-radius:8px;text-align:center;margin:1rem 0;font-size:1.1rem;font-weight:600;${passed ? 'background:#f0fdf4;border:2px solid #22c55e;color:#16a34a' : 'background:#fef2f2;border:2px solid #ef4444;color:#dc2626'}">
        Score: ${score} / ${total} (${pct}%) — ${passed ? 'PASSED ✅' : 'NEEDS REVIEW ❌'}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem">
        <thead><tr style="background:#f1f5f9">
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:0.85rem">Question</th>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:0.85rem">Answer</th>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;font-size:0.85rem">Correct</th>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:center;font-size:0.85rem">Result</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="padding:1rem;background:#f8fafc;border-radius:6px">
        <h3 style="font-size:1rem;color:#1e293b;margin-bottom:0.5rem">Answer Explanations</h3>
        ${explanations}
      </div>
    </div>
  `

  try {
    // Send to participant
    await transporter.sendMail({
      from: `Kiro Workshop <${GMAIL_USER}>`,
      to: email,
      subject: `Kiro Workshop Results — ${passed ? 'PASSED' : 'Needs Review'} (${pct}%)`,
      html: resultHtml,
    })

    // Send to admin
    if (ADMIN_EMAIL && ADMIN_EMAIL !== email) {
      await transporter.sendMail({
        from: `Kiro Workshop <${GMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: `[Workshop Result] ${name} — ${score}/${total} (${pct}%)`,
        html: resultHtml,
      })
    }

    console.log(`[submit-results] Results sent for ${name} (${email}): ${score}/${total}`)
    res.json({ success: true })
  } catch (err) {
    console.error('[submit-results] Failed:', err.message)
    res.status(500).json({ success: false, message: 'Failed to send results email' })
  }
})

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`GMAIL_USER: ${GMAIL_USER ? 'set' : 'NOT SET'}`)
  console.log(`GMAIL_APP_PASSWORD: ${GMAIL_APP_PASSWORD ? 'set' : 'NOT SET'}`)
  console.log(`ADMIN_EMAIL: ${ADMIN_EMAIL || 'NOT SET'}`)
})
