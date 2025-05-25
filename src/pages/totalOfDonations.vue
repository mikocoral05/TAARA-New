<template>
  <q-page>
    <div class="flex justify-center items-center text-white">
      <div class="first-container q-ma-lg q-mx-xl q-pb-sm">
        <div class="row justify-between items-center q-pb-md">
          <div class="justify-center items-center column date-year">
            <h3 class="q-mb-none q-ml-xl month q-ma-none q-mt-md q-mb-none">
              {{ filteredDate.month.label }}
            </h3>
            <h3 class="q-mt-xs q-ml-xl year q-ma-none q-mb-none">
              {{ filteredDate.year }}
            </h3>
          </div>
          <div class="row justify-center items-center q-ml-xl total-donation-container">
            <div
              class="column justify-center items-center q-mr-xl total-label-container q-pa-none q-mt-md"
            >
              <h3 class="q-pa-none q-ma-none q-mb-sm">
                {{ formatNumber(totalDonation, 'noDecimal') }}
              </h3>
              <p class="q-mb-none total-label q-mt-none">Total of Donations</p>
            </div>
            <div class="q-mr-xl image-container q-mt-md">
              <q-img src="../image/handheart.png" class="image" />
            </div>
          </div>
        </div>
        <div class="column justify-center items-center" style="width: 100%">
          <div
            class="small-div row justify-around items-center q-mb-md q-pa-sm"
            v-for="(value, week) in objectsWeeklyDonation"
            :key="week"
          >
            <p class="q-ma-sm">{{ week }} Week</p>
            <p class="q-ma-sm">Total donated</p>
            <div>
              <p class="q-ma-sm">
                {{ formatNumber(value.donation) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="full-width">
        <h3 class="text-black text-center year-donate-bottom q-mb-none">
          {{ filteredDate.year }} Donations
        </h3>
      </div>
      <div
        class="flex column justify-center items-center bar-container q-ma-lg q-mx-xl q-mb-xl q-pa-lg"
      >
        <BarChartsDonations />
      </div>
      <TaaraFooter class="footer full-width"></TaaraFooter>
    </div>
  </q-page>
</template>
<script>
import BarChartsDonations from 'src/components/BarChartsDonations.vue'
import { ref, onMounted } from 'vue'
import { yearToday, monthToday, formatNumber, monthNames } from 'src/composable/simpleComposable'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { getMonthlyDonation } from 'src/composable/latestPublicComposable'
export default {
  components: {
    BarChartsDonations,
    TaaraFooter,
  },
  setup() {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    })
    let totalDonation = ref(0)
    let objectsWeeklyDonation = ref({})
    onMounted(() => {
      getMonthlyDonation(month, year).then((response) => {
        totalDonation.value = response.data
      })
    })
    return {
      objectsWeeklyDonation,
      filteredDate,
      totalDonation,
      formatNumber,
    }
  },
}
</script>
<style lang="scss" scoped src="../pages/taara/style/totalOfRescueAdoptionDonation.scss"></style>
