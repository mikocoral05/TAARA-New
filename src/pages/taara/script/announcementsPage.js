import { onMounted, ref, watch } from 'vue'
import { getAllAnnouncement, annoucementData } from 'src/composable/taaraComposable'
import { wordifyDate, wordifyTime } from 'src/composable/simpleComposable'
import { useCounterStore } from 'src/stores/example-store'
import TextClamp from 'vue3-text-clamp'
import PageFooter from 'src/components/PageFooter.vue'
export default {
  components: {
    PageFooter,
    TextClamp,
  },

  setup() {
    const counterStore = useCounterStore()
    const myElement = ref(null)
    let textLength = ref(150)
    const scrollToElement = () => {
      setTimeout(() => {
        const element = document.querySelector(`#report-${counterStore.announcement}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 10)
    }

    let showMore = ref(false)
    const handleWindowResize = () => {
      if (window.innerWidth < 415) {
        showMore.value = true
      } else {
        showMore.value = false
      }
    }

    function toggleShowMore(item) {
      item.showMore = !item.showMore
    }
    let slide = ref(1)
    let qDialogImageId = ref()
    let viewImage = (payload, id) => {
      slide.value = payload
      qDialogImageId.value = id
    }

    window.addEventListener('resize', handleWindowResize)
    watch(
      () => counterStore.announcement,
      (newValue, oldValue) => {
        console.log(newValue + 'd' + oldValue)
        scrollToElement()
      },
    )
    onMounted(() => {
      handleWindowResize()
      getAllAnnouncement()
      setTimeout(() => {
        scrollToElement()
      }, 1000)
    })
    return {
      qDialogImageId,
      viewImage,
      toggleShowMore,
      wordifyDate,
      wordifyTime,
      getAllAnnouncement,
      annoucementData,
      myElement,
      showMore,
      textLength,
      slide,
      carousel: ref(false),
    }
  },
}
