<template>
  <div ref="chartContainer" class="bubble-chart"></div>
</template>

<script>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'

export default {
  name: 'BubbleChart',
  setup() {
    const chartContainer = ref(null)

    onMounted(() => {
      const data = [
        { name: 'A', value: 30, image: 'bubble-chart/1.jpg' },
        { name: 'B', value: 50, image: 'bubble-chart/2.jpg' },
        { name: 'C', value: 65, image: 'bubble-chart/3.jpg' },
        { name: 'D', value: 75, image: 'bubble-chart/4.jpg' },
        { name: 'E', value: 85, image: 'bubble-chart/5.jpg' },
        { name: 'F', value: 20, image: 'bubble-chart/1.jpg' },
        { name: 'G', value: 30, image: 'bubble-chart/2.jpg' },
        { name: 'H', value: 15, image: 'bubble-chart/3.jpg' },
        { name: 'I', value: 85, image: 'bubble-chart/4.jpg' },
        { name: 'J', value: 85, image: 'bubble-chart/5.jpg' },
      ]

      const width = 600
      const height = 600

      const svg = d3
        .select(chartContainer.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const radiusScale = d3
        .scaleSqrt()
        .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
        .range([20, 60])

      const defs = svg.append('defs')

      data.forEach((d, i) => {
        const radius = radiusScale(d.value)
        defs
          .append('pattern')
          .attr('id', `img-pattern-${i}`)
          .attr('patternUnits', 'objectBoundingBox')
          .attr('width', 1)
          .attr('height', 1)
          .append('image')
          .attr('href', d.image)
          .attr('preserveAspectRatio', 'xMidYMid slice') // This makes it behave like background-size: cover
          .attr('width', radius * 2)
          .attr('height', radius * 2)
      })

      const nodes = svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', (d) => radiusScale(d.value))
        .attr('fill', (d, i) => `url(#img-pattern-${i})`)

      d3.forceSimulation(data)
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('charge', d3.forceManyBody().strength(5))
        .force(
          'collision',
          d3.forceCollide().radius((d) => radiusScale(d.value) + 4),
        )
        .on('tick', () => {
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
        })
    })

    return {
      chartContainer,
    }
  },
}
</script>

<style scoped>
.bubble-chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
