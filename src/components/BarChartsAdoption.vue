<template>
  <div class="canvased">
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { getMonthlyAdopted } from 'src/composable/latestComposable'
import { yearToday, threeWordsAbbMonth, twoWordsAbbMonth } from 'src/composable/simpleComposable'

export default defineComponent({
  name: 'BarChartsRescue',
  setup() {
    const acquisitions = ref()
    const monthlyAdoption = ref([]) // ✅ Use an empty array, not 0
    let dataShow = null
    let chart = null
    let resizeTimeout = null

    function createChart() {
      if (chart) {
        chart.destroy()
      }

      chart = new Chart(acquisitions.value, {
        type: 'bar',
        data: {
          labels: dataShow.map((row) => row.month), // ✅ Uses responsive month labels
          datasets: [
            {
              label: 'Adopted Animals by Month',
              data: monthlyAdoption.value,
              backgroundColor: '#B157AE',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }

    function onWindowResize() {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 365 && window.innerWidth <= 420) {
          dataShow = twoWordsAbbMonth
        } else if (window.innerWidth <= 364) {
          dataShow = threeWordsAbbMonth.map((item) => {
            return { month: item.month.charAt(0) }
          })
        } else {
          dataShow = threeWordsAbbMonth
        }
        createChart() // ✅ Now this only runs after data is loaded
      }, 250)
    }

    onMounted(async () => {
      window.addEventListener('resize', onWindowResize)
      monthlyAdoption.value = await getMonthlyAdopted(yearToday) // ✅ Data fetched first
      console.log(monthlyAdoption.value)

      onWindowResize() // ✅ Then render chart
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
    })

    return {
      acquisitions,
    }
  },
})
</script>

<style scoped lang="scss">
.canvased {
  max-width: 90%;
  width: 100%;
}
.text {
  font-size: 3px;
}
</style>
