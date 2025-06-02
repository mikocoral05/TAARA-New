import { onlineEndpoint } from 'src/boot/axios'
import { globalStore } from 'src/stores/global-store'
import { ref } from 'vue'

let date = new Date()
let dateToday = date.toISOString().slice(0, 10)
let dayToday = ref(date.getDate())
let monthToday = date.getMonth() + 1
let yearToday = date.getFullYear()

let hours = date.getHours().toString().padStart(2, '0')
let minutes = date.getMinutes().toString().padStart(2, '0')
let seconds = date.getSeconds().toString().padStart(2, '0')
let timeNow = `${hours}:${minutes}:${seconds}`
const store = globalStore()

export const wordifyDate = (param) => {
  if (param != null) {
    var date = new Date(param)
    var d = date.getDate()
    var m = date.getMonth() + 1
    var y = date.getFullYear()
    var mthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return mthNames[m - 1] + ' ' + d + ', ' + y
  } else {
    return 'N/a'
  }
}

export const wordifyTime = (time) => {
  if (time != null && time.includes(':')) {
    let timeString = time
    let timeParts = timeString.split(':')
    let d = new Date()
    d.setHours(timeParts[0])
    d.setMinutes(timeParts[1])
    d.setSeconds(timeParts[2])
    let hours = d.getHours()
    let minutes = d.getMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    let strTime = hours + ':' + minutes + ' ' + ampm
    return strTime
  } else {
    return 'N/a'
  }
}

export const timeAgo = (date, time) => {
  var dateTimeString = date + 'T' + time
  var givenDate = new Date(dateTimeString)
  var currentDate = new Date()
  var difference = currentDate - givenDate
  var secondsDifference = Math.floor(difference / 1000)
  var minutesDifference = Math.floor(secondsDifference / 60)
  var hoursDifference = Math.floor(minutesDifference / 60)
  var daysDifference = Math.floor(hoursDifference / 24)
  var weeksDifference = Math.floor(daysDifference / 7)
  var monthsDifference = Math.floor(daysDifference / 30.44) // Approximation
  var yearsDifference = Math.floor(daysDifference / 365.25) // Approximation
  if (yearsDifference > 0) {
    return yearsDifference + (yearsDifference === 1 ? ' year ago' : ' years ago')
  } else if (monthsDifference > 0) {
    return monthsDifference + (monthsDifference === 1 ? ' month ago' : ' months ago')
  } else if (weeksDifference > 0) {
    return weeksDifference + (weeksDifference === 1 ? ' week ago' : ' weeks ago')
  } else if (daysDifference > 0) {
    return daysDifference + (daysDifference === 1 ? ' day ago' : ' days ago')
  } else if (hoursDifference > 0) {
    return hoursDifference + (hoursDifference === 1 ? ' hour ago' : ' hours ago')
  } else if (minutesDifference > 0) {
    return minutesDifference + (minutesDifference === 1 ? ' minute ago' : ' minutes ago')
  } else {
    return secondsDifference + (secondsDifference === 1 ? ' second ago' : ' seconds ago')
  }
}

export const threeWordsAbbMonth = [
  { month: 'Jan' },
  { month: 'Feb' },
  { month: 'Mar' },
  { month: 'Apr' },
  { month: 'May' },
  { month: 'Jun' },
  { month: 'Jul' },
  { month: 'Aug' },
  { month: 'Sep' },
  { month: 'Oct' },
  { month: 'Nov' },
  { month: 'Dec' },
]

export const twoWordsAbbMonth = [
  { month: 'Jn' },
  { month: 'Fb' },
  { month: 'Mr' },
  { month: 'Ap' },
  { month: 'My' },
  { month: 'Jn' },
  { month: 'Jl' },
  { month: 'Au' },
  { month: 'Sp' },
  { month: 'Oc' },
  { month: 'Nv' },
  { month: 'Dc' },
]

export const monthNames = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

export const getAge = (birthDate) => {
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  const ageInMonths = (today - birthDateObj) / (1000 * 60 * 60 * 24 * 30.44) // Approximate months

  if (ageInMonths < 24) {
    return 'Infant'
  } else if (ageInMonths < 84) {
    return 'Adult'
  } else {
    return 'Senior'
  }
}

export const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    var img = document.createElement('img')
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var reader = new FileReader()
    reader.onload = function (e) {
      img.src = e.target.result
      img.onload = function () {
        var width = img.width
        var height = img.height
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        console.log(file.name)
        resolve({ dataUrl: canvas.toDataURL(file.type), fileName: file.name })
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const switchCaseSize = (payload) => {
  if (Number.isInteger(payload)) {
    if (payload == 1) {
      return 'Small'
    } else if (payload == 2) {
      return 'Normal'
    } else if (payload == 3) {
      return 'Big'
    }
  }
}

export const wordifySex = (payload) => {
  if (payload == 1) {
    return 'Male'
  } else {
    return 'Female'
  }
}

export const wordifyCurrentState = (payload) => {
  if (payload == 1) {
    return 'Ready for Adoption'
  } else if (payload == 2) {
    return 'Under Rehabilitation'
  } else if (payload == 3) {
    return 'Under Medication'
  }
}

export const wordifyGoodWith = (payload) => {
  if (payload == 1) {
    return 'People'
  } else if (payload == 2) {
    return 'Animals'
  } else if (payload == 3) {
    return 'Bothh Animals and People '
  }
}

export const goodWith = (payload) => {
  if (payload == 1) {
    return 'People'
  } else if (payload == 2) {
    return 'Animals'
  } else if (payload == 3) {
    return 'Both animals and people'
  }
}

export const formatNumber = (number, based = '') => {
  number = Number(number)

  if (based === 'noDecimal') {
    return '₱ ' + number.toLocaleString('en-US')
  }

  return (
    '₱ ' +
    number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

export const formatOrNumber = (number) => {
  number = Number(number)
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const weekCount = (year, month_number, startDayOfWeek) => {
  // month_number is in the range 1..12
  // Get the first day of the week (0: Sunday, 1: Monday, ...)
  const firstDayOfWeek = startDayOfWeek || 0
  const firstOfMonth = new Date(year, month_number - 1, 1)
  const lastOfMonth = new Date(year, month_number, 0)
  const numberOfDaysInMonth = lastOfMonth.getDate()
  const firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7
  const used = firstWeekDay + numberOfDaysInMonth
  return Math.ceil(used / 7)
}

export const calculateAge = (birthDate) => {
  birthDate = new Date(birthDate)
  let today = new Date()

  let years = today.getFullYear() - birthDate.getFullYear()

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    years--
  }

  let months =
    today.getMonth() -
    birthDate.getMonth() +
    12 * (today.getFullYear() - birthDate.getFullYear()) +
    (today.getDate() >= birthDate.getDate() ? 0 : -1)

  if (years < 1) {
    return months == 1 ? months + ' month old' : months + ' months old'
  } else {
    return years == 1 ? months + ' year old' : months + ' years old'
  }
}

var Email = {
  send: function (a) {
    return new Promise(function (n) {
      a.nocache = Math.floor(1e6 * Math.random() + 1)
      a.Action = 'Send'
      var t = JSON.stringify(a)
      Email.ajaxPost('https://smtpjs.com/v3/smtpjs.aspx?', t, function (e) {
        n(e)
      })
    })
  },
  ajaxPost: function (e, n, t) {
    var a = Email.createCORSRequest('POST', e)
    a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    a.onload = function () {
      var e = a.responseText
      if (t) t(e)
    }
    a.send(n)
  },
  ajax: function (e, n) {
    var t = Email.createCORSRequest('GET', e)
    t.onload = function () {
      var e = t.responseText
      if (n) n(e)
    }
    t.send()
  },
  createCORSRequest: function (method, url) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url, true) // Always use XMLHttpRequest
    return xhr
  },
}

export const removeNumSymbols = (num) => {
  const cleanedNumber = num.replace(/[^\d]/g, '') // Remove non-digit characters
  const finalNumber = cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : cleanedNumber
  return `+63${finalNumber}`
}

export const sendTelerivetSms = async (to, message) => {
  const cleanedTo = removeNumSymbols(to)

  const response = await onlineEndpoint.post('/send-sms', {
    to: cleanedTo,
    message,
  })

  console.log(response.data)

  return response.data
}

export const encodeAnimalId = (id) => {
  const encoded = btoa(id.toString()) // Convert to Base64
  return encoded
}

export const decodeAnimalId = (encoded) => {
  const decoded = atob(encoded) // Convert from Base64

  return parseInt(decoded, 10)
}

export const generateYearList = () => {
  const years = []
  for (let year = 2016; year <= yearToday; year++) {
    years.push(year)
  }
  return years
}

export const isNearExpiration = (expirationDate) => {
  const now = new Date()
  const expiry = new Date(expirationDate)

  const diffInMs = expiry - now
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  return diffInDays >= 0 && diffInDays <= 7
}

export const isExpired = (expirationDate) => {
  // Normalize today's date (midnight, no time)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Try to parse the expiration date
  const expiry = new Date(expirationDate)

  // If invalid date, return false (or handle however you'd like)
  if (isNaN(expiry)) return false

  // Normalize expiry date
  expiry.setHours(0, 0, 0, 0)

  // Return true if the expiration date is before today
  return expiry < today
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const getImageLink = (img) => {
  if (!img) return ''
  if (img.startsWith('http')) {
    return img // Already a full URL
  }
  return `http://localhost/TAARA-Capstone/backend/taara_backend/files/${img}`
}

export const convertDaysToInterval = (days) => {
  if (!days) return ''
  days = parseInt(days)
  if (isNaN(days) || days < 1) return 'Invalid interval'

  const units = {
    year: 365,
    month: 30,
    week: 7,
    day: 1,
  }

  for (const [label, unitDays] of Object.entries(units)) {
    if (days % unitDays === 0) {
      const multiplier = days / unitDays
      const plural = multiplier > 1 ? 's' : ''
      return `Every ${multiplier} ${label}${plural}`
    }
  }

  return `Every ${days} days`
}

export const intervalOptions = [
  { label: 'Every Day', value: 1 },
  { label: 'Every 2 Days', value: 2 },
  { label: 'Every 3 Days', value: 3 },
  { label: 'Every 5 Days', value: 5 },
  { label: 'Every Week', value: 7 },
  { label: 'Every 10 Days', value: 10 },
  { label: 'Every 2 Weeks', value: 14 },
  { label: 'Every 3 Weeks', value: 21 },
  { label: 'Every Month', value: 30 },
  { label: 'Every 6 Weeks', value: 42 },
  { label: 'Every 2 Months', value: 60 },
  { label: 'Every 3 Months', value: 90 },
  { label: 'Every 4 Months', value: 120 },
  { label: 'Every 6 Months', value: 180 },
  { label: 'Every 9 Months', value: 270 },
  { label: 'Every Year', value: 365 },
  { label: 'Every 18 Months', value: 540 },
  { label: 'Every 2 Years', value: 730 },
  { label: 'Every 3 Years', value: 1095 },
]

export const checkUserIfPublic = () => {
  if (Object.keys(store.userData).length != 0) {
    return store.userData?.user_type == 1
  }
  return false
}

import { createWorker } from 'tesseract.js'

export const parseDonationFromImage = async (imageFile, fallbackReference = '') => {
  if (!imageFile) {
    return {
      donation_amount: null,
      reference: `Ref No. ${fallbackReference}`,
      image: null,
      rawText: '',
    }
  }

  // TODO: Implement image resizing here if needed before OCR

  const worker = await createWorker('eng')

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile)

    // Regex to capture amounts with commas and decimals
    const amountRegex = /(Total Amount Sent|Amount|Php)\s*([\d,.]+)/gi
    let match
    const amounts = []

    while ((match = amountRegex.exec(text)) !== null) {
      // Remove commas for correct parsing
      const normalizedAmount = match[2].replace(/,/g, '').trim()
      amounts.push(normalizedAmount)
    }

    // Regex to capture reference number (Ref No.)
    // Matches "Ref No. 0028 843 266741" - capture digits and spaces only
    const refNoRegex = /Ref No\.\s*([\d\s]+)/i
    const refMatch = refNoRegex.exec(text)

    return {
      donation_amount: amounts.length > 0 ? Number(amounts[0]) : null,
      reference: refMatch ? refMatch[1].trim() : `Ref No. ${fallbackReference}`,
      image: null, // Add image data URL here if resizing/processing is implemented
      rawText: text, // For debugging or further processing
    }
  } catch (error) {
    console.error('OCR extraction failed:', error)
    return {
      donation_amount: null,
      reference: `Ref No. ${fallbackReference}`,
      image: null,
      rawText: '',
    }
  } finally {
    await worker.terminate()
  }
}

export const getFileNameFromLink = (link) => {
  if (!link) return ''
  const splitLink = link.split('/')
  const result = splitLink.at(-1)
  return result
}

export const statusColor = (status) => {
  const stringMap = {
    pending: 'bg-orange',
    approved: 'bg-positive q-px-sm',
    disapproved: 'bg-negative q-px-sm',
  }
  const numberMap = {
    1: 'bg-white text-orange-10',
    2: 'bg-white q-px-sm text-positive',
    3: 'bg-white q-px-sm text-positive',
  }
  return typeof status === 'string' ? stringMap[status] : numberMap[status]
}

export const statusIcon = (status) => {
  const stringMap = {
    pending: 'sym_r_assignment',
    approved: 'sym_r_thumb_up',
    disapproved: 'sym_r_thumb_down',
  }

  const numberMap = {
    1: 'sym_r_assignment',
    2: 'sym_r_thumb_up',
    3: 'sym_r_thumb_down',
  }

  return typeof status === 'string' ? stringMap[status] : numberMap[status]
}

export const rescueStatusIcon = (status) => {
  const obj = {
    1: 'sym_r_fact_check',
    2: 'sym_r_notification_multiple',
    3: 'sym_r_fire_truck',
    4: 'sym_r_vaccines',
    5: 'sym_r_deceased',
    6: 'sym_r_outpatient_med',
    7: 'sym_r_real_estate_agent',
    8: 'sym_r_diversity_3',
  }
  return obj[status]
}

export const rescueStatusText = (r_status) => {
  const map = {
    1: 'Reported',
    2: 'Acknowledged',
    3: 'Rescue In Progress',
    4: 'Reached Vet Clinic',
    5: 'Deceased (as declared by vet)',
    6: 'Released (to environment or public)',
    7: 'Now Under Organization’s Care',
    8: 'Returned to Owner',
  }

  return map[r_status]
}

export const donationStatusText = (status) => {
  const map = {
    1: 'Pending',
    2: 'Approved',
    3: 'Disapproved',
  }

  return map[status]
}

export { Email, dateToday, monthToday, yearToday, timeNow, dayToday }
