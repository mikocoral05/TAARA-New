import { ref, onMounted } from 'vue'
import taaraFooter from 'src/components/taaraFooter.vue'
import BarChartsRescue from 'src/components/BarChartsRescue.vue'
import { formatNumber } from 'src/composable/simpleComposable'
import { allRescuedAnimal, animalsAdopted } from 'src/composable/taaraComposable'
import { getMonthlyDonation } from 'src/composable/latestPublicComposable'

export default {
  components: {
    taaraFooter,
    BarChartsRescue,
  },
  setup() {
    let amountGoal = ref(50000)
    let percentage = ref(0)

    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let totalRescue = ref(0)
    const thisMonthDonation = ref(0)

    onMounted(() => {
      getMonthlyDonation(month, year).then((response) => {
        thisMonthDonation.value = response.data
      })
    })
    return {
      thisMonthDonation,
      animalsAdopted,
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
