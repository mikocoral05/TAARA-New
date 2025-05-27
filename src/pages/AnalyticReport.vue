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
        <q-btn icon="sym_r_download" dense unelevated />
        <q-btn icon="sym_r_more_vert" dense unelevated>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Pet Report</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Budget Report</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <div class="radius-10 q-mb-md row no-wrap">
      <DoughnutChart style="width: 300px" class="bg-white q-mr-md radius-10" />
      <div class="bg-white full-width radius-10 q-pa-md">
        <q-table :rows="rows" :columns="columns" row-key="name" :rows-per-page-options="[4]" flat>
          <template v-slot:top>
            <div class="text-body1 q-mb-md">
              Geographical Hotspots <q-icon class="q-ml-sm" size="1.2rem" name="sym_r_language" />
            </div>
          </template>
          <template v-slot:body-cell-btn="props">
            <q-td :props="props">
              <q-btn flat dense no-caps :ripple="false" class="q-px-md">
                <span class="q-mr-sm text-caption">Show </span>
                <q-icon name="sym_r_location_on" size="1.2rem" class="cursor-pointer" />
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <div class="bg-white radius-10">
      <StackBarLine />
    </div>
  </q-page>
</template>
<script>
import DoughnutChart from 'src/components/DoughnutChart.vue'
import StackBarLine from 'src/components/StackBarLine.vue'
import { formatNumber, formatOrNumber } from 'src/composable/simpleComposable'
import { ref } from 'vue'

export default {
  components: { StackBarLine, DoughnutChart },
  setup() {
    const columns = [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'address',
        required: true,
        label: 'Address',
        align: 'left',
        field: 'address',
        sortable: true,
      },
      { name: 'btn', align: 'center', label: 'Map' },
    ]

    const rows = [
      { id: 1, address: 'Centro, Sto. Domingo, Albay, Philippines' },
      { id: 2, address: 'Barangay Salvacion, Sto. Domingo, Albay' },
      { id: 3, address: 'Barangay Lidong, Sto. Domingo, Albay' },
      { id: 4, address: 'Barangay Buhatan, Sto. Domingo, Albay' },
    ]

    return { columns, rows, formatOrNumber, formatNumber }
  },
}
</script>
