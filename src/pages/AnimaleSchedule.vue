<template>
  <q-page>
    <ReusableTable
      :rows="rows"
      :columns="columns"
      separator="vertical"
      title="Veterinary Schedule"
      row-key="id"
      v-model="search"
      :rows-per-page-options="[10]"
      selection="multiple"
      v-model:selected="arrayOfId"
      v-model:confirm="confirm"
      v-model:dialog="showDialog"
      :tableAction="tableAction"
      :preventAction="preventAction"
      :visible-columns="[
        'id',
        'schedule_name',
        'dose_number',
        'dose_taken',
        'name',
        'scheduled_date',
        'next_due_interval',
        'next_due_date',
        'color',
        'behavior',
        'adoptedStatus',
        'btn',
      ]"
    >
      <template #cell-name="{ row }">
        <q-img
          :src="row.image_path || defaultImage"
          height="30px"
          width="30px"
          class="radius-100"
        />
        {{ row.name }}
      </template>
      <template #cell-next_due_interval="{ row }">
        {{ row.dose_taken == 1 ? 'Last Dose' : convertDaysToInterval(row.next_due_interval) }}
      </template>
      <template #cell-next_due_date="{ row }">
        {{ doseChecker(row.dose_number, row.dose_taken, row.next_due_date) }}
      </template>
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
              <q-item clickable @click="tableAction(row, 'Archive')">
                <q-item-section>Delete</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_keyboard_arrow_right" size="1.2rem" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" maximized full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black">
        <q-form @submit="saveFn()" class="full-height column justify-between no-wrap">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} Pet Schedule</div>
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
              <div class="row no-wrap">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Schedule Name <span class="text-negative">*</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.schedule_name"
                    dense
                    class="q-mt-sm"
                    placeholder="Schedule name"
                    style="width: 300px"
                    :rules="[(val) => !!val || 'Schedule name is required!']"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Schedule For <span class="text-negative">*</span>
                  </div>
                  <q-select
                    outlined
                    v-model="dataStorage.animal_id"
                    class="q-mt-sm"
                    :options="animalOption"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="animal_id"
                    dense
                    style="width: 250px"
                    behavior="menu"
                    :rules="[(val) => !!val || 'This is required!']"
                  />
                </div>
              </div>
              <div class="row no-wrap q-mt-sm">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Dose No.<span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    type="number"
                    v-model="dataStorage.dose_number"
                    dense
                    :rules="[
                      (val) => !!val || 'Dose number is required!',
                      (val) => val >= 1 || 'Dose number must be atleast 1!',
                    ]"
                    class="q-mt-sm"
                    hint="Dose no. required!"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Dose Taken<span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.dose_taken"
                    type="number"
                    dense
                    class="q-mt-sm"
                    :rules="[
                      (val) => (val !== null && val !== '') || 'Dose taken is required!',
                      (val) =>
                        val < dataStorage.dose_number ||
                        'Dose taken must be less than the total dose number!',
                    ]"
                    hint="Dose taken!"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Schedule Date<span class="text-negative">*</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="dataStorage.scheduled_date"
                    mask="####-##-##"
                    :rules="[(val) => !!val || 'Schedule date is required!']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.scheduled_date" mask="YYYY-MM-DD">
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
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Next Due Interval<span class="text-negative">*</span>
                  </div>

                  <q-select
                    outlined
                    v-model="dataStorage.next_due_interval"
                    class="q-mt-sm"
                    :options="intervalOptions"
                    emit-value
                    map-options
                    dense
                    style="width: 280px"
                    :rules="[(val) => !!val || 'Interval is required!']"
                    behavior="menu"
                    hint="if interval is not present please click the icon"
                    v-if="!showInputInterval"
                  >
                    <template v-slot:after>
                      <q-icon
                        name="sym_r_change_circle"
                        @click="((showInputInterval = true), (dataStorage.next_due_inteval = null))"
                      />
                    </template>
                  </q-select>
                  <q-input
                    v-else
                    style="width: 280px"
                    outlined
                    v-model="dataStorage.next_due_inteval"
                    dense
                    :rules="[(val) => !!val || 'This is required!']"
                    type="number"
                    class="q-mt-sm"
                    hint="Please input a number by days"
                  >
                    <template v-slot:after>
                      <q-icon
                        name="sym_r_change_circle"
                        @click="
                          ((showInputInterval = false), (dataStorage.next_due_inteval = null))
                        "
                      />
                    </template>
                  </q-input>
                </div>

                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Next Due Date<span class="text-negative">*</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="dataStorage.next_due_date"
                    mask="####-##-##"
                    :rules="[(val) => !!val || '']"
                    disable
                    hint="Automatically generated"
                  />
                </div>
              </div>
              <div class="column no-wrap q-mt-md">
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
    <NoAccessDialog v-model:showNoAccess="showNoAccess" />
    <OutputDialog v-model:outputDialog="outputDialog" v-model:outputObj="outputObj" />
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
import OutputDialog from 'src/components/OutputDialog.vue'
import ReusableTable from 'src/components/ReusableTable.vue'
import {
  addSchedule,
  editSchedule,
  getAnimalOption,
  getSchedule,
  softDeleteSchedule,
} from 'src/composable/latestComposable'
import { convertDaysToInterval, intervalOptions } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { onMounted, watchEffect } from 'vue'
import { ref } from 'vue'
export default {
  components: { ReusableTable, NoAccessDialog, OutputDialog },
  setup() {
    const rows = ref([])
    const $q = useQuasar()
    const confirm = ref(false)
    const showDialog = ref(true)
    const showInputInterval = ref(false)
    const dataStorage = ref({ file: [] })
    const mode = ref('')
    const itemsCount = ref([])
    const arrayOfId = ref([])
    const search = ref(null)
    const animalOption = ref([])
    const showNoAccess = ref(false)
    const store = globalStore()
    const outputDialog = ref(false)
    const outputObj = ref({})
    const userName = store.userData.first_name + ' ' + store.userData.last_name
    const tableAction = (data, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        showDialog.value = !showDialog.value
        if (modeParam == 'Add') {
          getAnimalOption().then((response) => {
            animalOption.value = response
            console.log(animalOption.value)
          })

          dataStorage.value = {}
        } else {
          dataStorage.value = data
          console.log(dataStorage.value)
        }
      } else {
        arrayOfId.value.push(data.id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = async () => {
      if (mode.value == 'Add') {
        $q.loading.show({
          group: 'update',
          message: `Adding new Schedule. Please wait...`,
        })
        dataStorage.value.added_by = store.userData?.user_id ?? 84
        const response = await addSchedule(
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          userName,
        )
        setTimeout(() => {
          $q.loading.hide()
          showDialog.value = false
          outputDialog.value = true
          outputObj.value = {
            icon: 'check_circle',
            title: response.message,
            subtext: 'New Schedule has been successfully added',
          }
          getSchedule().then((response) => {
            rows.value = response
          })
        }, 1000)
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: `Updating Schedule. Please wait...`,
        })
        const response = await editSchedule(
          dataStorage.value,
          store.userData.user_id,
          store.userData.user_type,
          userName,
        )
        console.log(response)

        setTimeout(() => {
          $q.loading.hide()
          showDialog.value = false
          outputDialog.value = true
          outputObj.value = {
            icon: 'check_circle',
            title: response.message,
            subtext: 'Schedule has been successfully updated for the selected veterinary animal.',
          }
        }, 1000)
      }
    }

    const doseChecker = (x, y, z) => {
      if (x == y) {
        return 'Finish'
      } else if (x - y == 1) {
        return 'Last Dose'
      }
      return z
    }

    watchEffect(() => {
      let dateVar = dataStorage.value.scheduled_date // format: "YYYY-MM-DD"
      let interVar = dataStorage.value.next_due_interval // number of days (e.g. 365)
      console.log(dataStorage.value.next_due_interval)

      if (dateVar && interVar) {
        const startDate = new Date(dateVar)
        const nextDueDate = new Date(startDate)
        nextDueDate.setDate(startDate.getDate() + Number(interVar))

        // Format to YYYY-MM-DD if needed
        const formatted = nextDueDate.toISOString().split('T')[0]
        console.log('Next due date:', formatted)

        // Optional: store it back
        dataStorage.value.next_due_date = formatted
      }
    })

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Deleting Schedule info. Please wait...',
      })
      softDeleteSchedule(
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
          if (response.status == 'success') {
            getSchedule().then((response) => {
              rows.value = response
            })
          }
        }, 1000)
      })
    }

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const official = [1, 2, 3].includes(userRole) && userType == 3
      const volunteer = [2, 3].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer
      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }

    onMounted(() => {
      getSchedule().then((response) => {
        rows.value = response
        console.log(rows.value)
      })
    })
    return {
      outputDialog,
      outputObj,
      preventAction,
      showNoAccess,
      softDeleteFn,
      saveFn,
      showInputInterval,
      intervalOptions,
      animalOption,
      tableAction,
      showDialog,
      mode,
      itemsCount,
      arrayOfId,
      confirm,
      dataStorage,
      doseChecker,
      convertDaysToInterval,
      rows,
      search,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Schedule For',
          field: 'name',
          sortable: true,
          align: 'left',
        },
        {
          name: 'schedule_name',
          label: 'Schedule Name',
          field: 'schedule_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'dose_number',
          label: 'Dose No.',
          field: 'dose_number',
          sortable: true,
          align: 'center',
        },
        {
          name: 'dose_taken',
          label: 'Dose Taken.',
          field: 'dose_taken',
          sortable: true,
          align: 'center',
        },
        {
          name: 'scheduled_date',
          label: 'Schedule Date',
          field: 'scheduled_date',
          sortable: true,
          align: 'center',
        },
        {
          name: 'next_due_interval',
          label: 'Next Due Interval',
          field: 'next_due_interval',
          sortable: true,
          align: 'center',
        },
        {
          name: 'next_due_date',
          label: 'Next Dose',
          field: 'next_due_date',
          sortable: true,
          align: 'center',
        },
        { name: 'btn', label: 'Action', field: 'btn', align: 'center' },
      ],
    }
  },
}
</script>
