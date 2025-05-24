import { ref, onMounted, computed } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import BarChartsRescue from 'src/components/BarChartsRescue.vue'
import { formatNumber } from 'src/composable/simpleComposable'
import { allRescuedAnimal, animalsAdopted } from 'src/composable/taaraComposable'
import {
  getMonthlyDonation,
  getTotalAdoption,
  getTotalRescue,
} from 'src/composable/latestPublicComposable'

export default {
  components: {
    TaaraFooter,
    BarChartsRescue,
  },
  setup() {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const totalRescue = ref(0)
    const totalAdopted = ref(0)
    const thisMonthDonation = ref(0)

    const amountGoal = ref(50000)
    const percentage = computed(() => {
      const goal = amountGoal.value
      const donation = thisMonthDonation.value

      if (goal === 0) return 0 // Prevent division by zero

      return (donation / goal) * 100
    })

    onMounted(() => {
      getMonthlyDonation(month, year).then((response) => {
        thisMonthDonation.value = response.data
      })
      getTotalRescue(month, year).then((response) => {
        totalRescue.value = response.data
      })
      getTotalAdoption(month, year).then((response) => {
        totalAdopted.value = response.data
      })
    })
    return {
      thisMonthDonation,
      animalsAdopted,
      totalAdopted,
      allRescuedAnimal,
      totalRescue,
      month,
      percentage,
      amountGoal,
      formatNumber,
      TaaraFooter,
    }
  },
}
