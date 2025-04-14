<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary">
        <q-tab name="3" icon="sym_r_manage_accounts" label="Officials" no-caps />
        <q-tab name="2" icon="sym_r_person_raised_hand" label="Volunteer " no-caps />
        <q-tab name="1" icon="sym_r_identity_platform" label="Public  Users" no-caps />
      </q-tabs>
      <div class="row no-wrap justify-between items-center">
        <q-btn icon="sym_r_add" dense unelevated class="q-mr-md" />
        <q-btn icon="sym_r_upload" dense unelevated />
      </div>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <ReusableTable
      :rows="userRows"
      :columns="volunteerColumns"
      separator="vertical"
      :rows-per-page-options="[10]"
      :visible-columns="
        ['3', '2'].includes(tab)
          ? ['id', 'fullName', 'email', 'roles', 'age', 'profession', 'phone_number', 'btn']
          : ['id', 'fullName', 'email', 'age', 'profession', 'phone_number', 'btn']
      "
    >
      <template #cell-fullName="{ row }">
        <q-avatar size="30px" class="q-mr-md">
          <q-img
            :src="row.img_path || row.sex == 1 ? 'no-profile-male.svg' : 'no-profile-female.svg'"
          />
        </q-avatar>
        {{ row.first_name }}
        {{ row.middle_name }}
        {{ row.last_name }}
      </template>
      <!-- Button slot with icon -->
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
              <q-item clickable @click="tableAction(row, 'Page Access')">
                <q-item-section>Access</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_key" size="1.2rem" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" full-height v-model="editDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div>{{ mode }}</div>
          <q-icon name="close" size="1.2rem" @click="editDialog = !editDialog" />
        </q-card-section>
        <q-separator />
        <q-card-section
          v-if="mode !== 'Page Access'"
          class="q-px-lg row no-wrap justify-between items-center"
        >
          <div class="column no-wrap" style="width: 30%">
            <q-avatar size="120px" class="q-mr-md">
              <q-img
                :src="
                  userData?.img_path || userData?.sex == 1
                    ? 'no-profile-male.svg'
                    : 'no-profile-female.svg'
                "
              />
            </q-avatar>
            <div class="text-body1">
              {{ userData?.first_name }} {{ userData?.middle_name }} {{ userData?.last_name }}
            </div>
            <div class="text-grey-7">{{ userData?.email_address }}</div>
          </div>
        </q-card-section>
        <q-card-section v-if="mode !== 'Page Access'">
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
                    class="q-mt-sm"
                    :type="isPwd ? 'password' : 'text'"
                    style="width: 400px"
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
        <q-card-section v-if="mode == 'Page Access'">
          <div class="column no-wrap full-width">
            <div
              class="row no-wrap q-mt-sm items-center justify-between"
              v-for="(pg, index) in userData?.page_access"
              :key="index"
            >
              <div style="width: 150px">{{ pg.page }}</div>
              <div class="row no-wrap items-start" style="min-width: 200px">
                <q-checkbox label="View" dense v-model="pg.view" class="q-mr-md" />
                <q-checkbox label="Add" dense v-model="pg.add" class="q-mr-md" />
                <q-checkbox label="Edit" dense v-model="pg.edit" class="q-mr-md" />
                <q-checkbox label="Delete" dense v-model="pg.delete" class="q-mr-md" />
              </div>
              <q-toggle
                v-model="pg.enable"
                color="primary"
                checked-icon="sym_r_visibility"
                unchecked-icon="sym_r_visibility_off"
              />
            </div>
          </div>
          <div class="row no-wrap q-mt-lg">
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
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import { getPageAccess, getUserByType, updateUser } from 'src/composable/latestComposable'
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const $q = useQuasar()
    const tab = ref('3')
    const editTab = ref('1')
    const userRows = ref([])
    const confirm = ref(false)
    const editDialog = ref(false)
    const pages = ref([])
    const userData = ref()
    const mode = ref('')

    const tableAction = (data, modeParam) => {
      mode.value = modeParam
      userData.value = data

      if (['Edit', 'View', 'Page Access'].includes(modeParam)) {
        editDialog.value = !editDialog.value
        if (modeParam == 'Page Access') {
          if (userData.value.page_access == '') {
            getPageAccess().then((response) => {
              const updatedPages = response.map((element) => {
                const obj = { view: true, edit: true, add: true, delete: true, enable: true }
                return { ...element, ...obj }
              })
              userData.value.page_access = updatedPages
            })
          } else {
            if (typeof userData.value.page_access == 'string')
              userData.value.page_access = JSON.parse(userData.value.page_access)
          }
        }
      } else {
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      $q.loading.show({
        message: 'Updating. Please wait...',
      })
      updateUser(userData.value).then(() => {
        setTimeout(() => {
          $q.loading.hide()
        }, 2000)
      })
    }
    watchEffect(() => {
      getUserByType(tab.value).then((response) => {
        userRows.value = response
      })
    })
    return {
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
      volunteerColumns: [
        { name: 'id', label: 'ID', field: 'user_id', align: 'center' },
        {
          name: 'fullName',
          label: 'Full Name',
          field: 'first_name',
          sortable: true,
          align: 'left',
        },
        { name: 'email', label: 'Email', field: 'email_address', sortable: true, align: 'center' },
        { name: 'roles', label: 'Role', field: 'position_title', sortable: true, align: 'center' },
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
