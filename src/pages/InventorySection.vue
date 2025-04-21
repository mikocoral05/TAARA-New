<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="2" icon="sym_r_medical_services" label="Medicine" no-caps />
        <q-tab name="3" icon="sym_r_vaccines" label="Vaccine" no-caps />
        <q-tab name="4" icon="sym_r_nutrition" label="Vitamin" no-caps />
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
    <div class="column no-wrap">
      <div class="row q-mb-md">
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section class="q-pb-none">
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">MEDICINE AVAILABLE</div>
              <q-icon name="sym_r_medical_services" color="blue" size="1.5rem" />
            </div>
            <div class="row no-wrap items-center justify-center">
              <div class="text-h6 text-bold q-my-md text-center">
                {{ elseSummary.unique_group_count }}
                <span class="text-caption text-grey-7">Unique</span>
              </div>
              <q-separator vertical inset class="q-mx-md" />
              <div class="text-h6 text-bold q-my-md text-center">
                {{ formatOrNumber(elseSummary.total_quantity) }}
                <span class="text-caption text-grey-7"> Pieces</span>
              </div>
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(1)"
              class="q-mt-sm full-width"
            >
              <div class="text-blue text-caption flex flex-center">
                VIEW FULL LIST <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section>
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">MEDICINE GROUPS</div>
              <q-icon name="sym_r_outpatient_med" color="positive" size="1.5rem" />
            </div>
            <div class="text-h6 text-bold q-my-md text-center">
              {{ elseSummary?.unique_group_count }}
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(2)"
              class="q-mt-sm full-width"
            >
              <div class="text-positive text-caption flex flex-center">
                <span>VIEW GROUPS</span>
                <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10" flat>
          <q-card-section>
            <div class="row no-wrap items-center q-px-lg">
              <div class="text-grey-7 text-caption q-mr-md">EXPIRED MEDICINE</div>
              <q-icon name="sym_r_warning" color="negative" size="1.5rem" />
            </div>
            <div class="text-h6 text-bold q-my-md text-center">
              {{ elseSummary?.expired_count }}
            </div>
            <q-separator />
            <q-btn
              dense
              flat
              :ripple="false"
              @click="filterInventory(3)"
              class="q-mt-sm full-width"
            >
              <div class="text-negative text-caption flex flex-center">
                <span>VIEW FULL LIST</span>
                <q-icon name="sym_r_keyboard_double_arrow_right" size="1.2rem" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row no-wrap">
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        separator="vertical"
        :title="tableConfig.title"
        :rows-per-page-options="[10]"
        :visible-columns="tableConfig.columns"
        v-model="search"
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
        <template #cell-computed="{ row }">
          <div>
            {{ formatNumber((Number(totalBalance) * Number(row.percentage_allocated)) / 100) }}
          </div>
        </template>
        <template #cell-id="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
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
import {
  getBudgetAllocation,
  getExpensesSummary,
  getPageAccess,
  updateUser,
  getTotalBalance,
  getInventoryList,
  getInventoryGroup,
  getInventoryListSummary,
  getInventoryExpiredList,
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
    const obj = { 2: 'medicine', 3: 'vaccine', 4: 'vitamin' }
    const $q = useQuasar()
    const tab = ref('2')
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const editDialog = ref(false)
    const pages = ref([])
    const userData = ref()
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
    const tableConfig = ref({ title: '', columns: [] })
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

    watchEffect(() => {
      if (tab.value == 1) {
        updateBudgetAllocationSum()
      } else {
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
          console.log(rows.value)

          itemsCount.value = rows.value.reduce((total, item) => {
            return total + item.quantity
          }, 0)
        })
        getInventoryListSummary(obj[tab.value]).then((response) => {
          elseSummary.value = response
        })
      }
    })

    return {
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
      editDialog,
      mode,
      userData,
      tableAction,
      rows,
      tab,
      showingTooltip: ref(false),
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Name',
          field: 'name',
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
          name: 'group_name',
          label: 'Group Name',
          field: 'group_name',
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
          name: 'expiration_date',
          label: 'Expiration Date',
          field: 'expiration_date',
          sortable: true,
          align: 'center',
        },

        {
          name: 'count',
          label: `No. of ${obj[tab.value]}`,
          field: 'count',
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
