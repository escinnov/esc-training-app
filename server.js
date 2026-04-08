import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { Resend } from 'resend'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'changeme'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

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

// Workshop: register (no email verification, just collect name + email)
app.post('/api/workshop/register', (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' })
  }
  console.log(`[register] Workshop participant: ${name} (${email})`)
  res.json({ success: true })
})

// Workshop: submit knowledge check results (send to admin email via Resend)
app.post('/api/workshop/submit-results', async (req, res) => {
  const { name, email, score, total, pct, passed, answers, questions } = req.body
  console.log(`[submit-results] ${name} (${email}): ${score}/${total} (${pct}%)`)

  if (!resend || !ADMIN_EMAIL) {
    console.log('[submit-results] Resend or ADMIN_EMAIL not configured, skipping email')
    return res.json({ success: true, emailSent: false })
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
    await resend.emails.send({
      from: `Kiro Workshop <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[Workshop Result] ${name} (${email}) — ${score}/${total} (${pct}%)`,
      html: resultHtml,
    })
    console.log(`[submit-results] Email sent to admin for ${name}`)
    res.json({ success: true, emailSent: true })
  } catch (err) {
    console.error('[submit-results] Email failed:', err.message || err)
    res.json({ success: true, emailSent: false })
  }
})

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`RESEND_API_KEY: ${RESEND_API_KEY ? 'set' : 'NOT SET'}`)
  console.log(`ADMIN_EMAIL: ${ADMIN_EMAIL || 'NOT SET'}`)
  console.log(`SENDER_EMAIL: ${SENDER_EMAIL}`)
})
