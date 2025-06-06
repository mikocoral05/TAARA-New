import { ref, onBeforeUnmount, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { QSpinnerGears, useQuasar, QSpinnerFacebook } from 'quasar'
import {
  dateToday,
  timeNow,
  Email,
  sendTelerivetSms,
  checkEmailOrPhone,
} from 'src/composable/simpleComposable'
import {
  dearUserEmail,
  changePass,
  logInDetails,
  wrongUserOrPass,
  addUser,
  dearUserName,
  dearUserPhoneNumber,
} from 'src/composable/taaraComposable'
import BubbleChart from 'src/components/BubbleChart.vue'
import {
  changePassword,
  checkEmail,
  checkPhoneNumber,
  checkUsername,
  logIn,
  registerUser,
  sendEmailActiviationOtp,
} from 'src/composable/latestComposable'
import { globalStore } from 'src/stores/global-store'
import { civilStatusOption } from 'src/composable/optionsComposable'
export default {
  components: { BubbleChart },
  setup() {
    const $q = useQuasar()
    const store = globalStore()
    const router = useRouter()
    let fadeValue = ref(false)
    let step = ref(1)
    let code = ref(null)
    const tab = ref('login')
    const includeNumber = ref(false)
    const minSixLenght = ref(false)
    let timer1, timer2
    let miniStep1 = ref(true)
    const userInfo = ref({})
    let miniStep2 = ref(true)
    let miniStep3 = ref(true)
    let miniStep4 = ref(true)
    let aggree = ref(false)
    let miniStep = ref(1)
    let disableProggress = ref(true)
    let email_address = ref(null)
    let password = ref(null)
    let registerRetypePass = ref(null)
    let confirm_password = ref(null)
    let pin = ref(null)
    let changer = ref(0)
    let errorEmail = ref('')
    const showLoginError = ref(false)
    const loadingVar = ref(false)
    const emailOrPhone = ref(0)
    const referenceCode = ref(Math.floor(1000 + Math.random() * 9000))
    let registerInfo = ref({
      first_name: null,
      last_name: null,
      birth_date: null,
      phone_number: null,
      sex: 'male',
      civil_status: 'Single',
      occupation: null,
      street: null,
      brgy_name: null,
      city_municipality: null,
      province: null,
      account_identifier: 'publicUser',
      date_created: dateToday,
      time_created: timeNow,
    })
    const countdownTime = ref(2 * 60) // 2 minutes in seconds
    let timerId = null
    let minutes = ref(2)
    let seconds = ref(0)
    const otpSent = ref(false)
    const forgotPasswordStep = ref(1)
    const forgotPasswordField = ref(null)
    const showPhoneError = ref(false)
    const showEmailError = ref(false)
    const showUsernameError = ref(false)
    const showPasswordError = ref(false)
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

    let resetPassMessageEmail = () => {
      return (
        'Dear [' +
        dearUserName.value +
        '],<br><br> Hello, <br><br>We received a request to reset your password for your account associated with this email address.<br> If you made this request, please use the code below to change your password.<br><br><b>Your verification code is:' +
        +referenceCode.value +
        '</b><br><br> If you did not do this, please ignore this message.<br><br>Please note that this verification code does not have an expiration unless you request another one.<br><br>Best regards, Tabaco Animal Rescue and Adoption'
      )
    }

    let resetPassMessageSms = () => {
      return (
        'Dear [' +
        dearUserName.value +
        '],\n\nHello,\n\nWe received a request to reset your password for your account associated with this phone number. If you made this request, please use the code below to change your password.\n\nYour verification code is: ' +
        referenceCode.value +
        '\n\nIf you did not do this, please ignore this message. Please note that this verification code does not have an expiration unless you request another one.\n\nBest regards, Tabaco Animal Rescue and Adoption'
      )
    }

    let resetPassVerification = () => {
      Email.send({
        SecureToken: 'e16c5656-79fd-4b50-8411-d2cbfcff3662',
        To: email_address.value,
        From: 'michaelangelo.corral.personal@gmail.com',
        Subject: 'Password Reset Request',
        Body: resetPassMessageEmail(),
      }).then((message) => console.log(message))
      sendTelerivetSms(dearUserPhoneNumber.value, resetPassMessageSms())
    }

    let forgotPassBtn = () => {
      let isEmail = /^[^@]+@[^@]+\.[^@]+$/.test(email_address.value)
      if (isEmail) {
        checkEmail(email_address.value)
          .then((response) => {
            if (response.status == 'success') {
              resetPassVerification()
              startCountdown()
              forgotPasswordStep.value = 1
            } else {
              alert('Email is not registered with us!')
            }
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        forgotPasswordStep.value = 0
      }
    }

    const registerMessageSms = () => {
      return `Hello, ${userInfo.value.first_name}

  Thank you for joining TAARA (Tabaco Animal Rescue and Adoption)! Please use the following code to complete your sign-up process:

  Code: ${referenceCode.value}

  If you did not request this, please ignore this message.

  Best regards,
  TAARA Team`
    }

    const registerVerification = async (base) => {
      emailOrPhone.value = base
      loadingVar.value = true
      if (base == 1) {
        const response = await sendEmailActiviationOtp(
          userInfo.value.email_address,
          referenceCode.value,
        )
        if (response.status == 'success') {
          otpSent.value = true
        }
        console.log(response)
        loadingVar.value = false
      } else {
        const response = await sendTelerivetSms(userInfo.value.phone_number, registerMessageSms())
        if (response.status == 'success') {
          otpSent.value = true
        }
        console.log(response)
        loadingVar.value = false
      }
    }

    let finishUp = (email_address) => {
      checkEmail(email_address)
        .then((response) => {
          if (response.status == 'success') {
            errorEmail.value = response.data[0].email_address
          } else if (response.status == 'failed') {
            errorEmail.value = ''
            if (registerInfo.value.password !== null && email_address !== null) {
              step.value = 3
              registerVerification()
              startCountdown()
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }

    let checkResetVerificationCode = () => {
      if (code.value == referenceCode.value) {
        forgotPasswordStep.value = 2
      }
    }

    let changePassBtn = (email, pass) => {
      // $q.notify({
      //   spinner: QSpinnerGears,
      //   message: "Working...",
      //   timeout: 0,
      // });
      changePass(pass, email)
        .then((response) => {
          console.log(response)
          if (response == 'success') {
            // const dismiss = $q.notify({});
            // dismiss();
            forgotPasswordStep.value = 0
            email_address.value = null
            password.value = null
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }

    let resendVerification = () => {
      if (forgotPasswordStep.value == 1) {
        resetPassVerification()
      } else {
        registerVerification()
      }
      startCountdown()
    }

    let logInTaara = async () => {
      if (tab.value == 'login') {
        $q.loading.show({
          message: 'Logging in. Please wait...',
        })
        logIn(userInfo.value)
          .then((response) => {
            if (response.status == 'success') {
              showPasswordError.value = false
              store.userData = response.data
              console.log(store.userData)

              sessionStorage.setItem('user_data', JSON.stringify(response.data))
              if (response.data.user_type == 1) {
                setTimeout(() => {
                  router.replace('/public')
                  $q.loading.hide()
                }, 500)
              } else {
                setTimeout(() => {
                  router.replace('/management')
                  $q.loading.hide()
                }, 500)
              }
            } else {
              setTimeout(() => {
                showPasswordError.value = true
                $q.loading.hide()
              }, 500)
            }
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        loadingVar.value = [1, 3].includes(step.value)
        if (step.value == 1) {
          const res = await checkPhoneNumber(userInfo.value.phone_number)
          loadingVar.value = false
          if (res.data > 0) {
            showPhoneError.value = true
            return
          }
          showPhoneError.value = false
        }
        if (step.value == 3) {
          const res1 = await checkEmail(userInfo.value.email_address)
          const res2 = await checkUsername(userInfo.value.username)
          loadingVar.value = false
          showEmailError.value = res1.data > 0
          showUsernameError.value = res2.data > 0
          if (showEmailError.value || showUsernameError.value) {
            return
          }
          showEmailError.value = false
          showUsernameError.value = false
        }
        if (step.value < 4 && referenceCode.value !== pin.value) {
          step.value += 1
          return
        }
        $q.loading.show({
          group: 'register',
          message: 'Registering . Please wait...',
        })
        const response = await registerUser(userInfo.value)
        setTimeout(() => {
          $q.loading.show({
            group: 'register',
            message: response.message,
          })
          if (response.status == 'success') {
            tab.value = 'login'
            userInfo.value = {}
          }
        }, 500)
        setTimeout(() => {
          $q.loading.hide()
        }, 1000)
      }
    }

    let miniStepCheck = (step) => {
      miniStep.value = step

      if (miniStep.value !== 1) {
        let keyToCheck = ['first_name', 'last_name']
        miniStep1.value = keyToCheck.some((key) => {
          const value = registerInfo.value[key]
          return value === null || value === ''
        })
      }
      if (miniStep.value !== 2) {
        let keyToCheck = ['birth_date', 'phone_number', 'sex']
        miniStep2.value = keyToCheck.some((key) => {
          const value = registerInfo.value[key]
          return value === null || value === ''
        })
      }
      if (miniStep.value !== 3) {
        let keyToCheck = ['street', 'brgy_name', 'city_municipality', 'province']
        miniStep3.value = keyToCheck.some((key) => {
          const value = registerInfo.value[key]
          return value === null || value === ''
        })
      }
      if (miniStep.value !== 4) {
        let keyToCheck = ['occupation', 'civil_status']
        miniStep4.value = keyToCheck.some((key) => {
          const value = registerInfo.value[key]
          return value === null || value === ''
        })
      }
    }

    let authenticationStep = () => {
      let hasNull = Object.values(registerInfo.value).some((v) => v === null || v === '')
      let number =
        registerInfo.value.phone_number.length == 16 && registerInfo.value.phone_number[1] == 9
      if (hasNull == false && number == true) {
        step.value = 2
      }
    }

    let createAccount = (payload) => {
      if (aggree.value == true) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'amber',
          spinnerSize: 140,
          backgroundColor: 'primary',
          message: 'Some important process is in progress. Hang on...',
          messageColor: 'white',
        })

        addUser(payload)
          .then((response) => {
            timer1 = setTimeout(() => {
              $q.loading.hide()
              $q.loading.show({
                spinner: QSpinnerFacebook,
                spinnerColor: 'amber',
                spinnerSize: 140,
                backgroundColor: 'primary',
                message:
                  response == 'success'
                    ? 'Account Creation is Successful!'
                    : 'Account Creation failed',
                messageColor: 'white',
              })
              timer2 = setTimeout(() => {
                $q.loading.hide()
                fadeValue.value = response == 'success' ? false : true
                let keysToKeep = [
                  'account_identifier',
                  'date_created',
                  'time_created',
                  'sex',
                  'civil_status',
                ]

                Object.keys(registerInfo.value).forEach((obj) => {
                  if (!keysToKeep.includes(obj)) {
                    registerInfo.value[obj] = null
                  }
                })
              }, 1500)
            }, 2000)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }

    let resetRegisterInfo = () => {
      Object.keys(registerInfo.value).forEach((key) => {
        registerInfo.value[key] == null
      })
    }

    const forgotFn = async () => {
      loadingVar.value = true
      const res = checkEmailOrPhone(forgotPasswordField.value)
      if (res.type == 'email') {
        const response = await sendEmailActiviationOtp(res.value, referenceCode.value)
        if (response.status == 'success') {
          forgotPasswordStep.value = 2
        }
        console.log(response)
        loadingVar.value = false
      } else {
        const response = await sendTelerivetSms(res.value, registerMessageSms())
        if (response.status == 'success') {
          forgotPasswordStep.value = 2
        }
        console.log(response)
        loadingVar.value = false
      }
    }

    const validateForgotPassword = async () => {
      if (forgotPasswordStep.value == 2) {
        if (pin.value == referenceCode.value) {
          forgotPasswordStep.value = 3
        }
      } else if (forgotPasswordStep.value == 3) {
        $q.loading.show({
          group: 'update',
          message: 'Updating password . Please wait...',
        })
        const res = checkEmailOrPhone(forgotPasswordField.value)
        const sliceIfPhone =
          res.type === 'phone' && res.value.startsWith('+63')
            ? res.value.slice(3) // remove '+63'
            : res.value

        const response = await changePassword(sliceIfPhone, userInfo.value.password)
        setTimeout(() => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
        }, 500)
        setTimeout(() => {
          if (response.status == 'success') {
            tab.value = 'login'
          }
          $q.loading.hide()
        }, 1000)
      }
    }

    let resetLogInInfo = () => {
      email_address.value = null
      password.value = null
    }

    onBeforeUnmount(() => {
      if (timer1 !== void 0) {
        clearTimeout(timer1)
      }
      if (timer2 !== void 0) {
        clearTimeout(timer2)
      }
    })

    watchEffect(() => {
      minSixLenght.value = userInfo.value.password?.length > 5
      includeNumber.value = /\d/.test(userInfo.value.password)
    })
    return {
      showPasswordError,
      showEmailError,
      showUsernameError,
      showPhoneError,
      validateForgotPassword,
      forgotPasswordStep,
      forgotFn,
      emailOrPhone,
      loadingVar,
      isPwd: ref(true),
      civilStatusOption,
      otpSent,
      registerVerification,
      tab,
      slide: ref(1),
      autoplay: ref(true),
      userInfo,
      includeNumber,
      minSixLenght,
      router,
      showLoginError,
      QSpinnerGears,
      dearUserEmail,
      resetLogInInfo,
      resetRegisterInfo,
      finishUp,
      createAccount,
      authenticationStep,
      miniStepCheck,
      countdownTime,
      minutes,
      seconds,
      startCountdown,
      wrongUserOrPass,
      logInDetails,
      logInTaara,
      errorEmail,
      forgotPassBtn,
      changer,
      email_address,
      password,
      confirm_password,
      checkResetVerificationCode,
      pin,
      fadeValue,
      step,
      miniStep,
      registerInfo,
      registerRetypePass,
      disableProggress,
      aggree,
      code,
      forgotPasswordField,
      changePassBtn,
      resendVerification,
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
      miniStep1,
      miniStep2,
      miniStep3,
      miniStep4,
    }
  },
}
