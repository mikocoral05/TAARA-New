<template>
  <q-page>
    <div class="row no-wrap justify-between items-start">
      <div class="column no-wrap">
        <div class="row q-mb-md">
          <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
            <q-card-section>
              <div class="row no-wrap justify-between">
                <div class="text-grey-7 text-caption">OVERALL RESCUE</div>
                <q-icon name="sym_r_fire_truck" size="1.5rem" color="red" />
              </div>
              <div class="text-h6 text-bold q-mt-lg">
                {{ formatOrNumber(23235) }}
              </div>
              <div class="text-grey-7 text-caption q-mt-sm">
                <q-icon name="sym_r_north_east" class="text-positive text-bold q-mr-xs" /><span
                  class="text-positive text-bold"
                  >25%</span
                >
                vs last month
              </div>
            </q-card-section>
          </q-card>
          <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
            <q-card-section>
              <div class="row no-wrap justify-between">
                <div class="text-grey-7 text-caption">PET AVAILABLE</div>
                <q-icon name="sym_r_pets" size="1.5rem" color="primary" />
              </div>
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(4534) }}</div>
              <div class="text-grey-7 text-caption q-mt-sm">
                <q-icon name="sym_r_south_west" class="text-negative text-bold q-mr-xs" /><span
                  class="text-negative text-bold"
                  >-5%</span
                >
                vs last month
              </div>
            </q-card-section>
          </q-card>
          <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
            <q-card-section>
              <div class="row no-wrap justify-between">
                <div class="text-grey-7 text-caption">TOTAL ADOPTED</div>
                <q-icon name="sym_r_diversity_1" size="1.5rem" color="positive" />
              </div>
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(3734) }}</div>
              <div class="text-grey-7 text-caption q-mt-sm">
                <q-icon name="sym_r_north_east" class="text-positive text-bold q-mr-xs" /><span
                  class="text-positive text-bold"
                  >15%</span
                >
                vs last month
              </div>
            </q-card-section>
          </q-card>
          <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
            <q-card-section>
              <div class="row no-wrap justify-between">
                <div class="text-grey-7 text-caption">IN MEDICATION</div>
                <q-icon name="sym_r_monitor_heart" size="1.5rem" color="blue" />
              </div>
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(1734) }}</div>
              <div class="text-grey-7 text-caption q-mt-sm">
                <q-icon name="sym_r_north_east" class="text-positive text-bold q-mr-xs" /><span
                  class="text-positive text-bold"
                  >15%</span
                >
                vs last month
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row no-wrap justify-between items-center">
        <q-btn icon="sym_r_add" dense unelevated class="q-mr-md" />
        <q-btn icon="sym_r_upload" dense unelevated />
      </div>
    </div>
    <div class="radius-10 q-mb-md row no-wrap">
      <DoughnutChart style="width: 300px" class="bg-white q-mr-md radius-10" />
      <div class="bg-white full-width radius-10">
        <q-table :rows="rows" :columns="columns" row-key="name" :rows-per-page-options="[4]" flat>
          <template v-slot:top>
            <div class="text-body1 q-mb-md">
              Geographical Hotspots <q-icon class="q-ml-sm" size="1.2rem" name="sym_r_language" />
            </div>
          </template>
        </q-table>

        <LeafletMap v-if="showMap" />
      </div>
    </div>
    <div class="bg-white radius-10">
      <StackBarLine />
    </div>
  </q-page>
</template>
<script>
import DoughnutChart from 'src/components/DoughnutChart.vue'
import LeafletMap from 'src/components/LeafletMap.vue'
import StackBarLine from 'src/components/StackBarLine.vue'
import { formatNumber, formatOrNumber } from 'src/composable/simpleComposable'
import { ref } from 'vue'

export default {
  components: { StackBarLine, DoughnutChart, LeafletMap },
  setup() {
    const columns = [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Address',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
      { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
    ]

    const rows = [
      {
        id: 1,
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
      },
      {
        id: 2,
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%',
      },
      {
        id: 3,
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%',
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%',
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%',
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%',
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%',
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%',
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%',
      },
    ]
    const showMap = ref(false)
    return { columns, rows, showMap, formatOrNumber, formatNumber }
  },
}
</script>
