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
          <div
            class="row justify-center items-center q-ml-xl total-donation-container"
          >
            <div
              class="column justify-center items-center q-mr-xl total-label-container q-pa-none q-mt-md"
            >
              <h3 class="q-pa-none q-ma-none q-mb-sm">
                {{ formatNumber(totalDonation, "noDecimal") }}
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
      <PageFooter class="footer"></PageFooter>
    </div>
  </q-page>
</template>
<script>
import BarChartsDonations from "src/components/BarChartsDonations.vue";
import PageFooter from "src/components/PageFooter.vue";
import { ref, onMounted } from "vue";
import {
  weekCount,
  yearToday,
  monthToday,
  formatNumber,
  monthNames,
} from "src/composable/simpleComposable";
import { getMonthDonation } from "../composable/taaraComposable";
export default {
  components: {
    BarChartsDonations,
    PageFooter,
  },
  setup() {
    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    });
    let totalDonation = ref(0);
    let objectsWeeklyDonation = ref({});
    onMounted(() => {
      getMonthDonation(filteredDate.value.month.value, yearToday)
        .then((donationThisMonth) => {
          console.log(donationThisMonth);
          let count = weekCount(
            filteredDate.value.year,
            filteredDate.value.month.value
          );
          const weeklySummary = {};
          let allDonation = 0;
          // Initialize weekly summary object
          for (let week = 1; week <= count; week++) {
            weeklySummary[week] = { donation: 0 };
          }

          // Process each rescue entry
          for (const entry of donationThisMonth) {
            const rescueDate = new Date(entry.donation_date); // Assuming 'date' is the key for rescue date
            const weekNumber = weekCount(
              rescueDate.getFullYear(),
              rescueDate.getMonth() + 1
            );

            // Increment the count for the corresponding animal type
            weeklySummary[weekNumber].donation += entry.donation_amount;
            allDonation += entry.donation_amount;
          }
          objectsWeeklyDonation.value = weeklySummary;
          totalDonation.value = allDonation;
          console.log(weeklySummary);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    return {
      objectsWeeklyDonation,
      filteredDate,
      totalDonation,
      formatNumber,
    };
  },
};
</script>
<style
  lang="scss"
  scoped
  src="../pages/taara/style/totalOfRescueAdoptionDonation.scss"
></style>
