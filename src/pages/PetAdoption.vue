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
                  v-if="row.status == 2 && row.adoption_status == 2"
                  @click="tableAction(row, 'Ready')"
                >
                  <q-item-section>Ready for Pickup</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_arrow_circle_right" color="positive" size="1.2rem" />
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  v-if="row.adoption_status == 3 && row.adoption_status != 4"
                  @click="tableAction(row, 'Received')"
                >
                  <q-item-section>Received</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_multiple_stop" color="positive" size="1.2rem" />
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

    <q-dialog position="right" full-height maximized v-model="showForm">
      <q-card style="width: 50vw; height: 500px" class="text-black column justify-between no-wrap">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div class="text-body1">Viewing Adoption Form</div>
          <q-icon name="close" size="1.2rem" @click="showForm = !showForm" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Do you own any pets?*</p>
            </div>
            <div class="q-ma-sm row justify-center">
              <q-radio
                disable
                v-model="dataStorage.have_other_pet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.have_other_pet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div
            class="flex row justify-start items-center"
            v-show="dataStorage.have_other_pet == 'Yes'"
          >
            <p class="q-ma-sm q-mr-md" style="width: 230px">How many pets do you own?</p>
            <q-input
              readonly
              class="q-ma-sm q-mx-md"
              :disable="dataStorage.have_other_pet == 'No' || dataStorage.have_other_pet == null"
              outlined
              :rules="[(val) => (!!val && dataStorage.have_other_pet == 'Yes') || '']"
              hide-bottom-space
              :value="
                dataStorage.have_other_pet == 'No'
                  ? (dataStorage.pet_number = null)
                  : dataStorage.have_other_pet
              "
              v-model="dataStorage.pet_number"
              dense
              style="width: 300px"
              type="number"
              :style="
                dataStorage.have_other_pet == 'Yes'
                  ? dataStorage.pet_number == null
                    ? {
                        border: '1px solid #b157ae',
                        borderRadius: '5px',
                      }
                    : { borderRadius: '10px' }
                  : {}
              "
            />
          </div>
          <div
            class="flex row justify-start items-center"
            v-show="dataStorage.have_other_pet == 'Yes'"
          >
            <div class="q-ma-sm" style="width: 230px">
              <p>Are your pets well behaved toward other pets? *</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                v-model="dataStorage.behavior_other_animals"
                :disable="dataStorage.have_other_pet == 'No' || dataStorage.have_other_pet == null"
                :color="dataStorage.have_other_pet == 'Yes' ? 'accent' : 'gray'"
                :keep-color="dataStorage.have_other_pet == 'Yes' ? true : false"
                :value="
                  dataStorage.have_other_pet == 'Yes'
                    ? dataStorage.behavior_other_animals
                    : (dataStorage.behavior_other_animals = '')
                "
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="yes"
                label="Yes"
              />
              <q-radio
                v-model="dataStorage.behavior_other_animals"
                :disable="dataStorage.have_other_pet == 'No' || dataStorage.have_other_pet == null"
                :color="dataStorage.have_other_pet == 'Yes' ? 'accent' : 'gray'"
                :keep-color="dataStorage.have_other_pet == 'Yes' ? true : false"
                :value="
                  dataStorage.have_other_pet == 'No'
                    ? (dataStorage.behavior_other_animals = '')
                    : dataStorage.behavior_other_animals
                "
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="no"
                label="No"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Do you have a veterinarian? *</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.have_vet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.have_vet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center" v-show="dataStorage.have_vet == 'Yes'">
            <p class="q-ma-sm q-mr-md" style="width: 230px">Phone Number</p>
            <q-input
              class="q-ma-sm q-mx-md"
              outlined
              readonly
              v-model="dataStorage.vet_phone_number"
              :style="
                dataStorage.have_other_pet == 'Yes'
                  ? dataStorage.vet_phone_number == null
                    ? {
                        border: '1px solid #b157ae',
                        borderRadius: '5px',
                      }
                    : { borderRadius: '10px' }
                  : {}
              "
              :color="
                dataStorage.have_other_pet == 'Yes' && dataStorage.vet_phone_number == null
                  ? 'accent'
                  : 'gray'
              "
              :value="
                dataStorage.have_other_pet == 'No'
                  ? (dataStorage.vet_phone_number = null)
                  : dataStorage.vet_phone_number
              "
              :rules="[
                (val) => (!!val && dataStorage.have_other_pet == 'Yes' && val.length == 16) || '',
                (val) => (val && val[1] === '9') || 'Phone number must start with 9',
              ]"
              hide-bottom-space
              :disable="dataStorage.have_other_pet == 'No' || dataStorage.have_other_pet == null"
              mask="phone"
              prefix="+63"
              dense
              style="width: 300px"
            />
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Do you own or rent your home?*</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.own_or_rent"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="1"
                label="Own"
              />
              <q-radio
                disable
                v-model="dataStorage.own_or_rent"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="2"
                label="Rent"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Do you have an adequate space for your pets? *</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.have_enough_space"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.have_enough_space"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Do you have any children at home?</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.have_children"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.have_children"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div
            class="flex row justify-start items-center"
            v-show="dataStorage.have_children == 'Yes'"
          >
            <p class="q-ma-sm q-mr-md" style="width: 230px">If yes, number of children</p>
            <q-input
              readonly
              class="q-ma-sm q-mx-md"
              type="number"
              :style="
                dataStorage.have_children == 'Yes'
                  ? dataStorage.number_of_children == null
                    ? {
                        border: '1px solid #b157ae',
                        borderRadius: '5px',
                      }
                    : { borderRadius: '10px' }
                  : {}
              "
              :rules="[(val) => (!!val && dataStorage.have_children == 'Yes') || '']"
              hide-bottom-space
              :value="
                dataStorage.have_children == 'No'
                  ? (dataStorage.number_of_children = '')
                  : dataStorage.number_of_children
              "
              :disable="dataStorage.have_children == 'No' || dataStorage.have_children == null"
              outlined
              v-model="dataStorage.number_of_children"
              dense
              style="width: 300px"
            />
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Will there be someone to take care of your pets while you're away?</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.someone_gonna_takecare_of_pet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.someone_gonna_takecare_of_pet"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div
            class="flex row justify-start items-center"
            v-show="dataStorage.someone_gonna_takecare_of_pet == 'Yes'"
          >
            <p class="q-ma-sm q-mr-md" style="width: 230px">If yes,</p>
            <q-select
              class="q-ma-sm q-mx-md"
              outlined
              v-model="dataStorage.pet_caretaker"
              :style="
                dataStorage.someone_gonna_takecare_of_pet == 'Yes'
                  ? dataStorage.pet_caretaker == ''
                    ? {
                        border: '1px solid #b157ae',
                        borderRadius: '5px',
                      }
                    : { borderRadius: '10px' }
                  : {}
              "
              :disable="
                dataStorage.someone_gonna_takecare_of_pet == 'No' ||
                dataStorage.someone_gonna_takecare_of_pet == null
              "
              :options="takeCareOptions"
              dense
              style="width: 300px"
              :value="
                dataStorage.someone_gonna_takecare_of_pet == 'No'
                  ? (dataStorage.pet_caretaker = '')
                  : dataStorage.pet_caretaker
              "
              :rules="[
                (val) => (!!val && dataStorage.someone_gonna_takecare_of_pet == 'Yes') || '',
              ]"
              hide-bottom-space
            />
          </div>
          <div
            class="flex row justify-start items-center"
            v-show="dataStorage.someone_gonna_takecare_of_pet == 'No'"
          >
            <p class="q-ma-sm q-mr-md" style="width: 230px">
              If no, what are your plans in taking care of your pets while you're away?
            </p>
            <q-input
              class="q-ma-sm q-mx-md"
              :style="
                dataStorage.someone_gonna_takecare_of_pet == 'No'
                  ? dataStorage.plans_for_pet_when_away == null
                    ? {
                        border: '1px solid #b157ae',
                        borderRadius: '5px',
                      }
                    : { borderRadius: '10px' }
                  : {}
              "
              :disable="
                dataStorage.someone_gonna_takecare_of_pet == 'Yes' ||
                dataStorage.someone_gonna_takecare_of_pet == null
              "
              :value="
                dataStorage.someone_gonna_takecare_of_pet == 'Yes'
                  ? (dataStorage.plans_for_pet_when_away = null)
                  : dataStorage.plans_for_pet_when_away
              "
              :rules="[(val) => (!!val && dataStorage.someone_gonna_takecare_of_pet == 'No') || '']"
              hide-bottom-space
              type="textarea"
              outlined
              v-model="dataStorage.plans_for_pet_when_away"
              dense
              style="width: 300px"
            />
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>
                Are you easily disturbed or triggered by loud noises (such as barking), or
                unpleasant smell (such as animal poop)?
              </p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.easily_trigger_by_pet_noise"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.easily_trigger_by_pet_noise"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>
                Have you ever been convicted of an animal related crime, such as cruelty to animals,
                animal theft, or animal abandonment?*
              </p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.convicted_animal_crime"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Yes"
                label="Yes"
              />
              <q-radio
                disable
                v-model="dataStorage.convicted_animal_crime"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="No"
                label="No"
              />
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <p class="q-ma-sm q-mr-md" style="width: 230px">
              Please provide valid ID’s for personal references:*
            </p>
            <div class="column no-wrap">
              <q-img :src="dataStorage.image_path" height="100px"></q-img>
            </div>
          </div>
          <div class="flex row justify-between items-center">
            <div class="q-ma-sm" style="width: 230px">
              <p>Pick up the pet or Deliver to your house?*</p>
            </div>
            <div class="q-ma-sm row justify-start">
              <q-radio
                disable
                v-model="dataStorage.pickup_or_delivery"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Pickup"
                label="Pick up"
              />
              <q-radio
                disable
                v-model="dataStorage.pickup_or_delivery"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Deliver"
                label="Deliver"
              />
            </div>
          </div>
        </q-card-section>
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
import { updatePetAdoptionReceived } from '../composable/latestComposable'
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
    const showForm = ref(false)
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

    const tableAction = (row, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      console.log(row)

      if (modeParam == 'View') {
        showForm.value = true
        dataStorage.value = { ...row }
        console.log(dataStorage.value)
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
            showForm.value = false
            fetchData()
          }, 1000)
        })
      } else if (modeParam == 'Received') {
        dataStorage.value = { ...row, adoption_status: 4 }
        $q.loading.show({
          group: 'update',
          message: `Updating. Please wait...`,
        })
        updatePetAdoptionReceived(
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
            showForm.value = false
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
              showForm.value = false
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
            showForm.value = false
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
      showForm,
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
