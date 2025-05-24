import { ref, onMounted } from 'vue'
import taaraFooter from 'src/components/taaraFooter.vue'
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
    taaraFooter,
    BarChartsRescue,
  },
  setup() {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const amountGoal = ref(50000)
    const percentage = ref(0)

    const totalRescue = ref(0)
    const totalAdopted = ref(0)
    const thisMonthDonation = ref(0)

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
      taaraFooter,
    }
  },
}
