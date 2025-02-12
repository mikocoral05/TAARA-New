<template>
  <div>
    <canvas ref="chartCanvas" width="1200" height="400"></canvas>
    <div class="actions">
      <button @click="randomizeData">Randomize</button>
      <button @click="addDataset">Add Dataset</button>
      <button @click="addData">Add Data</button>
      <button @click="removeDataset">Remove Dataset</button>
      <button @click="removeData">Remove Data</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export default {
  setup() {
    const chartCanvas = ref(null)
    let chartInstance = null

    // Define Data & Configuration
    const DATA_COUNT = 12
    // const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 }

    const labels = Array.from({ length: DATA_COUNT }, (_, i) => `Month ${i + 1}`)
    const generateRandomData = () =>
      Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 200 - 100))

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: generateRandomData(),
          borderColor: '#c10015',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
        {
          label: 'Dataset 2',
          data: generateRandomData(),
          borderColor: '#557ff7',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
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

    // Actions
    const randomizeData = () => {
      if (chartInstance) {
        chartInstance.data.datasets.forEach((dataset) => {
          dataset.data = generateRandomData()
        })
        chartInstance.update()
      }
    }

    const addDataset = () => {
      if (chartInstance) {
        const color = `hsl(${Math.random() * 360}, 70%, 50%)`
        const newDataset = {
          label: `Dataset ${chartInstance.data.datasets.length + 1}`,
          backgroundColor: color,
          borderColor: color,
          data: generateRandomData(),
        }
        chartInstance.data.datasets.push(newDataset)
        chartInstance.update()
      }
    }

    const addData = () => {
      if (chartInstance) {
        const newMonth = `Month ${chartInstance.data.labels.length + 1}`
        chartInstance.data.labels.push(newMonth)

        chartInstance.data.datasets.forEach((dataset) => {
          dataset.data.push(Math.floor(Math.random() * 200 - 100))
        })

        chartInstance.update()
      }
    }

    const removeDataset = () => {
      if (chartInstance && chartInstance.data.datasets.length > 0) {
        chartInstance.data.datasets.pop()
        chartInstance.update()
      }
    }

    const removeData = () => {
      if (chartInstance && chartInstance.data.labels.length > 0) {
        chartInstance.data.labels.pop()

        chartInstance.data.datasets.forEach((dataset) => {
          dataset.data.pop()
        })

        chartInstance.update()
      }
    }

    return {
      chartCanvas,
      randomizeData,
      addDataset,
      addData,
      removeDataset,
      removeData,
    }
  },
}
</script>

<style scoped>
.actions {
  margin-top: 10px;
}
button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
