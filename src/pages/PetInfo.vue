<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="1" icon="sym_r_pets" label="Ready for Adoption" no-caps />
        <q-tab
          name="2"
          icon="sym_r_sound_detection_dog_barking"
          label="Under Rehabilitation"
          no-caps
        />
        <q-tab name="3" icon="sym_r_monitor_heart" label="Under Medication" no-caps />
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

        <template #cell-animal_id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
        <template #cell-name="{ row }">
          <q-avatar size="30px" class="q-mr-md">
            <q-img :src="row.img_path || 'animal-no-image.svg'" />
          </q-avatar>
          {{ row.name }}
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
    <q-dialog position="right" full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column justify-between">
        <div class="column no-wrap">
          <q-card-section class="q-py-md row no-wrap justify-between items-center">
            <div class="text-body1">{{ mode }} {{ tableConfig.title }}</div>
            <q-icon name="close" size="1.2rem" @click="showDialog = !showDialog" />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pb-none">
            <div class="text-grey-7" style="font-size: 12px">
              All fields are mandatory, except mentioned as (optional).
            </div>
          </q-card-section>
          <q-card-section
            class="no-padding column no-wrap justify-between"
            style="min-height: 590px"
          >
            <q-stepper
              v-model="step"
              flat
              ref="stepper"
              color="primary"
              animated
              style="min-height: 530px"
            >
              <q-step
                :name="1"
                title="Basic info"
                icon="sym_r_pets"
                :done="step > 1"
                class="q-pt-none"
              >
                <div class="row">
                  <div class="column no-wrap q-mr-md w-40">
                    <div class="text-capitalize">Pet name</div>
                    <q-input
                      outlined
                      v-model="dataStorage.name"
                      dense
                      class="q-mt-sm"
                      placeholder="Pick best name"
                    />
                  </div>
                  <div class="column no-wrap q-mr-md w-40">
                    <div class="text-capitalize">Species</div>
                    <q-input
                      outlined
                      placeholder="Species"
                      v-model="dataStorage.species"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">Breed</div>
                    <q-input
                      outlined
                      placeholder="Breed"
                      v-model="dataStorage.breed"
                      dense
                      class="q-mt-sm"
                    />
                  </div>

                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">Birtdate</div>
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm"
                      placeholder="Date of birth"
                      v-model="dataStorage.date_of_birth"
                      mask="####-##-##"
                      :rules="[(val) => !!val || '']"
                      hide-bottom-space
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="dataStorage.date_of_birth">
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
                <div class="q-mt-md text-bold">Physical Characteristics</div>
                <div class="row">
                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">Fur color</div>
                    <q-input
                      outlined
                      placeholder="Fur color"
                      v-model="dataStorage.fur_color"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">Eye color</div>
                    <q-input
                      outlined
                      placeholder="Eye color"
                      v-model="dataStorage.eye_color"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="column no-wrap w-30 q-mr-md q-mt-md">
                    <div class="text-capitalize">Sex</div>
                    <q-select
                      outlined
                      v-model="dataStorage.sex"
                      :options="['Male', 'Female']"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                </div>
                <div class="q-mt-md text-bold">Size Measurements</div>
                <div class="row">
                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">
                      Weight<span class="text-grey-7 q-ml-sm">(kg)</span>
                    </div>
                    <q-input
                      outlined
                      placeholder="Weight"
                      v-model="dataStorage.weight"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="column no-wrap q-mr-md q-mt-md">
                    <div class="text-capitalize">
                      Height<span class="text-grey-7 q-ml-sm">(cm)</span>
                    </div>
                    <q-input
                      placeholder="Height"
                      outlined
                      v-model="dataStorage.height"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                </div>
              </q-step>

              <q-step :name="2" title="Medical info" icon="sym_r_healing" :done="step > 2">
                <div class="row no-wrap justify-between items-center">
                  <div>Is the pet spayed or neutered ?</div>
                  <div class="row no-wrap">
                    <q-checkbox
                      v-model="dataStorage.spayed_neutered"
                      label="Yes"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      true-value="Yes"
                      indeterminate-icon="highlight_off"
                    />
                    <q-checkbox
                      true-value="No"
                      v-model="dataStorage.spayed_neutered"
                      label="No"
                      indeterminate-icon="highlight_off"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                    />
                  </div>
                </div>
                <div class="row no-wrap justify-between items-center">
                  <div>Vaccination status ?</div>
                  <div class="row no-wrap">
                    <q-checkbox
                      v-model="dataStorage.vaccination_status"
                      label="Up-to-date"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      true-value="Up-to-date"
                      indeterminate-icon="highlight_off"
                    />
                    <q-checkbox
                      v-model="dataStorage.vaccination_status"
                      label="Partial"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      true-value="Partial"
                      indeterminate-icon="highlight_off"
                    />
                    <q-checkbox
                      true-value="None"
                      v-model="dataStorage.vaccination_status"
                      label="None"
                      indeterminate-icon="highlight_off"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                    />
                  </div>
                </div>
                <div class="row no-wrap justify-between items-center">
                  <div>Rescue status ?</div>
                  <div class="row no-wrap">
                    <q-checkbox
                      v-model="dataStorage.rescue_status"
                      label="Rescued"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      true-value="Rescued"
                      indeterminate-icon="highlight_off"
                    />
                    <q-checkbox
                      v-model="dataStorage.rescue_status"
                      label="Abandoned"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                      true-value="Abandoned"
                      indeterminate-icon="highlight_off"
                    />
                    <q-checkbox
                      true-value="Transferred"
                      v-model="dataStorage.rescue_status"
                      label="Transferred"
                      indeterminate-icon="highlight_off"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                    />
                    <q-checkbox
                      true-value="Born in Care"
                      v-model="dataStorage.rescue_status"
                      label="Born in Care"
                      indeterminate-icon="highlight_off"
                      checked-icon="task_alt"
                      unchecked-icon="highlight_off"
                    />
                  </div>
                </div>
                <div class="column no-wrap relative-position">
                  <q-separator class="q-my-md" />
                  <div class="absolute-center bg-white text-grey-7">Skills & Behavior</div>
                </div>
                <div class="row q-mt-md">
                  <div class="column no-wrap q-mr-md w-40">
                    <div class="text-capitalize">Temperament (Behaviour)</div>
                    <q-input
                      outlined
                      v-model="dataStorage.temperament"
                      dense
                      class="q-mt-sm"
                      placeholder="Ex: Friendly, shy"
                    />
                  </div>
                  <div class="column no-wrap q-mr-md">
                    <div class="text-capitalize">Skills</div>
                    <q-input
                      outlined
                      placeholder="Ex: Fetching"
                      v-model="dataStorage.skills"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                  <div class="column no-wrap">
                    <div class="text-capitalize">Favorite food</div>
                    <q-input
                      outlined
                      placeholder="Ex: Meat"
                      v-model="dataStorage.favorite_food"
                      dense
                      class="q-mt-sm"
                    />
                  </div>
                </div>
                <div class="column q-mt-md no-wrap">
                  <div class="text-capitalize">Medical needs</div>
                  <q-input
                    outlined
                    type="textarea"
                    placeholder="Ex: Meat"
                    v-model="dataStorage.medical_needs"
                    dense
                    class="q-mt-sm"
                  />
                </div>
              </q-step>

              <q-step :name="3" title="Story" icon="sym_r_auto_stories" :done="step > 3">
                <div class="text-grey-7 text-caption q-mb-md">
                  Note: A compelling animal background story should immediately capture the reader's
                  heart by combining struggle, survival, and hope in a short, emotionally-resonant
                  way.
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">Background Story</div>
                  <q-input
                    outlined
                    type="textarea"
                    placeholder="Create a story that touch the heart of people."
                    v-model="dataStorage.medical_needs"
                    dense
                    class="q-mt-sm"
                  />
                </div>
              </q-step>
              <q-step :name="4" title="Pet Image" icon="sym_r_photo_camera">
                <div class="text-body1 text-bold">Upload pet Image</div>
                <div class="text-caption text-grey-7">
                  Choose an image that will appear in public page in the specific pet
                </div>
                <q-card class="q-mt-md radius-10 shadow-1">
                  <q-card-section
                    style="height: 200px"
                    class="column no-wrap items-center justify-center"
                  >
                    <q-icon name="sym_r_folder_open" size="1.5rem" />
                    <div class="q-mt-md">Click or drag and drop to upload file</div>
                    <div class="q-mt-sm text-caption text-grey-7">PNG,JPG,SVG</div>
                  </q-card-section>
                </q-card>
              </q-step>
            </q-stepper>
            <div class="row no-wrap q-pa-md q-px-lg">
              <q-btn
                label="Back"
                @click="step -= 1"
                no-caps
                v-if="step > 1"
                class="btn q-mr-md"
                outline
                color="primary"
              />
              <q-btn label="Continue" class="btn" color="primary" no-caps @click="step += 1" />
            </div>
          </q-card-section>
        </div>
        <!-- <q-card-section>
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
        </q-card-section> -->
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
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getBudgetAllocation,
  getExpensesSummary,
  getTotalBalance,
  getInventoryList,
  getInventoryGroup,
  getInventoryListSummary,
  getInventoryExpiredList,
  softDeleteInventoryData,
  addInventoryList,
  editInventoryList,
  addGroupName,
  getAnimalList,
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
    const obj = { 1: 'Ready for Adoption', 2: 'Under Rehabilitation', 3: 'Under Medication' }
    const obj2 = { 1: 'Medicine', 2: 'Group', 3: 'Expired' }
    const obj3 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const $q = useQuasar()
    const tab = ref('1')
    const filterTab = ref('1')
    const editTab = ref('1')
    const step = ref(4)
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const showDialog = ref(true)
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
    const tableAction = (data, modeParam) => {
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
        editInventoryList(dataStorage.value).then((response) => {
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
      getAnimalList(tab.value).then((response) => {
        tableConfig.value.title = `${capitalize(obj[tab.value])} List`
        tableConfig.value.columns = [
          'animal_id',
          'name',
          'species',
          'breed',
          'date_of_birth',
          'sex',
          'rescue_status',
          'btn',
        ]
        rows.value = response
        console.log(rows.value)
      })
    })

    return {
      step,
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
      dataStorage,
      tableAction,
      rows,
      tab,
      showingTooltip: ref(false),
      columns: [
        { name: 'animal_id', label: 'ID', field: 'animal_id', align: 'center' },
        {
          name: 'name',
          label: 'Name',
          field: 'name',
          sortable: true,
          align: 'left',
        },
        {
          name: 'species',
          label: 'Species',
          field: 'species',
          sortable: true,
          align: 'center',
        },
        {
          name: 'breed',
          label: 'Breed',
          field: 'breed',
          sortable: true,
          align: 'center',
        },
        {
          name: 'date_of_birth',
          label: 'Age',
          field: 'date_of_birth',
          sortable: true,
          align: 'center',
        },
        {
          name: 'sex',
          label: 'Sex',
          field: 'sex',
          sortable: true,
          align: 'center',
        },
        {
          name: 'rescue_status',
          label: 'Rescue Status',
          field: 'rescue_status',
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
