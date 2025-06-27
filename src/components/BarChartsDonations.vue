<template>
  <div class="canvased">
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'
import Chart from 'chart.js/auto'
import { yearToday, threeWordsAbbMonth, twoWordsAbbMonth } from 'src/composable/simpleComposable'
import { getMonthlyDonation } from 'src/composable/latestComposable'

export default defineComponent({
  name: 'BarChartsDonation',
  setup() {
    const acquisitions = ref()
    const monthlyDonationData = ref([])
    let chart = null
    let dataShow = []

    const createChart = () => {
      if (chart) chart.destroy()

      chart = new Chart(acquisitions.value, {
        type: 'bar',
        data: {
          labels: dataShow.map((row) => row.month),
          datasets: [
            {
              label: `Donations per Month (${yearToday})`,
              data: monthlyDonationData.value,
              backgroundColor: '#B157AE',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      })
    }

    let resizeTimeout = null

    const onWindowResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 365 && window.innerWidth <= 420) {
          dataShow = twoWordsAbbMonth
        } else if (window.innerWidth <= 364) {
          dataShow = threeWordsAbbMonth.map((item) => ({
            month: item.month.charAt(0),
          }))
        } else {
          dataShow = threeWordsAbbMonth
        }

        if (monthlyDonationData.value.length) {
          createChart()
        }
      }, 250)
    }

    onMounted(async () => {
      window.addEventListener('resize', onWindowResize)

      // Fetch donation data
      monthlyDonationData.value = await getMonthlyDonation(yearToday)
      console.log(monthlyDonationData.value)

      // After data is ready, render chart
      onWindowResize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize)
      if (chart) chart.destroy()
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
