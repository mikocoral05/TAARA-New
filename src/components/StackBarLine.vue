<template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineComponent, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  name: 'StackBarLine',
  props: {
    chartLabels: {
      type: Array,
      required: true,
    },
    chartDatasets: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      const config = {
        type: 'bar',
        data: {
          labels: props.chartLabels,
          datasets: props.chartDatasets,
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: props.title,
            },
          },
          scales: {
            y: {
              stacked: false,
            },
          },
        },
      }

      chartInstance = new Chart(chartCanvas.value, config)
    }

    onMounted(() => {
      if (chartCanvas.value) {
        createChart()
      }
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    // Optional: Watch for prop changes to re-render chart
    watch(
      () => [props.chartLabels, props.chartDatasets],
      () => {
        if (chartInstance) createChart()
      },
      { deep: true },
    )

    return {
      chartCanvas,
    }
  },
})
</script>
