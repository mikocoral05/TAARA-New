<template>
  <div class="canvased">
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>

<script>
import { onMounted, defineComponent, ref, onUnmounted } from 'vue'
import { yearToday, threeWordsAbbMonth, twoWordsAbbMonth } from 'src/composable/simpleComposable'
import Chart from 'chart.js/auto'
import { getMonthlyRescue } from 'src/composable/latestComposable'

export default defineComponent({
  name: 'BarChartsRescue',
  setup() {
    const acquisitions = ref()
    const monthlyRescuedAnimal = ref([])
    const chartInstance = ref(null)

    // Static full month names
    const fullMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const formatMonthLabels = () => {
      if (window.innerWidth <= 364) {
        return fullMonths.map((m) => m.charAt(0)) // First letter
      } else if (window.innerWidth <= 420) {
        return twoWordsAbbMonth.map((m) => m.month) // Like "Ja", "Fe"
      } else {
        return threeWordsAbbMonth.map((m) => m.month) // Like "Jan", "Feb"
      }
    }

    const createChart = (labels) => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      chartInstance.value = new Chart(acquisitions.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: `Rescued Animal by Month (${yearToday})`,
              data: monthlyRescuedAnimal.value,
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

    const handleResize = () => {
      const labels = formatMonthLabels()
      createChart(labels)
    }

    let resizeTimeout = null
    const onWindowResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 200)
    }

    onMounted(async () => {
      window.addEventListener('resize', onWindowResize)

      // Get animal count per month (expected: length 12)
      monthlyRescuedAnimal.value = await getMonthlyRescue(yearToday)

      // Initial chart
      handleResize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
      if (chartInstance.value) chartInstance.value.destroy()
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
