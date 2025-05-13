import lineCharts from "../../../components/lineCharts.vue";
import DoughNut from "../../../components/DoughNut.vue";
import { onMounted, ref } from "vue";
import {
  //budget-allocation
  budgetAllocationData,
  getBudgetAllocation,
  addBudgetAllocation,
  getMonthlyDonation,
  getAllMonthlyExpenses,
  updateBudgetAllocation,
  //fund-expense
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
  responseBackup,
} from "src/composable/taaraComposable";
import {
  dateToday,
  formatNumber,
  monthNames,
  monthToday,
  yearToday,
  dayToday,
  timeAgo,
  timeNow,
} from "src/composable/simpleComposable";
export default {
  components: {
    lineCharts,
    DoughNut,
  },
  setup() {
    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    });
    let result = ref([]);
    let dayTodayExpense = ref();
    let totalExpense = ref(0);
    let availableBudget = ref(0);
    let day = ref(dayToday);
    let dayTodayBasedScroll = ref(dayToday);

    const isAddFunds = ref(false);
    let budgetAllocationDetails = ref([{}]);
    let allPercentage = ref(false);

    let closeMenu = ref(false);
    let expensesDetails = ref({});
    let addAndEdit = ref(0);
    let closeExpenseMenu = ref(false);

    let yearArray = ref([]);
    let getYears = (year) => {
      for (let i = 2021; i <= year; i++) {
        yearArray.value.push([i]);
      }
    };

    let calLastMnthExpense = () => {
      let monthDonationPromise = getMonthlyDonation(
        filteredDate.value,
        "budget_allocation"
      ).then((response) => {
        return response;
      });
      let monthExpensePromise = getAllMonthlyExpenses(
        filteredDate.value,
        "budget_allocation"
      ).then((response) => {
        return response;
      });

      Promise.all([monthDonationPromise, monthExpensePromise]).then(
        ([donations, expenses]) => {
          let netDonations = ref([]);
          let carryOver = 0;
          for (let i = 0; i < donations.length; i++) {
            let donation = donations[i].month_donation;
            let expense = expenses[i].total_expense;
            let netDonation = donation - expense + carryOver;
            carryOver = netDonation > 0 ? netDonation : 0;

            netDonations.value.push({
              year: donations[i].year,
              month: donations[i].month,
              total_donation: donations[i].month_donation,
              total_expense: expenses[i].total_expense,
              net_donation: netDonation,
            });
          }
          result.value = netDonations.value;
        }
      );
    };
    let filterAllYearTransaction = (result, month, baseResult) => {
      let filter = result.filter((obj) => {
        return obj.month == month && obj.year == filteredDate.value.year;
      });
      if (filter.length > 0) {
        let sum = filter[0].net_donation + Number(filter[0].total_expense);
        let difference = sum - Number(filter[0].total_expense);
        availableBudget.value = difference;
        totalExpense.value = filter[0].total_expense;

        if (baseResult == "totalDonation") {
          return sum;
        }
      } else {
        availableBudget.value = 0;
        if (baseResult == "totalDonation") {
          return 0;
        }
      }
    };
    let numberOfDays = ref([]);
    let getDays = () => {
      let dayInAmonth = new Date(
        filteredDate.value.year,
        filteredDate.value.month.value,
        0
      ).getDate();

      for (let i = 1; i <= dayInAmonth; i++) {
        numberOfDays.value.push({ label: "Day " + i, value: i });
      }

      let filterDayToday = numberOfDays.value.filter((obj) => {
        return obj.value === dayToday.value;
      })[0].value;
      dayTodayExpense.value = filterDayToday;

      let formatted_month = ("0" + filteredDate.value.month.value).slice(-2);

      if (filteredDate.value.month.value == monthNames[monthToday].value) {
        day.value = dayTodayBasedScroll.value;
        let date =
          filteredDate.value.year + "-" + formatted_month + "-" + day.value;
        getDailyFundsAndExpenses(date);
      } else {
        day.value = 1;
        let date =
          filteredDate.value.year + "-" + formatted_month + "-" + day.value;
        getDailyFundsAndExpenses(date);
      }
    };
    let selectDay = (obj) => {
      let formatted_month = ("0" + filteredDate.value.month.value).slice(-2);
      let fullDate =
        filteredDate.value.year + "-" + formatted_month + "-" + obj;
      console.log(fullDate);
      getDailyFundsAndExpenses(fullDate);
    };
    let sum = ref(0);
    let resetAddItem = (update, payload) => {
      sum.value = 0;
      allPercentage.value = false;
      if (sum.value <= 100) {
        update.forEach((obj) => {
          sum.value += Number(obj.percentage);
        });
        let addedPercent = ref(0);
        payload.forEach((obj) => {
          addedPercent.value += Number(obj.percentage);
        });
        sum.value = sum.value + addedPercent.value;
        if (sum.value != 100) {
          allPercentage.value = true;
          // isAddFunds.value = true;
        } else {
          if (addedPercent.value == 0) {
            budgetAllocationDetails.value = [];
            isAddFunds.value = false;
            updateBudgetAllocation(update);
          } else {
            budgetAllocationDetails.value = [];
            isAddFunds.value = false;
            addBudgetAllocation(payload);
          }
        }
      }
    };
    let submitExpense = (addInfo) => {
      let formatted_month = ("0" + filteredDate.value.month.value).slice(-2);
      let fullDate =
        filteredDate.value.year + "-" + formatted_month + "-" + day.value;
      expensesDetails.value.date = fullDate;
      expensesDetails.value.time = timeNow;
      addInfo.expense_total = addInfo.expense_amount * addInfo.expense_qty;
      totalExpense.value = Number(totalExpense.value) + addInfo.expense_total;

      closeExpenseMenu.value = false;
      addExpenses(addInfo)
        .then((response) => {
          if (response == "success") {
            calLastMnthExpense();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const columns = [
      {
        name: "expense_name",
        field: "expense_name",
        label: "Expense Name",
        align: "left",
        sortable: true,
      },
      {
        name: "expense_type",
        field: "expense_type",
        label: "Type of Expense",
        align: "left",
        sortable: true,
      },
      {
        name: "expense_amount",
        field: "expense_amount",
        label: "Amount",
        align: "left",
        sortable: true,
      },
      {
        name: "expense_qty",
        field: "expense_qty",
        label: "Qty",
        align: "left",
        sortable: true,
      },
      {
        name: "expense_qty_type",
        field: "expense_qty_type",
        label: "Qty Type",
        align: "left",
        sortable: true,
      },
      {
        name: "expense_total",
        field: "expense_total",
        label: "Total",
        align: "left",
        sortable: true,
      },
      {
        name: "action",
        field: "action",
        label: "",
        align: "left",
      },
    ];
    const rows = fundsAndExpenses;
    onMounted(() => {
      calLastMnthExpense();
      getMonthlyFundAndExpenses(filteredDate.value);
      getBudgetAllocation(filteredDate.value);
      getYears(yearToday);
      getDays();
    });
    return {
      formatNumber,
      filteredDate,
      filterAllYearTransaction,
      calLastMnthExpense,
      result,
      availableBudget,
      //fund-expenses
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
      columns,
      rows,
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 4,
      },
      budgetAllocationData,
      timeAgo,
      numberOfDays,
      dayToday,
      dayTodayExpense,
      selectDay,
      monthNames,
      isAddFunds,
      budgetAllocationDetails,
      resetAddItem,
      allPercentage,
      closeMenu,
      sum,
      expensesDetails,
      addAndEdit,
      submitExpense,
      closeExpenseMenu,
      totalExpense,
      yearArray,
      getBudgetAllocation,
    };
  },
};
