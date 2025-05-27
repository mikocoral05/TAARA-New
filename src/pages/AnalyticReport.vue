<template>
  <q-page>
    <div class="row no-wrap justify-between items-start">
      <div class="column no-wrap">
        <div class="row q-mb-md">
          <q-card class="q-mr-md radius-10 q-px-lg" flat style="width: 250px">
            <q-card-section>
              <div class="text-grey-7 text-caption">OVERALL RESCUE</div>
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
          <q-card class="q-mr-md radius-10 q-px-lg" flat style="width: 250px">
            <q-card-section>
              <div class="text-grey-7 text-caption">PET AVAILABLE</div>
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
          <q-card class="q-mr-md radius-10 q-px-lg" flat style="width: 250px">
            <q-card-section>
              <div class="text-grey-7 text-caption">TOTAL ADOPTED</div>
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
          <q-card class="q-mr-md radius-10 q-px-lg" flat style="width: 250px">
            <q-card-section>
              <div class="text-grey-7 text-caption">IN MEDICATION</div>
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
  </q-page>
</template>
<script>
import { formatNumber, formatOrNumber } from 'src/composable/simpleComposable'

export default {
  setup() {
    return {
      formatOrNumber,
      formatNumber,
    }
  },
}
</script>
