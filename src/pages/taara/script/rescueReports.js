import { onMounted, ref, watch, onUnmounted } from 'vue'
import {
  getReportRescue,
  getReportRescueData,
  rescueReportBasicSearch,
  originalReportRescueData,
  logInDetails,
  addReportManagement,
} from 'src/composable/taaraComposable'
import {
  wordifyTime,
  wordifyDate,
  encodeAnimalId,
  resizeImage,
  dateToday,
  timeNow,
} from 'src/composable/simpleComposable'
import TextClamp from 'vue3-text-clamp'

import { useCounterStore } from 'src/stores/example-store'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import donationDialog from 'src/components/donationDialog.vue'
export default {
  components: {
    TextClamp,
    TaaraFooter,
    donationDialog,
  },
  setup() {
    const counterStore = useCounterStore()
    const myElement = ref(null)
    let slide = ref({})
    let showMore = ref(false)
    let search = ref()
    let step = ref(1)
    let sortReport = ref(true)
    let noReport = ref(false)
    let addReport = ref(true)
    let addImage = ref(false)
    let images = ref([])
    let reportDetails = ref({
      user_id: logInDetails.value == null ? null : logInDetails.value[0].user_id,
      reporter_name: logInDetails.value == null ? null : logInDetails.value[0].first_name,
      report_details: null,
      date: dateToday,
      time: timeNow,
      phone_number: logInDetails.value == null ? null : logInDetails.value[0].phone_number,
      report_status: 1,
    })
    const scrollToElement = () => {
      setTimeout(() => {
        const element = document.querySelector(`#report-${counterStore.rescueReport}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 10)
    }
    const handleWindowResize = () => {
      showMore.value = window.innerWidth < 415
    }
    const filterReport = (param) => {
      if (param == 'All') {
        getReportRescueData.value.data = originalReportRescueData.value
      } else if (param == 'MyReport') {
        let result = getReportRescueData.value.data.filter(
          (obj) => obj.user_id === logInDetails.value[0].user_id,
        )
        getReportRescueData.value.data = result
        result.length < 1 ? (noReport.value = true) : (noReport.value = false)
      }
    }
    const filterBySearch = (searchValue) => {
      let exactMatches = []
      let partialMatches = []
      let toFilter = ref([])
      if (sortReport.value == true) {
        toFilter.value = originalReportRescueData.value
      } else {
        toFilter.value = originalReportRescueData.value.filter(
          (obj) => obj.user_id === logInDetails.value[0].user_id,
        )
      }
      getReportRescueData.value.data = toFilter.value
      getReportRescueData.value.data.forEach((obj) => {
        if (
          obj.reporter_name &&
          obj.reporter_name.toString().trim() !== '' &&
          obj.reporter_name.toString().toLowerCase() === searchValue.toLowerCase()
        ) {
          exactMatches.push(obj)
        } else if (
          obj.report_title &&
          obj.report_title.toString().trim() !== '' &&
          obj.report_title.toString().toLowerCase().includes(searchValue.toLowerCase())
        ) {
          partialMatches.push(obj)
        }
      })

      getReportRescueData.value.data = exactMatches.length > 0 ? exactMatches : partialMatches
    }
    const pickFile = () => {
      document.getElementById('fileInput').click()
    }
    const handleFileUpload = (event) => {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl }) => {
              if (images.value.length <= 4) {
                images.value.push({
                  image: dataUrl,
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }
    watch(
      () => counterStore.rescueReport,
      () => {
        scrollToElement()
      },
    )
    onMounted(() => {
      window.addEventListener('resize', handleWindowResize)
      handleWindowResize()
      getReportRescue()
        .then((response) => {
          response.data.forEach((data) => {
            slide.value[`id${data.report_id}`] = 0
          })
        })
        .catch((error) => {
          console.log(error)
        })
      setTimeout(() => {
        scrollToElement()
      }, 1000)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })
    return {
      addReportManagement,
      logInDetails,
      pickFile,
      handleFileUpload,
      images,
      addImage,
      reportDetails,
      addReport,
      encodeAnimalId,
      counterStore,
      filterBySearch,
      noReport,
      filterReport,
      sortReport,
      rescueReportBasicSearch,
      step,
      search,
      slide,
      myElement,
      getReportRescue,
      getReportRescueData,
      showMore,
      wordifyTime,
      wordifyDate,
      getFilteredImages(id) {
        let filterImage = getReportRescueData.value.image.filter((image) => image.report_id === id)
        return filterImage
      },

      titleChoices: [
        'Urgent: Injured Dog Found',
        'Emergency: Abandoned Puppy in Need',
        'Rescue Alert: Stranded Canine',
        'Paws in Peril: Help Needed',
        'Lost and Alone: Dog Rescue Required',
        'Cat in Crisis: Immediate Assistance Needed',
        'Feline Emergency: Injured Kitty Found',
        'SOS: Stray Cat Rescue',
        'Purr-fectly Desperate: Cat in Danger',
        'Whisker Wonderland: Urgent Situation',
        'Wildlife SOS: Saving an Endangered Species',
        'Farm Animal Rescue: Critical Condition',
        'Feathered Friend in Distress',
        'Hopping to Safety: Bunny in Need',
        'Swimmingly Urgent: Fish Rescue',
      ],
    }
  },
}
