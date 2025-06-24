import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  getReportRescue,
  getReportRescueData,
  valueToGoPageScroll,
  updateReportManagement,
  addReportManagement,
  logInDetails,
} from 'src/composable/taaraComposable'
import {
  wordifyDate,
  wordifyTime,
  resizeImage,
  dateToday,
  timeNow,
} from 'src/composable/simpleComposable'
import TextClamp from 'vue3-text-clamp'

import { useCounterStore } from 'src/stores/example-store'
export default {
  components: {
    TextClamp,
  },
  setup() {
    const counterStore = useCounterStore()
    const myElement = ref(null)
    let slide = ref(1)
    let qDialogImageId = ref()
    let showMore = ref(false)
    let editOrAdd = ref(false)

    let addAnnouncement = ref(false)
    let addImageCarousel = ref(false)
    let addImage = ref(false)
    let addImageSlide = ref(1)
    let reportDetails = ref({
      user_id: null,
      reporter_name: null,
      report_details: null,
      date: dateToday,
      time: timeNow,
      phone_number: null,
      report_status: 1,
    })
    // const scrollToElement = () => {
    //   setTimeout(() => {
    //     const element = document.querySelector(
    //       `#report-${counterStore.counter}`
    //     );
    //     if (element) {
    //       element.scrollIntoView({ behavior: "smooth" });
    //     }
    //   }, 10);
    // };

    let images = ref([])
    let referenceReportId = ref()

    let test = (payload, id) => {
      if (based == 'viewPost') {
        slide.value = payload
        qDialogImageId.value = id
        carousel.value = true
      } else {
        addImageCarousel.value = true
        addImageSlide.value = payload
      }
    }
    let editReport = (payload) => {
      addAnnouncement.value = true
      addImage.value = true
      reportDetails.value = { ...payload }
      images.value = getReportRescueData.value.image.filter((obj) => {
        return obj.report_id === payload.report_id
      })
      editOrAdd.value = true
      referenceReportId.value = payload.report_id
    }
    let removeImage = (payload) => {
      images.value.splice(payload, 1)
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
            .then(({ dataUrl, fileName }) => {
              if (images.value.length <= 4 && editOrAdd.value == false) {
                images.value.push({
                  image: dataUrl,
                })
              } else if (images.value.length <= 4 && editOrAdd.value == true) {
                images.value.push({
                  report_id: referenceReportId.value,
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
    let removeValue = () => {
      let excludeKeys = ['time', 'date', 'report_status']
      Object.keys(reportDetails.value).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          reportDetails.value[key] = null
        }
      })
      images.value = []
      addAnnouncement.value = true
      editOrAdd.value = false
      addImage.value = false
    }
    const handleWindowResize = () => {
      showMore.value = window.innerWidth < 415
    }
    watch(
      () => counterStore.counter,
      (newValue, oldValue) => {
        scrollToElement()
      },
    )
    onMounted(() => {
      window.addEventListener('resize', handleWindowResize)
      handleWindowResize()
      getReportRescue()
      // setTimeout(() => {
      //   scrollToElement();
      // }, 1000);
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })
    return {
      wordifyDate,
      wordifyTime,
      pickFile,
      removeValue,
      handleFileUpload,
      addReportManagement,
      removeImage,
      images,
      editOrAdd,
      test,
      carousel: ref(false),
      updateReportManagement,
      slide,
      myElement,
      reportDetails,
      editReport,
      getReportRescue,
      getReportRescueData,
      showMore,
      qDialogImageId,
      addAnnouncement,
      addImageCarousel,
      addImage,
      addImageSlide,
    }
  },
}
