<template>
  <q-page>
    <div class="row no-wrap">
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        row-key="id"
        separator="vertical"
        :rows-per-page-options="[10]"
        title="Pet Adoption Request List"
        :visible-columns="tableConfig.columns"
        selection="multiple"
        v-model="search"
        v-model:selected="arrayOfId"
        v-model:confirm="confirm"
        v-model:status="status"
        v-model:showStatusFilter="showStatusFilter"
        v-model:statusOption="statusOption"
        :tableAction="tableAction"
        :preventAction="preventAction"
        :showAddBtns="false"
      >
        <template #cell-btn="{ row }">
          <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
            <q-menu anchor="bottom left" self="top right">
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="tableAction(row, 'View')">
                  <q-item-section>View Form</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_visibility" size="1.2rem" />
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-close-popup
                  v-if="row.status == 1"
                  @click="tableAction(row, 'Approve')"
                >
                  <q-item-section>Approve</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_check_circle" size="1.2rem" color="positive" />
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  v-if="row.status == 1"
                  @click="tableAction(row, 'Disapprove')"
                >
                  <q-item-section>Dispprove</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_cancel" color="red" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  v-if="row.status == 2"
                  @click="tableAction(row, 'Ready')"
                >
                  <q-item-section>Ready for Pickup</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_arrow_circle_right" color="positive" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="tableAction(row.id, 'Archive')">
                  <q-item-section>Archive</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_delete" size="1.2rem" color="negative" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>

        <template #cell-status="{ row }">
          <div
            class="row no-wrap radius-5 text-white items-center justify-center"
            :class="{
              'bg-orange ': row.status == 1,
              'bg-positive ': row.status == 2,
              'bg-negative ': row.status == 3,
            }"
          >
            <q-icon
              class="q-mr-sm"
              :name="
                row.status == 1
                  ? 'sym_r_assignment'
                  : row.status == 2
                    ? 'sym_r_check_circle'
                    : 'sym_r_cancel'
              "
            />
            <div>
              {{ row.status == 1 ? 'Pending' : row.status == 2 ? 'Approved' : 'Disapproved' }}
            </div>
          </div>
        </template>
        <template #cell-adoption_status="{ row }">
          <div>
            {{ adoptionProgressMap[row.adoption_status] }}
          </div>
        </template>
        <template #cell-phone_number="{ row }">
          <div>+63 {{ row.phone_number }}</div>
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
            Are you sure you want to Delete this Pet Adotpion Request ?
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

    <q-dialog position="right" full-height maximized v-model="addDialog">
      <q-card style="width: 50vw; height: 500px" class="text-black column justify-between no-wrap">
        <q-form @submit="saveFn()">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} Pet Transfer List</div>
              <q-icon name="close" size="1.2rem" @click="addDialog = !addDialog" />
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
                    Owner First name<span class="text-negative q-ml-sm"> *</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.owner_first_name"
                    dense
                    class="q-mt-sm"
                    placeholder="First name"
                    :rules="[(val) => !!val || 'First name is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Middle name <span class="text-grey-7 text-caption q-ml-sm"> ( optional) </span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.owner_middle_name"
                    dense
                    placeholder="Middle name"
                    class="q-mt-sm"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Last name <span class="text-negative q-ml-sm"> *</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.owner_last_name"
                    dense
                    class="q-mt-sm"
                    placeholder="Last name"
                    :rules="[(val) => !!val || 'Last name is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
              </div>
              <div class="row no-wrap q-mt-sm">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Pet name <span class="text-negative q-ml-sm"> *</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.pet_name"
                    dense
                    class="q-mt-sm"
                    placeholder="Last name"
                    :rules="[(val) => !!val || 'Pet name is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Breed <span class="text-negative q-ml-sm"> *</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.pet_breed"
                    dense
                    placeholder="Pet Breed"
                    class="q-mt-sm"
                    style="width: 300px"
                    :rules="[(val) => !!val || 'Pet breed is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
              </div>
              <div class="row no-wrap q-mt-sm">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    BirthDate<span class="text-negative q-ml-sm"> *</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="dataStorage.birth_date"
                    mask="####-##-##"
                    placeholder="####-##-##"
                    :rules="[(val) => !!val || 'Birth Date is required!']"
                    :readonly="mode == 'View'"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.birth_date" mask="YYYY-MM-DD">
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
                  <div class="text-capitalize">fur_color<span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.fur_color"
                    placeholder="Fur Color"
                    dense
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Fur color is required!']"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <p class="q-ma-none q-mb-sm">
                    Size <span class="text-negative q-ml-sm"> *</span>
                  </p>
                  <q-select
                    v-model="dataStorage.size"
                    outlined
                    :options="petSizes"
                    map-options
                    dense
                    :rules="[(val) => !!val || 'Size is required!']"
                    :readonly="mode == 'View'"
                    style="width: 200px"
                    behaviour="menu"
                    hint="To determine cage size"
                  />
                </div>
              </div>

              <div class="row">
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <p class="q-ma-none q-mb-sm">Sex <span class="text-negative q-ml-sm"> *</span></p>
                  <q-select
                    v-model="dataStorage.sex"
                    outlined
                    :options="sexOption"
                    map-options
                    emit-value
                    dense
                    :rules="[(val) => !!val || 'Sex is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <p class="q-ma-none q-mb-sm">
                    Has Anti-rabbies? <span class="text-negative q-ml-sm"> *</span>
                  </p>
                  <q-select
                    v-model="dataStorage.has_anti_rabies"
                    outlined
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 2 },
                    ]"
                    map-options
                    emit-value
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <p class="q-ma-none q-mb-sm">
                    Has been Dewormed? <span class="text-negative q-ml-sm"> *</span>
                  </p>
                  <q-select
                    v-model="dataStorage.has_been_dewormed"
                    outlined
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 2 },
                    ]"
                    map-options
                    emit-value
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <p class="q-ma-none q-mb-sm">
                    Sleeping Place <span class="text-negative q-ml-sm"> *</span>
                  </p>
                  <q-select
                    v-model="dataStorage.pet_sleeping_place"
                    outlined
                    :options="[
                      { label: 'Indoor', value: 1 },
                      { label: 'Outdoor', value: 2 },
                    ]"
                    emit-value
                    map-options
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <p class="q-ma-none q-mb-sm">
                    Status <span class="text-negative q-ml-sm"> *</span>
                  </p>
                  <q-select
                    v-model="dataStorage.status"
                    outlined
                    :options="[
                      { label: 'Pending', value: 1 },
                      { label: 'Approved', value: 2 },
                      { label: 'Disapproved', value: 2 },
                    ]"
                    emit-value
                    map-options
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md q-mt-sm">
                  <div class="text-capitalize">
                    Date Transfer<span class="text-grey-7 q-ml-sm"> ( optional )</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="dataStorage.date_transfer"
                    mask="####-##-##"
                    placeholder="####-##-##"
                    :readonly="mode == 'View'"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.date_transfer" mask="YYYY-MM-DD">
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
              <div class="column no-wrap q-mt-sm">
                <div class="text-capitalize">
                  Reason for Transfer<span class="text-negative q-ml-sm"> *</span>
                </div>
                <q-input
                  outlined
                  type="textarea"
                  v-model="dataStorage.reason_for_transfer"
                  dense
                  class="q-mt-sm"
                  :rules="[(val) => !!val || 'Reason is required!']"
                  :readonly="mode == 'View'"
                />
              </div>
              <div class="column no-wrap q-mt-sm">
                <div class="text-capitalize">
                  Behaviour <span class="text-negative q-ml-sm"> *</span>
                </div>
                <q-input
                  outlined
                  type="textarea"
                  v-model="dataStorage.behaviour"
                  dense
                  class="q-mt-sm"
                  :rules="[(val) => !!val || 'Behaviour is required!']"
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
    <NoAccessDialog v-model:showNoAccess="showNoAccess" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import {
  civilStatusOption,
  nameSuffixes,
  petSizes,
  sexOption,
} from 'src/composable/optionsComposable'
import {
  updatePetAdoption,
  addPetListRequest,
  getPetAdoptionList,
  deletePetAdotpion,
  updatePetAdoptionReadyPickup,
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

    const $q = useQuasar()
    const tab = ref('1')
    const filterTab = ref('1')
    const editTab = ref('1')
    const rows = ref([])
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
    const status = ref(0)
    const store = globalStore()
    const showStatusFilter = ref(true)
    const statusOption = ref([
      { label: 'All', value: 0 },
      { label: 'Pending', value: 1 },
      { label: 'Approved', value: 2 },
      { label: 'Disapproved', value: 3 },
    ])
    const username = store.userData.first_name + ' ' + store.userData.last_name
    const totalBalance = ref(null)
    const dailyExpenseTotal = ref([])
    const itemsCount = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })
    const groupNameOptions = ref([])
    const showNoAccess = ref(false)
    const fetchData = async () => {
      const response = await getPetAdoptionList(status.value)
      tableConfig.value.columns = [
        'id',
        'first_name',
        'name',
        'phone_number',
        'status',
        'adoption_status',
        'btn',
      ]
      rows.value = response
      console.log(rows.value)
    }
    const adoptionProgressMap = {
      1: 'Application Review',
      2: 'Pet Being Prepared',
      3: 'Ready for Pickup/Delivery',
      4: 'Received',
    }

    const tableAction = (row, modeParam, action) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      console.log(row)

      if (['View', 'Edit', 'Add'].includes(modeParam)) {
        if (modeParam == 'Add') {
          addDialog.value = true
          dataStorage.value = { status: 1 }
        } else if (['Edit', 'View'].includes(modeParam)) {
          addDialog.value = true
          dataStorage.value = { ...row }
          console.log(dataStorage.value)
        } else {
          dataStorage.value = { id: row, status: action == 'prio' ? 1 : 0 }
          saveFn()
        }
      } else if (['Disapprove', 'Approve'].includes(modeParam)) {
        const statusParam = modeParam == 'Disapprove' ? 3 : 2
        dataStorage.value = { ...row, status: statusParam }
        saveFn()
      } else if (modeParam == 'Ready') {
        dataStorage.value = { ...row, adoption_status: 3 }
        $q.loading.show({
          group: 'update',
          message: `Updating. Please wait...`,
        })

        updatePetAdoptionReadyPickup(
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          username,
        ).then((response) => {
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 500)
          setTimeout(() => {
            $q.loading.hide()
            addDialog.value = false
            fetchData()
          }, 1000)
        })
      } else {
        arrayOfId.value.push(row)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      if (mode.value == 'Add') {
        $q.loading.show({
          group: 'add',
          message: 'Adding Pet transfer. Please wait...',
        })
        addPetListRequest(dataStorage.value, store.userData.user_id, store.userData.user_type).then(
          (response) => {
            setTimeout(() => {
              $q.loading.show({
                group: 'add',
                message: response.message,
              })
            }, 500)
            setTimeout(() => {
              $q.loading.hide()
              addDialog.value = false
              fetchData()
            }, 1000)
          },
        )
      } else if (['Approve', 'Disapprove'].includes(mode.value)) {
        $q.loading.show({
          group: 'update',
          message: `Updating. Please wait...`,
        })

        updatePetAdoption(
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          username,
        ).then((response) => {
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 500)
          setTimeout(() => {
            $q.loading.hide()
            addDialog.value = false
            fetchData()
          }, 1000)
        })
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: `Deleting Pet Transfer list. Please wait...`,
      })
      deletePetAdotpion(
        arrayOfId.value,
        store.userData.user_id,
        store.userData.user_type,
        username,
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
    }

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const official = [1, 2].includes(userRole) && userType == 3
      const volunteer = [2, 3, 5].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer
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
      adoptionProgressMap,
      preventAction,
      showNoAccess,
      sexOption,
      petSizes,
      showStatusFilter,
      statusOption,
      status,
      addDialog,
      groupNameOptions,
      arrayOfId,
      filterTab,
      softDeleteFn,
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
          name: 'first_name',
          label: 'Adopter Name',
          field: 'first_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'name',
          label: 'Pet Name',
          field: 'name',
          align: 'center',
        },
        {
          name: 'phone_number',
          label: 'Phone Number',
          field: 'phone_number',
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
          name: 'adoption_status',
          label: 'Progress',
          field: 'adoption_status',
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
