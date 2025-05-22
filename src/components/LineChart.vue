<!-- <template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    const DATA_COUNT = 48 // 52 weeks in a year
    const WEEKS_PER_MONTH = 4 // Approx. 4 weeks per month

    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    // Create weekly labels but only display months
    const labels = Array.from({ length: DATA_COUNT }, (_, i) => {
      return monthLabels[Math.floor(i / WEEKS_PER_MONTH)] // Group by month
    })

    // Generate random weekly data for more fluctuations
    const generateRandomData = () => {
      return Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 90000 + 1000))
    }

    const data = {
      labels: labels, // Still using month labels
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(),
          borderColor: '#c10015',
          pointRadius: (ctx) => {
            // Show point only for the first week of each month
            return ctx.dataIndex % WEEKS_PER_MONTH === 0 ? 5 : 0
          },
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
            gradient.addColorStop(0, 'rgba(193, 0, 21, 0.3)')
            gradient.addColorStop(0.7, 'rgba(193, 0, 21, 0.1)')
            gradient.addColorStop(1, 'rgba(193, 0, 21, 0)')
            return gradient
          },
          fill: true,
        },
        {
          label: 'Dataset 2',
          data: generateRandomData(),
          borderColor: '#557ff7',
          pointRadius: (ctx) => {
            // Show point only for the first week of each month
            return ctx.dataIndex % WEEKS_PER_MONTH === 0 ? 5 : 0
          },
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
            gradient.addColorStop(0, 'rgba(85, 127, 247, 0.3)')
            gradient.addColorStop(0.7, 'rgba(85, 127, 247, 0.1)')
            gradient.addColorStop(1, 'rgba(85, 127, 247, 0)')
            return gradient
          },
          fill: true,
        },
      ],
    }

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Chart.js Line Chart' },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              callback: (value, index) => {
                // Show only month labels, not every week
                return index % WEEKS_PER_MONTH === 0 ? labels[index] : ''
              },
              autoSkip: false, // Ensure labels are evenly spaced
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            grid: {
              display: true,
            },
            ticks: {
              display: true,
            },
            border: {
              display: true,
            },
          },
        },
      },
    }

    // Initialize Chart
    onMounted(() => {
      if (chartCanvas.value) {
        chartInstance = new Chart(chartCanvas.value, config)
      }
    })

    // Destroy Chart on Unmount
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      chartCanvas,
    }
  },
}
</script> -->
<template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    const DATA_COUNT = 48 // 52 weeks in a year approx.
    const WEEKS_PER_MONTH = 4

    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    const labels = Array.from({ length: DATA_COUNT }, (_, i) => {
      return monthLabels[Math.floor(i / WEEKS_PER_MONTH)]
    })

    const generateRandomData = () => {
      return Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 90000 + 1000))
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(),
          backgroundColor: '#c10015',
        },
        {
          label: 'Dataset 2',
          data: generateRandomData(),
          backgroundColor: '#557ff7',
        },
      ],
    }

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Chart.js Bar Chart' },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                return index % WEEKS_PER_MONTH === 0 ? labels[index] : ''
              },
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            },
            stacked: false,
          },
          y: {
            grid: { display: true },
            ticks: { display: true },
            stacked: false,
          },
        },
      },
    }

    onMounted(() => {
      if (chartCanvas.value) {
        chartInstance = new Chart(chartCanvas.value, config)
      }
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      chartCanvas,
    }
  },
}
</script>
