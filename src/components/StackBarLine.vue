<!-- <template>
  <div class="q-pa-md q-pb-lg">
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
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
  },
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      blue: 'rgb(54, 162, 235)',
      green: 'rgb(75, 192, 192)',
      yellow: 'rgb(255, 205, 86)',
      purple: 'rgb(153, 102, 255)',
      orange: 'rgb(255, 159, 64)',
    }

    const transparentize = (color, opacity) => {
      const alpha = 1 - opacity
      return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
    }

    const numbers = ({ count, min = 0, max = 100 }) => {
      const arr = []
      for (let i = 0; i < count; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
      return arr
    }

    const months = ({ count }) => {
      const base = [
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
      return base.slice(0, count)
    }

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    const namedColor = (index) => {
      const colorKeys = Object.keys(CHART_COLORS)
      return CHART_COLORS[colorKeys[index % colorKeys.length]]
    }

    const DATA_COUNT = 12
    const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 }

    const labels = months({ count: DATA_COUNT })
    const data = {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: numbers(NUMBER_CFG),
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
          stack: 'combined',
          type: 'bar',
        },
        {
          label: 'Dataset 2',
          data: numbers(NUMBER_CFG),
          borderColor: CHART_COLORS.blue,
          backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
          stack: 'combined',
        },
      ],
    }

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Stacked Line/Bar Chart',
          },
        },
        scales: {
          y: {
            stacked: true,
          },
        },
      },
    }

    const actions = [
      {
        name: 'Randomize',
        handler(chart) {
          chart.data.datasets.forEach((dataset) => {
            dataset.data = numbers({ count: chart.data.labels.length, min: 0, max: 100 })
          })
          chart.update()
        },
      },
      {
        name: 'Add Dataset',
        handler(chart) {
          const dsColor = namedColor(chart.data.datasets.length)
          const newDataset = {
            label: 'Dataset ' + (chart.data.datasets.length + 1),
            backgroundColor: transparentize(dsColor, 0.5),
            borderColor: dsColor,
            borderWidth: 1,
            stack: 'combined',
            data: numbers({ count: chart.data.labels.length, min: 0, max: 100 }),
          }
          chart.data.datasets.push(newDataset)
          chart.update()
        },
      },
      {
        name: 'Add Data',
        handler(chart) {
          chart.data.labels.push(months({ count: chart.data.labels.length + 1 }).slice(-1)[0])
          chart.data.datasets.forEach((dataset) => {
            dataset.data.push(rand(0, 100))
          })
          chart.update()
        },
      },
      {
        name: 'Remove Dataset',
        handler(chart) {
          chart.data.datasets.pop()
          chart.update()
        },
      },
      {
        name: 'Remove Data',
        handler(chart) {
          chart.data.labels.pop()
          chart.data.datasets.forEach((dataset) => {
            dataset.data.pop()
          })
          chart.update()
        },
      },
    ]

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
      actions,
    }
  },
})
</script> -->
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
      type: Text,
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
              stacked: true,
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
