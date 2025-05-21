<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="1" icon="sym_r_medical_services" label="Medicine" no-caps />
        <q-tab name="2" icon="sym_r_restaurant" label="Food" no-caps />
        <q-tab name="3" icon="sym_r_warehouse" label="Supplies" no-caps />
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
    <div class="row no-wrap">
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        row-key="id"
        separator="vertical"
        :rows-per-page-options="[10]"
        :title="tableConfig.title"
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
                <q-item clickable v-close-popup @click="tableAction(row.id, 'Edit', 'prio')">
                  <q-item-section>Priority</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_flag_circle" size="1.2rem" color="red" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="tableAction(row.id, 'Edit', 'not-prio')">
                  <q-item-section>Not priority</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_list" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="tableAction(row.id, 'Archieve')">
                  <q-item-section>Delete</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_dangerous" size="1.2rem" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #cell-is_priority="{ row }">
          <div>
            {{ row.is_priority == 1 ? 'Yes' : 'No' }}
          </div>
        </template>
        <template #cell-id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
      </ReusableTable>
    </div>

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
  addInventoryList,
  updateWishlist,
  addGroupName,
  getWishlist,
  deleteWishlist,
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
    const obj = { 1: 'tbl_wishlist_medicine', 2: 'tbl_wishlist_food', 3: 'tbl_wishlist_supplies' }

    const obj2 = { 1: 'Medicine', 2: 'Food', 3: 'Supplies' }
    const obj3 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const $q = useQuasar()
    const tab = ref('1')
    const filterTab = ref('1')
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const groupDialog = ref(false)
    const pages = ref([])
    const dataStorage = ref({})
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
    const groupNameOptions = ref([])

    const fetchData = () => {
      getWishlist(obj[tab.value]).then((response) => {
        tableConfig.value.title = `${capitalize(obj2[tab.value])} Wishlist`
        tableConfig.value.columns = ['id', 'name', 'is_priority', 'btn']
        rows.value = response
        console.log(rows.value)
      })
    }

    const tableAction = (id, modeParam, action) => {
      mode.value = modeParam
      if (['Edit', 'Add'].includes(modeParam)) {
        if (modeParam == 'Add') {
          dataStorage.value = {}
        } else {
          dataStorage.value = { id: id, status: action == 'prio' ? 1 : 0 }
          saveFn()
        }
      } else {
        arrayOfId.value.push(id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      if (mode.value == 'Add') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        dataStorage.value.category = obj[tab.value]
        if (filterTab.value !== 2) {
          addInventoryList(dataStorage.value).then((response) => {
            console.log(response)
            setTimeout(() => {
              $q.loading.show({
                group: 'update',
                message: response.message,
              })
            }, 1000)
            setTimeout(() => {
              $q.loading.hide()
            }, 2000)
          })
        } else {
          addGroupName(dataStorage.value).then((response) => {
            console.log(response)
            setTimeout(() => {
              $q.loading.show({
                group: 'update',
                message: response.message,
              })
            }, 1000)
            setTimeout(() => {
              groupDialog.value = false
              $q.loading.hide()
            }, 2000)
          })
        }
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        updateWishlist(obj[tab.value], dataStorage.value).then((response) => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
          setTimeout(() => {
            $q.loading.hide()
            if (response.status == 'success') {
              fetchData()
            }
          }, 2000)
        })
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: `${obj3[mode.value]}. Please wait...`,
      })
      deleteWishlist(obj[tab.value], arrayOfId.value).then((response) => {
        $q.loading.show({
          group: 'update',
          message: response.message,
        })
        setTimeout(() => {
          $q.loading.hide()
          if (response.status == 'success') {
            fetchData()
          }
        }, 2000)
      })
    }

    watchEffect(() => {
      fetchData()
    })

    return {
      groupDialog,
      groupNameOptions,
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
      tableConfig,
      scrollListRef,
      scrollAreaRef,
      selectedDay,
      dailyExpenseTotal,
      generateYearList,
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
      mode,
      dataStorage,
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
          name: 'is_priority',
          label: 'Priority',
          field: 'is_priority',
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
