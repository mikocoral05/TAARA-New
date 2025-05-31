import TaaraFooter from 'src/components/TaaraFooter.vue'
import donationDialog from 'src/components/donationDialog.vue'
import { useCounterStore } from 'src/stores/example-store'
import VueScrollTo from 'vue-scrollto'
import {
  encodeAnimalId,
  wordifyDate,
  formatNumber,
  yearToday,
  getImageLink,
} from 'src/composable/simpleComposable'
import {
  getWishlistFood,
  getWishlistMedicine,
  getWishlistSupplies,
  getOverallDonators,
  donatorsData,
  getOverAllDonationCash,
  getMonthDonationCash,
  getLatestDonators,
} from 'src/composable/taaraComposable'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  components: {
    TaaraFooter,
    donationDialog,
  },
  setup() {
    const wishlistFoodData = ref([])
    const wishlistMedicineData = ref([])
    const wishlistSuppliesData = ref([])
    const countOverallDonors = ref(0)
    const countOverallDonation = ref(0)
    const countThisMonthDonation = ref(0)
    const randomDonor = ref([])
    const targetWishlist = ref(null)
    const route = useRoute()
    const counterStore = useCounterStore()
    const filterDonator = (amount) => {
      return donatorsData.value.filter((obj) => obj.donation_amount === amount)
    }

    const filterOtherDonator = () => {
      let arr = [500, 1000, 1500]
      return donatorsData.value.filter((obj) => !arr.includes(obj.donation_amount))
    }

    const countOtherDonator = () => {
      let arr = [500, 1000, 1500]
      let result = donatorsData.value.filter((obj) => !arr.includes(obj.donation_amount)).length
      if (result > 5) {
        return '+' + (result - 5)
      }
    }

    const countDonators = (amount) => {
      let result = donatorsData.value.filter((obj) => obj.donation_amount === amount).length
      if (result > 9) {
        return '+' + (result - 9)
      }
    }

    const cuttedDonors = (cutNum) => {
      let startIndex = cutNum - 4
      let endIndex = cutNum
      return donatorsData.value.slice(startIndex, endIndex)
    }

    const countUniqueDonators = () => {
      const uniqueDonatorIds = new Set()
      const uniqueWalkInIds = new Set()

      donatorsData.value.forEach((obj) => {
        if (obj.donators_id) {
          uniqueDonatorIds.add(obj.donators_id)
        }
        if (obj.walk_in_id) {
          uniqueWalkInIds.add(obj.walk_in_id)
        }
      })

      const uniqueDonatorsCount = uniqueDonatorIds.size
      const uniqueWalkInCount = uniqueWalkInIds.size

      return uniqueDonatorsCount + uniqueWalkInCount
    }

    onMounted(() => {
      getWishlistFood().then((response) => {
        wishlistFoodData.value = response
      })
      getWishlistMedicine().then((response) => {
        wishlistMedicineData.value = response
      })
      getWishlistSupplies().then((response) => {
        wishlistSuppliesData.value = response
      })
      getOverallDonators().then((response) => {
        countOverallDonors.value = response
      })
      getOverAllDonationCash().then((response) => {
        countOverallDonation.value = response
      })
      getMonthDonationCash().then((response) => {
        countThisMonthDonation.value = response
      })
      console.log(route.query.wish)
      if (route.query.wish) {
        VueScrollTo.scrollTo(targetWishlist.value, 500, { offset: Number(route.query.wish) })
      }
      getLatestDonators().then((response) => {
        randomDonor.value = response
        console.log(randomDonor.value)
      })
    })
    return {
      getImageLink,
      randomDonor,
      targetWishlist,
      yearToday,
      countThisMonthDonation,
      countOverallDonation,
      countOverallDonors,
      countUniqueDonators,
      formatNumber,
      wordifyDate,
      cuttedDonors,
      autoplay: ref(true),
      slide: ref(1),
      countOtherDonator,
      countDonators,
      filterOtherDonator,
      filterDonator,
      donatorsData,
      encodeAnimalId,
      counterStore,
      wishlistFoodData,
      wishlistMedicineData,
      wishlistSuppliesData,

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#e0e0e0',
        width: '5px',
        opacity: '0.75',
      },
    }
  },
}
