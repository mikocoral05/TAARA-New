<template>
  <div class="q-pa-md">
    <div id="map" class="leaflet-map"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix marker icon issue with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default defineComponent({
  name: 'LeafletMap',
  setup() {
    let map = null

    onMounted(() => {
      // Initialize the map
      map = L.map('map').setView([51.505, -0.09], 5)

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Define 4 locations with labels
      const locations = [
        { coords: [51.505, -0.09], label: 'London' },
        { coords: [48.8566, 2.3522], label: 'Paris' },
        { coords: [52.52, 13.405], label: 'Berlin' },
        { coords: [41.9028, 12.4964], label: 'Rome' },
      ]

      // Add markers
      locations.forEach((loc) => {
        L.marker(loc.coords).addTo(map).bindPopup(`<b>${loc.label}</b>`)
      })
    })

    onUnmounted(() => {
      if (map) {
        map.remove()
      }
    })
  },
})
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
