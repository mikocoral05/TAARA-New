<template>
  <div class="canvased">
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>
<script>
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'
import Chart from 'chart.js/auto'
import { yearToday, threeWordsAbbMonth, twoWordsAbbMonth } from 'src/composable/simpleComposable'
import { getMonthlyDonationByYear } from 'src/composable/latestPublicComposable'
export default defineComponent({
  name: 'BarChartsRescue',
  setup() {
    let acquisitions = ref()
    let dataShow = null
    const monthlyDonationData = ref([])
    let chart = null
    function createChart() {
      if (chart) {
        chart.destroy()
      }

      chart = new Chart(acquisitions.value, {
        type: 'bar',
        data: {
          labels: dataShow.map((row) => row.month),
          datasets: [
            {
              label: 'Rescued Animal by Month ',
              data: monthlyDonationData.value.map((row) => row.total_donation),
              backgroundColor: '#B157AE',
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }

    let resizeTimeout = null

    function onWindowResize() {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 365 && window.innerWidth <= 420) {
          dataShow = twoWordsAbbMonth
        } else if (window.innerWidth <= 364) {
          let newData = threeWordsAbbMonth.map((item) => {
            return { month: item.month.charAt(0) }
          })
          dataShow = newData
        } else {
          dataShow = threeWordsAbbMonth
        }
        createChart()
      }, 250)
    }

    onMounted(() => {
      window.addEventListener('resize', onWindowResize)
      onWindowResize()
      getMonthlyDonationByYear(yearToday)
        .then((response) => {
          monthlyDonationData.value = response
          createChart()
        })
        .catch((error) => {
          console.log(error)
        })
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
