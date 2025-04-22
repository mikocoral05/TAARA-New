<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="2" icon="sym_r_medical_services" label="Medicine" no-caps />
        <q-tab name="3" icon="sym_r_vaccines" label="Vaccine" no-caps />
        <q-tab name="4" icon="sym_r_nutrition" label="Vitamin" no-caps />
      </q-tabs>
      <div class="row no-wrap justify-between items-center">
        <div class="row no-wrap">
          <div class="row no-wrap">
            <q-icon
              name="sym_r_check_box_outline_blank"
              size="1rem"
              color="warning"
              class="bg-warning q-mr-sm radius-2"
            />
            <div class="text-grey-7 text-caption">Nearly expired</div>
          </div>
          <div class="row no-wrap q-ml-md">
            <q-icon
              name="sym_r_check_box_outline_blank"
              size="1rem"
              color="negative"
              class="bg-negative q-mr-sm radius-2"
            />
            <div class="text-grey-7 text-caption">Expired</div>
          </div>
        </div>
      </div>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <div class="column no-wrap">
      <div class="row q-mb-md">
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section class="q-pb-none">
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">MEDICINE AVAILABLE</div>
              <q-icon name="sym_r_medical_services" color="blue" size="1.5rem" />
            </div>
            <div class="row no-wrap items-center justify-center">
              <div class="text-h6 text-bold q-my-md text-center">
                {{ elseSummary.unique_group_count }}
                <span class="text-caption text-grey-7">Unique</span>
              </div>
              <q-separator vertical inset class="q-mx-md" />
              <div class="text-h6 text-bold q-my-md text-center">
                {{ formatOrNumber(elseSummary.total_quantity) }}
                <span class="text-caption text-grey-7"> Pieces</span>
              </div>
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(1)"
              class="q-mt-sm full-width"
            >
              <div class="text-blue text-caption flex flex-center">
                VIEW FULL LIST <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section>
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">MEDICINE GROUPS</div>
              <q-icon name="sym_r_outpatient_med" color="positive" size="1.5rem" />
            </div>
            <div class="text-h6 text-bold q-my-md text-center">
              {{ elseSummary?.unique_group_count }}
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(2)"
              class="q-mt-sm full-width"
            >
              <div class="text-positive text-caption flex flex-center">
                <span>VIEW GROUPS</span>
                <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section>
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">EXPIRED MEDICINE</div>
              <q-icon name="sym_r_warning" color="negative" size="1.5rem" />
            </div>
            <div class="text-h6 text-bold q-my-md text-center">
              {{ elseSummary?.expired_count }}
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(3)"
              class="q-mt-sm full-width"
            >
              <div class="text-negative text-caption flex flex-center">
                <span>VIEW FULL LIST</span>
                <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row no-wrap">
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        separator="vertical"
        :title="tableConfig.title"
        :rows-per-page-options="[10]"
        :visible-columns="tableConfig.columns"
        selection="multiple"
        v-model="search"
        v-model:selected="arrayOfId"
        v-model:confirm="confirm"
        v-model:dialog="showDialog"
        :tableAction="tableAction"
      >
        <template #cell-btn="{ row }">
          <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
            <q-menu anchor="bottom left" self="top right">
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="tableAction(row, 'View')">
                  <q-item-section>View</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_visibility" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="tableAction(row, 'Edit')">
                  <q-item-section>Edit</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_edit" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="tableAction(row, 'Archieve')">
                  <q-item-section>Delete</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_keyboard_arrow_right" size="1.2rem" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #cell-computed="{ row }">
          <div>
            {{ formatNumber((Number(totalBalance) * Number(row.percentage_allocated)) / 100) }}
          </div>
        </template>
        <template #cell-id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
        <template #cell-expiration_date="{ row }">
          <div
            :class="{
              'bg-warning text-white radius-10': isNearExpiration(row.expiration_date),
              'bg-negative text-white radius-10': isExpired(row.expiration_date),
            }"
          >
            {{ row.expiration_date }}
          </div>
        </template>
        <template #cell-delete="{}">
          <q-checkbox dense />
        </template>
      </ReusableTable>
    </div>
    <q-dialog position="right" full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div class="text-body1">{{ mode }} {{ tableConfig.title }}</div>
          <q-icon name="close" size="1.2rem" @click="showDialog = !showDialog" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-grey-7" style="font-size: 12px">
            <span class="text-negative">*</span>All fields are mandatory, except mentioned as
            (optional).
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column no-wrap">
            <div class="text-capitalize">{{ obj[tab] }} Name</div>
            <q-input outlined v-model="text" dense class="q-mt-sm" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md" style="width: 450px; min-height: 230px">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_inventory_2" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md text-center">
            Are you sure you want to Delete this {{ obj2[tab] }} List?
          </span>
          <span class="q-ml-sm text-caption text-grey-7 q-mt-sm">
            This action is irreversible.
          </span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            outline
            label="Cancel"
            v-close-popup
            color="primary"
            no-caps
            style="width: 180px"
            dense
          />
          <q-btn
            label="Confirm"
            unelevated
            color="primary"
            no-caps
            dense
            v-close-popup
            style="width: 180px"
            @click="softDeleteFn()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getBudgetAllocation,
  getExpensesSummary,
  updateUser,
  getTotalBalance,
  getInventoryList,
  getInventoryGroup,
  getInventoryListSummary,
  getInventoryExpiredList,
  softDeleteInventoryData,
} from 'src/composable/latestComposable'
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import {
  formatNumber,
  generateYearList,
  monthNames,
  monthToday,
  yearToday,
  dayToday,
  formatOrNumber,
  isNearExpiration,
  isExpired,
  capitalize,
} from 'src/composable/simpleComposable'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const obj = { 2: 'medicine', 3: 'vaccine', 4: 'vitamin' }
    const obj2 = { 1: 'Medicine', 2: 'Group', 3: 'Expired' }
    const $q = useQuasar()
    const tab = ref('2')
    const filterTab = ref('1')
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const showDialog = ref(true)
    const pages = ref([])
    const inventoryListSpecificData = ref()
    const elseSummary = ref({})
    const mode = ref('')
    const selectedMonth = ref(monthToday)
    const selectedYear = ref(yearToday)
    const selectedDay = ref(dayToday)
    const totalExpense = ref(null)

    const totalBalance = ref(null)
    const dailyExpenseTotal = ref([])
    const itemsCount = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })

    const tableAction = (data, modeParam) => {
      mode.value = modeParam
      inventoryListSpecificData.value = data
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        showDialog.value = !showDialog.value
        if (modeParam == 'Add') {
          //
        }
      } else {
        arrayOfId.value.push(data.id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      $q.loading.show({
        message: 'Updating. Please wait...',
      })
      updateUser(inventoryListSpecificData.value).then(() => {
        setTimeout(() => {
          $q.loading.hide()
        }, 2000)
      })
    }

    const updateBudgetAllocationSum = () => {
      getBudgetAllocation().then((response) => {
        rows.value = response
      })
      getExpensesSummary({ month: selectedMonth.value, year: selectedYear.value }).then(
        (response) => {
          totalExpense.value = response?.total
        },
      )
      getTotalBalance({ month: selectedMonth.value, year: selectedYear.value }).then((response) => {
        totalBalance.value = response?.balance
      })
    }

    const filterInventory = (filterNo) => {
      filterTab.value = filterNo
      if (filterNo == 1) {
        getInventoryList(obj[tab.value]).then((response) => {
          tableConfig.value.title = `${capitalize(obj[tab.value])} List`
          tableConfig.value.columns = [
            'id',
            'item_name',
            'group_name',
            'quantity',
            'unit',
            'expiration_date',
            'btn',
          ]
          rows.value = response
        })
      } else if (filterNo == 2) {
        getInventoryGroup(obj[tab.value]).then((response) => {
          rows.value = response
          tableConfig.value.title = 'Group List'
          tableConfig.value.columns = ['id', 'group_name', 'count', 'btn']
          console.log(tableConfig.value.columns)
        })
      } else if (filterNo == 3) {
        getInventoryExpiredList(obj[tab.value]).then((response) => {
          rows.value = response
          tableConfig.value.title = 'Expired List'
          tableConfig.value.columns = [
            'id',
            'item_name',
            'group_name',
            'quantity',
            'unit',
            'expiration_date',
            'btn',
          ]
        })
      }
    }

    const softDeleteFn = () => {
      const tableName = filterTab.value == 2 ? 'tbl_inventory_group' : 'tbl_inventory'
      softDeleteInventoryData(arrayOfId.value, tableName).then((response) => {
        if (response == 'success') {
          filterInventory(filterTab.value)
          getInventoryListSummary(obj[tab.value]).then((response) => {
            elseSummary.value = response
          })
        }
      })
    }

    watchEffect(() => {
      if (tab.value == 1) {
        updateBudgetAllocationSum()
      } else {
        getInventoryList(obj[tab.value]).then((response) => {
          tableConfig.value.title = `${capitalize(obj[tab.value])} List`
          tableConfig.value.columns = [
            'id',
            'item_name',
            'group_name',
            'quantity',
            'unit',
            'expiration_date',
            'btn',
          ]
          rows.value = response
          console.log(rows.value)

          itemsCount.value = rows.value.reduce((total, item) => {
            return total + item.quantity
          }, 0)
        })
        getInventoryListSummary(obj[tab.value]).then((response) => {
          elseSummary.value = response
        })
      }
    })

    return {
      arrayOfId,
      filterTab,
      softDeleteFn,
      obj2,
      obj,
      search,
      isExpired,
      elseSummary,
      isNearExpiration,
      formatOrNumber,
      itemsCount,
      filterInventory,
      tableConfig,
      scrollListRef,
      scrollAreaRef,
      selectedDay,
      dailyExpenseTotal,
      generateYearList,
      updateBudgetAllocationSum,
      totalBalance,
      formatNumber,
      totalExpense,
      selectedMonth,
      selectedYear,
      monthNames,
      pages,
      saveFn,
      confirm,
      isPwd: ref(true),
      civilStatusOption,
      nameSuffixes,
      sexOption,
      editTab,
      showDialog,
      mode,
      inventoryListSpecificData,
      tableAction,
      rows,
      tab,
      showingTooltip: ref(false),
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Name',
          field: 'name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'item_name',
          label: 'Item Name',
          field: 'item_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'group_name',
          label: 'Group Name',
          field: 'group_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'quantity',
          label: 'Quantity',
          field: 'quantity',
          sortable: true,
          align: 'center',
        },
        {
          name: 'unit',
          label: 'Unit',
          field: 'unit',
          sortable: true,
          align: 'center',
        },
        {
          name: 'expiration_date',
          label: 'Expiration Date',
          field: 'expiration_date',
          sortable: true,
          align: 'center',
        },

        {
          name: 'count',
          label: `No. of ${obj[tab.value]}`,
          field: 'count',
          sortable: true,
          align: 'center',
        },
        {
          name: 'btn',
          label: 'Action',
          field: 'btn',
          sortable: false,
          align: 'center',
        },
        {
          name: 'delete',
          label: '*',
          field: 'delete',
          sortable: false,
          align: 'center',
        },
      ],
    }
  },
}
</script>
