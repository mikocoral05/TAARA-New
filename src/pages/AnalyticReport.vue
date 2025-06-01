<template>
  <q-page>
    <div class="column no-wrap" v-if="tab == 1">
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
                  <div class="text-grey-7 text-caption">PET AVAILABLE</div>
                  <q-icon name="sym_r_pets" size="1.5rem" color="primary" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">{{ formatOrNumber(petAvailable) }}</div>
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
                  <div class="text-grey-7 text-caption">IN MEDICATION</div>
                  <q-icon name="sym_r_monitor_heart" size="1.5rem" color="blue" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatOrNumber(inMedication) }}
                </div>
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
          <q-btn icon="sym_r_event" dense unelevated @click="filterDialog = !filterDialog" />
          <q-btn icon="sym_r_download" dense unelevated @click="printPage()" />
          <q-btn icon="sym_r_more_vert" dense unelevated>
            <q-menu>
              <q-list style="min-width: 160px">
                <q-item
                  clickable
                  v-close-popup
                  class="row no-wrap items-center"
                  :active="tab == 1"
                  @click="tab = 1"
                >
                  <q-item-section>Pet Report </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="sym_r_pets" />
                  </q-item-section>
                </q-item>

                <q-separator></q-separator>
                <q-item
                  clickable
                  v-close-popup
                  class="row no-wrap items-center"
                  :active="tab == 2"
                  @click="tab = 2"
                >
                  <q-item-section>Budget Report </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="sym_r_bar_chart" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
      <div class="radius-10 q-mb-md row no-wrap">
        <DoughnutChart
          style="width: 300px"
          class="bg-white q-mr-md radius-10"
          :data1="classification.data1 || 0"
          :data2="classification.data2 || 0"
        />
        <div class="bg-white full-width radius-10 q-pa-md">
          <q-table :rows="rows" :columns="columns" row-key="name" :rows-per-page-options="[3]" flat>
            <template v-slot:top>
              <div class="row no-wrap q-mb-md items-center">
                <div class="text-body1">
                  Geographical Hotspots
                  <q-icon class="q-ml-sm" size="1.2rem" name="sym_r_language" />
                </div>
                <div class="text-grey-7 q-ml-md text-caption">
                  Most frequently reported rescue locations
                </div>
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
            <template v-slot:body-cell-id="{ rowIndex }">
              <q-td>
                {{ rowIndex + 1 }}
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
      <div class="bg-white radius-10">
        <StackBarLine
          title="Population Status Overview"
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
              label: 'Rescue',
              data: monthlyRescue,
              borderColor: 'rgb(193, 0, 21)',
              backgroundColor: 'rgba(193, 0, 21, 0.5)',
              stack: 'combined',
              type: 'bar',
            },
            {
              label: 'Pet available',
              data: monthlyPetAvailable,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              stack: 'barStack',
              type: 'bar',
            },
            {
              label: 'Adotped',
              data: monthlyPetAdopted,
              borderColor: 'rgb(33, 186, 69)',
              backgroundColor: 'rgba(33, 186, 69, 0.5)',
              stack: 'lineStack',
              type: 'line',
            },
            {
              label: 'Deceased',
              data: monthlyDeceased,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              stack: 'lineStack',
              type: 'line',
            },
          ]"
        />
      </div>
    </div>
    <div class="column no-wrap" v-if="tab == 2">
      <div class="row no-wrap justify-between items-start">
        <div class="column no-wrap">
          <div class="row q-mb-md">
            <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
              <q-card-section>
                <div class="row no-wrap justify-between">
                  <div class="text-grey-7 text-caption">AVAILABLE BUDGET</div>
                  <q-icon name="sym_r_savings" size="1.5rem" color="positive" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatNumber(expenseSummary.donations) }}
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
                  <div class="text-grey-7 text-caption">TOTAL EXPENSE</div>
                  <q-icon name="sym_r_attach_money" size="1.5rem" color="red" />
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
            <q-card class="q-mr-md radius-10 q-px-md" flat style="width: 250px">
              <q-card-section>
                <div class="row no-wrap justify-between">
                  <div class="text-grey-7 text-caption">REMAINING BALANCE</div>
                  <q-icon name="sym_r_payments" size="1.5rem" color="primary" />
                </div>
                <div class="text-h6 text-bold q-mt-lg">
                  {{ formatNumber(expenseSummary.balance) }}
                </div>
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
          <q-btn icon="sym_r_event" dense unelevated @click="filterDialog = !filterDialog" />
          <q-btn icon="sym_r_download" dense unelevated @click="printPage()" />
          <q-btn icon="sym_r_more_vert" dense unelevated>
            <q-menu>
              <q-list style="min-width: 160px">
                <q-item
                  clickable
                  v-close-popup
                  class="row no-wrap items-center"
                  :active="tab == 1"
                  @click="tab = 1"
                >
                  <q-item-section>Pet Report </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="sym_r_pets" />
                  </q-item-section>
                </q-item>

                <q-separator></q-separator>
                <q-item
                  clickable
                  v-close-popup
                  class="row no-wrap items-center"
                  :active="tab == 2"
                  @click="tab = 2"
                >
                  <q-item-section>Budget Report </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="sym_r_bar_chart" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <div class="bg-white radius-10">
        <StackBarLine
          title="Budget vs Expense"
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
              label: 'Budget',
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
          ]"
        />
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
              hint="Opertaion"
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
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import DoughnutChart from 'src/components/DoughnutChart.vue'
import StackBarLine from 'src/components/StackBarLine.vue'
import {
  getAnimalByHealtStatus,
  getClassification,
  getExpenseSummary,
  getFrequentLocation,
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
  components: { StackBarLine, DoughnutChart },
  setup() {
    const store = globalStore()
    const inMedication = ref(0)
    const petAvailable = ref(0)
    const totalAdopted = ref(0)
    const filterDialog = ref(false)
    const overallRescue = ref(0)
    const expenseSummary = ref({ donations: 0, expenses: 0, balance: 0 })
    const mostReportedPlace = ref([])
    const classification = ref([])
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
      inMedication.value = await getAnimalByHealtStatus(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
        3,
      )
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
      classification.value = await getClassification(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
    }

    const fetchFn2 = async () => {
      expenseSummary.value = await getExpenseSummary(
        selectedYear.value,
        selectedMonth.value,
        seletedOperation.value,
      )
      monthlyDonation.value = await getMonthlyDonation(selectedYear.value)
      monthlyExpense.value = await getMonthlyExpense(selectedYear.value)
    }
    watchEffect(() => {
      if (tab.value == 1) {
        fetchFn()
      } else {
        fetchFn2()
      }
    })

    onMounted(async () => {
      monthlyRescue.value = await getMonthlyRescue(selectedYear.value)
      monthlyPetAvailable.value = await getMonthlyPetAvailble(selectedYear.value)
      monthlyPetAdopted.value = await getMonthlyAdopted(selectedYear.value)
      monthlyDeceased.value = await getMonthlyDeceased(selectedYear.value)
      monthlyBalance.value = await getMonthlyBalance(selectedYear.value)
      console.log(monthlyBalance.value)

      window.onafterprint = () => {
        store.showLayout = true
        store.leftDrawerOpen = true
      }
    })
    onUnmounted(() => {
      window.onafterprint = null // Clean up
    })
    return {
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
      classification,
      mostReportedPlace,
      petAvailable,
      totalAdopted,
      overallRescue,
      inMedication,
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
