import { ref } from 'vue'
import {
  logInDetails,
  updatePublicUserDetails,
  userSettingChanger,
} from 'src/composable/taaraComposable'
import { resizeImage } from 'src/composable/simpleComposable'
// import { QSpinnerGears, useQuasar } from "quasar";
import PageFooter from 'src/components/PageFooter.vue'
export default {
  components: {
    PageFooter,
  },
  setup() {
    // const $q = useQuasar();
    let changer = ref(userSettingChanger)
    let read = ref(userSettingChanger.value)

    changer.value = JSON.parse(localStorage.getItem('changer'))
    let logInDataCopy = { ...logInDetails.value[0] }
    let userdata = ref({
      first_name: null,
      middle_name: null,
      last_name: null,
      suffix: null,
      sex: null,
      birth_date: null,
      occupation: null,
      civil_status: null,
      phone_number: null,
      email_address: null,
      street: null,
      brgy_name: null,
      city_municipality: null,
      province: null,
      valid_id: null,
      valid_id_name: null,
      image: null,
    })
    userdata.value = logInDataCopy
    let update = (payload) => {
      updatePublicUserDetails(payload)
    }
    let cancel = () => {
      userdata.value = { ...logInDetails.value[0] }
    }

    const handleFileUpload = (event, param) => {
      const files = event.target.files
      const file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resizeImage(file, 500, 500)
          .then(({ dataUrl, fileName }) => {
            if (param == 'profileImage') {
              userdata.value.image = dataUrl
            } else {
              userdata.value.valid_id = dataUrl(fileName)
              userdata.value.valid_id_name = fileName
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }

    const fileInput = ref(null)
    const pickFile = () => {
      document.getElementById('fileInput').click()
    }

    let imageShow2 = () => {
      document.getElementById('file2').click()
    }

    return {
      imageShow2,
      handleFileUpload,
      civil_status_options: [
        {
          label: 'Single',
          value: 1,
        },
        {
          label: 'Married',
          value: 2,
        },
        {
          label: 'Seperated',
          value: 3,
        },
      ],
      sex_options: [
        {
          label: 'Male',
          value: 1,
        },
        {
          label: 'Female',
          value: 2,
        },
      ],
      suffix_options: [
        {
          label: 'none',
          value: 'none',
        },
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
      pickFile,
      fileInput,
      userdata,
      update,
      cancel,
      read,
      logInDetails,
      changer,
    }
  },
}
