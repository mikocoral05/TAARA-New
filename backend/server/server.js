const axios = require('axios')
const cron = require('node-cron')
const express = require('express')

const app = express()
app.use(express.json())
const TELERIVET_PROJECT_ID = 'PJef3fb9be8be70aa4'
const TELERIVET_API_KEY = 'Zz5xo_zavayVyp5cEfgowtdl4PWsP4Tt2NY3'
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

cron.schedule(
  '0 8 * * *', // Runs at 8:00 AM daily
  async () => {
    console.log('🔁 Running SMS Cron Job...')
    const today = new Date()

    try {
      // 1. Get phone numbers of management users
      const phoneRes = await axios.get(
        'http://localhost/TAARA-Capstone/backend/taara_backend/API/new_api.php',
        {
          params: { get_phone_number: 'get_phone_number' },
        },
      )
      const phoneList = phoneRes.data.data // [{ phone_number: '...' }]
      console.log('📱 Phone List:', phoneList)

      // 2. Get expiring inventory items
      const inventoryRes = await axios.get(
        'http://localhost/TAARA-Capstone/backend/taara_backend/API/new_api.php',
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
        'http://localhost/TAARA-Capstone/backend/taara_backend/API/new_api.php',
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

      // 4. Build message
      let message = ''

      if (expiringItems.length > 0) {
        message += '📦 Inventory items expiring soon:\n'
        for (const item of expiringItems) {
          message += `- ${item.item_name} (expires on ${item.expiration_date})\n`
        }
        message += '\n'
      }

      if (scheduledAnimals.length > 0) {
        message += '🐾 Upcoming veterinary schedules:\n'
        for (const s of scheduledAnimals) {
          message += `- ${s.schedule_name} (Dose ${s.dose_number}) on ${s.scheduled_date}\n`
        }
      }

      // 5. Send SMS if any message was built
      if (message.trim()) {
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

const port = 3007
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
