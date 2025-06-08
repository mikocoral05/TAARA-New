<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary">
        <q-tab name="1" icon="sym_r_identity_platform" label="Public  Users" no-caps />
        <q-tab
          name="2"
          icon="sym_r_person_raised_hand"
          label="Volunteer "
          no-caps
          style="width: 170px"
          class="relative-position"
        >
          <div class="absolute-right" style="margin-right: -25px">
            <q-badge
              v-if="store.pendingVolunteer"
              color="red"
              align="middle"
              class="absolute-right relative-position"
              style="height: 20px; width: 20px"
            >
              <div class="absolute-center text-caption">
                {{ store.pendingVolunteer }}
              </div>
            </q-badge>
          </div></q-tab
        >
        <q-tab name="3" icon="sym_r_manage_accounts" label="Officials" no-caps />
      </q-tabs>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <ReusableTable
      row-key="user_id"
      :rows="userRows"
      :columns="userColumns"
      separator="vertical"
      :rows-per-page-options="[10]"
      :title="tableConfig.title"
      :visible-columns="tableConfig.columns"
      selection="multiple"
      v-model="search"
      v-model:selected="arrayOfId"
      v-model:confirm="confirm"
      :tableAction="tableAction"
      :preventAction="preventAction"
    >
      <template #cell-fullName="{ row }">
        <q-img
          height="30px"
          width="30px"
          class="radius-100 q-mr-sm"
          :src="
            row?.image_path
              ? getImageLink(row.image_path)
              : row.sex == 1
                ? 'no-profile-male.svg'
                : 'no-profile-female.svg'
          "
        />
        {{ row.first_name }}
        {{ row.middle_name }}
        {{ row.last_name }}
      </template>
      <template #cell-application_status="{ row }">
        <div
          class="row no-wrap q-px-sm radius-5 items-center text-white"
          :class="statusColor(row.application_status)"
        >
          <q-icon :name="statusIcon(row.application_status)" size="1rem" class="q-mr-sm" />
          {{ statusText(row.application_status) }}
        </div>
      </template>
      <template #cell-age="{ row }">
        {{ calculateAge(row.birth_date) }}
      </template>
      <template #cell-id="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #cell-phone_number="{ row }"> +63 {{ row.phone_number }} </template>
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
                <q-item-section>Archieve</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_keyboard_arrow_right" size="1.2rem" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" full-height maximized v-model="editDialog">
      <q-card style="width: 50vw; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div>{{ mode }}</div>
          <q-icon name="close" size="1.2rem" @click="editDialog = !editDialog" />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-px-lg row no-wrap justify-between items-center">
          <div class="column no-wrap w-100">
            <div class="row no-wrap justify-between items-start">
              <q-img
                :src="
                  previewImage
                    ? previewImage
                    : userData?.sex == 1
                      ? 'no-profile-male.svg'
                      : 'no-profile-female.svg'
                "
                height="120px"
                width="120px"
                class="radius-100"
              />
              <q-btn
                icon="sym_r_photo_camera"
                flat
                dense
                @click="triggerUpload()"
                :disable="mode == 'View'"
              />
              <q-file
                class="q-mt-sm hidden"
                v-model="fileStorage"
                outlined
                dense
                ref="myFile"
                @update:model-value="imageFnUpdate()"
              />
            </div>
            <div class="text-body1">
              {{ userData?.first_name }} {{ userData?.middle_name }} {{ userData?.last_name }}
            </div>
            <div class="text-grey-7">{{ userData?.email_address }}</div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-tabs
            v-model="editTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            inline-label
            no-caps
          >
            <q-tab name="1" label="Personal Details" icon="person" />
            <q-tab name="2" label="Address" icon="travel_explore" />
            <q-tab name="3" label="Credentials" icon="admin_panel_settings" />
            <q-tab name="5" label="Others" icon="dynamic_feed" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="editTab" animated>
            <q-tab-panel name="1" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="row items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">First name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.first_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Middle name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.middle_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Last name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.last_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Suffix</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.suffix"
                    :options="nameSuffixes"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Birthdate</div>
                  <q-input
                    :readonly="mode == 'View'"
                    class="q-mt-sm q-mr-md"
                    outlined
                    dense
                    v-model="userData.birth_date"
                    mask="date"
                    :rules="['date']"
                    error-message="Birthdate required!"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="userData.birth_date">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Civil status</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.civil_status"
                    :options="civilStatusOption"
                    :rules="[(val) => !!val || 'Civil status required!']"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Occupation</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.occupation"
                    dense
                    placeholder="Suffix"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Sex</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.sex"
                    :options="sexOption"
                    map-options
                    emit-value
                    :rules="[(val) => !!val || 'Sex required!']"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Phone no.</div>
                  <q-input
                    :readonly="mode == 'View'"
                    dense
                    outlined
                    class="q-mt-sm q-mr-md"
                    v-model="userData.phone_number"
                    hide-bottom-space
                    :rules="[
                      (val) => !!val || 'Contact no. required!',
                      (val) =>
                        /^\+?[0-9]*$/.test(val) ||
                        'Only numbers and an optional + at the start are allowed',
                    ]"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="2" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="row items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Street</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.street"
                    dense
                    placeholder="Street"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Brgy</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.brgy_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">City/Municipality</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.city_municipality"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Province</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.province"
                    :options="nameSuffixes"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="3" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="column no-wrap items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Email Address</div>
                  <q-input
                    :readonly="mode == 'View'"
                    dense
                    outlined
                    v-model="userData.email_address"
                    class="q-mt-sm q-mr-md"
                    :rules="[
                      (val) => !!val || 'Email address required!',
                      (val) => /.+@.+\..+/.test(val) || 'Enter a valid email address',
                    ]"
                    style="width: 400px"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Username</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.username"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Password</div>
                  <q-input
                    :readonly="mode == 'View'"
                    v-model="userData.password"
                    dense
                    outlined
                    placeholder="***************"
                    class="q-mt-sm"
                    :type="isPwd ? 'password' : 'text'"
                    style="width: 400px"
                    hint="Type new password"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="5" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="column items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Bio</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.Bio"
                    dense
                    type="textarea"
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                    style="width: 600px"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_person_remove" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md">
            Are you sure you want to archive this account?
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
import { getUserByType, softDeleteUser, updateUser } from 'src/composable/latestComposable'
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { calculateAge, getImageLink } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { updatePublicUserImage } from 'src/composable/latestPublicComposable'
import { watch } from 'vue'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const obj = { 3: 'Officials', 2: 'Volunteer', 1: 'Public Users' }
    const $q = useQuasar()
    const tab = ref('1')
    const editTab = ref('1')
    const search = ref(null)
    const userRows = ref([])
    const confirm = ref(false)
    const editDialog = ref(false)
    const pages = ref([])
    const userData = ref()
    const mode = ref('')
    const myFile = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })
    const store = globalStore()
    const fileStorage = ref(null)

    const tableAction = (data, modeParam) => {
      mode.value = modeParam
      userData.value = { ...data }
      console.log(userData.value)

      previewImage.value = data.image_path
      if (['Edit', 'View'].includes(modeParam)) {
        editDialog.value = !editDialog.value
      } else {
        arrayOfId.value.push(data.user_id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Updating. Please wait...',
      })

      updateUser(userData.value).then((response) => {
        setTimeout(() => {
          $q.loading.show({
            group: 'update',
            message: response.message,
          })
        }, 500)
        if (response.status == 'success') {
          const index = userRows.value.findIndex((row) => row.user_id === userData.value.user_id)

          if (index !== -1) {
            userRows.value[index] = { ...userData.value }
          }
        }
        setTimeout(() => {
          editDialog.value = false
          $q.loading.hide()
        }, 1000)
      })
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Archieving user. Please wait...',
      })
      softDeleteUser(arrayOfId.value).then((response) => {
        if (response.status == 'success') {
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 1000)
          setTimeout(() => {
            $q.loading.hide()
          }, 2000)
          getUserByType(tab.value).then((response) => {
            userRows.value = response
          })
        }
      })
    }

    const fetchFn = () => {
      tableConfig.value.title = `${obj[tab.value]} List`
      tableConfig.value.columns = ['3', '2'].includes(tab.value)
        ? ['id', 'fullName', 'email', 'roles', 'age', 'profession', 'phone_number', 'btn']
        : ['id', 'fullName', 'email', 'age', 'profession', 'phone_number', 'btn']
      if (tab.value == 2) {
        tableConfig.value.columns.push('application_status')
      }
      getUserByType(tab.value).then((response) => {
        userRows.value = response
        console.log(userRows.value)
      })
    }

    watchEffect(() => {
      fetchFn()
    })

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(fileStorage.value)
    }

    const statusColor = (status) => {
      const obj = {
        1: 'bg-orange  ',
        2: 'bg-positive q-px-sm',
        3: 'bg-negative q-px-sm',
      }
      return obj[status]
    }

    const statusIcon = (status) => {
      const obj = {
        1: 'sym_r_assignment',
        2: 'sym_r_thumb_up',
        3: 'sym_r_thumb_down',
      }
      return obj[status]
    }

    const statusText = (status) => {
      const obj = {
        1: 'Pending',
        2: 'Approved',
        3: 'Disapproved',
      }
      return obj[status]
    }

    const triggerUpload = () => {
      myFile.value.pickFiles()
    }

    const showNoAccess = ref(false)
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

    watch(
      () => fileStorage.value,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          $q.loading.show({ group: 'update', message: 'Update your image. Please wait ...' })
          const response = await updatePublicUserImage(newVal, userData.value.user_id)
          $q.loading.show({ group: 'update', message: response.message })
          if (response.status == 'success') {
            fetchFn()
          }
          setTimeout(() => {
            $q.loading.hide()
          }, 500)
        }
      },
    )

    return {
      preventAction,
      showNoAccess,
      triggerUpload,
      fileStorage,
      myFile,
      previewImage,
      imageFnUpdate,
      calculateAge,
      store,
      statusText,
      statusColor,
      statusIcon,
      getImageLink,
      search,
      softDeleteFn,
      arrayOfId,
      tableConfig,
      pages,
      saveFn,
      confirm,
      isPwd: ref(true),
      civilStatusOption,
      nameSuffixes,
      sexOption,
      editTab,
      editDialog,
      mode,
      userData,
      tableAction,
      userRows,
      tab,
      userColumns: [
        { name: 'id', label: 'ID', field: 'user_id', align: 'center' },
        {
          name: 'fullName',
          label: 'Full Name',
          field: 'first_name',
          sortable: true,
          align: 'left',
        },
        { name: 'email', label: 'Email', field: 'email_address', sortable: true, align: 'center' },
        {
          name: 'roles',
          label: 'Role',
          field: 'position_title',
          sortable: true,
          align: 'center',
          style: 'max-width: 150px; word-wrap: break-word; white-space: normal;',
        },
        { name: 'age', label: 'Age', field: 'birth_date', sortable: true, align: 'center' },
        {
          name: 'profession',
          label: 'Profession',
          field: 'occupation',
          sortable: true,
          align: 'center',
        },
        {
          name: 'phone_number',
          label: 'Phone no.',
          field: 'phone_number',
          sortable: true,
          align: 'center',
        },
        {
          name: 'application_status',
          label: 'Status',
          field: 'application_status',
          align: 'center',
        },
        {
          name: 'btn',
          label: '',
          field: 'btn',
          sortable: true,
          align: 'center',
        },
      ],
    }
  },
}
</script>
