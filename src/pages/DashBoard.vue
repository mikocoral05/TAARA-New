<template>
  <q-page>
    <div class="column no-wrap">
      <div class="row no-wrap justify-between items-start">
        <div class="column no-wrap">
          <div class="row q-mb-md">
            <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
              <q-card-section>
                <div class="row no-wrap justify-between">
                  <div class="text-grey-7 text-caption">TOTAL DONATION</div>
                  <q-icon name="sym_r_savings" size="1.5rem" color="positive" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatNumber(totalDonation) }}
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
                  <div class="text-grey-7 text-caption">TOTAL RESCUE</div>
                  <q-icon name="sym_r_fire_truck" size="1.5rem" color="red" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatOrNumber(overallRescue) }}
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
                  <div class="text-grey-7 text-caption">TOTAL ADOPTED</div>
                  <q-icon name="sym_r_diversity_1" size="1.5rem" color="positive" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(totalAdopted) }}</div>
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
                  <div class="text-grey-7 text-caption">TOTAL EXPENSE</div>
                  <q-icon name="sym_r_payments" size="1.5rem" color="red" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatNumber(expenseSummary.expenses) }}
                </div>
                <div class="text-grey-7 text-caption q-mt-sm">
                  <q-icon name="sym_r_south_west" class="text-negative text-bold q-mr-xs" /><span
                    class="text-negative text-bold"
                    >-5%</span
                  >
                  vs last month
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row no-wrap justify-between items-center">
          <q-btn icon="sym_r_event" dense unelevated @click="filterDialog = !filterDialog" />
        </div>
      </div>

      <div class="bg-white radius-10">
        <StackBarLine
          title="Annual Shelter & Financial Overview"
          :chartLabels="[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]"
          :chartDatasets="[
            {
              label: 'Donation',
              data: monthlyDonation,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              stack: 'combined',
              type: 'bar',
            },
            {
              label: 'Expense',
              data: monthlyExpense,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              stack: 'barStack',
              type: 'bar',
            },
            {
              label: 'Balance',
              data: monthlyBalance,
              borderColor: 'rgb(33, 186, 69)',
              backgroundColor: 'rgba(33, 186, 69, 0.5)',
              stack: 'barStack',
              type: 'line',
            },
            {
              label: 'Rescue',
              data: monthlyRescue,
              borderColor: 'rgb(193, 0, 21)',
              backgroundColor: 'rgba(193, 0, 21, 0.5)',
              stack: 'combined',
              type: 'bar',
              hidden: true,
            },
            {
              label: 'Pet available',
              data: monthlyPetAvailable,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              stack: 'barStack',
              type: 'bar',
              hidden: true,
            },
            {
              label: 'Adotped',
              data: monthlyPetAdopted,
              borderColor: 'rgb(33, 186, 69)',
              backgroundColor: 'rgba(33, 186, 69, 0.5)',
              stack: 'lineStack',
              type: 'line',
              hidden: true,
            },
            {
              label: 'Deceased',
              data: monthlyDeceased,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              stack: 'lineStack',
              type: 'line',
              hidden: true,
            },
          ]"
        />
      </div>
      <div class="q-mt-md">
        <q-card flat class="radius-10">
          <q-card-section class="column no-wrap">
            <div class="text-bold text-caption text-grey-8">INVENTORIES</div>
            <q-separator class="q-my-sm q-mb-md"></q-separator>
            <div class="row no-wrap justify-between items-center">
              <div class="column no-wrap">
                <div class="text-bold">
                  {{
                    inventorySummary.filter((obj) => obj.category == 'medicine')[0]?.total_count ||
                    0
                  }}
                </div>
                <div class="q-mt-sm text-grey-8" style="font-size: 13px">Total no. of Medicine</div>
              </div>
              <div class="column no-wrap">
                <div class="text-bold">
                  {{
                    inventorySummary.filter((obj) => obj.category == 'vaccine')[0]?.total_count || 0
                  }}
                </div>
                <div class="q-mt-sm text-grey-8" style="font-size: 13px">Total no. of Vaccine</div>
              </div>
              <div class="column no-wrap">
                <div class="text-bold">
                  {{
                    inventorySummary.filter((obj) => obj.category == 'vitamin')[0]?.total_count || 0
                  }}
                </div>
                <div class="q-mt-sm text-grey-8" style="font-size: 13px">Total no. of Vitamin</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="filterDialog" position="top">
      <q-card style="min-width: 350px">
        <q-linear-progress :value="1" color="pink" />
        <q-card-section class="column no-wrap">
          <div class="text-weight-bold">
            Filter Report
            <span class="text-grey-7 text-caption q-ml-sm">(Filter by date to view report)</span>
          </div>

          <div class="row no-wrap q-mt-sm">
            <q-select
              hint="Select month"
              dense
              outlined
              v-model="selectedMonth"
              :options="monthNames"
              emit-value
              map-options
              style="width: 200px"
              class="q-mr-sm"
            />
            <q-select
              class="q-mr-sm"
              hint="Select year"
              dense
              outlined
              style="width: 200px"
              v-model="selectedYear"
              :options="generateYearList()"
            />
            <q-select
              hint="Operation"
              dense
              outlined
              style="width: 100px"
              v-model="seletedOperation"
              :options="[
                {
                  label: `From the beginning up to ${monthNames.find((obj) => obj.value == selectedMonth)?.label} ${selectedYear}`,
                  value: '<=',
                },
                {
                  label: `Only ${monthNames.find((obj) => obj.value == selectedMonth)?.label} ${selectedYear}`,
                  value: '=',
                },
              ]"
              emit-value
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import StackBarLine from 'src/components/StackBarLine.vue'
import {
  getAnimalByHealtStatus,
  getExpenseSummary,
  getFrequentLocation,
  getInventorySummary,
  getMonthlyAdopted,
  getMonthlyBalance,
  getMonthlyDeceased,
  getMonthlyDonation,
  getMonthlyExpense,
  getMonthlyPetAvailble,
  getMonthlyRescue,
  getOverallRescue,
  getPetAvailable,
  getTotalAdopted,
  getTotalDonation,
} from 'src/composable/latestComposable'
import {
  formatNumber,
  formatOrNumber,
  generateYearList,
  monthNames,
  monthToday,
  yearToday,
} from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { watchEffect } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  components: { StackBarLine },
  setup() {
    const store = globalStore()
    const petAvailable = ref(0)
    const totalAdopted = ref(0)
    const totalDonation = ref(0)
    const filterDialog = ref(false)
    const overallRescue = ref(0)
    const expenseSummary = ref({ donations: 0, expenses: 0, balance: 0 })
    const mostReportedPlace = ref([])
    const inventorySummary = ref([])
    const monthlyRescue = ref([])
    const monthlyDonation = ref([])
    const monthlyBalance = ref([])
    const monthlyPetAvailable = ref([])
    const monthlyPetAdopted = ref([])
    const monthlyDeceased = ref([])
    const monthlyExpense = ref([])
    const selectedYear = ref(yearToday)
    const selectedMonth = ref(monthToday)
    const seletedOperation = ref('<=')
    const rows = ref([])
    const tab = ref(1)
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
        name: 'location',
        required: true,
        label: 'Full Address',
        align: 'left',
        field: 'location',
        sortable: true,
      },
      {
        name: 'total_reports',
        required: true,
        label: 'No. of reports',
        align: 'left',
        field: 'total_reports',
        sortable: true,
      },
      { name: 'btn', align: 'center', label: 'Map' },
    ]

    const printPage = () => {
      store.leftDrawerOpen = false
      store.showLayout = false
      setTimeout(() => {
        window.print()
      }, 100)
    }

    const fetchFn = async () => {
      totalAdopted.value = await getTotalAdopted(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
      petAvailable.value = await getPetAvailable(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
      overallRescue.value = await getOverallRescue(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
      rows.value = await getFrequentLocation(selectedYear.value)
    }

    const fetchFn2 = async () => {
      expenseSummary.value = await getExpenseSummary(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
      monthlyDonation.value = await getMonthlyDonation(selectedYear.value)
      monthlyExpense.value = await getMonthlyExpense(selectedYear.value)
      totalDonation.value = await getTotalDonation(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
    }
    watchEffect(() => {
      fetchFn()
      fetchFn2()
    })

    onMounted(async () => {
      inventorySummary.value = await getInventorySummary()
      console.log(inventorySummary.value)

      monthlyRescue.value = await getMonthlyRescue(selectedYear.value)
      monthlyPetAvailable.value = await getMonthlyPetAvailble(selectedYear.value)
      monthlyPetAdopted.value = await getMonthlyAdopted(selectedYear.value)
      monthlyDeceased.value = await getMonthlyDeceased(selectedYear.value)
      monthlyBalance.value = await getMonthlyBalance(selectedYear.value)

      window.onafterprint = () => {
        store.showLayout = true
        store.leftDrawerOpen = true
      }
    })
    onUnmounted(() => {
      window.onafterprint = null // Clean up
    })
    return {
      inventorySummary,
      totalDonation,
      monthlyBalance,
      monthlyExpense,
      monthlyDonation,
      expenseSummary,
      selectedYear,
      generateYearList,
      selectedMonth,
      monthNames,
      filterDialog,
      monthlyDeceased,
      monthlyPetAdopted,
      monthlyPetAvailable,
      monthlyRescue,
      mostReportedPlace,
      petAvailable,
      totalAdopted,
      overallRescue,
      getAnimalByHealtStatus,
      store,
      tab,
      printPage,
      columns,
      rows,
      formatOrNumber,
      formatNumber,
      seletedOperation,
    }
  },
}
</script>
<style lang="scss" scoped></style>
