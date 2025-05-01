import { expressServer } from 'src/boot/axios'
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

function wordifyDate(param) {
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

function wordifyTime(time) {
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

function timeAgo(date, time) {
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

const threeWordsAbbMonth = [
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

const twoWordsAbbMonth = [
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

let monthNames = [
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

function getAge(birthDate) {
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

function resizeImage(file, maxWidth, maxHeight) {
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
let switchCaseSize = (payload) => {
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
let wordifySex = (payload) => {
  if (payload == 1) {
    return 'Male'
  } else {
    return 'Female'
  }
}
let wordifyCurrentState = (payload) => {
  if (payload == 1) {
    return 'Ready for Adoption'
  } else if (payload == 2) {
    return 'Under Rehabilitation'
  } else if (payload == 3) {
    return 'Under Medication'
  }
}
let wordifyGoodWith = (payload) => {
  if (payload == 1) {
    return 'People'
  } else if (payload == 2) {
    return 'Animals'
  } else if (payload == 3) {
    return 'Bothh Animals and People '
  }
}
let goodWith = (payload) => {
  if (payload == 1) {
    return 'People'
  } else if (payload == 2) {
    return 'Animals'
  } else if (payload == 3) {
    return 'Both animals and people'
  }
}

const formatNumber = (number, based = '') => {
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

const formatOrNumber = (number) => {
  number = Number(number)
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function weekCount(year, month_number, startDayOfWeek) {
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
function calculateAge(birthDate) {
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

const removeNumSymbols = (num) => {
  const inputNumber = num
  const cleanedNumber = inputNumber.replace(/[^\d]/g, '') // Remove non-digit characters
  const formattedNumber = `+63${cleanedNumber}`
  console.log(formattedNumber)
  return formattedNumber
}
const sendTelerivetSms = async (phone_number, message) => {
  try {
    const recipientNumber = removeNumSymbols(phone_number)
    const messageContent = message

    const response = await expressServer.post(
      'send-sms',
      {
        recipientNumber,
        messageContent,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Set the correct content type
        },
      },
    )

    console.log('SMS sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending SMS:', error.message)
  }
}
let encodeAnimalId = (id) => {
  const encoded = btoa(id.toString()) // Convert to Base64
  return encoded
}
let decodeAnimalId = (encoded) => {
  const decoded = atob(encoded) // Convert from Base64

  return parseInt(decoded, 10)
}

const generateYearList = () => {
  const years = []
  for (let year = 2016; year <= yearToday; year++) {
    years.push(year)
  }
  return years
}

const isNearExpiration = (expirationDate) => {
  const now = new Date()
  const expiry = new Date(expirationDate)

  const diffInMs = expiry - now
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  return diffInDays >= 0 && diffInDays <= 7
}
const isExpired = (expirationDate) => {
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

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
const getImageLink = (img) => {
  return `http://localhost/TAARA-Capstone/backend/taara_backend/files/${img}`
}

export {
  getImageLink,
  isExpired,
  capitalize,
  isNearExpiration,
  formatOrNumber,
  generateYearList,
  decodeAnimalId,
  encodeAnimalId,
  sendTelerivetSms,
  removeNumSymbols,
  Email,
  getAge,
  calculateAge,
  weekCount,
  dateToday,
  monthToday,
  yearToday,
  timeNow,
  threeWordsAbbMonth,
  twoWordsAbbMonth,
  wordifyDate,
  wordifyTime,
  timeAgo,
  resizeImage,
  switchCaseSize,
  formatNumber,
  monthNames,
  wordifySex,
  goodWith,
  wordifyCurrentState,
  wordifyGoodWith,
  dayToday,
}
