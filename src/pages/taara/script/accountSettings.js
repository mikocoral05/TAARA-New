import { ref, watch } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { sendTelerivetSms, getImageLink } from 'src/composable/simpleComposable'
import { logInDetails } from 'src/composable/taaraComposable'
import { globalStore } from 'src/stores/global-store'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getPublicUserInfo,
  udpateUserInfo,
  updatePublicUserEmailAddress,
  updatePublicUserImage,
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
    const emailOrPassProgress = ref(0)
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
    const changeEmailOrPass = ref(1)
    const showErrorEmailExist = ref(false)
    const minSixLenght = ref(false)
    const includeNumber = ref(false)
    const showErrorPassRequirement = ref(false)

    const changeSmsMess = (type = 1) => {
      const name = userInfo.value.first_name
      const code = referenceCode.value

      if (type === 1) {
        return (
          `Hello ${name},\n\n` +
          `We received a request to change the email address associated with your TAARA account. ` +
          `To confirm this change, please use the verification code below:\n\n` +
          `Verification Code: ${code}\n\n` +
          `If you did not request this change, please ignore this message or contact support.\n\n` +
          `- Tabaco Animal Rescue and Adoption (TAARA)`
        )
      }

      if (type === 2) {
        return (
          `Hello ${name},\n\n` +
          `We received a request to reset the password for your TAARA account. ` +
          `To proceed, please use the verification code below:\n\n` +
          `Verification Code: ${code}\n\n` +
          `If you did not request this, please ignore this message or contact support.\n\n` +
          `- Tabaco Animal Rescue and Adoption (TAARA)`
        )
      }

      return ''
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
        startCountdown()
      } else {
        const response = await sendTelerivetSms(
          userInfo.value.phone_number,
          changeSmsMess(changeEmailOrPass.value),
        )
        emailOrPassProgress.value = response.status == 'success' ? 2 : 1
        startCountdown()
      }
      loadingVar.value = false
    }

    const resendVerification = () => {
      sendEmailOrPhoneOtp(emailOrPhone.value)
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
        if (!minSixLenght.value || !includeNumber.value) {
          showErrorPassRequirement.value = true
          return
        }
        showErrorPassRequirement.value = false
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
      const response = await udpateUserInfo(userInfo.value)
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

    watch(
      () => userInfo.value.file,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          $q.loading.show({ group: 'update', message: 'Update your image. Please wait ...' })
          const response = await updatePublicUserImage(newVal, userInfo.value.user_id)
          $q.loading.show({ group: 'update', message: response.message })
          if (response.status == 'success') {
            const newData = await getPublicUserInfo(userInfo.value.user_id)
            console.log(newData)
            store.userData = newData.data
            sessionStorage.setItem('user_data', JSON.stringify(newData.data))
          }
          setTimeout(() => {
            $q.loading.hide()
          }, 500)
        }
      },
    )

    watchEffect(() => {
      minSixLenght.value = newPassword.value?.length > 5
      includeNumber.value = /\d/.test(newPassword.value)
    })
    return {
      showErrorPassRequirement,
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
      // changePass,
      minutes,
      seconds,
      code,
      referenceCode,
      updateChange,
      newEmailAddress,
      confirmCode,
      resendVerification,
      userInfo,
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
