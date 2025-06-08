<template>
  <q-page>
    <ReusableTable
      :rows="rows"
      :columns="columns"
      separator="vertical"
      title="Rescue Report List"
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
        'name',
        'location',
        'description',
        'report_date',
        'status',
        'rescue_status',
        'btn',
      ]"
    >
      <template #cell-id="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #cell-description="{ row }">
        <div class="text-wrap ellipsis-3-lines text-center">
          {{ row.description }}
        </div>
      </template>
      <template #cell-status="{ row }">
        <div
          class="row no-wrap q-px-sm radius-5 items-center text-white"
          :class="statusColor(row.status)"
        >
          <q-icon :name="statusIcon(row.status)" size="1rem" class="q-mr-sm" />
          {{ row.status }}
        </div>
      </template>
      <template #cell-rescue_status="{ row }">
        <div class="row no-wrap q-px-sm radius-2 items-center">
          <q-icon :name="rescueStatusIcon(row.rescue_status)" size="1rem" class="q-mr-sm" />
          {{ rescueStatusText(row.rescue_status) }}
        </div>
      </template>
      <template #cell-report_date="{ row }">
        <div class="column no-wrap items-center">
          <div>
            {{ row.report_date }}
          </div>
          <div class="q-mt-xs row no-wrap items-center">
            <q-icon name="sym_r_call" class="q-mr-xs" />
            <div>+{{ row.phone_number }}</div>
          </div>
        </div>
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
    </ReusableTable>

    <q-dialog position="right" maximized full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column no-wrap">
        <q-form @submit="saveFn()" class="full-height column justify-between no-wrap">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} Rescue Report Schedule</div>
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
                    Reporter Name <span class="text-grey-7 text-caption">(optional)</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.name"
                    dense
                    class="q-mt-sm"
                    placeholder="Reporter Name"
                    style="width: 300px"
                    :readonly="mode == 'View'"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Phone No. <span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.phone_number"
                    dense
                    type="number"
                    class="q-mt-sm"
                    placeholder="920783562"
                    style="width: 300px"
                    :readonly="mode == 'View'"
                    prefix="+63"
                    :rules="[
                      (val) => !!val || 'Phone number is required',
                      (val) => /^\d{10}$/.test(val) || 'Phone number must be exactly 10 digits',
                    ]"
                  />
                </div>
              </div>
              <div class="row no-wrap items-end">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Location.<span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    v-model="dataStorage.location"
                    dense
                    :readonly="mode == 'View'"
                    :rules="[(val) => !!val || 'Location is required!']"
                    class="q-mt-sm"
                    style="min-width: 450px"
                    hint="Location of the reported animal"
                  />
                </div>
                <q-file
                  v-model="dataStorage.file"
                  dense
                  outlined
                  :readonly="mode == 'View'"
                  hint="Upload one image (click the other icon to view image)"
                  class="q-mt-md"
                  :label="dataStorage.image_path"
                  style="min-width: 200px"
                  @update:model-value="imageFnUpdate"
                >
                  <template v-slot:prepend> <q-icon name="sym_r_add_photo_alternate" /></template>
                  <template v-slot:after>
                    <q-icon name="sym_r_photo_library" @click="showImage = !showImage"
                  /></template>
                </q-file>
                <ImageViewer v-model="showImage" :imageUrl="previewImage" />
              </div>
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Report Status<span class="text-negative">*</span>
                  </div>

                  <q-select
                    outlined
                    v-model="dataStorage.status"
                    class="q-mt-sm"
                    :options="reportStatusOption"
                    emit-value
                    map-options
                    dense
                    :readonly="mode == 'View'"
                    style="width: 280px"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    behavior="menu"
                    hint="Default to Pending"
                  />
                </div>

                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Rescue Status<span class="text-negative">*</span>
                  </div>
                  <q-select
                    outlined
                    :readonly="mode == 'View'"
                    v-model="dataStorage.rescue_status"
                    class="q-mt-sm"
                    :options="rescueStatusOptions"
                    emit-value
                    map-options
                    dense
                    style="width: 280px"
                    :rules="[(val) => !!val || 'Status is required!']"
                    behavior="menu"
                    hint="Adjust rescue status accordingly"
                  />
                </div>
              </div>
              <div class="column no-wrap q-mt-md">
                <div class="text-capitalize">Details</div>
                <q-input
                  :rules="[(val) => !!val || 'Details is required!']"
                  outlined
                  :readonly="mode == 'View'"
                  type="textarea"
                  v-model="dataStorage.description"
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
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import ImageViewer from 'src/components/ImageViewer.vue'
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
import ReusableTable from 'src/components/ReusableTable.vue'
import {
  addRescueRerport,
  editRescueReport,
  getRescueReport,
  softDeleteRescueReport,
} from 'src/composable/latestComposable'
import { convertDaysToInterval, getImageLink } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { onMounted, watchEffect } from 'vue'
import { ref } from 'vue'
export default {
  components: { ReusableTable, ImageViewer, NoAccessDialog },
  setup() {
    const rows = ref([])
    const $q = useQuasar()
    const confirm = ref(false)
    const showDialog = ref(false)
    const showImage = ref(false)
    const showInputInterval = ref(false)
    const showNoAccess = ref(false)
    const dataStorage = ref({ file: [] })
    const mode = ref('')
    const itemsCount = ref([])
    const arrayOfId = ref([])
    const search = ref(null)
    const animalOption = ref([])
    const store = globalStore()

    const myFile = ref(null)
    const triggerUpload = () => {
      myFile.value.pickFiles()
    }

    const tableAction = (data, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        showDialog.value = !showDialog.value
        if (modeParam == 'Add') {
          previewImage.value = null
          dataStorage.value = { content: '', rescue_status: 1, status: 'pending', reporter_type: 2 }
        } else {
          dataStorage.value = data
          previewImage.value = data?.image_path ? getImageLink(data.image_path) : null
          console.log(dataStorage.value)
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
          message: 'Adding new Rescue report. Please wait...',
        })
        dataStorage.value.created_by = store.userData?.user_id ?? 84
        addRescueRerport(dataStorage.value).then((response) => {
          console.log(response)
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 1000)
          setTimeout(() => {
            getRescueReport().then((response) => {
              rows.value = response
            })
            showDialog.value = false
            $q.loading.hide()
          }, 2000)
        })
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: 'Updating Announcement. Please wait...',
        })
        editRescueReport(dataStorage.value).then((response) => {
          console.log(response)
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
          setTimeout(() => {
            showDialog.value = false
            $q.loading.hide()
          }, 2000)
        })
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

    const statusColor = (status) => {
      const obj = {
        pending: 'bg-orange',
        approved: 'bg-positive q-px-sm',
        disapproved: 'bg-negative q-px-sm',
      }
      return obj[status]
    }

    const statusIcon = (status) => {
      const obj = {
        pending: 'sym_r_assignment',
        approved: 'sym_r_thumb_up',
        disapproved: 'sym_r_thumb_down',
      }
      return obj[status]
    }

    const rescueStatusIcon = (status) => {
      const obj = {
        1: 'sym_r_fact_check',
        2: 'sym_r_notification_multiple',
        3: 'sym_r_fire_truck',
        4: 'sym_r_vaccines',
        5: 'sym_r_deceased',
        6: 'sym_r_outpatient_med',
        7: 'sym_r_real_estate_agent',
        8: 'sym_r_diversity_3',
      }
      return obj[status]
    }

    const rescueStatusText = (r_status) => {
      const map = {
        1: 'Reported',
        2: 'Acknowledged',
        3: 'Rescue In Progress',
        4: 'Reached Vet Clinic',
        5: 'Deceased (as declared by vet)',
        6: 'Released (to environment or public)',
        7: 'Now Under Organization’s Care',
        8: 'Returned to Owner',
      }

      return map[r_status]
    }

    watchEffect(() => {
      let dateVar = dataStorage.value.start_date // format: "YYYY-MM-DD"
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
        message: 'Deleting Report info. Please wait...',
      })
      softDeleteRescueReport(arrayOfId.value).then((response) => {
        $q.loading.show({
          group: 'update',
          message: response.message,
        })
        setTimeout(() => {
          $q.loading.hide()
          if (response.status == 'success') {
            getRescueReport().then((response) => {
              rows.value = response
            })
          }
        }, 2000)
      })
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(dataStorage.value.file)
    }

    const reportStatusOption = ref([
      { label: 'Pending', value: 'pending' },
      { label: 'Approve', value: 'approved' },
      { label: 'Disapprove', value: 'disapproved' },
    ])

    const rescueStatusOptions = [
      { value: 1, label: 'Reported' },
      { value: 2, label: 'Acknowledged' },
      { value: 3, label: 'Rescue In Progress' },
      { value: 4, label: 'Reached Vet Clinic' },
      { value: 5, label: 'Deceased (as declared by vet)' },
      { value: 6, label: 'Released (to environment or public)' },
      { value: 7, label: 'Now Under Organization’s Care' },
      { value: 8, label: 'Returned to Owner' },
    ]

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.role
      const official = [1, 2, 3, 4].includes(userRole) && userType == 3
      const volunteer = [1].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer
      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }

    onMounted(() => {
      getRescueReport().then((response) => {
        rows.value = response
        console.log(rows.value)
      })
    })
    return {
      preventAction,
      showNoAccess,
      showImage,
      rescueStatusOptions,
      reportStatusOption,
      rescueStatusText,
      statusIcon,
      rescueStatusIcon,
      statusColor,
      previewImage,
      myFile,
      imageFnUpdate,
      triggerUpload,
      softDeleteFn,
      saveFn,
      showInputInterval,
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
        { name: 'id', label: 'ID', sortable: true, field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Reporter',
          field: 'name',
          sortable: true,
          align: 'left',
        },

        {
          name: 'location',
          label: 'Location',
          field: 'location',
          sortable: true,
          align: 'left',
          style: 'width:200px;max-width:200px;word-wrap: break-word; white-space: pre-wrap',
        },
        {
          name: 'description',
          label: 'Details',
          field: 'description',
          sortable: true,
          align: 'center',
          style: 'width: 300px; word-wrap: break-word; white-space: pre-wrap',
        },
        {
          name: 'report_date',
          label: 'Report Date',
          field: 'report_date',
          sortable: true,
          align: 'center',
        },

        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
        },
        {
          name: 'rescue_status',
          label: 'Rescue Status',
          field: 'rescue_status',
          align: 'center',
        },
        { name: 'btn', label: 'Action', field: 'btn', align: 'center' },
      ],
    }
  },
}
</script>
