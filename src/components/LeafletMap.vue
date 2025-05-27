<template>
  <div>
    <div id="map" class="leaflet-map"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default defineComponent({
  name: 'LeafletMap',
  setup() {
    let map = null

    onMounted(() => {
      // Initialize the map
      map = L.map('map').setView([13.2653, 123.7877], 13)

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Define 4 locations with labels
      const locations = [
        { coords: [13.2653, 123.7877], label: 'Sto. Domingo Town Proper' },
        { coords: [13.2715, 123.7969], label: 'Barangay Lidong' },
        { coords: [13.2602, 123.7745], label: 'Barangay Buhatan' },
        { coords: [13.2781, 123.782], label: 'Mayon Resthouse Viewpoint' },
      ]

      const defaultIcon = new L.Icon.Default()

      locations.forEach((loc) => {
        L.marker(loc.coords, { icon: defaultIcon }) // explicitly assign default icon here
          .addTo(map)
          .bindPopup(`<b>${loc.label}</b>`)
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
  height: 310px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
