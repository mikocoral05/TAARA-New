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
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(4534534) }}</div>
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
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(34734) }}</div>
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
              <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(34734) }}</div>
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
    <div class="bg-white radius-10"><StackBarLine /></div>
  </q-page>
</template>
<script>
import StackBarLine from 'src/components/StackBarLine.vue'
import { formatNumber, formatOrNumber } from 'src/composable/simpleComposable'

export default {
  components: { StackBarLine },
  setup() {
    return {
      formatOrNumber,
      formatNumber,
    }
  },
}
</script>
