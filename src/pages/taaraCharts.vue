<template>
  <q-page class="column items-center">
    <div class="first-layer text-body1">
      <div class="background-image absolute-top"></div>
      <h3 class="text-center q-my-md q-pt-lg text-white">
        {{ formattedString }}
      </h3>
      <p class="text-center text-white">“Uncover patterns in rescues, adoptions, and donations.”</p>
      <div class="flex row justify-center items-center chart-container">
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ totalRescue }}
                </h2>
                <p class="box-label">Total of Rescue</p>
              </div>
              <q-img src="../image/pet-care.png" class="images" />
            </div>
            <q-btn
              no-caps
              class="text-white text-center q-pa-sm click-for-more"
              flat
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              to="/public/totalOfRescue"
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
        <!-- ------------------ -->
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ totalAdopted }}
                </h2>
                <p class="box-label">Total of Adoption</p>
              </div>
              <q-img src="../image/pet-adoption.png" class="images" />
            </div>
            <q-btn
              to="/public/totalOfAdoption"
              no-caps
              flat
              class="text-white text-center q-pa-sm click-for-more"
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
        <!-- ------------------------- -->
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ formatNumber(thisMonthDonation, 'noDecimal') }}
                </h2>
                <p class="box-label">Total of Donations</p>
              </div>
              <q-img src="../image/handheart.png" class="images" />
            </div>
            <q-btn
              to="/public/totalOfDonations"
              flat
              no-caps
              class="text-white text-center q-pa-sm click-for-more"
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center q-mb-xl almost-container">
        <div class="bottom-div flex justify-center items-center column q-mb-xl q-ma-md">
          <h2 class="text-center almost-there q-my-sm">
            {{ percentage == 100 ? 'Thank you for your support!' : `We're Almost There!` }}
          </h2>
          <div style="width: 100%" class="flex justify-between items-center">
            <div>
              <p class="text-zize-left q-ml-xl">We Have Received</p>
              <p class="text-zize-left q-ml-xl">
                {{ formatNumber(thisMonthDonation) }}
              </p>
            </div>
            <div>
              <p class="text-zize-right q-mr-xl">Our Goal</p>
              <p class="text-zize-right q-mr-xl">
                {{ formatNumber(amountGoal) }}
              </p>
            </div>
          </div>
          <div
            class="flex row justify-center items-center q-mb-xl percentage-container no-wrap"
            style="width: 100%"
          >
            <q-img src="../image/sad-dog.png" class="dog-cat-image q-ml-sm" />
            <div class="container-skill">
              <div class="skill" :style="{ width: percentage + '%' }">{{ percentage }}%</div>
            </div>
            <q-img src="../image/happy-cat.jpg" class="dog-cat-image q-mr-sm" />
          </div>
        </div>
      </div>
    </div>

    <TaaraFooter class="footer full-width"></TaaraFooter>
  </q-page>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { formatNumber } from 'src/composable/simpleComposable'
import { allRescuedAnimal, animalsAdopted } from 'src/composable/taaraComposable'
import { date } from 'quasar'
import {
  getMonthlyDonation,
  getTotalAdoption,
  getTotalRescue,
} from 'src/composable/latestPublicComposable'

export default {
  components: {
    TaaraFooter,
  },
  setup() {
    const dateP = new Date()
    const month = dateP.getMonth() + 1
    const year = dateP.getFullYear()
    const formattedString = date.formatDate(Date.now(), 'MMMM YYYY')
    const totalRescue = ref(0)
    const totalAdopted = ref(0)
    const thisMonthDonation = ref(0)

    const amountGoal = ref(50000)
    const percentage = computed(() => {
      const goal = amountGoal.value
      const donation = thisMonthDonation.value

      if (goal === 0) return 0 // Prevent division by zero
      const result = (donation / goal) * 100
      return result > 100 ? 100 : result
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
      formattedString,
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
</script>
<style lang="scss" scoped src="pages/taara/style/taaraCharts.scss"></style>
