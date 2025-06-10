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
                <span class="text-caption text-grey-7"> Quantity</span>
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
      </ReusableTable>
    </div>
    <q-dialog position="right" full-height maximized v-model="showDialog">
      <q-card style="width: 50vw; height: 500px" class="text-black column justify-between">
        <div class="column no-wrap">
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
            <div class="row no-wrap q-mt-md">
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">
                  {{ obj[tab] }} Name <span class="text-negative">*</span>
                </div>
                <q-input
                  outlined
                  v-model="dataStorage.item_name"
                  dense
                  class="q-mt-sm"
                  style="width: 300px"
                />
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">
                  {{ obj[tab] }} Group <span class="text-negative">*</span>
                </div>
                <q-select
                  outlined
                  v-model="dataStorage.group_name"
                  class="q-mt-sm"
                  :options="groupNameOptions"
                  emit-value
                  map-options
                  option-label="group_name"
                  option-value="id"
                  dense
                  style="width: 250px"
                  behavior="menu"
                />
              </div>
            </div>
            <div class="row no-wrap q-mt-md">
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">Expiry Date<span class="text-negative">*</span></div>
                <q-input
                  dense
                  outlined
                  class="q-mt-sm"
                  v-model="dataStorage.expiration_date"
                  mask="####-##-##"
                  :rules="[(val) => !!val || '']"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dataStorage.expiration_date" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">Quantity<span class="text-negative">*</span></div>
                <q-input
                  outlined
                  type="number"
                  v-model="dataStorage.quantity"
                  dense
                  class="q-mt-sm"
                />
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">Unit<span class="text-negative">*</span></div>
                <q-input outlined v-model="dataStorage.unit" dense class="q-mt-sm" />
              </div>
            </div>
            <div class="column no-wrap q-mt-md">
              <div class="text-capitalize">
                Notes <span class="text-grey-7 text-caption"> (optional)</span>
              </div>
              <q-input outlined type="textarea" v-model="dataStorage.notes" dense class="q-mt-sm" />
            </div>
          </q-card-section>
        </div>
        <q-card-section>
          <q-btn
            outline
            label="Cancel"
            v-close-popup
            color="primary"
            no-caps
            class="q-mr-md"
            style="width: 180px"
          />
          <q-btn
            label="Confirm"
            unelevated
            color="primary"
            no-caps
            v-close-popup
            style="width: 180px"
            @click="saveFn()"
          />
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
    <q-dialog v-model="groupDialog" persistent>
      <q-card class="q-pa-md" style="width: 450px; min-height: 130px">
        <q-card-section class="column no-wrap q-px-sm">
          <div class="text-capitalize text-body1 text0center">
            Add {{ obj[tab] }} {{ obj2[filterTab] }}
          </div>
          <q-input
            outlined
            v-model="dataStorage.group_name"
            placeholder="Ex: Antibiotic"
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
  getInventoryList,
  getInventoryGroup,
  getInventoryListSummary,
  getInventoryExpiredList,
  softDeleteInventoryData,
  addInventoryList,
  editInventoryList,
  addGroupName,
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
import { globalStore } from 'src/stores/global-store'
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
export default {
  components: {
    ReusableTable,
    NoAccessDialog,
  },
  setup() {
    const obj = { 2: 'medicine', 3: 'vaccine', 4: 'vitamin' }
    const obj2 = { 1: 'Medicine', 2: 'Group', 3: 'Expired' }
    const obj3 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const $q = useQuasar()
    const tab = ref('2')
    const filterTab = ref('1')
    const store = globalStore()
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const showDialog = ref(false)
    const groupDialog = ref(false)
    const showNoAccess = ref(false)
    const pages = ref([])
    const dataStorage = ref({})
    const elseSummary = ref({})
    const mode = ref('')
    const selectedMonth = ref(monthToday)
    const selectedYear = ref(yearToday)
    const selectedDay = ref(dayToday)

    const itemsCount = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })

    const groupNameOptions = ref([])
    const tableAction = (data, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        if (filterTab.value !== 2) showDialog.value = !showDialog.value
        else groupDialog.value = !groupDialog.value

        getInventoryGroup(obj[tab.value]).then((response) => {
          groupNameOptions.value = response
        })
        if (modeParam == 'Add') {
          dataStorage.value = {}
        } else {
          dataStorage.value = data
        }
      } else {
        arrayOfId.value.push(data.id)
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
          addInventoryList(
            dataStorage.value,
            store.userData.user_id,
            store.userData.user_type,
          ).then((response) => {
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
          addGroupName(dataStorage.value, store.userData.user_id, store.userData.user_type).then(
            (response) => {
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
            },
          )
        }
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        editInventoryList(dataStorage.value, store.userData.user_id, store.userData.user_type).then(
          (response) => {
            console.log(response)
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
            setTimeout(() => {
              $q.loading.hide()
            }, 2000)
          },
        )
      }
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
      softDeleteInventoryData(
        arrayOfId.value,
        tableName,
        store.userData.user_id,
        store.userData.user_type,
      ).then((response) => {
        if (response == 'success') {
          filterInventory(filterTab.value)
          getInventoryListSummary(obj[tab.value]).then((response) => {
            elseSummary.value = response
          })
        }
      })
    }

    watchEffect(() => {
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
    })
    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const official = [1, 2, 3, 4].includes(userRole) && userType == 3
      const volunteer = [1, 2].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer
      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }

    return {
      showNoAccess,
      preventAction,
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
      filterInventory,
      tableConfig,
      scrollListRef,
      scrollAreaRef,
      selectedDay,
      generateYearList,
      formatNumber,
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
