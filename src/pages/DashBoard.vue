<template>
  <q-page class="q-pa-lg">
    <!-- <div class="text-h5">Dashboard</div> -->
    <div class="row no-wrap justify-between">
      <q-card flat class="radius-10 col q-mr-lg">
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="column no-wrap">
            <div class="text-grey-7 text-overline">Total User</div>
            <div class="text-subtitle1 q-mt-md">40,689</div>
          </div>
          <q-img src="icons/user.png" width="50px" />
        </q-card-section>
        <q-card-section>
          <div class="row no-wrap text-overline items-center">
            <q-icon name="trending_up" size="1.2rem" color="positive" class="q-mr-sm" />
            <div class="text-positive q-mr-md">8.5%</div>
            <div class="text-grey-7">Up from yesterday</div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat class="radius-10 col q-mr-lg">
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="column no-wrap">
            <div class="text-grey-7 text-overline">Total Order</div>
            <div class="text-subtitle1 q-mt-md">10,293</div>
          </div>
          <q-img src="icons/orders.png" width="50px" />
        </q-card-section>
        <q-card-section>
          <div class="row no-wrap text-overline items-center">
            <q-icon name="trending_up" size="1.2rem" color="positive" class="q-mr-sm" />
            <div class="text-positive q-mr-md">1.3%</div>
            <div class="text-grey-7">Up from yesterday</div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat class="radius-10 col q-mr-lg">
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="column no-wrap">
            <div class="text-grey-7 text-overline">Total Sales</div>
            <div class="text-subtitle1 q-mt-md">$89,000</div>
          </div>
          <q-img src="icons/Sales.png" width="50px" />
        </q-card-section>
        <q-card-section>
          <div class="row no-wrap text-overline items-center">
            <q-icon name="trending_down" size="1.2rem" color="negative" class="q-mr-sm" />
            <div class="text-positive q-mr-md">4.3%</div>
            <div class="text-grey-7">Down from yesterday</div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat class="radius-10 col">
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="column no-wrap">
            <div class="text-grey-7 text-overline">Total Pending</div>
            <div class="text-subtitle1 q-mt-md">2,040</div>
          </div>
          <q-img src="icons/pending.png" width="50px" />
        </q-card-section>
        <q-card-section>
          <div class="row no-wrap text-overline items-center">
            <q-icon name="trending_up" size="1.2rem" color="positive" class="q-mr-sm" />
            <div class="text-positive q-mr-md">8.5%</div>
            <div class="text-grey-7">Up from yesterday</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <LineChart class="bg-white radius-10 q-mt-lg" />
  </q-page>
</template>

<script>
import LineChart from 'src/components/LineChart.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LineChart,
  },
})
</script>
