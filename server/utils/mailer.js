const nodemailer = require('nodemailer')

const port = Number(process.env.SMTP_PORT || 587)
const secure = port === 465 // true for 465, false for others
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function verifyTransport() {
  try {
    await transporter.verify()
    console.log('[mail] transporter verified')
  } catch (e) {
    console.error('[mail] transporter verify failed:', e?.message || e)
  }
}

async function sendNotification(email, subject, html) {
  if (!email) throw new Error('Missing recipient email')
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const info = await transporter.sendMail({ from, to: email, subject, html })
  const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
  if (preview) console.log('[mail] preview URL:', preview)
  console.log('[mail] sent messageId:', info?.messageId)
  return info
}

module.exports = { sendNotification, verifyTransport }
