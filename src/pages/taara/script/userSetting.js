import { ref } from 'vue'
import {
  logInDetails,
  updatePublicUserPassword,
  uploadImage,
  userSettingChanger,
  changePass,
} from 'src/composable/taaraComposable'
import { QSpinnerGears, useQuasar } from 'quasar'
import PageFooter from 'src/components/PageFooter.vue'
export default {
  components: {
    PageFooter,
  },
  setup() {
    const $q = useQuasar()
    let changer = ref(userSettingChanger)
    let read = ref(userSettingChanger.value)
    let emailCode = ref()
    let currentPassword = ref(null)
    let forgotPassword = ref(0)
    let retypeNewPassword = ref(null)
    let email_address = ref(null)
    let password = ref(null)
    let confirm_password = ref(null)
    let pin = ref(null)
    let popEmail = ref(false)

    logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))

    changer.value = JSON.parse(localStorage.getItem('changer'))

    var val = Math.floor(1000 + Math.random() * 9000)
    const body =
      'Hello, <br><br>Thank you for being part of our community! Please use the following code to change your email address:<br><br><b>' +
      val +
      '</b><br><br> If you did request to change your email, please ignore this message.<br><br>Best regards, Tabaco Animal Rescue and Adoption'
    var Email = {
      send: function (a) {
        return new Promise(function (n) {
          ;(a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = 'Send')
          var t = JSON.stringify(a)
          Email.ajaxPost('https://smtpjs.com/v3/smtpjs.aspx?', t, function (e) {
            n(e)
          })
        })
      },
      ajaxPost: function (e, n, t) {
        var a = Email.createCORSRequest('POST', e)
        a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
          (a.onload = function () {
            var e = a.responseText
            null != t && t(e)
          }),
          a.send(n)
      },
      ajax: function (e, n) {
        var t = Email.createCORSRequest('GET', e)
        ;(t.onload = function () {
          var e = t.responseText
          null != n && n(e)
        }),
          t.send()
      },
      // createCORSRequest: function (e, n) {
      //   var t = new XMLHttpRequest()
      //   return (
      //     'withCredentials' in t
      //       ? t.open(e, n, !0)
      //       : 'undefined' != typeof XDomainRequest
      //         ? (t = new XDomainRequest()).open(e, n)
      //         : (t = null),
      //     t
      //   )
      // },
    }
    let sendEmail = (to, body) => {
      if (to.includes('@yahoo.com') || to.includes('@gmail.com')) {
        // if(emailAnswer == 1){
        popEmail.value = false
        forgotPassword.value = 2
        Email.send({
          SecureToken: '3b24312b-932f-4872-8318-eb87b4916ed8',
          To: to,
          From: 'mikocoral11@gmail.com',
          Subject: 'Account recovery',
          Body: body,
        })
          .then
          // message => alert(message)
          //
          ()
        return
        // }else if(emailAnswer == 0){
        // popEmail.value=true;
        // return;
        // }
      }
    }
    let confirmPin = (payload) => {
      if (payload == val) {
        forgotPassword.value = 3
      }
    }
    let pop = ref(false)
    let NewPassword = (pay1, pay2, em) => {
      if (pay1 != pay2) {
        pop.value = true
      } else {
        changePass(pay1, em)
        setTimeout(() => {
          $q.notify({
            spinner: QSpinnerGears,
            color: 'purple',
            message: 'Password change successfuly',
            timeout: 500,
            position: 'center',
          })
        }, 1000)
        setTimeout(() => {
          // router.push("/login");
          pop.value = false

          forgotPassword.value = 0
          password.value = null
        }, 3000)
      }
    }
    let change = ref(true)

    let wrongPassword = ref(null)
    let didNotMatchPassword = ref(null)
    let newPass = ref(null)
    let readPass = ref(true)
    let clickUpdatePassword = (payload) => {
      if (currentPassword.value == null) {
        wrongPassword.value = 'Password field cannot be left blank'
      } else {
        if (currentPassword.value !== payload.password) {
          wrongPassword.value = "Current password didn't match!"
        } else {
          wrongPassword.value = ''
          if (newPass.value == null) {
            didNotMatchPassword.value = 'New Password cannot be left blank'
          } else {
            if (newPass.value == null ? true : newPass.value.length < 9) {
              didNotMatchPassword.value = 'Password minimum length is 8!'
            } else {
              if (newPass.value === retypeNewPassword.value) {
                didNotMatchPassword.value = ''
                payload.password = newPass.value
                updatePublicUserPassword(payload)
                setTimeout(() => {
                  $q.notify({
                    spinner: QSpinnerGears,
                    color: 'purple',
                    message: 'Password change successfuly',
                    timeout: 500,
                    position: 'center',
                  })
                }, 1000)
                setTimeout(() => {
                  // router.push("/login");
                  currentPassword.value = null
                  newPass.value = null
                  retypeNewPassword.value = null
                }, 3000)
              } else {
                didNotMatchPassword.value = "New password didn't match!"
              }
            }
          }
        }
      }
    }

    return {
      uploadImage,
      isPwd: ref(true),
      readPass,
      isPwde: ref(true),
      clickUpdatePassword,
      newPass,
      changePass,
      change,
      currentPassword,
      retypeNewPassword,
      didNotMatchPassword,
      body,
      sendEmail,
      emailCode,
      wrongPassword,
      forgotPassword,
      read,
      confirmPin,
      logInDetails,
      pop,
      email_address,
      password,
      confirm_password,
      pin,
      popEmail,
      NewPassword,
    }
  },
}
