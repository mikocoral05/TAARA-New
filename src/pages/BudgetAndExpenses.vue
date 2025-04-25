<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary" active-bg-color="white">
        <q-tab name="1" icon="sym_r_account_balance_wallet" label="Budget Allocation" no-caps />
        <q-tab name="2" icon="sym_r_price_check" label="Daily Expenses" no-caps />
      </q-tabs>
      <div class="row no-wrap justify-between items-center">
        <div class="row no-wrap items-center q-mr-xl">
          <q-select v-model="selectedMonth" :options="monthNames" dense emit-value map-options />
          <q-icon name="sym_r_sync_alt" size="1.2rem" class="q-mx-lg" color="grey-7" />
          <q-select v-model="selectedYear" :options="generateYearList()" dense />
        </div>
        <div class="row no-wrap">
          <q-btn icon="sym_r_add" dense unelevated class="q-mr-md">
            <q-tooltip v-model="showingTooltip">Add Buget Allocation</q-tooltip>
          </q-btn>
          <q-btn icon="sym_r_upload" dense unelevated>
            <!-- <q-tooltip v-model="showingTooltip">Tooltip text</q-tooltip> -->
          </q-btn>
        </div>
      </div>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <div class="column no-wrap" v-if="tab == 1">
      <div class="row q-mb-md">
        <q-card class="q-mr-md radius-10 q-px-lg" flat>
          <q-card-section>
            <div class="text-grey-7 text-caption">TOTAL BALANCE</div>
            <div class="text-h6 text-bold q-mt-lg">
              {{ formatNumber(Number(totalBalance) + Number(totalExpense)) }}
            </div>
            <div class="text-grey-7 text-caption q-mt-sm">
              <q-icon name="sym_r_trending_up" class="text-positive text-bold q-mr-xs" /><span
                class="text-positive text-bold"
                >25%</span
              >
              from last month
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10 q-px-lg" flat>
          <q-card-section>
            <div class="text-grey-7 text-caption">TOTAL EXPENSES</div>
            <div class="text-h6 text-bold q-mt-lg">{{ formatNumber(totalExpense) }}</div>
            <div class="text-grey-7 text-caption q-mt-sm">
              <q-icon name="sym_r_trending_down" class="text-negative text-bold q-mr-xs" /><span
                class="text-negative text-bold"
                >-5%</span
              >
              from last month
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mr-md radius-10 q-px-lg" flat>
          <q-card-section>
            <div class="text-grey-7 text-caption">AVAILABLE BUDGET</div>
            <div class="text-h6 text-bold q-mt-lg">{{ formatNumber(totalBalance) }}</div>
            <div class="text-grey-7 text-caption q-mt-sm">
              <q-icon name="sym_r_trending_up" class="text-positive text-bold q-mr-xs" /><span
                class="text-positive text-bold"
                >15%</span
              >
              from last month
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row no-wrap">
      <div class="bg-white q-mr-md radius-10" v-if="tab == 2" style="width: 300px">
        <q-scroll-area
          :thumb-style="{ width: '2px', backgroundColor: '#b157ae' }"
          :bar-style="{ width: '2px', backgroundColor: '#b157ae' }"
          style="height: 78vh; max-width: 300px"
          class="q-pb-md radius-10"
          ref="scrollAreaRef"
        >
          <div ref="scrollListRef">
            <q-list bordered separator>
              <q-item
                v-for="(daily, index) in dailyExpenseTotal"
                :key="index"
                clickable
                v-ripple
                class="q-px-lg row no-wrap justify-between items-center font-12"
                :class="{ 'bg-primary text-white': selectedDay == daily?.day }"
                @click="selectedDay = daily?.day"
              >
                <q-item-section>
                  <div>Day {{ daily?.day }}</div>
                </q-item-section>
                <q-item-section class="text-right">
                  <div>{{ formatNumber(daily?.total) }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-scroll-area>
      </div>
      <ReusableTable
        style="width: 100%"
        :rows="rows"
        :columns="columns"
        separator="vertical"
        row-key="id"
        :rows-per-page-options="[10]"
        v-model="search"
        :title="
          tab == 1
            ? 'Budget Allocation'
            : `${dayNameFn(`${selectedYear}-${selectedMonth}-${selectedDay}`)} Expenses`
        "
        :visible-columns="
          tab == 1
            ? ['id', 'name', 'percentage_allocated', 'computed', 'btn']
            : [
                'id',
                'expense_title',
                'amount',
                'payment_method',
                'expense_date',
                'attachments',
                'btn',
              ]
        "
      >
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
        <template #cell-computed="{ row }">
          <div>
            {{ formatNumber((Number(totalBalance) * Number(row.percentage_allocated)) / 100) }}
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
import { nextTick, ref, watchEffect } from 'vue'
import { date, useQuasar } from 'quasar'
import {
  getBudgetAllocation,
  getExpensesSummary,
  getExpenses,
  getPageAccess,
  updateUser,
  getTotalBalance,
  getMonthlyFundAndExpenses,
} from 'src/composable/latestComposable'
import {
  formatNumber,
  generateYearList,
  monthNames,
  monthToday,
  yearToday,
  dayToday,
} from 'src/composable/simpleComposable'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const $q = useQuasar()
    const tab = ref('1')
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const editDialog = ref(false)
    const pages = ref([])
    const userData = ref()
    const mode = ref('')
    const selectedMonth = ref(monthToday)
    const selectedYear = ref(yearToday)
    const selectedDay = ref(dayToday)
    const totalExpense = ref(null)
    const totalBalance = ref(null)
    const dailyExpenseTotal = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const dayName = ref(null)
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

    const dayNameFn = (rawDate) => {
      return date.formatDate(rawDate, 'dddd')
    }
    watchEffect(() => {
      if (tab.value == 1) {
        updateBudgetAllocationSum()
      } else {
        let obj = {
          month: selectedMonth.value,
          year: selectedYear.value,
        }
        getExpenses({ ...obj, day: selectedDay.value }).then((response) => {
          rows.value = response
        })
        getMonthlyFundAndExpenses(obj).then((response) => {
          dailyExpenseTotal.value = response?.dailyTotal

          nextTick(() => {
            const itemElements = scrollListRef.value?.querySelectorAll('.q-item')
            const targetElement = Array.from(itemElements).find(
              (el, i) => dailyExpenseTotal.value[i]?.day === selectedDay.value,
            )

            if (targetElement) {
              const offsetTop = targetElement.offsetTop

              // Only scroll if the target is not already near the top (less than 10px)
              if (offsetTop > 10) {
                scrollAreaRef.value.setScrollPosition('vertical', offsetTop, 300)
              }
            }
          })
        })
      }
    })

    return {
      dayNameFn,
      dayName,
      search,
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
          name: 'percentage_allocated',
          label: 'Allocated ( % ) ',
          field: 'percentage_allocated',
          sortable: true,
          align: 'center',
        },
        {
          name: 'computed',
          label: 'Accumulated Expenses',
          field: 'computed',
          sortable: true,
          align: 'center',
        },
        {
          name: 'expense_title',
          label: 'Expense',
          field: 'expense_title',
          sortable: true,
          align: 'center',
        },
        {
          name: 'amount',
          label: 'Amount (₱)',
          field: 'amount',
          sortable: true,
          align: 'center',
        },
        {
          name: 'payment_method',
          label: 'Payment Method',
          field: 'payment_method',
          sortable: true,
          align: 'center',
        },
        {
          name: 'expense_date',
          label: 'Date Transacted',
          field: 'expense_date',
          sortable: true,
          align: 'center',
        },
        {
          name: 'attachments',
          label: 'File',
          field: 'attachments',
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
