<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary">
        <q-tab name="1" icon="sym_r_account_balance_wallet" label="Budget Allocation" no-caps />
        <q-tab name="2" icon="sym_r_price_check" label="Daily Expenses" no-caps />
      </q-tabs>
      <div class="row no-wrap justify-between items-center">
        <div class="row no-wrap items-center">
          <q-select v-model="selectedMonth" :options="monthNames" dense emit-value map-options />
          <q-icon name="sym_r_sync_alt" size="1.2rem" class="q-mx-lg" color="grey-7" />
          <q-select v-model="selectedYear" :options="generateYearList()" dense />
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
        v-model:selected="arrayOfId"
        v-model:confirm="confirm"
        v-model:dialog="showDialog"
        :tableAction="tableAction"
        :preventAction="preventAction"
        :title="
          tab == 1
            ? 'Budget Allocation'
            : `${dayNameFn(`${selectedYear}-${selectedMonth}-${selectedDay}`)} Expenses`
        "
        :visible-columns="
          tab == 1
            ? ['id', 'name', 'percentage_allocated', 'computed', 'computed_expense', 'btn']
            : [
                'id',
                'expense_title',
                'amount',
                'payment_method',
                'expense_date',
                'attachments',
                'file_id',
                'btn',
              ]
        "
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
                <q-item clickable @click="tableAction(row, 'Delete')">
                  <q-item-section>Delete</q-item-section>
                  <q-item-section side>
                    <q-icon name="sym_r_keyboard_arrow_right" size="1.2rem" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #cell-id="{ rowIndex }">
          <div>
            {{ rowIndex + 1 }}
          </div>
        </template>
        <template #cell-computed="{ row }">
          <div>
            {{ formatNumber((Number(totalBalance) * Number(row.percentage_allocated)) / 100) }}
          </div>
        </template>
        <template #cell-computed_expense="{ row }">
          <div
            class="text-red"
            v-if="
              getSpecificExpenseFn(row.id) >
              (Number(totalBalance) * Number(row.percentage_allocated)) / 100
            "
          >
            {{ formatNumber(getSpecificExpenseFn(row.id)) }}
          </div>
          <div v-else>
            {{ formatNumber(getSpecificExpenseFn(row.id)) }}
          </div>
        </template>
        <template #cell-file_id="{ row }">
          <div v-if="row?.file_id">
            {{ 'Yes' }}
          </div>
          <div v-else class="text-grey-5">
            {{ 'N/a' }}
          </div>
        </template>
      </ReusableTable>
    </div>
    <q-dialog position="right" maximized full-height v-model="editDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column justify-between">
        <q-form @submit="saveFn()" class="column justify-between full-height no-wrap">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} {{ tableConfig?.title }}</div>
              <q-icon name="close" size="1.2rem" @click="editDialog = !editDialog" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-grey-7" style="font-size: 12px">
                <span class="text-negative">*</span>All fields are mandatory, except mentioned as
                (optional).
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Expense Name <span class="text-negative">*</span>
                  </div>
                  <q-input
                    outlined
                    v-model="expenseData.expense_title"
                    dense
                    class="q-mt-sm"
                    style="width: 300px"
                    :rules="[(val) => !!val || 'Expense name is required!']"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Upload image <span class="text-grey-7 text-caption">( optional )</span>
                  </div>
                  <q-file
                    class="q-mt-sm"
                    v-model="expenseData.file"
                    :hint="
                      mode == 'Add'
                        ? 'Try uploading image first, will analyse'
                        : previewImage
                          ? 'Click the icon to view image'
                          : 'Click the empty space to add image'
                    "
                    outlined
                    dense
                    :readonly="mode == 'View'"
                    style="max-width: 300px"
                    @update:model-value="imageFnUpdate()"
                  >
                    <template v-slot:append>
                      <q-icon v-if="!previewImage" name="sym_r_add_photo_alternate" />
                      <q-icon
                        v-if="previewImage"
                        name="sym_r_photo"
                        @click="viewImage = !viewImage"
                      />
                    </template>
                  </q-file>
                </div>
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">Category <span class="text-negative">*</span></div>
                <q-select
                  outlined
                  v-model="expenseData.category_id"
                  class="q-mt-sm"
                  :options="categoryOptions"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="id"
                  dense
                  style="width: 250px"
                  behavior="menu"
                  :rules="[(val) => !!val || 'Category is required!']"
                />
              </div>
              <div class="row no-wrap q-mt-sm">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Expense Date<span class="text-negative">*</span>
                  </div>
                  <q-input
                    dense
                    outlined
                    class="q-mt-sm"
                    v-model="expenseData.expense_date"
                    mask="####-##-##"
                    :rules="[(val) => !!val || '']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="expenseData.expense_date" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Amount<span class="text-negative">*</span></div>
                  <q-input
                    outlined
                    type="number"
                    v-model="expenseData.amount"
                    dense
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Amount is required!']"
                  />
                </div>
                <div class="column no-wrap">
                  <div class="text-capitalize">
                    Payment method<span class="text-negative">*</span>
                  </div>
                  <q-select
                    outlined
                    v-model="expenseData.payment_method"
                    class="q-mt-sm"
                    :options="['Cash', 'Online']"
                    dense
                    style="width: 200px"
                    behavior="menu"
                    :rules="[(val) => !!val || 'Category is required!']"
                  />
                </div>
              </div>
              <div class="column no-wrap q-mt-sm">
                <div class="text-capitalize">
                  Description <span class="text-grey-7 text-caption"> (optional)</span>
                </div>
                <q-input
                  outlined
                  type="textarea"
                  v-model="expenseData.description"
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
    <q-dialog v-model="allocationDialog">
      <q-card class="q-pa-md" style="width: 450px; min-height: 130px">
        <q-form @submit="saveFn()">
          <q-card-section class="column no-wrap q-px-sm">
            <div class="text-capitalize text-body1 text0center">{{ mode }} {{ obj[tab] }}</div>
            <q-input
              outlined
              v-model="expenseData.name"
              placeholder="Name"
              dense
              class="q-mt-md full-width"
              :rules="[(val) => !!val || 'Need Budget allocation name']"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="expenseData.percentage_allocated"
              placeholder="Percentage"
              dense
              type="number"
              class="q-mt-md full-width"
              :rules="[
                (val) => !!val || 'Need percentage',
                (val) => val <= percentageAvailable || `Cannot exceed ${percentageAvailable}%`,
              ]"
            />
            <div class="row q-mt-md text-grey-7 text-caption">
              <q-icon name="assignment" size="1.2rem" color="grey-7" class="q-mr-md" />{{
                getPercentage()
              }}
            </div>
          </q-card-section>

          <q-card-actions align="center" class="row no-wrap">
            <q-btn
              outline
              style="width: 100%"
              label="Cancel"
              v-close-popup
              color="primary"
              no-caps
            />
            <q-btn
              label="Confirm"
              unelevated
              color="primary"
              no-caps
              style="width: 100%"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_person_remove" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md">
            Are you sure you want to delete this data?
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
    <ImageViewer v-model="viewImage" :imageUrl="previewImage" />
    <NoAccessDialog v-model:showNoAccess="showNoAccess" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import { computed, nextTick, ref, watchEffect } from 'vue'
import { date, useQuasar } from 'quasar'
import {
  getBudgetAllocation,
  getExpensesSummary,
  getExpenses,
  getTotalBalance,
  getMonthlyFundAndExpenses,
  addBudgetAllocation,
  updateBudgetAllocation,
  softDeleteBudgetAndExpenses,
  addExpense,
  updateExpense,
  getExpensesList,
} from 'src/composable/latestComposable'
import {
  formatNumber,
  generateYearList,
  monthNames,
  monthToday,
  yearToday,
  dayToday,
} from 'src/composable/simpleComposable'
import ImageViewer from 'src/components/ImageViewer.vue'
import { globalStore } from 'src/stores/global-store'
import NoAccessDialog from 'src/components/NoAccessDialog.vue'
export default {
  components: {
    ReusableTable,
    ImageViewer,
    NoAccessDialog,
  },
  setup() {
    const store = globalStore()
    const $q = useQuasar()
    const tab = ref('1')
    const obj = { 1: 'Budget Allocation', 2: 'Expenses' }
    const obj2 = { Add: 'Adding', Edit: 'Updating', Delete: 'Deleting' }
    const editTab = ref('1')
    const rows = ref([])
    const confirm = ref(false)
    const search = ref(null)
    const editDialog = ref(false)
    const showNoAccess = ref(false)
    const pages = ref([])
    const expenseData = ref({})
    const mode = ref('')
    const selectedDay = ref(dayToday)
    const selectedMonth = ref(monthToday)
    const selectedYear = ref(yearToday)
    const viewImage = ref(false)
    const timeStamp = computed(() => {
      return new Date(
        selectedYear.value,
        selectedMonth.value - 1, // JS Date months are 0-based
        selectedDay.value,
      ).getTime()
    })

    const formattedString = computed(() => {
      return date.formatDate(timeStamp.value, 'YYYY-MM-DD')
    })

    const totalExpense = ref(null)
    const totalBalance = ref(null)
    const allocationDialog = ref(false)
    const dailyExpenseTotal = ref([])
    const scrollAreaRef = ref(null)
    const scrollListRef = ref(null)
    const dayName = ref(null)
    const tableConfig = ref({})
    const arrayOfId = ref([])
    const categoryOptions = ref([])
    const percentageAvailable = ref(0)
    const expenseList = ref([])

    const tableAction = (data, modeParam) => {
      if (!preventAction()) {
        return
      }
      mode.value = modeParam
      if (['Edit', 'View', 'Add'].includes(modeParam)) {
        tableConfig.value.title = tab.value == 1 ? 'Budget Allocation' : 'Expense'
        if (modeParam == 'Add') {
          if (tab.value == 1) {
            expenseData.value = {}
            allocationDialog.value = true
          } else {
            console.log(formattedString)

            expenseData.value = { expense_date: formattedString }
            if (categoryOptions.value.length == 0) {
              getBudgetAllocation().then((response) => {
                categoryOptions.value = response
              })
            }
            editDialog.value = true
          }
          //
        } else if (modeParam == 'Edit') {
          expenseData.value = { ...data }
          console.log(expenseData.value)

          previewImage.value = expenseData.value?.image_path

          if (tab.value == 1) {
            allocationDialog.value = true
          } else {
            editDialog.value = true
          }
        } else {
          previewImage.value = data?.image_path
          editDialog.value = true
          expenseData.value = data
        }
      } else {
        arrayOfId.value.push(data.id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      $q.loading.show({
        group: 'save',
        message: `${obj2[mode.value]}. Please wait...`,
      })
      if (tab.value == 1) {
        if (mode.value == 'Add')
          addBudgetAllocation(expenseData.value).then((response) => {
            $q.loading.show({
              group: 'save',
              message: response.message,
            })
            setTimeout(() => {
              if (response.status == 'success') {
                fetchFn()
                allocationDialog.value = false
              }
              $q.loading.hide()
            }, 1000)
          })
        else {
          updateBudgetAllocation(expenseData.value).then((response) => {
            $q.loading.show({
              group: 'save',
              message: response.message,
            })
            setTimeout(() => {
              if (response.status == 'success') {
                fetchFn()
                allocationDialog.value = false
              }
              $q.loading.hide()
            }, 1000)
          })
        }
      } else {
        if (mode.value == 'Add') {
          addExpense(expenseData.value, store.userData.user_id, store.userData.user_type).then(
            (response) => {
              $q.loading.show({
                group: 'save',
                message: response.message,
              })
              setTimeout(() => {
                if (response.status == 'success') {
                  fetchFn()
                  editDialog.value = false
                }
                $q.loading.hide()
              }, 1000)
            },
          )
        } else {
          updateExpense(expenseData.value, store.userData.user_id, store.userData.user_type).then(
            (response) => {
              $q.loading.show({
                group: 'save',
                message: response.message,
              })
              setTimeout(() => {
                if (response.status == 'success') {
                  fetchFn()
                  editDialog.value = false
                }
                $q.loading.hide()
              }, 1000)
            },
          )
        }
      }
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'save',
        message: `${obj2[mode.value]}. Please wait...`,
      })
      const tableName = tab.value == 1 ? 'tbl_budget_allocation' : 'tbl_expenses'
      softDeleteBudgetAndExpenses(
        arrayOfId.value,
        tableName,
        store.userData.user_id,
        store.userData.user_type,
      ).then((response) => {
        $q.loading.show({
          group: 'save',
          message: response.message,
        })
        setTimeout(() => {
          if (response.status == 'success') {
            fetchFn()
          }
          $q.loading.hide()
        }, 1500)
      })
    }

    const getSpecificExpenseFn = (allocation_id) => {
      const result = expenseList.value
        .filter((obj) => obj.category_id == allocation_id)
        .reduce((sum, item) => sum + Number(item.amount), 0)
      return result ?? 0
    }

    const updateBudgetAllocationSum = () => {
      getBudgetAllocation().then(async (response) => {
        rows.value = response
        console.log(rows.value)
        categoryOptions.value = response
        expenseList.value = await getExpensesList(selectedMonth.value, selectedYear.value)
        console.log(expenseList.value)
        const addedObj = {
          id: null,
          name: 'Others',
          percentage_allocated: null,
          date_created: '2025-05-26 13:37:10',
          is_deleted: 0,
          deleted_at: null,
        }
        const nullisthList = getSpecificExpenseFn(null)

        if (nullisthList) {
          rows.value.push({ ...addedObj })
        }
      })
      getExpensesSummary({ month: selectedMonth.value, year: selectedYear.value }).then(
        (response) => {
          totalExpense.value = response?.total
          console.log(response)
        },
      )
      getTotalBalance({ month: selectedMonth.value, year: selectedYear.value }).then((response) => {
        totalBalance.value = response?.balance
      })
    }

    const dayNameFn = (rawDate) => {
      return date.formatDate(rawDate, 'dddd')
    }

    const getPercentage = () => {
      if (tab.value == 1) {
        const result = rows.value.reduce((sum, obj) => sum + obj.percentage_allocated, 0)
        percentageAvailable.value = result < 100 ? 100 - result : result
        const text = `${percentageAvailable.value}% is the remaining percentage you can use!`
        return text
      }
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(expenseData.value.file)
      console.log(previewImage.value)
    }

    const fetchFn = () => {
      if (tab.value == 1) {
        updateBudgetAllocationSum()
      } else {
        let obj = {
          month: selectedMonth.value,
          year: selectedYear.value,
        }
        getExpenses({ ...obj, day: selectedDay.value }).then((response) => {
          rows.value = response
          console.log(rows.value)
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
    }

    watchEffect(() => {
      fetchFn()
    })

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
      getSpecificExpenseFn,
      expenseList,
      viewImage,
      previewImage,
      imageFnUpdate,
      arrayOfId,
      categoryOptions,
      softDeleteFn,
      percentageAvailable,
      getPercentage,
      allocationDialog,
      tableConfig,
      obj,
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
      expenseData,
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
          label: 'Accumulated Amount',
          field: 'computed',
          sortable: true,
          align: 'center',
        },
        {
          name: 'computed_expense',
          label: 'Accumulated Expenses',
          field: 'computed_expense',
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
          name: 'file_id',
          label: 'File',
          field: 'file_id',
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
