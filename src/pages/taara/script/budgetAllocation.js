import { ref, onMounted, onUnmounted } from "vue";
import {
  budgetAllocationData,
  getBudgetAllocation,
  addBudgetAllocation,
  getMonthlyDonation,
  getAllMonthlyExpenses,
  updateBudgetAllocation,
} from "../../../composable/taaraComposable";
import { formatNumber, monthNames } from "src/composable/simpleComposable";
export default {
  setup() {
    const isAddFunds = ref(false);

    const date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let yearArray = ref([]);
    let getYears = (year) => {
      for (let i = 2021; i <= year; i++) {
        yearArray.value.push([i]);
      }
    };
    let filteredDate = ref({
      month: monthNames[month],
      year: year,
    });
    let allPercentage = ref(false);
    let result = ref([]);
    let budgetAllocationDetails = ref([{}]);
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
          isAddFunds.value = true;
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

    const columns = [
      {
        name: "item_name",
        field: "item_name",
        label: "Expense",
        align: "center",
        sortable: true,
      },
      {
        name: "percentage",
        field: "percentage",
        label: "Budget Percentage",
        align: "center",
        sortable: true,
      },
      {
        name: "budgetAllocation",
        field: "budgetAllocation",
        label: "Budget Allocation",
        align: "center",
        sortable: true,
      },

      {
        name: "accumulated_expenses",
        field: "accumulated_expenses",
        label: "Accumulated Expenses",
        align: "center",
        sortable: true,
      },
    ];
    const rows = budgetAllocationData;

    let calLastMnthExpense = () => {
      let monthDonationPromise = getMonthlyDonation(
        filteredDate.value,
        "budget_allocation"
      ).then((response) => {
        console.log(response);
        return response;
      });
      let monthExpensePromise = getAllMonthlyExpenses(
        filteredDate.value,
        "budget_allocation"
      ).then((response) => {
        console.log(response);
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
            // If it's December, reset the carry over for the new year
            // if (donations[i].month === 12) {
            //   carryOver = 0;
            // }
          }
          result.value = netDonations.value;
        }
      );
    };

    let availableBudget = ref(0);

    let filterAllYearTransaction = (result, month, baseResult) => {
      let filter = result.filter((obj) => {
        return obj.month == month && obj.year == filteredDate.value.year;
      });
      if (filter.length > 0) {
        console.log(result);
        let sum = filter[0].net_donation + Number(filter[0].total_expense);
        let difference = sum - Number(filter[0].total_expense);
        availableBudget.value = difference;

        if (baseResult == "totalDonation") {
          return sum;
        } else if (baseResult == "totalExpense") {
          return formatNumber(Number(filter[0].total_expense));
        }
      } else {
        availableBudget.value = 0;
        if (baseResult == "totalDonation") {
          return 0;
        } else if (baseResult == "totalExpense") {
          return formatNumber(0);
        }
      }
    };

    let cutLabel = ref(false);
    const adjustLabel = () => {
      cutLabel.value = window.innerWidth <= 400;
    };

    onMounted(() => {
      window.addEventListener("resize", adjustLabel);
      getBudgetAllocation(filteredDate.value, "budget_allocation");
      calLastMnthExpense();
      getYears(year);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", adjustLabel);
    });

    return {
      calLastMnthExpense,
      getBudgetAllocation,
      filteredDate,
      cutLabel,
      filterAllYearTransaction,
      budgetAllocationData,
      addBudgetAllocation,
      monthNames,
      columns,
      rows,
      isAddFunds,
      budgetAllocationDetails,
      resetAddItem,
      month,
      result,
      month,
      availableBudget,
      formatNumber,
      yearArray,
      year,
      allPercentage,
      sum,
    };
  },
};
