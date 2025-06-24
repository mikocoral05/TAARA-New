<template>
  <div class="acquisitions relative-position">
    <!-- <canvas id="acquisitions" width="800" height="400"></canvas> -->
    <p class="q-ma-none absolute-center text-subtitle1">100%</p>
    <canvas ref="acquisitions"> </canvas>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { onMounted } from 'vue'
import { getBudgetAllocation } from 'src/composable/taaraComposable'
import { monthNames, monthToday, yearToday } from 'src/composable/simpleComposable'
import Chart from 'chart.js/auto'
export default defineComponent({
  name: 'DoughNut',
  setup() {
    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    })
    let acquisitions = ref()
    // (async function () {
    // const DATA_COUNT = 5;
    // const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

    onMounted(() => {
      getBudgetAllocation(filteredDate.value, 'funds_expenses')
        .then((response) => {
          let filterPercentage = response.map((obj) => {
            return obj.percentage
          })
          console.log(filterPercentage)
          const data = {
            datasets: [
              {
                label: 'Percentage Distribution',
                data: filterPercentage,
              },
            ],
          }
          new Chart(acquisitions.value, {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              cutout: '80%',
            },
          })
        })
        .catch((error) => {
          console.log(error)
        })
    })
    // })();
    return {
      acquisitions,
    }
  },
})
</script>

<style lang="scss" scope>
.acquisitions {
  width: 100%;
  height: 100%;
}
</style>
