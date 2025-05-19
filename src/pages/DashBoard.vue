<template>
  <q-page>
    <div class="row no-wrap justify-between">
      <q-card flat class="radius-10 col q-mr-lg">
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="column no-wrap">
            <div class="text-grey-7 text-overline">Total User</div>
            <div class="text-subtitle1 q-mt-md">{{ totalUser }}</div>
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
            <div class="text-grey-7 text-overline">Total Rescue</div>
            <div class="text-subtitle1 q-mt-md">{{ totalAnimalCount }}</div>
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
            <div class="text-grey-7 text-overline">Total Expenses</div>
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
            <div class="text-grey-7 text-overline">Total Donation</div>
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
import { getTotalAnimalCount, getTotalUser } from 'src/composable/latestComposable'
import { formatOrNumber } from 'src/composable/simpleComposable'
import { ref } from 'vue'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LineChart,
  },
  setup() {
    const totalUser = ref(0)
    const totalAnimalCount = ref(0)
    onMounted(() => {
      getTotalUser().then((response) => {
        console.log(response)
        totalUser.value = formatOrNumber(response)
      })
      getTotalAnimalCount().then((response) => {
        console.log(response)
        totalAnimalCount.value = formatOrNumber(response)
      })
    })
    return { totalUser, totalAnimalCount }
  },
})
</script>
