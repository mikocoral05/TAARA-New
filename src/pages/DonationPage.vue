<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="1" icon="sym_r_payments" label="Cash Donation" no-caps />
        <q-tab name="2" icon="sym_r_handyman" label="Material Donation" no-caps />
      </q-tabs>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />

    <div class="row no-wrap">
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        row-key="animal_id"
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

        <template #cell-fund_id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
        <template #cell-donor_name="{ row }">
          <span :class="row?.donor_name ? 'text-black' : 'text-grey-5'">
            {{ row?.donor_name || 'N/a' }}
          </span>
        </template>
        <template #cell-reference_code="{ row }">
          <span :class="row?.reference_code ? 'text-black' : 'text-grey-5'">
            {{ row?.reference_code || 'N/a' }}
          </span>
        </template>
        <template #cell-item_condition="{ row }">
          {{ row.item_condition == 1 ? 'New' : 'Used' }}
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
        <q-form class="full-height column justify-between no-wrap" @submit="saveFn()">
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
                    Donor Name <span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.donor_name"
                    dense
                    class="q-mt-sm"
                    style="width: 200px"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Amount <span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    type="number"
                    v-model="dataStorage.amount"
                    dense
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Amount is required!']"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Upload image <span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-file
                    class="q-mt-sm"
                    v-model="dataStorage.file"
                    hint="Try uploading image first, will analyse"
                    outlined
                    dense
                    style="max-width: 300px"
                  >
                    <template v-slot:append>
                      <q-icon name="sym_r_attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Method<span class="text-negative"> *</span></div>
                  <q-select
                    outlined
                    v-model="dataStorage.method"
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Method is required!']"
                    :options="[
                      { label: 'Onsite', value: 'onsite' },
                      { label: 'Online', value: 'online' },
                    ]"
                    dense
                    style="width: 150px"
                    behavior="menu"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Reference code<span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-input
                    outlined
                    type="number"
                    v-model="dataStorage.reference_code"
                    dense
                    class="q-mt-sm"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Be anonymous<span class="text-negative"> *</span>
                  </div>
                  <q-select
                    outlined
                    v-model="dataStorage.anonymous"
                    class="q-mt-sm"
                    :options="[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]"
                    :rules="[(val) => !!val || 'This feild is required!']"
                    dense
                    style="width: 150px"
                    behavior="menu"
                  />
                </div>
              </div>
              <div class="row no-wrap">
                <div class="column no-wrap q-mt-sm q-mr-md">
                  <div class="text-capitalize">
                    Allocated for<span class="text-grey-7 text-caption"> (optional)</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.allocated_for"
                    style="width: 300px"
                    dense
                    class="q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mt-sm">
                  <div class="text-capitalize">
                    Received date<span class="text-negative"> *</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="dataStorage.received_date"
                    mask="####-##-##"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.expiration_date">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="column no-wrap q-mt-lg">
                <div class="text-capitalize">
                  Notes <span class="text-grey-7 text-caption"> (optional)</span>
                </div>
                <q-input
                  outlined
                  type="textarea"
                  v-model="dataStorage.notes"
                  dense
                  class="q-mt-sm"
                />
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
              style="width: 180px"
              type="submit"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md" style="width: 450px; min-height: 230px">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_inventory_2" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md text-center">
            Are you sure you want to Delete this Pet Record List?
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
  softDeleteAnimal,
  getAnimalList,
  editAnimalInfo,
  getDonation,
  saveDonation,
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
  getImageLink,
  dateToday,
} from 'src/composable/simpleComposable'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const obj = { 1: 'Cash Donation List', 2: 'Material Donation List' }
    const obj2 = { 1: 'Medicine', 2: 'Group', 3: 'Expired' }
    const obj3 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const $q = useQuasar()
    const tab = ref('1')
    const filterTab = ref('1')
    const editTab = ref('1')
    const step = ref(1)
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const showDialog = ref(false)
    const pages = ref([])
    const dataStorage = ref({ file: [], received_date: dateToday })
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
    const file = ref(null)
    const myFile = ref(null)

    const triggerUpload = () => {
      myFile.value.pickFiles()
    }

    const groupNameOptions = ref([])
    const tableAction = (data, modeParam) => {
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        if (filterTab.value !== 2) showDialog.value = !showDialog.value

        if (modeParam == 'Add') {
          dataStorage.value = {}
        } else {
          dataStorage.value = data
          console.log(dataStorage.value.image_gallery)
          if (dataStorage.value?.image_gallery.length > 0) {
            dataStorage.value?.image_gallery.forEach((element) => {
              previewImage.value.push(getImageLink(element))
              console.log(getImageLink(element))
            })
          }
        }
      } else {
        arrayOfId.value.push(data.animal_id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      if (mode.value == 'Add') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        dataStorage.value.donation_type = tab.value == 1 ? 'cash' : 'material'
        saveDonation(dataStorage.value).then((response) => {
          console.log(response)
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 500)
          setTimeout(() => {
            fetchFn()
            showDialog.value = false
            $q.loading.hide()
          }, 1000)
        })
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        editAnimalInfo(dataStorage.value).then((response) => {
          console.log(response)
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
          setTimeout(() => {
            $q.loading.hide()
          }, 2000)
        })
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Deleting Pet info. Please wait...',
      })
      softDeleteAnimal(arrayOfId.value).then((response) => {
        $q.loading.show({
          group: 'update',
          message: response.message,
        })
        setTimeout(() => {
          $q.loading.hide()
          if (response.status == 'success') {
            getAnimalList(tab.value).then((response) => {
              rows.value = response
            })
          }
        }, 2000)
      })
    }

    const previewImage = ref([])
    const imageFnUpdate = () => {
      previewImage.value = [] // RESET before adding new images
      if (dataStorage.value.file.length > 0) {
        dataStorage.value.file.forEach((element) => {
          previewImage.value.push(URL.createObjectURL(element))
        })
      }
    }
    const fetchFn = () => {
      const objW = { 1: 'cash', 2: 'material' }
      getDonation(objW[tab.value]).then((response) => {
        tableConfig.value.title = `${obj[tab.value]}`
        if (tab.value == 1) {
          tableConfig.value.columns = [
            'id',
            'fund_id',
            'allocated_for',
            'donor_name',
            'received_date',
            'remarks',
            'amount',
            'method',
            'notes',
            'reference_code',
            'btn',
          ]
        } else {
          tableConfig.value.columns = [
            'id',
            'fund_id',
            'allocated_for',
            'donor_name',
            'received_date',
            'remarks',
            'notes',
            'item_name',
            'quantity',
            'unit',
            'estimate_value',
            'item_condition',
            'btn',
          ]
        }
        rows.value = response
        console.log(rows.value)
      })
    }
    watchEffect(() => {
      fetchFn()
    })

    return {
      getImageLink,
      imageFnUpdate,
      step,
      myFile,
      file,
      previewImage,
      triggerUpload,
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
      showDialog,
      mode,
      dataStorage,
      tableAction,
      rows,
      tab,
      showingTooltip: ref(false),
      columns: [
        { name: 'fund_id', label: 'ID', field: 'fund_id', align: 'center' },
        {
          name: 'donor_name',
          label: 'Donor Name',
          field: 'donor_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'allocated_for',
          label: 'Alocated For',
          field: 'allocated_for',
          sortable: true,
          align: 'center',
        },
        {
          name: 'method',
          label: 'Method',
          field: 'method',
          sortable: true,
          align: 'center',
        },
        {
          name: 'amount',
          label: 'Amount',
          field: 'amount',
          sortable: true,
          align: 'center',
        },
        {
          name: 'notes',
          label: 'Notes',
          field: 'notes',
          sortable: true,
          align: 'center',
        },
        {
          name: 'reference_code',
          label: 'Reference Code',
          field: 'reference_code',
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
          name: 'estimated_value',
          label: 'Estimated Value',
          field: 'estimated_value',
          sortable: true,
          align: 'center',
        },
        {
          name: 'item_condition',
          label: 'Item Condition',
          field: 'item_condition',
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
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.image-viewer-container {
  .image-viewer {
    margin-top: 5px;
    height: 125px;
    width: 125px;
    position: relative;
    border-radius: 10px;
    .q-img {
      border-radius: 10px;
    }
  }
}
</style>
