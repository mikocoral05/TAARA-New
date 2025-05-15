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

    let userInfo = ref({
      last_name: null,
      first_name: null,
      middle_name: null,
      suffix: null,
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
      if (
        userInfo.value.user_image_name == null ||
        userInfo.value.image == null ||
        userInfo.value.valid_id == null ||
        userInfo.value.valid_id_name == null
      ) {
        registration_alert.value = true
      } else {
        registration_alert.value = false
        addUser(payload)
        setTimeout(() => {
          $q.notify({
            spinner: QSpinnerGears,
            message: 'Creating Account...',
            timeout: 1500,
            position: 'center',
            color: 'purple',
          })
        }, 100)
        setTimeout(() => {
          $q.notify({
            spinner: QSpinnerGears,
            message: 'Redirecting to Login...',
            timeout: 500,
            position: 'center',
            color: 'purple',
          })
        }, 1500)
        setTimeout(() => {
          router.push('/login')
        }, 3500)
      }
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
    }
  },
}
