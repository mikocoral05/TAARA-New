import { ref } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { resizeImage, Email, sendTelerivetSms, getImageLink } from 'src/composable/simpleComposable'
import { logInDetails } from 'src/composable/taaraComposable'
import { globalStore } from 'src/stores/global-store'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getPublicUserInfo,
  updatePublicUserDetails,
  updatePublicUserEmailAddress,
  updatePublicUserPassword,
} from 'src/composable/latestPublicComposable'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'
import { checkEmail, sendChangeEmail } from 'src/composable/latestComposable'
import { watchEffect } from 'vue'

export default {
  components: {
    TaaraFooter,
  },
  setup() {
    const $q = useQuasar()
    const store = globalStore()
    const more = ref(false)
    const userInfo = ref({ ...store.userData })
    const dummyPassword = ref('*******************')
    const newPassword = ref(null)
    const retypePassword = ref(null)
    const emailOrPassProgress = ref(4)
    const emailOrPass = ref(false)
    const newEmailAddress = ref(null)
    const tab = ref(1)
    const myFile = ref(null)
    const code = ref(null)
    const referenceCode = ref(Math.floor(1000 + Math.random() * 9000))

    const countdownTime = ref(2 * 60) // 2 minutes in seconds
    let timerId = null
    const minutes = ref(2)
    const seconds = ref(0)
    const emailOrPhone = ref(0)
    const loadingVar = ref(false)
    const changeEmailOrPass = ref(2)
    const showErrorEmailExist = ref(false)
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

    const changeSmsMess = () => {
      return (
        `Hello ${userInfo.value.first_name},\n\n` +
        `We received a request to change the email address associated with your TAARA account. ` +
        `To confirm this change, please use the verification code below:\n\n` +
        `Verification Code: ${referenceCode.value}\n\n` +
        `If you did not request this change, please ignore this message or contact support.\n\n` +
        `- Tabaco Animal Rescue and Adoption (TAARA)`
      )
    }

    const changeEmail = async () => {
      emailOrPassProgress.value = 1
      startCountdown()
      const response = await sendChangeEmail()
      if (response.status == 'success') {
        //
      }
      //  emailOrPass.value = false
      sendTelerivetSms(userInfo.value.phone_number, changeSmsMess())
    }
    const resetPassMessageEmail = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],<br><br> Hello, <br><br>We received a request to reset your password for your account associated with this email address.<br> If you made this request, please use the code below to change your password.<br><br><b>Your verification code is:' +
        +referenceCode.value +
        '</b><br><br> If you did not do this, please ignore this message.<br><br>Please note that this verification code does not have an expiration unless you request another one.<br><br>Best regards, Tabaco Animal Rescue and Adoption'
      )
    }
    const resetPassMessageSms = () => {
      return (
        'Dear [' +
        userInfo.value.first_name +
        '],\n\nHello,\n\nWe received a request to reset your password for your account associated with this phone number. If you made this request, please use the code below to change your password.\n\nYour verification code is: ' +
        referenceCode.value +
        '\n\nIf you did not do this, please ignore this message. Please note that this verification code does not have an expiration unless you request another one.\n\nBest regards, Tabaco Animal Rescue and Adoption'
      )
    }
    const changePass = () => {
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

    const sendEmailOrPhoneOtp = async (base) => {
      emailOrPhone.value = base
      loadingVar.value = true
      if (base == 1) {
        const response = await sendChangeEmail(userInfo.value.email_address, referenceCode.value)
        emailOrPassProgress.value = response.status == 'success' ? 2 : 1
      } else {
        const response = await sendTelerivetSms(userInfo.value.phone_number, changeSmsMess())
        emailOrPassProgress.value = response.status == 'success' ? 2 : 1
      }
      loadingVar.value = false
    }

    const resendVerification = () => {
      if (emailOrPassProgress.value == 1) {
        changeEmail()
        startCountdown()
      } else {
        changePass()
        startCountdown()
      }
      startCountdown()
    }

    const confirmCode = () => {
      if (referenceCode.value == code.value) {
        emailOrPassProgress.value = changeEmailOrPass.value == 1 ? 3 : 4
      }
    }

    const updateChange = async () => {
      if (changeEmailOrPass.value == 1) {
        const res = await checkEmail(newEmailAddress.value)
        if (res.data > 0) {
          showErrorEmailExist.value = true
          return
        }
        showErrorEmailExist.value = false
        $q.loading.show({ group: 'update', message: 'Updating new Email address. Please wait ...' })
        const response = await updatePublicUserEmailAddress(
          newEmailAddress.value,
          userInfo.value.user_id,
        )
        $q.loading.show({ group: 'update', message: response.message })
        setTimeout(() => {
          emailOrPassProgress.value = response.status == 'success' ? 0 : 3
          userInfo.value.email_address = newEmailAddress.value
          $q.loading.hide()
        }, 500)
      } else if (changeEmailOrPass.value == 2) {
        $q.loading.show({ group: 'update', message: 'Updating new password. Please wait ...' })
        const response = await updatePublicUserPassword(newPassword.value, userInfo.value.user_id)
        $q.loading.show({ group: 'update', message: response.message })
        setTimeout(() => {
          emailOrPassProgress.value = response.status == 'success' ? 0 : 3
          $q.loading.hide()
        }, 500)
      }
    }

    const updateUserDataFn = async () => {
      $q.loading.show({ group: 'update', message: 'Updating info. Please wait...' })
      const response = await updatePublicUserDetails(userInfo.value)
      setTimeout(() => {
        $q.loading.show({ group: 'update', message: response.message })
      }, 500)
      if (response.status == 'success') {
        const newData = await getPublicUserInfo(userInfo.value.user_id)
        console.log(newData)
        store.userData = newData.data
        sessionStorage.setItem('user_data', JSON.stringify(newData.data))
      }
      setTimeout(() => {
        $q.loading.hide()
      }, 1000)
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(userInfo.value.file)
      console.log(previewImage.value)
    }

    const triggerUpload = () => {
      myFile.value.pickFiles()
    }
    onMounted(() => {
      previewImage.value = store.userData.image_path
      console.log(previewImage.value)
    })
    const minSixLenght = ref(false)
    const includeNumber = ref(false)
    watchEffect(() => {
      minSixLenght.value = newPassword.value?.length > 5
      includeNumber.value = /\d/.test(newPassword.value)
    })
    return {
      minSixLenght,
      includeNumber,
      showErrorEmailExist,
      changeEmailOrPass,
      loadingVar,
      emailOrPhone,
      sendEmailOrPhoneOtp,
      triggerUpload,
      myFile,
      previewImage,
      imageFnUpdate,
      updateUserDataFn,
      nameSuffixes,
      getImageLink,
      store,
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
      more,
      tab,
      TaaraFooter,
      logInDetails,

      dummyPassword,
      emailOrPassProgress,
      sexOption,
      civilStatusOption,
    }
  },
}
