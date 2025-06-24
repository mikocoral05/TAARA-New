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
        :preventAction="preventAction"
      >
        <template #cell-btn="{ row }">
          <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
            <q-menu anchor="bottom left" self="top right">
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="tableAction(row, 'EditP')">
                  <q-item-section>Edit</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_edit" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-item
                  v-if="row.is_priority != 1"
                  clickable
                  v-close-popup
                  @click="tableAction(row.id, 'Edit', 'prio')"
                >
                  <q-item-section>Priority</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_flag_circle" size="1.2rem" color="red" />
                  </q-item-section>
                </q-item>
                <q-item
                  v-if="row.is_priority == 1"
                  clickable
                  v-close-popup
                  @click="tableAction(row.id, 'Edit', 'not-prio')"
                >
                  <q-item-section>Not priority</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_list" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="tableAction(row.id, 'Archive')">
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
        <template #cell-name="{ row }">
          <div :class="{ 'text-red': row.is_priority == 1 }">
            {{ row.name }}
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

    <q-dialog v-model="addDialog" persistent>
      <q-card class="q-pa-md" style="width: 450px; min-height: 130px">
        <q-card-section class="column no-wrap q-px-sm"
          ><div class="row no-wrap justify-between items-center">
            <div class="text-capitalize text-body1 text0center">
              Add {{ obj2[filterTab] }} wishlist
            </div>
            <q-toggle
              v-model="dataStorage.is_priority"
              color="green"
              :true-value="1"
              :false-value="0"
              :label="dataStorage.is_priority ? 'Priority' : 'Not priority'"
            />
          </div>
          <q-input
            outlined
            v-model="dataStorage.name"
            :placeholder="`${obj2[filterTab]} wishlist`"
            dense
            class="q-mt-md full-width"
          />
        </q-card-section>

        <q-card-actions align="center" class="row no-wrap">
          <q-btn outline style="width: 100%" label="Cancel" v-close-popup color="primary" no-caps />
          <q-btn
            label="Confirm"
            unelevated
            color="primary"
            no-caps
            style="width: 100%"
            v-close-popup
            @click="saveFn()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <NoAccessDialog v-model:showNoAccess="showNoAccess" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  updateWishlist,
  getWishlist,
  deleteWishlist,
  addWishlist,
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
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
import { globalStore } from 'src/stores/global-store'
export default {
  components: {
    ReusableTable,
    NoAccessDialog,
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
    const store = globalStore()
    const confirm = ref(false)
    const search = ref(null)
    const addDialog = ref(false)
    const pages = ref([])
    const dataStorage = ref({})
    const elseSummary = ref({})
    const mode = ref('')
    const selectedMonth = ref(monthToday)
    const selectedYear = ref(yearToday)
    const selectedDay = ref(dayToday)
    const totalExpense = ref(null)
    const userName = store.userData.first_name + ' ' + store.userData.last_name
    const totalBalance = ref(null)
    const dailyExpenseTotal = ref([])
    const itemsCount = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })
    const groupNameOptions = ref([])
    const showNoAccess = ref(false)
    const fetchData = () => {
      getWishlist(obj[tab.value]).then((response) => {
        tableConfig.value.title = `${capitalize(obj2[tab.value])} Wishlist`
        tableConfig.value.columns = ['id', 'name', 'is_priority', 'btn']
        rows.value = response
      })
    }

    const tableAction = (id, modeParam, action) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Edit', 'Add', 'EditP'].includes(modeParam)) {
        if (modeParam == 'Add') {
          addDialog.value = true
          dataStorage.value = { is_priority: 0 }
        } else if (modeParam == 'EditP') {
          addDialog.value = true
          dataStorage.value = { ...id } //actually pass data not id
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
        dataStorage.value.table = obj[tab.value]
        addWishlist(
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          userName,
        ).then((response) => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
          setTimeout(() => {
            $q.loading.hide()
            fetchData()
          }, 1000)
        })
      } else if (['Edit', 'EditP'].includes(mode.value)) {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })

        updateWishlist(
          obj[tab.value],
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          userName,
        ).then((response) => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
          setTimeout(() => {
            $q.loading.hide()
            fetchData()
          }, 1500)
        })
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: `${obj3[mode.value]}. Please wait...`,
      })
      deleteWishlist(
        obj[tab.value],
        arrayOfId.value,
        store.userData.user_id,
        store.userData.user_type,
        userName,
      ).then((response) => {
        $q.loading.show({
          group: 'update',
          message: response.message,
        })
        setTimeout(() => {
          $q.loading.hide()
          fetchData()
        }, 1500)
      })
    }

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const result = [1, 2, 3, 4].includes(userRole) && userType == 3
      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }

    watchEffect(() => {
      fetchData()
    })

    return {
      preventAction,
      showNoAccess,
      addDialog,
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
