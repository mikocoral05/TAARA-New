import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { QSpinnerGears, useQuasar } from 'quasar'
import { addUser, userData } from 'src/composable/taaraComposable'
import { dateToday, timeNow, resizeImage } from 'src/composable/simpleComposable'
import PageFooter from 'src/components/PageFooter.vue'
export default {
  components: {
    PageFooter,
  },
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    let confirm_password = ref('')

    let registration_alert = ref(false)
    let password_match = ref(false)
    let password_length = ref(false)
    let next = ref(0)
    let errorProfile = ref(false)
    let errorValidId = ref(false)

    let userInfo = ref({
      last_name: null,
      first_name: null,
      sex: null,
      occupation: null,
      civil_status: null,
      birth_date: null,
      phone_number: null,
      street: null,
      brgy_name: null,
      city_municipality: null,
      email_address: null,
      password: null,
      image: null,
      user_image_name: null,
      valid_id: null,
      valid_id_name: null,
      date_created: dateToday,
      time_created: timeNow,
      account_identifier: 'publicUser',
    })

    let addUsersFunction = (payload) => {
      setTimeout(() => {
        $q.notify({
          spinner: QSpinnerGears,
          message: 'Creating Account...',
          timeout: 1500,
          position: 'center',
          color: 'purple',
        })
      }, 100)
      addUser(payload)
        .then((response) => {
          if (response == 'success') {
            setTimeout(() => {
              $q.notify({
                spinner: QSpinnerGears,
                message: 'Create Successfull...',
                timeout: 500,
                position: 'center',
                color: 'purple',
              })
            }, 1500)
            setTimeout(() => {
              $q.notify({
                spinner: QSpinnerGears,
                message: 'Redirecting to log in...',
                timeout: 500,
                position: 'center',
                color: 'purple',
              })
            }, 2900)
            setTimeout(() => {
              router.push('/login')
            }, 5000)
          } else {
            setTimeout(() => {
              $q.notify({
                spinner: QSpinnerGears,
                message: 'Account creation failed...',
                timeout: 500,
                position: 'center',
                color: 'purple',
              })
            }, 1500)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

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
          .then(({ dataUrl, fileName }) => {
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
    let checkImage = (userInfo) => {
      if (userInfo.image == null) {
        errorProfile.value = true
      } else if (userInfo.valid_id == null) {
        errorValidId.value = true
      } else {
        next.value = 2
      }
    }
    let imageShow = () => {
      document.getElementById('file').click()
    }
    let imageShow2 = () => {
      document.getElementById('file2').click()
    }
    return {
      imageShow,
      imageShow2,
      handleFileUpload,
      addUsersFunction,
      addUser,
      userData,
      registration_alert,
      password_match,
      password_length,
      userInfo,
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
      suffix_options: [
        {
          label: 'Jr',
          value: 'Jr',
        },
        {
          label: 'Sr',
          value: 'Sr',
        },
        {
          label: '||(second)',
          value: '||',
        },
        {
          label: 'Jd(Juris Doctor)',
          value: 'Jd',
        },
        {
          label: 'MBA(Master in Business Administration)',
          value: 'MBA',
        },
        {
          label: 'Ph.D(Philosophical Doctor)',
          value: 'Ph.D',
        },
      ],
      confirm_password,
      isPwd: ref(true),
      next,
      checkImage,
      errorProfile,
      errorValidId,
    }
  },
}
