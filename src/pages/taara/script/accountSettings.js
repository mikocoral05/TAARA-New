import { ref, onMounted } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import {
  logInDetails,
  getPublicUser,
  updatePublicUserDetails,
  updatePublicUserEmailAddress,
  updatePublicUserPassword,
} from 'src/composable/taaraComposable'
import { resizeImage, Email, sendTelerivetSms } from 'src/composable/simpleComposable'

export default {
  components: {
    TaaraFooter,
  },
  setup() {
    let more = ref(false)
    let userInfo = ref({})
    let dummyPassword = ref('*******************')
    let newPassword = ref()
    let retypePassword = ref()
    let emailOrPassProgress = ref(0)
    let emailOrPass = ref(false)
    let newEmailAddress = ref(null)
    let tab = ref(1)
    let code = ref(null)
    let referenceCode = ref(Math.floor(1000 + Math.random() * 9000))

    const countdownTime = ref(2 * 60) // 2 minutes in seconds
    let timerId = null
    let minutes = ref(2)
    let seconds = ref(0)

    const handleFileUpload = (event, param) => {
      const files = event.target.files
      const file = files[0]
      param == 'profileImage'
        ? (userInfo.value.user_image_name = file.name)
        : (userInfo.value.valid_id_name = file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resizeImage(file, 500, 500)
          .then(({ dataUrl }) => {
            more.value = true
            if (param == 'profileImage') {
              userInfo.value.image = dataUrl
            } else {
              userInfo.value.valid_id = dataUrl
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }
    let imageShow = () => {
      document.getElementById('file').click()
    }

    let changeEmailMess = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],<br><br> Hello, <br><br>We received a request to change your Email Address. <br> If you made this request, please use the code below to change your Email.<br><br><b>Your verification code is: ' +
        +referenceCode.value +
        '</b><br><br> If you did not do this, please ignore this message.<br><br>Please note that this verification code does not have an expiration unless you request another one.<br><br>Best regards, Tabaco Animal Rescue and Adoption'
      )
    }
    let changeSmsMess = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],\n\n Hello, \n\nWe received a request to change your Email Address. \n If you made this request, please use the code below to change your Email.\n\nYour verification code is: ' +
        +referenceCode.value +
        '\n\n If you did not do this, please ignore this message.\n\nPlease note that this verification code does not have an expiration unless you request another one.\n\nBest regards, Tabaco Animal Rescue and Adoption'
      )
    }
    let changeEmail = () => {
      emailOrPassProgress.value = 1
      startCountdown()
      Email.send({
        SecureToken: 'e16c5656-79fd-4b50-8411-d2cbfcff3662',
        To: userInfo.value.email_address,
        From: 'michaelangelo.corral.personal@gmail.com',
        Subject: 'Password Reset Request',
        Body: changeEmailMess(),
      }).then((message) => console.log(message))
      emailOrPass.value = false
      sendTelerivetSms(userInfo.value.phone_number, changeSmsMess())
    }
    let resetPassMessageEmail = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],<br><br> Hello, <br><br>We received a request to reset your password for your account associated with this email address.<br> If you made this request, please use the code below to change your password.<br><br><b>Your verification code is:' +
        +referenceCode.value +
        '</b><br><br> If you did not do this, please ignore this message.<br><br>Please note that this verification code does not have an expiration unless you request another one.<br><br>Best regards, Tabaco Animal Rescue and Adoption'
      )
    }
    let resetPassMessageSms = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],\n\nHello,\n\nWe received a request to reset your password for your account associated with this phone number. If you made this request, please use the code below to change your password.\n\nYour verification code is: ' +
        referenceCode.value +
        '\n\nIf you did not do this, please ignore this message. Please note that this verification code does not have an expiration unless you request another one.\n\nBest regards, Tabaco Animal Rescue and Adoption'
      )
    }
    let changePass = () => {
      emailOrPassProgress.value = 1
      Email.send({
        SecureToken: 'e16c5656-79fd-4b50-8411-d2cbfcff3662',
        To: userInfo.value.email_address,
        From: 'michaelangelo.corral.personal@gmail.com',
        Subject: 'Password Reset Request',
        Body: resetPassMessageEmail(),
      }).then((message) => console.log(message))
      startCountdown()
      emailOrPass.value = true
      sendTelerivetSms(userInfo.value.phone_number, resetPassMessageSms())
    }

    const startCountdown = () => {
      countdownTime.value = 2 * 60 // reset to 10 seconds for testing
      minutes.value = Math.floor(countdownTime.value / 60)
      seconds.value = countdownTime.value % 60

      if (timerId) {
        clearInterval(timerId) // clear existing timer if any
      }

      timerId = setInterval(() => {
        if (countdownTime.value > 0) {
          countdownTime.value--
          minutes.value = Math.floor(countdownTime.value / 60)
          seconds.value = countdownTime.value % 60
        }

        if (countdownTime.value <= 0) {
          clearInterval(timerId)
        }
      }, 1000)
    }
    let resendVerification = () => {
      if (emailOrPassProgress.value == 1) {
        changeEmail()
        startCountdown()
      } else {
        changePass()
        startCountdown()
      }
      startCountdown()
    }
    let confirmCode = () => {
      if (referenceCode.value == code.value) {
        if (emailOrPass.value == false) {
          emailOrPassProgress.value = 2
        } else if (emailOrPass.value == true) {
          emailOrPassProgress.value = 3
        }
      }
    }
    let updateChange = () => {
      if (emailOrPass.value == false) {
        updatePublicUserEmailAddress(newEmailAddress.value, logInDetails.value[0].user_id)
          .then((response) => {
            if (response == 'success') {
              emailOrPassProgress.value = 0
              userInfo.value.email_address = newEmailAddress.value
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (emailOrPass.value == true) {
        updatePublicUserPassword(newPassword.value, logInDetails.value[0].user_id)
          .then((response) => {
            if (response == 'success') {
              emailOrPassProgress.value = 0
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }

    onMounted(() => {
      getPublicUser(logInDetails.value[0].user_id)
        .then((response) => {
          userInfo.value = { ...response }
        })
        .catch((error) => {
          console.log(error)
        })
      // if (route.query.hasOwnProperty('my-account') == true) {
      //   tab.value = 1
      // } else {
      //   tab.value = 2
      // }
    })

    return {
      isPwd: ref(false),
      newPassword,
      retypePassword,
      changePass,
      minutes,
      seconds,
      code,
      referenceCode,
      updateChange,
      newEmailAddress,
      confirmCode,
      resendVerification,
      changeEmail,
      userInfo,
      handleFileUpload,
      imageShow,
      more,
      tab,
      TaaraFooter,
      logInDetails,
      updatePublicUserDetails,
      dummyPassword,
      emailOrPassProgress,
      sex_options: [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
      ],
      civil_status_options: [
        {
          label: 'Single',
          value: 'Single',
        },
        {
          label: 'Married',
          value: 'Married',
        },
        {
          label: 'Seperated',
          value: 'Seperated',
        },
      ],
    }
  },
}
