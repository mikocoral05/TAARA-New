<template>
  <q-page>
    <ReusableTable
      :rows="rows"
      :columns="columns"
      separator="vertical"
      title="Announcement"
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
        'title',
        'content',
        'first_name',
        'created_at',
        'position_title',
        'btn',
      ]"
    >
      <template #cell-id="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #cell-content="{ row }">
        <div class="text-wrap ellipsis-3-lines" v-html="row.content"></div>
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

    <q-dialog position="right" maximized full-height class="column no-wrap" v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column no-wrap">
        <q-form @submit="saveFn()" class="full-height column justify-between no-wrap">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} Announcement</div>
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
              <div class="row no-wrap justify-between items-start">
                <q-img
                  :src="previewImage"
                  width="400px"
                  height="300px"
                  class="radius-10 light-border relative-position"
                >
                  <div v-if="!previewImage" class="absolute-center bg-white">
                    <q-icon name="sym_r_wallpaper" color="grey-7" size="3rem" /></div
                ></q-img>
                <div class="column no-wrap">
                  <q-btn
                    icon="sym_r_upload"
                    label="Upload Image"
                    borderless
                    class="light-border q-px-md"
                    no-caps
                    unelevated
                    @click="triggerUpload"
                    :readonly="mode == 'View'"
                  />
                  <q-select
                    v-model="dataStorage.is_pinned"
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 0 },
                    ]"
                    option-label="label"
                    option-value="value"
                    dense
                    emit-value
                    map-options
                    hint="Pin this post to the top?"
                    outlined
                    class="q-mt-md"
                    behavior="menu"
                    :readonly="mode == 'View'"
                  />
                </div>
                <q-file
                  ref="myFile"
                  v-model="dataStorage.file"
                  label="Upload your file"
                  :readonly="mode == 'View'"
                  class="hidden"
                  accept=".jpg, .jpeg, .png, .svg"
                  @update:model-value="imageFnUpdate"
                />
              </div>

              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Announcement Title <span class="text-negative">*</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.title"
                    dense
                    class="q-mt-sm"
                    placeholder="Type here your announcement title"
                    style="width: 5000px; max-width: 500px"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    :readonly="mode == 'View'"
                  />
                </div>
              </div>

              <div class="column no-wrap q-mt-md">
                <div class="text-capitalize">Description</div>
                <q-editor
                  class="q-mt-sm"
                  v-model="dataStorage.content"
                  :readonly="mode == 'View'"
                  min-height="20rem"
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
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
import ReusableTable from 'src/components/ReusableTable.vue'
import {
  addAnnouncement,
  editAnnouncement,
  getAnnouncement,
  softDeleteAnnouncement,
} from 'src/composable/latestComposable'
import {
  convertDaysToInterval,
  getImageLink,
  intervalOptions,
} from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { onMounted, watchEffect } from 'vue'
import { ref } from 'vue'
export default {
  components: { ReusableTable, NoAccessDialog },
  setup() {
    const rows = ref([])
    const $q = useQuasar()
    const confirm = ref(false)
    const showDialog = ref(false)
    const showNoAccess = ref(false)
    const showInputInterval = ref(false)
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

    const userName = store.userData.first_name + ' ' + store.userData.last_name
    const tableAction = (data, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        showDialog.value = !showDialog.value
        if (modeParam == 'Add') {
          previewImage.value = null
          dataStorage.value = { content: '' }
        } else {
          dataStorage.value = { ...data }
          previewImage.value = data?.image_path ? getImageLink(data.image_path) : null
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
          message: 'Adding new Announcement. Please wait...',
        })
        dataStorage.value.created_by = store.userData?.user_id
        addAnnouncement(
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
            fetchFn()
            showDialog.value = false
            $q.loading.hide()
          }, 1500)
        })
      } else if (mode.value == 'Edit') {
        $q.loading.show({
          group: 'update',
          message: 'Updating Announcement. Please wait...',
        })
        editAnnouncement(
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
            showDialog.value = false
            fetchFn()
            $q.loading.hide()
          }, 1500)
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

    watchEffect(() => {
      let dateVar = dataStorage.value.start_date // format: "YYYY-MM-DD"
      let interVar = dataStorage.value.next_due_interval // number of days (e.g. 365)

      if (dateVar && interVar) {
        const startDate = new Date(dateVar)
        const nextDueDate = new Date(startDate)
        nextDueDate.setDate(startDate.getDate() + Number(interVar))

        // Format to YYYY-MM-DD if needed
        const formatted = nextDueDate.toISOString().split('T')[0]

        // Optional: store it back
        dataStorage.value.next_due_date = formatted
      }
    })

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Deleting Schedule info. Please wait...',
      })
      softDeleteAnnouncement(
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
            fetchFn()
          }
        }, 1500)
      })
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(dataStorage.value.file)
    }

    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles
      const official = [1, 2, 3, 4].includes(userRole) && userType == 3
      const volunteer = [4].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer
      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }
    const fetchFn = () => {
      getAnnouncement().then((response) => {
        rows.value = response
        console.log(rows.value)
      })
    }
    onMounted(() => {
      fetchFn()
    })
    return {
      showNoAccess,
      preventAction,
      previewImage,
      myFile,
      imageFnUpdate,
      triggerUpload,
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
        { name: 'id', label: 'ID', sortable: true, field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Schedule For',
          field: 'name',
          sortable: true,
          align: 'left',
        },
        {
          name: 'title',
          label: 'Title',
          field: 'title',
          sortable: true,
          style: 'min-width:200px;word-wrap: break-word; white-space: pre-wrap;',
          align: 'left',
        },
        {
          name: 'content',
          label: 'Content',
          field: 'content',
          sortable: true,
          style: 'min-width:240px;word-wrap: break-word; white-space: pre-wrap;',
          align: 'left',
        },
        {
          name: 'first_name',
          label: 'Created By',
          field: 'first_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'created_at',
          label: 'Created At',
          field: 'created_at',
          sortable: true,
          align: 'center',
        },

        {
          name: 'position_title',
          label: 'Position Title',
          field: 'position_title',
          align: 'center',
        },
        { name: 'btn', label: 'Action', field: 'btn', align: 'center' },
      ],
    }
  },
}
</script>
