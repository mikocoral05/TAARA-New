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
        :showUpload="true"
        :showDownload="true"
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

        <template #cell-animal_id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
        <template #cell-name="{ row }">
          <div class="row no-wrap items-center">
            <q-img
              height="30px"
              width="30px"
              :src="getImageLink(row.primary_image) || 'animal-no-image.svg'"
              fit="cover"
              class="radius-100 q-mr-sm"
            />
            {{ row.name }}
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
            <q-form @submit="validatorFn" class="no-padding no-margin">
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
                        :readonly="mode == 'View'"
                        outlined
                        v-model="dataStorage.name"
                        dense
                        class="q-mt-sm"
                        placeholder="Pick best name"
                        :rules="[(val) => !!val || 'Name is required!']"
                      />
                    </div>
                    <div class="column no-wrap q-mr-md w-40">
                      <div class="text-capitalize">Species</div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Species"
                        v-model="dataStorage.species"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Species is required!']"
                      />
                    </div>
                    <div class="column no-wrap q-mr-md q-mt-xs">
                      <div class="text-capitalize">Breed</div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Breed"
                        v-model="dataStorage.breed"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Breed is required!']"
                      />
                    </div>

                    <div class="column no-wrap q-mr-md q-mt-xs">
                      <div class="text-capitalize">Birtdate</div>
                      <q-input
                        :readonly="mode == 'View'"
                        dense
                        outlined
                        class="q-mt-sm"
                        placeholder="Date of birth"
                        v-model="dataStorage.date_of_birth"
                        mask="####-##-##"
                        :rules="[(val) => !!val || 'Birthdate is required!']"
                        hint="You can estimate the date of birth"
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
                  <div class="q-mt-sm text-bold q-mb-md">Physical Characteristics</div>
                  <div class="row">
                    <div class="column no-wrap q-mr-md">
                      <div class="text-capitalize">Fur color</div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Fur color"
                        v-model="dataStorage.fur_color"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Fur color is required!']"
                      />
                    </div>
                    <div class="column no-wrap q-mr-md">
                      <div class="text-capitalize">Eye color</div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Eye color"
                        v-model="dataStorage.eye_color"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Eye color is required!']"
                      />
                    </div>
                    <div class="column no-wrap w-30 q-mr-md">
                      <div class="text-capitalize">Sex</div>
                      <q-select
                        :readonly="mode == 'View'"
                        outlined
                        v-model="dataStorage.sex"
                        :options="['Male', 'Female']"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Sex  is required!']"
                      />
                    </div>
                  </div>
                  <div class="q-mt-xs text-bold q-mb-md">Size Measurements</div>
                  <div class="row">
                    <div class="column no-wrap q-mr-md">
                      <div class="text-capitalize">
                        Weight<span class="text-grey-7 q-ml-sm">(kg)</span>
                      </div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Weight"
                        v-model="dataStorage.weight"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Weight is required!']"
                        type="number"
                        hide-bottom-space
                      />
                    </div>
                    <div class="column no-wrap q-mr-md">
                      <div class="text-capitalize">
                        Height<span class="text-grey-7 q-ml-sm">(cm)</span>
                      </div>
                      <q-input
                        :readonly="mode == 'View'"
                        placeholder="Height"
                        outlined
                        type="number"
                        v-model="dataStorage.height"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Height is required!']"
                        hide-bottom-space
                      />
                    </div>
                  </div>
                </q-step>

                <q-step :name="2" title="Medical info" icon="sym_r_healing" :done="step > 2">
                  <div class="row no-wrap justify-between items-center">
                    <div class="row no-wrap">
                      <div class="q-mr-md">Is the pet spayed or neutered ?</div>
                      <div class="text-caption text-negative">
                        {{ showErrorNeutered == false ? 'This is required!' : '' }}
                      </div>
                    </div>
                    <div class="row no-wrap">
                      <q-checkbox
                        v-model="dataStorage.spayed_neutered"
                        label="Yes"
                        checked-icon="task_alt"
                        unchecked-icon="highlight_off"
                        true-value="Yes"
                        indeterminate-icon="highlight_off"
                        :disable="mode == 'View'"
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
                    <div class="row no-wrap">
                      <div class="q-mr-md">Vaccination status ?</div>
                      <div class="text-caption text-negative">
                        {{ showErrorVC == false ? 'This is required!' : '' }}
                      </div>
                    </div>
                    <div class="row no-wrap">
                      <q-checkbox
                        v-model="dataStorage.vaccination_status"
                        :disable="mode == 'View'"
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
                        :disable="mode == 'View'"
                        indeterminate-icon="highlight_off"
                      />
                      <q-checkbox
                        true-value="None"
                        v-model="dataStorage.vaccination_status"
                        label="None"
                        :disable="mode == 'View'"
                        indeterminate-icon="highlight_off"
                        checked-icon="task_alt"
                        unchecked-icon="highlight_off"
                      />
                    </div>
                  </div>
                  <div class="row no-wrap justify-between items-center">
                    <div class="row no-wrap">
                      <div class="q-mr-md">Rescue status ?</div>
                      <div class="text-caption text-negative">
                        {{ showErrorRS == false ? 'This is required!' : '' }}
                      </div>
                    </div>
                    <div class="row no-wrap">
                      <q-checkbox
                        v-model="dataStorage.rescue_status"
                        label="Rescued"
                        :disable="mode == 'View'"
                        checked-icon="task_alt"
                        unchecked-icon="highlight_off"
                        true-value="Rescued"
                        indeterminate-icon="highlight_off"
                      />
                      <q-checkbox
                        v-model="dataStorage.rescue_status"
                        label="Abandoned"
                        checked-icon="task_alt"
                        :disable="mode == 'View'"
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
                        :disable="mode == 'View'"
                        unchecked-icon="highlight_off"
                      />
                      <q-checkbox
                        true-value="Born in Care"
                        :disable="mode == 'View'"
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
                        :readonly="mode == 'View'"
                        :rules="[(val) => !!val || 'Behaviour is required!']"
                      />
                    </div>
                    <div class="column no-wrap q-mr-md">
                      <div class="text-capitalize">Skills</div>
                      <q-input
                        :readonly="mode == 'View'"
                        outlined
                        placeholder="Ex: Fetching"
                        v-model="dataStorage.skills"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Skills is required!']"
                      />
                    </div>
                    <div class="column no-wrap">
                      <div class="text-capitalize">Favorite food</div>
                      <q-input
                        outlined
                        :readonly="mode == 'View'"
                        placeholder="Ex: Meat"
                        v-model="dataStorage.favorite_food"
                        dense
                        class="q-mt-sm"
                        :rules="[(val) => !!val || 'Favorite food is required!']"
                      />
                    </div>
                  </div>
                  <div class="column no-wrap">
                    <div class="text-capitalize">Medical needs</div>
                    <q-input
                      :readonly="mode == 'View'"
                      outlined
                      type="textarea"
                      placeholder="Ex: Meat"
                      v-model="dataStorage.medical_needs"
                      dense
                      class="q-mt-sm"
                      :rules="[(val) => !!val || 'Medical needs is required!']"
                      hide-bottom-space
                    />
                  </div>
                </q-step>

                <q-step :name="3" title="Story" icon="sym_r_auto_stories" :done="step > 3">
                  <div class="text-grey-7 text-caption q-mb-md">
                    Note: A compelling animal background story should immediately capture the
                    reader's heart by combining struggle, survival, and hope in a short,
                    emotionally-resonant way.
                  </div>
                  <div class="column no-wrap">
                    <div class="text-capitalize">Background Story</div>
                    <q-input
                      :readonly="mode == 'View'"
                      outlined
                      autogrow
                      placeholder="Create a story that touch the heart of people."
                      v-model="dataStorage.story_background"
                      dense
                      class="q-mt-sm"
                      :rules="[(val) => !!val || 'Background story is important!']"
                    />
                  </div>
                </q-step>

                <q-step :name="4" title="Pet Image" icon="sym_r_photo_camera">
                  <div class="row no-wrap items-start justify-between">
                    <div class="column no-wrap">
                      <div class="text-body1">
                        Choose Pet Image
                        <span class="q-ml-sm text-caption">( Min and maximum of 5 image )</span>
                      </div>
                      <div class="text-caption text-grey-7">
                        Choose an image that will appear in public page in the specific pet
                      </div>
                    </div>
                    <q-btn
                      icon="sym_r_upload"
                      label="Upload"
                      outline
                      no-caps
                      dense
                      class="q-px-md"
                      @click="triggerUpload"
                    />
                  </div>
                  <q-file
                    ref="myFile"
                    v-model="dataStorage.file"
                    label="Upload your file"
                    multiple
                    max-files="5"
                    append
                    :readonly="mode == 'View'"
                    class="hidden"
                    accept=".jpg, .jpeg, .png, .svg"
                    @update:model-value="imageFnUpdate"
                  />
                  <q-table
                    class="q-mt-md"
                    :rows="dataStorage?.file ?? []"
                    :columns="columnsImage"
                    row-key="name"
                    bordered
                    dense
                    flat
                  >
                    <template v-slot:body-cell-name="props">
                      <q-td :props="props" class="text-center">
                        <q-img
                          :src="previewImage[props.rowIndex]"
                          height="100px"
                          width="100px"
                          class="radius-10"
                        />
                      </q-td>
                    </template>

                    <template v-slot:body-cell-btn="props">
                      <q-td :props="props" class="text-center">
                        <q-icon
                          name="sym_r_delete"
                          size="1.2rem"
                          color="negative"
                          @click="removeUploadedImage(props.rowIndex, props.row.id)"
                        />
                      </q-td>
                    </template>

                    <template v-slot:no-data>
                      <div class="row no-wrap items-center">
                        <q-icon
                          name="sym_r_scan_delete"
                          size="1rem"
                          color="negative"
                          class="q-mr-sm"
                        />
                        <div>No file upload</div>
                      </div>
                    </template>
                  </q-table>
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
                  :ripple="false"
                  unelevated
                />
                <q-btn
                  :label="step == 4 ? 'Save' : 'Next'"
                  class="btn"
                  color="primary"
                  type="submit"
                  no-caps
                  unelevated
                  :ripple="false"
                />
              </div>
            </q-form>
          </q-card-section>
        </div>
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
    <NoAccessDialog v-model:showNoAccess="showNoAccess" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  getBudgetAllocation,
  getExpensesSummary,
  getTotalBalance,
  softDeleteAnimal,
  getAnimalList,
  saveAnimalDetail,
  editAnimalInfo,
  downloadExampleExcelFormat,
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
} from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
export default {
  components: {
    ReusableTable,
    NoAccessDialog,
  },
  setup() {
    const obj = { 1: 'Ready for Adoption', 2: 'Under Rehabilitation', 3: 'Under Medication' }
    const obj2 = { 1: 'Medicine', 2: 'Group', 3: 'Expired' }
    const obj3 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const $q = useQuasar()
    const tab = ref('1')
    const store = globalStore()
    const filterTab = ref('1')
    const editTab = ref('1')
    const showDialog = ref(false)
    const step = ref(1)
    const rows = ref([])
    const confirm = ref(false)
    const showNoAccess = ref(false)
    const search = ref(null)
    const pages = ref([])
    const dataStorage = ref({ file: [] })
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
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        step.value = 1
        if (filterTab.value !== 2) showDialog.value = !showDialog.value

        if (modeParam == 'Add') {
          idToRemove.value = []
          dataStorage.value = {}
        } else {
          dataStorage.value = { ...data }
          console.log(dataStorage.value)
          previewImage.value = []
          if (dataStorage.value?.file.length > 0) {
            dataStorage.value?.file.forEach((element) => {
              previewImage.value.push(getImageLink(element.name))
            })
          }
        }
      } else if (modeParam == 'Upload') {
        //
      } else if (modeParam == 'Download') {
        const columnsToGet = [
          'name',
          'species',
          'breed',
          'fur_color',
          'eye_color',
          'date_of_birth',
          'weight',
          'height',
          'sex',
          'spayed_neutered',
          'vaccination_status',
          'temperament',
          'skills',
          'favorite_food',
          'story_background',
          'rescue_status',
          'health_status',
          'medical_needs',
          'date_rescued',
          'classification',
        ]

        downloadExampleExcelFormat('tbl_animal_info', columnsToGet, 'pet_info_excel_structure')
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
        dataStorage.value.health_status = Number(tab.value)
        saveAnimalDetail(dataStorage.value, store.userData.user_id, store.userData.user_type).then(
          (response) => {
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
              fetchFn()
            }, 1000)
          },
        )
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: `${obj3[mode.value]}. Please wait...`,
        })
        dataStorage.value.toRemoveId = idToRemove.value
        editAnimalInfo(dataStorage.value, store.userData.user_id, store.userData.user_type).then(
          (response) => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
            setTimeout(() => {
              showDialog.value = false
              $q.loading.hide()
              fetchFn()
            }, 2000)
          },
        )
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

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Deleting Pet info. Please wait...',
      })
      softDeleteAnimal(arrayOfId.value, store.userData.user_id, store.userData.user_type).then(
        (response) => {
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
        },
      )
    }

    const previewImage = ref([])
    const imageFnUpdate = () => {
      previewImage.value = [] // Reset previews
      const updatedFiles = []

      dataStorage.value.file.forEach((item) => {
        // Check if it's a File (newly uploaded)
        if (item instanceof File) {
          // Create object with full metadata
          const fileObj = {
            name: item.name,
            type: item.type,
            size: item.size,
            file: item, // Store the actual File object
          }

          updatedFiles.push(fileObj)
          previewImage.value.push(URL.createObjectURL(item))
        } else if (item.name !== undefined) {
          // Existing image object from DB
          previewImage.value.push(getImageLink(item.name)) // your backend image URL logic
          updatedFiles.push(item)
        }
      })

      // Replace the array with normalized and clean data
      dataStorage.value.file = updatedFiles
      console.log(dataStorage.value.file)
      console.log(idToRemove.value)
    }

    const idToRemove = ref([])
    const removeUploadedImage = (indexp, id) => {
      if (mode.value == 'Edit') {
        idToRemove.value.push(id)
      }
      dataStorage.value.file.splice(indexp, 1)
      previewImage.value.splice(indexp, 1)
    }

    const fetchFn = () => {
      getAnimalList(tab.value).then((response) => {
        tableConfig.value.title = `${obj[tab.value]} Pet`
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
    }

    watchEffect(() => {
      fetchFn()
    })

    const columnsImage = [
      {
        name: 'name',
        required: true,
        label: 'File name',
        align: 'left',
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: 'size', align: 'center', label: 'File size', field: 'size', sortable: true },
      { name: 'type', label: 'File type', field: 'type', sortable: true },
      { name: 'btn', label: 'Remove', align: 'center' },
    ]

    const showErrorNeutered = ref(null)
    const showErrorVC = ref(null)
    const showErrorRS = ref(null)
    const validatorFn = () => {
      if (step.value == 2) {
        if (!dataStorage.value.spayed_neutered) {
          showErrorNeutered.value = false
        } else {
          showErrorNeutered.value = true
        }
        if (!dataStorage.value.vaccination_status) {
          showErrorVC.value = false
        } else {
          showErrorVC.value = true
        }
        if (!dataStorage.value.rescue_status) {
          showErrorRS.value = false
        } else {
          showErrorRS.value = true
        }
        if (showErrorNeutered.value && showErrorRS && showErrorVC) {
          step.value += 1
        }
      } else if (step.value == 4) {
        if (dataStorage.value.file?.length == 5) {
          saveFn()
        }
      } else {
        step.value += 1
      }
    }

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const official = [1, 2, 3].includes(userRole) && userType == 3
      const volunteer = [5].includes(userRole) && userType == 2
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
      showErrorNeutered,
      showErrorRS,
      showErrorVC,
      validatorFn,
      removeUploadedImage,
      columnsImage,
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
