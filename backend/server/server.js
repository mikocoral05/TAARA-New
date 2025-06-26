require('dotenv').config()
const axios = require('axios')
const cron = require('node-cron')
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const multer = require('multer')
const path = require('path')
app.use(express.json())

const cors = require('cors')
app.use(cors())

// The base URL used when responding with image paths
const BASE_URL = 'http://77.37.74.195/images/'

// Storage config
const storage = multer.diskStorage({
  destination: '/var/www/html/images/', // This is your correct path
  filename: (req, file, cb) => {
    // Rename files to something unique if needed
    const uniqueName = `${file.fieldname}_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

// Accept multiple files, even if it's just one
app.post('/upload', upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' })
  }

  const imageUrls = req.files.map((file) => `${BASE_URL}${file.filename}`)
  res.status(200).json({ images: imageUrls })
})

const TELERIVET_API_KEY = process.env.TELERIVET_API_KEY
const TELERIVET_PROJECT_ID = process.env.PROJECT_ID
const sendSMS = async (to, message) => {
  try {
    const res = await axios.post(
      `https://api.telerivet.com/v1/projects/${TELERIVET_PROJECT_ID}/messages/send`,
      {
        to_number: to,
        content: message,
      },
      {
        auth: { username: TELERIVET_API_KEY, password: '' },
      },
    )
    console.log(res)

    console.log(`SMS sent to ${to}:`, message)
  } catch (err) {
    console.error(`Failed to send SMS to ${to}:`, err.response?.data || err.message)
  }
}
//node mailer send email to user
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

app.post('/send-activation-code', (req, res) => {
  const { email, otp } = req.body

  const mailOptions = {
    from: `"TAARA Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Activate Your TAARA Account',
    text: `Hello,\n\nThank you for registering with Tabaco Animal Rescue and Adoption (TAARA). To activate your account, please use the following verification code: ${otp}\n\nIf you did not create an account, please ignore this message.`,
    html: `<p>Hello,</p><p>Thank you for registering with <strong>Tabaco Animal Rescue and Adoption (TAARA)</strong>. To activate your account, please use the following verification code:</p><h2>${otp}</h2><p>If you did not create an account, please ignore this message.</p>`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return res.send({
        status: 'failed',
        message: 'Error sending activation email',
      })
    }

    console.log('Activation email sent: %s', info.messageId)
    return res.send({
      status: 'success',
      message: 'Activation email sent successfully',
    })
  })
})

app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body
  try {
    const response = await axios.post(
      `https://api.telerivet.com/v1/projects/${TELERIVET_PROJECT_ID}/messages/send`,
      {
        to_number: to,
        content: message,
      },
      {
        auth: { username: TELERIVET_API_KEY, password: '' },
      },
    )
    res.json({ status: 'success', data: response.data })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.response?.data || error.message })
  }
})

app.post('/send-change-email-code', (req, res) => {
  const { email, otp } = req.body

  const mailOptions = {
    from: `"TAARA Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Confirm Your New Email Address',
    text: `Hello,\n\nWe received a request to change the email address associated with your TAARA account. To confirm this change, please use the verification code below:\n\nVerification Code: ${otp}\n\nIf you did not request this change, please ignore this message or contact support.`,
    html: `<p>Hello,</p><p>We received a request to change the email address associated with your <strong>TAARA</strong> account. To confirm this change, please use the verification code below:</p><h2>${otp}</h2><p>If you did not request this change, please ignore this message or <a href="mailto:support@example.com">contact support</a>.</p>`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending change-email email:', error)
      return res.send({
        status: 'failed',
        message: 'Error sending change email verification',
      })
    }

    console.log('Change email verification sent: %s', info.messageId)
    return res.send({
      status: 'success',
      message: 'Change email verification sent successfully',
    })
  })
})

app.post('/send-change-password-code', (req, res) => {
  const { email, otp } = req.body

  const mailOptions = {
    from: `"TAARA Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your TAARA Account Password',
    text: `Hello,\n\nWe received a request to reset the password for your TAARA account. Please use the verification code below to proceed:\n\nVerification Code: ${otp}\n\nIf you did not request a password reset, please ignore this message or contact support.`,
    html: `
      <p>Hello,</p>
      <p>We received a request to reset the password for your <strong>TAARA</strong> account. Please use the verification code below to proceed:</p>
      <h2>${otp}</h2>
      <p>If you did not request a password reset, please ignore this message or <a href="mailto:support@example.com">contact support</a>.</p>
    `,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending change-password email:', error)
      return res.send({
        status: 'failed',
        message: 'Error sending password reset verification',
      })
    }

    console.log('Password reset verification sent: %s', info.messageId)
    return res.send({
      status: 'success',
      message: 'Password reset verification sent successfully',
    })
  })
})

const notifyManagement = async (title, message) => {
  try {
    const res = await axios.post('https://vps.convertevue.com/taara_backend/API/new_api.php', {
      notify_management: { title, message },
    })
    console.log('✅ POST response:', res.data)
  } catch (error) {
    console.error('❌ Error posting notify_management:', error.response?.data || error.message)
  }
}

cron.schedule(
  '0 8 * * *', // Runs at 8:00 AM daily
  async () => {
    console.log('🔁 Running SMS Cron Job...')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      // 1. Get phone numbers of management users
      const phoneRes = await axios.get(
        'https://vps.convertevue.com/taara_backend/API/new_api.php',
        {
          params: { get_phone_number: 'get_phone_number' },
        },
      )
      const phoneList = phoneRes.data.data || []
      console.log('📱 Phone List:', phoneList)

      // 2. Get expiring inventory items
      const inventoryRes = await axios.get(
        'https://vps.convertevue.com/taara_backend/API/new_api.php',
        {
          params: { expiration_date: 'expiration_date' },
        },
      )
      const allInventory = inventoryRes.data.data || []
      const expiringItems = allInventory.filter((item) => {
        const expDate = new Date(item.expiration_date)
        expDate.setHours(0, 0, 0, 0)
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))
        return [0, 1, 7].includes(diffDays)
      })
      console.log('📦 Filtered Expiring Inventory:', expiringItems)

      // 3. Get animal vet schedules
      const animalRes = await axios.get(
        'https://vps.convertevue.com/taara_backend/API/new_api.php',
        {
          params: { schedule_animal: 'schedule_animal' },
        },
      )
      const allSchedules = animalRes.data.data || []
      const scheduledAnimals = allSchedules.filter((sched) => {
        const schedDate = new Date(sched.scheduled_date)
        schedDate.setHours(0, 0, 0, 0)
        const diffDays = Math.ceil((schedDate - today) / (1000 * 60 * 60 * 24))
        return [0, 1, 7].includes(diffDays)
      })
      console.log('🐾 Filtered Scheduled Animals:', scheduledAnimals)

      // 4. Build combined message
      let message = ''
      const titleParts = []

      if (expiringItems.length > 0) {
        titleParts.push('Inventory Expiring')
        message += '📦 Inventory items expiring soon:\n'
        for (const item of expiringItems) {
          message += `- ${item.item_name} (expires on ${item.expiration_date})\n`
        }
        message += '\n'
      }

      if (scheduledAnimals.length > 0) {
        titleParts.push('Pet Schedules')
        message += '🐾 Upcoming veterinary schedules:\n'
        for (const s of scheduledAnimals) {
          message += `- ${s.schedule_name} (Dose ${s.dose_number}) on ${s.scheduled_date}\n`
        }
      }

      // 5. Notify and send SMS
      if (message.trim()) {
        const title = titleParts.join(' & ') + ' Reminder!'
        await notifyManagement(title, message)

        for (const { phone_number } of phoneList) {
          await sendSMS(phone_number, message)
        }
      } else {
        console.log('✅ No reminders to send today.')
      }
    } catch (err) {
      console.error('❌ Cron job error:', err.message)
    }
  },
  { timezone: 'Asia/Manila' },
)

const port = 3000
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
