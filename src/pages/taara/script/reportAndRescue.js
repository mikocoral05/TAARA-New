import { ref, onMounted, onUnmounted } from 'vue'
import PageFooter from 'src/components/PageFooter.vue'
import { QSpinnerGears, useQuasar } from 'quasar'
import { logInDetails, addAnimalReport, getReportRescue } from 'src/composable/taaraComposable'
import { wordifyDate, wordifyTime, resizeImage } from 'src/composable/simpleComposable'
import { useRouter } from 'vue-router'
export default {
  components: { PageFooter },
  component: {
    PageFooter,
  },
  setup() {
    const router = useRouter()
    const $q = useQuasar()

    let reporterDetails = ref({
      user_id: logInDetails.value == null ? null : logInDetails.value[0].user_id,
      reporter_name: logInDetails.value == null ? null : logInDetails.value[0].first_name,
      reporter_image: logInDetails.value == null ? null : logInDetails.value[0].image,
      report_details: null,
      location: null,
      time: wordifyTime,
      date: wordifyDate,
      phone_number: logInDetails.value == null ? null : logInDetails.value[0].phone_number,
      approve: 2,
    })

    let date_rescued = ref('')
    let animal_condition = ref('')
    let continaer = ref([])
    const images = ref([])

    const handleFileUpload = (event) => {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl }) => {
              images.value.push(dataUrl)
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
      event.target.value = ''
    }

    let imageRemover = () => {
      images.value = []
    }
    let imageShow = () => {
      document.getElementById('file').click()
    }
    let submitReport = (report, image) => {
      addAnimalReport(report, image)
      setTimeout(() => {
        $q.notify({
          spinner: QSpinnerGears,
          message: 'Report Submitted',
          timeout: 500,
          position: 'center',
        })
      }, 1500)
      setTimeout(() => {
        // router.go(-1);
        router.push('rescue-reports')
      }, 3500)
    }
    let cancelInput = () => {
      if (logInDetails.value == null) {
        let arrayKeys = ['report_details', 'location', 'phone_number', 'reporter_name']
        for (let key of arrayKeys) {
          reporterDetails.value[key] = null
        }
      } else {
        reporterDetails.value.report_details = null
        reporterDetails.value.location = null
      }
    }
    let inputStyleAdjuster = ref(false)

    let handleWindowSize = () => {
      inputStyleAdjuster.value = window.innerWidth < 500
    }
    onMounted(() => {
      getReportRescue()
      window.addEventListener('resize', handleWindowSize)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowSize)
    })
    return {
      cancelInput,
      inputStyleAdjuster,
      images,
      submitReport,
      handleFileUpload,
      imageShow,
      reporterDetails,
      imageRemover,
      date_rescued,
      animal_condition,

      continaer,
      logInDetails,
    }
  },
}
