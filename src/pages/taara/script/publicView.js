import { ref, onMounted, watch } from 'vue'
import PageFooter from 'src/components/PageFooter.vue'
import taaraFooter from 'src/components/taaraFooter.vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from 'src/stores/example-store'
import VueScrollTo from 'vue-scrollto'

import {
  featuredData,
  getAllAnimals,
  logInDetails,
  latestAnnouncementImage,
  allAnimalData12,
  viewSpecificAnimal,
  annoucementData,
  latestAnnouncement,
  donationsThisMonth,
  wishlistPriority,
} from 'src/composable/taaraComposable'
import { wordifyTime, wordifyDate, formatNumber } from 'src/composable/simpleComposable'

export default {
  components: {
    PageFooter,
    taaraFooter,
  },

  setup() {
    const counterStore = useCounterStore()
    const router = useRouter()
    const footerDiv = ref(null)
    const ourMission = ref(null)
    const scrollInfo = ref({ position: { top: 0, left: 0 } })
    const maxScrollTop = ref(0)
    let slide = ref(1)
    let test = (payload) => {
      slide.value = payload
    }
    let viewAnimal = (id) => {
      viewSpecificAnimal(id)
      router.push('view-specific-animal')
      localStorage.setItem('specificAnimalId', JSON.stringify(id))
    }
    let fixName = (name) => {
      if (name == null) {
        return 'Anonymous'
      } else {
        let split = name.split(' ')
        return split[0]
      }
    }
    let totalDonation = (donationData) => {
      return donationData.reduce((total, donation) => {
        return total + donation.donation_amount
      }, 0)
    }
    let scrollToDiv = (goTo) => {
      if (goTo == 'mission') {
        VueScrollTo.scrollTo(ourMission.value, 500, { offset: -70 })
      } else if (goTo == 'payPal') {
        // VueScrollTo.scrollTo(payPal.value, 500, { offset: -130 })
      } else if (goTo == 'GCash') {
        // VueScrollTo.scrollTo(GCash.value, 500, { offset: -130 })
      }
    }

    watch(
      () => counterStore.scrollToDiv,
      (newValue, oldValue) => {
        console.log(newValue)
        if (newValue != oldValue) {
          VueScrollTo.scrollTo(footerDiv.value, 4000, { offset: -130 })
        }
      },
    )
    onMounted(() => {
      // getAnnouncement();
      // animalPublicDisplay();
      // logInDetails.value == null
      //   ? ""
      //   : getSubmitAdoptionForm(logInDetails.value[0].user_id);
      // logInDetails.value == null ? "" : getLikes(logInDetails.value[0].user_id);
      // getDonationsThisMonth(monthToday + 1, yearToday);
      // getWishlistPriority();
    })

    return {
      //
      scrollInfo,
      onScroll(info) {
        scrollInfo.value = info
        const currentTop = info.position.top
        if (currentTop > maxScrollTop.value) {
          maxScrollTop.value = currentTop
        }
      },
      maxScrollTop,
      scrollToDiv,
      wishlistPriority,
      totalDonation,
      fixName,
      donationsThisMonth,
      viewAnimal,
      logInDetails,
      counterStore,
      viewSpecificAnimal,
      latestAnnouncement,
      featuredData,
      slide: ref(1),
      getAllAnimals,
      annoucementData,
      latestAnnouncementImage,
      allAnimalData12,
      carousel: ref(false),
      test,
      wordifyTime,
      wordifyDate,
      formatNumber,
      footerDiv,
      ourMission,
    }
  },
}
