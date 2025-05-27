<template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

// Register only necessary chart components
Chart.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'DoughnutChart',
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    // === Utils ===
    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
    }

    const data = {
      labels: ['Stray', 'Surrendered'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [300, 100],
          backgroundColor: [CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.yellow],
          hoverOffset: 4,
        },
      ],
    }

    const config = {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Classification of Rescue',
          },
        },
      },
    }

    // === Lifecycle ===
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
})
</script>
