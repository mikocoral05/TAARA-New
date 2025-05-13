import { ref, onBeforeUnmount, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { QSpinnerGears, useQuasar, QSpinnerFacebook } from 'quasar'
import { dateToday, timeNow, Email, sendTelerivetSms } from 'src/composable/simpleComposable'
import {
  dearUserEmail,
  changePass,
  checkEmail,
  logInDetails,
  wrongUserOrPass,
  addUser,
  dearUserName,
  dearUserPhoneNumber,
} from 'src/composable/taaraComposable'
import BubbleChart from 'src/components/BubbleChart.vue'
import { logIn } from 'src/composable/latestComposable'
export default {
  components: { BubbleChart },
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    let fadeValue = ref(false)
    let step = ref(1)
    let code = ref(null)
    const tab = ref('login')
    const includeNumber = ref(false)
    const minSixLenght = ref(false)
    let forgotPasswordStep = ref(0)
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
    let referenceCode = ref(Math.floor(1000 + Math.random() * 9000))
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

    let registerMessageEmail = () => {
      return (
        'Hello,[' +
        registerInfo.value.first_name +
        '] <br><br>Thank you for joining TAARA (Tabaco Animal Rescue and Adoption)! Please use the following code to complete your sign-up process:<br><br><b>Code: ' +
        referenceCode.value +
        '</b><br><br> If you did not request this, please ignore this message.<br><br>Best regards, TAARA Team'
      )
    }

    let registerMessageSms = () => {
      return (
        'Hello,[' +
        registerInfo.value.first_name +
        '] \n\nThank you for joining TAARA (Tabaco Animal Rescue and Adoption)! Please use the following code to complete your sign-up process:\n\nCode: ' +
        referenceCode.value +
        '\n\n If you did not request this, please ignore this message.\n\nBest regards, TAARA Team'
      )
    }

    let registerVerification = () => {
      Email.send({
        SecureToken: 'e16c5656-79fd-4b50-8411-d2cbfcff3662',
        To: registerInfo.value.email_address,
        From: 'michaelangelo.corral.personal@gmail.com',
        Subject: 'Account Creation Request',
        Body: registerMessageEmail(),
      }).then((message) => console.log(message))
      sendTelerivetSms(registerInfo.value.phone_number, registerMessageSms())
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

    let logInTaara = () => {
      $q.loading.show({
        message: 'Logging in. Please wait...',
      })
      logIn(userInfo.value)
        .then((response) => {
          console.log(response.data)

          if (response.status == 'success') {
            if (response.data.user_type == '1') {
              // router.push('/home')
            } else {
              setTimeout(() => {
                // router.push('/')
                $q.loading.hide()
              }, 2000)
            }
          } else {
            setTimeout(() => {
              // showLoginError.value = !showLoginError.value
              $q.loading.hide()
            }, 2000)
          }
        })
        .catch((error) => {
          console.error(error)
        })
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
      checkEmail,
      errorEmail,
      forgotPassBtn,
      changer,
      email_address,
      password,
      confirm_password,
      checkResetVerificationCode,
      pin,
      isPwd: ref(true),
      fadeValue,
      step,
      miniStep,
      registerInfo,
      registerRetypePass,
      disableProggress,
      aggree,
      code,
      forgotPasswordStep,
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
