import { ref, onMounted, watch, onUnmounted } from 'vue'
import {
  getDailyFundsAndExpenses,
  fundsAndExpenses,
  todayfundsAndExpensesTotal,
  dailyTotal,
  getMonthlyFundAndExpenses,
  monthlyTotalExpense,
  updateExpenses,
  addExpenses,
  specificDateAddExpenses,
  exportMonthlyExpenses,
  fundsAndExpensesBasicSearch,
  getMonthlyDonation,
  getAllMonthlyExpenses,
  budgetAllocationData,
  getBudgetAllocation,
} from 'src/composable/taaraComposable'
export default {
  setup() {
    let months = [
      { label: 'January', value: 1 },
      { label: 'February', value: 2 },
      { label: 'March', value: 3 },
      { label: 'April', value: 4 },
      { label: 'May', value: 5 },
      { label: 'June', value: 6 },
      { label: 'July', value: 7 },
      { label: 'August', value: 8 },
      { label: 'September', value: 9 },
      { label: 'October', value: 10 },
      { label: 'November', value: 11 },
      { label: 'December', value: 12 },
    ]
    let actionDialog = ref(false)
    let vClosePopUp = ref(false)
    let viewDetials = ref(false)
    let updateOrAdd = ref()
    let showSearch = ref(false)
    let mobileAdd = ref(false)
    let startYear = 2021
    let currentYear = new Date().getFullYear()
    let years = ref([])
    for (let year = startYear; year <= currentYear; year++) {
      years.value.push(year)
    }

    let date = new Date()
    let dayTodayBasedScroll = ref(date.getDate())
    let day = ref(date.getDate())
    let monthTodayBasedScroll = ref(months[date.getMonth()])
    let todayMonth = ref(date.getMonth())
    let filteFundsExpenses = ref({
      month: months[todayMonth.value],
      year: currentYear,
    })

    let expensesDetails = ref({
      expense_id: null,
      expense_name: null,
      expense_type: null,
      expense_amount: null,
      expense_qty: null,
      expense_qty_type: null,
      expense_total: null,
      date: null,
    })

    let numberOfDays = ref()
    let getDays = () => {
      console.log(day.value)
      let month = months.indexOf(filteFundsExpenses.value.month.value) + 1
      numberOfDays.value = new Date(filteFundsExpenses.value.year, month, 0).getDate()
      let formatted_month = ('0' + filteFundsExpenses.value.month.value).slice(-2)
      if (filteFundsExpenses.value.month.value == monthTodayBasedScroll.value.value) {
        day.value = dayTodayBasedScroll.value
        let date = filteFundsExpenses.value.year + '-' + formatted_month + '-' + day.value
        getDailyFundsAndExpenses(date)
        setTimeout(() => {
          const element = document.querySelector(`#div-${day.value}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        day.value = 1
        let date = filteFundsExpenses.value.year + '-' + formatted_month + '-' + day.value
        getDailyFundsAndExpenses(date)
        setTimeout(() => {
          const element = document.querySelector(`#div-${1}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 10)
      }
    }
    let selectDay = (payloadDate, index) => {
      day.value = index
      let formatted_month = ('0' + payloadDate.month.value).slice(-2)
      let fullDate = payloadDate.year + '-' + formatted_month + '-' + day.value
      getDailyFundsAndExpenses(fullDate)
    }
    const updateItem = (props) => {
      actionDialog.value = true
      updateRecordHolder.value = { ...props }
      addOrUpdate.value = false
    }

    const columns = [
      {
        name: 'expense_name',
        field: 'expense_name',
        label: 'Expense Name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expense_type',
        field: 'expense_type',
        label: 'Type of Expense',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expense_amount',
        field: 'expense_amount',
        label: 'Amount',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expense_qty',
        field: 'expense_qty',
        label: 'Qty',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expense_qty_type',
        field: 'expense_qty_type',
        label: 'Qty Type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expense_total',
        field: 'expense_total',
        label: 'Total',
        align: 'left',
        sortable: true,
      },
      {
        name: 'action',
        field: 'action',
        label: '',
        align: 'left',
      },
    ]
    const rows = fundsAndExpenses
    let formatNumber = (number) => {
      return '₱ ' + number.toLocaleString('en-US') + '.00'
    }
    let addAndEdit = ref(0)
    let editRow = (payload) => {
      expensesDetails.value = { ...payload }
      addAndEdit.value = 1
    }
    let resetExpensesDetails = () => {
      if (window.innerWidth < 501) {
        mobileAdd.value = true
        viewDetials.value = null
      } else {
        actionDialog.value = true
        addAndEdit.value = 2
      }
      expensesDetails.value.date = specificDateAddExpenses.value
      Object.keys(expensesDetails.value).forEach((key) => {
        expensesDetails.value[key] = null
      })
    }

    let submitExpense = (addInfo) => {
      let formatted_month = ('0' + filteFundsExpenses.value.month.value).slice(-2)
      let fullDate = filteFundsExpenses.value.year + '-' + formatted_month + '-' + day.value
      expensesDetails.value.date = fullDate
      actionDialog.value = false
      addInfo.expense_total = addInfo.expense_amount * addInfo.expense_qty
      addExpenses(addInfo)
    }
    let viewSpecificDetails = (index) => {
      expensesDetails.value = { ...fundsAndExpenses.value[index] }
      updateOrAdd.value = false
    }
    let result = ref([])
    let calLastMnthExpense = () => {
      let monthDonationPromise = getMonthlyDonation(filteFundsExpenses.value, 'funds_expense').then(
        (response) => {
          return response
        },
      )
      let monthExpensePromise = getAllMonthlyExpenses(
        filteFundsExpenses.value,
        'funds_expense',
      ).then((response) => {
        return response
      })

      Promise.all([monthDonationPromise, monthExpensePromise]).then(([donations, expenses]) => {
        let netDonations = ref([])
        let carryOver = 0
        for (let i = 0; i < donations.length; i++) {
          let donation = donations[i].month_donation
          let expense = expenses[i].total_expense
          // Subtract the expense from the donation and add the carry over from the previous month
          let netDonation = donation - expense + carryOver
          // If the net donation is positive, carry it over to the next month
          carryOver = netDonation > 0 ? netDonation : 0
          // Don't allow negative net donations
          // netDonation = Math.max(netDonation, 0);
          netDonations.value.push({
            year: donations[i].year,
            month: donations[i].month,
            total_donation: donations[i].month_donation,
            total_expense: expenses[i].total_expense,
            net_donation: netDonation,
          })
          // If it's December, reset the carry over for the new year
          // if (donations[i].month === 12) {
          //   carryOver = 0;
          // }
        }
        result.value = netDonations.value
        return netDonations
      })
    }
    let remainingFunds = ref(0)
    let allDonation = (result, monthlyTotalExpense) => {
      if (result[filteFundsExpenses.value.month.value - 1] !== undefined) {
        let monthDonation = result.filter((obj) => {
          return (
            obj.month == filteFundsExpenses.value.month.value &&
            obj.year == filteFundsExpenses.value.year
          )
        })
        let filterOutput = monthDonation[0].net_donation + Number(monthDonation[0].total_expense)
        remainingFunds.value = filterOutput - monthlyTotalExpense
        return formatNumber(filterOutput)
      } else {
        remainingFunds.value = 0
        return formatNumber(0)
      }
    }
    watch(filteFundsExpenses.value, () => {
      calLastMnthExpense()
    })
    let reFalse = () => {
      if (window.innerWidth >= 501) {
        viewDetials.value = false
      }
    }
    onMounted(() => {
      window.addEventListener('resize', reFalse)
      getDays()
      getMonthlyFundAndExpenses(filteFundsExpenses.value)
      calLastMnthExpense()
      getBudgetAllocation(filteFundsExpenses.value, 'funds_expenses')
    })
    onUnmounted(() => {
      window.addEventListener('resize', reFalse)
    })
    return {
      remainingFunds,
      allDonation,
      updateItem,
      viewSpecificDetails,
      vClosePopUp,
      submitExpense,
      addAndEdit,
      addExpenses,
      resetExpensesDetails,
      editRow,
      monthlyTotalExpense,
      dailyTotal,
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 6,
      },
      formatNumber,
      selectDay,
      fundsAndExpenses,
      expensesDetails,
      day,
      todayfundsAndExpensesTotal,
      years,
      filteFundsExpenses,
      columns,
      rows,
      numberOfDays,
      getDays,
      months,
      actionDialog,
      updateExpenses,
      getMonthlyFundAndExpenses,
      exportMonthlyExpenses,
      viewDetials,
      monthTodayBasedScroll,
      showSearch,
      fundsAndExpensesBasicSearch,
      updateOrAdd,
      mobileAdd,
      result,
      budgetAllocationData,
    }
  },
}
