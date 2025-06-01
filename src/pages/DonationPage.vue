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
        row-key="fund_id"
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

        <template #cell-item_condition="{ row }">
          {{ row.item_condition == 1 ? 'New' : 'Used' }}
        </template>
        <template #cell-status="{ row }">
          <div
            :class="statusColor(row?.status)"
            class="row no-wrap q-px-sm radius-2 items-center justify-center"
          >
            <q-icon :name="statusIcon(row.status)" size="1rem" class="q-mr-sm" />
            {{ donationStatusText(row.status) }}
          </div>
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
              <div class="row no-wrap q-mt-md" v-if="tab == 1">
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
                    :readonly="mode == 'View'"
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
                    :readonly="mode == 'View'"
                  />
                </div>

                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Upload image <span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-file
                    class="q-mt-sm"
                    v-model="dataStorage.file"
                    :hint="
                      mode == 'Add'
                        ? 'Try uploading image first, will analyse'
                        : previewImage
                          ? 'Click the icon to view image'
                          : 'Click the empty space to add image'
                    "
                    outlined
                    dense
                    :readonly="mode == 'View'"
                    style="max-width: 300px"
                    @update:model-value="imageFnUpdate()"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="!previewImage && !showSpinner"
                        name="sym_r_add_photo_alternate"
                      />
                      <q-icon
                        v-if="!showSpinner && previewImage"
                        name="sym_r_photo"
                        @click="viewImage = !viewImage"
                      />
                      <q-spinner-ios color="primary" v-if="showSpinner" size="1em" />
                    </template>
                  </q-file>
                </div>
              </div>
              <div class="row no-wrap q-mt-md" v-else>
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
                    :readonly="mode == 'View'"
                  />
                </div>

                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Item name<span class="text-negative"> *</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.item_name"
                    dense
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Item name is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Upload image <span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-file
                    class="q-mt-sm"
                    v-model="dataStorage.file"
                    :hint="
                      mode == 'Add'
                        ? 'Try uploading image first, will analyse'
                        : dataStorage.file
                          ? 'Click the icon to view image'
                          : 'Click the empty space to add image'
                    "
                    outlined
                    dense
                    style="max-width: 300px"
                    @update:model-value="imageFnUpdate()"
                    :readonly="mode == 'View'"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="!dataStorage.file && !showSpinner"
                        name="sym_r_add_photo_alternate"
                      />
                      <q-icon
                        v-if="!showSpinner && dataStorage.file"
                        name="sym_r_photo"
                        @click="viewImage = !viewImage"
                      />
                      <q-spinner-ios color="primary" v-if="showSpinner" size="1em" />
                    </template>
                  </q-file>
                </div>
              </div>
              <div class="row no-wrap q-mt-md" v-if="tab == 1">
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
                    emit-value
                    map-options
                    style="width: 150px"
                    behavior="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Reference code<span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.reference_code"
                    dense
                    class="q-mt-sm"
                    :readonly="mode == 'View'"
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
                    emit-value
                    map-options
                    :rules="[(val) => !!val || 'This feild is required!']"
                    dense
                    style="width: 150px"
                    behavior="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
              </div>
              <div class="row no-wrap q-mt-md" v-else>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Quantity<span class="text-negative"> *</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.quantity"
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Quantity is required!']"
                    dense
                    style="width: 150px"
                    :readonly="mode == 'View'"
                  />
                </div>

                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Unit<span class="text-negative"> *</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.unit"
                    dense
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Unit is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Item condition<span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-select
                    outlined
                    v-model="dataStorage.item_condition"
                    class="q-mt-sm"
                    :options="[
                      { label: 'New', value: 1 },
                      { label: 'Used', value: 2 },
                    ]"
                    emit-value
                    map-options
                    :rules="[(val) => !!val || 'This feild is required!']"
                    dense
                    style="width: 150px"
                    :readonly="mode == 'View'"
                    behavior="menu"
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
                    emit-value
                    map-options
                    :rules="[(val) => !!val || 'This feild is required!']"
                    dense
                    style="width: 150px"
                    behavior="menu"
                    :readonly="mode == 'View'"
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
                    :readonly="mode == 'View'"
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
                    :readonly="mode == 'View'"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.received_date" :disable="mode == 'View'">
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
                  Status <span class="text-negative text-caption"> *</span>
                </div>
                <q-select
                  outlined
                  v-model="dataStorage.status"
                  class="q-mt-sm"
                  :rules="[(val) => !!val || 'Status is required!']"
                  :options="[
                    { label: 'Pending', value: 1 },
                    { label: 'Approved', value: 2 },
                    { label: 'Disapproved', value: 3 },
                  ]"
                  dense
                  emit-value
                  map-options
                  style="width: 150px"
                  behavior="menu"
                  :readonly="mode == 'View'"
                />
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">
                  Notes <span class="text-grey-7 text-caption"> (optional)</span>
                </div>
                <q-input
                  outlined
                  type="textarea"
                  v-model="dataStorage.notes"
                  dense
                  class="q-mt-sm"
                  :readonly="mode == 'View'"
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
            Are you sure you want to Delete this Donation Record?
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

    <ImageViewer v-model="viewImage" :imageUrl="previewImage" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getDonation,
  saveDonation,
  editDonation,
  softDeleteDonation,
} from 'src/composable/latestComposable'
import { ref, watch, watchEffect } from 'vue'
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
  parseDonationFromImage,
  statusIcon,
  donationStatusText,
  statusColor,
} from 'src/composable/simpleComposable'
import ImageViewer from 'src/components/ImageViewer.vue'
import { globalStore } from 'src/stores/global-store'
export default {
  components: {
    ReusableTable,
    ImageViewer,
  },
  setup() {
    const store = globalStore()
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
    const showSpinner = ref(false)
    const pages = ref([])
    const dataStorage = ref({})
    const elseSummary = ref({})
    const mode = ref('')
    const viewImage = ref(false)
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
    const tableAction = async (data, modeParam) => {
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        if (filterTab.value !== 2) showDialog.value = !showDialog.value

        if (modeParam == 'Add') {
          dataStorage.value = { file: null, received_date: dateToday }
        } else {
          dataStorage.value = { ...data }
          previewImage.value = data?.image_path
          // dataStorage.value.file = data?.image_path
          console.log(dataStorage.value)
        }
      } else {
        arrayOfId.value.push(data.fund_id)
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
        dataStorage.value.created_by = store.userData.user_id
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
        editDonation(dataStorage.value).then((response) => {
          console.log(response)
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 500)
          setTimeout(() => {
            showDialog.value = false
            $q.loading.hide()
          }, 1000)
        })
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Deleting Pet info. Please wait...',
      })
      softDeleteDonation(arrayOfId.value).then((response) => {
        setTimeout(() => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
        }, 500)
        setTimeout(() => {
          $q.loading.hide()
          if (response.status == 'success') {
            fetchFn()
          }
        }, 1000)
      })
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(dataStorage.value.file)
      console.log(previewImage.value)
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
            'reference_code',
            'status',
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
            'item_name',
            'quantity',
            'unit',
            'estimate_value',
            'item_condition',
            'status',

            'btn',
          ]
        }
        rows.value = response
        console.log(rows.value)
      })
    }

    watch(
      () => dataStorage.value.file,
      async (newValue) => {
        if (tab.value != 1 || !newValue) return
        console.log(newValue)

        // When newValue is a File object (from q-file)
        const isFileObject = typeof newValue === 'object' && newValue instanceof File

        // Only process if it's a real uploaded file, not a string/URL
        if (isFileObject) {
          showSpinner.value = true
          const response = await parseDonationFromImage(newValue)
          console.log('Extracted text:', response)

          dataStorage.value.amount = dataStorage.value?.amount || response.donation_amount
          dataStorage.value.reference_code = dataStorage.value?.reference_code || response.reference

          showSpinner.value = false
        }
      },
    )

    watchEffect(() => {
      fetchFn()
    })
    return {
      statusColor,
      donationStatusText,
      statusIcon,
      showSpinner,
      viewImage,
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
          name: 'status',
          label: 'Status',
          field: 'status',
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
