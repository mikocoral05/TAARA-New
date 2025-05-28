<template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { watch } from 'vue'

// Register only necessary chart components
Chart.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'DoughnutChart',
  props: {
    data1: {
      type: Number,
      required: true,
      default: 0,
    },
    data2: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

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
          label: 'Total of',
          data: [props.data1, props.data2],
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

    watch(
      () => [props.data1, props.data2],
      ([newData1, newData2]) => {
        if (chartInstance) {
          chartInstance.data.datasets[0].data = [newData1, newData2]
          chartInstance.update()
        }
      },
    )

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
