import { ref, onMounted } from "vue";
import taaraFooter from "../../../components/taaraFooter.vue";
import BarChartsRescue from "../../../components/BarChartsRescue.vue";
import {
  formatNumber,
  monthNames,
  monthToday,
  yearToday,
  weekCount,
} from "src/composable/simpleComposable";
import {
  getMonthlyDonation,
  getAllMonthlyExpenses,
  getRescuedAnimal,
  allRescuedAnimal,
  animalsAdopted,
  getAnimalsAdopted,
} from "src/composable/taaraComposable";

export default {
  components: {
    taaraFooter,
    BarChartsRescue,
  },
  setup() {
    let amountGoal = ref(50000);
    let percentage = ref(0);

    const date = new Date();
    let month = date.getMonth();

    let objectsWeeklyRescue = ref({});
    let totalRescue = ref(0);

    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    });
    let result = ref([]);
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
            // Subtract the expense from the donation and add the carry over from the previous month
            let netDonation = donation - expense + carryOver;
            // If the net donation is positive, carry it over to the next month
            carryOver = netDonation > 0 ? netDonation : 0;
            // Don't allow negative net donations
            // netDonation = Math.max(netDonation, 0);
            netDonations.value.push({
              month: donations[i].month,
              total_donation: donations[i].month_donation,
              total_expense: expenses[i].total_expense,
              net_donation: netDonation,
            });
            // If it's December, reset the carry over for the new year
            if (donations[i].month === 12) {
              carryOver = 0;
            }
          }
          result.value = netDonations.value;
          console.log(result.value);
        }
      );
    };

    let filterAllYearTransaction = (result, month, baseResult) => {
      let filter = result.filter((obj) => {
        return obj.month == month;
      });
      if (filter.length > 0) {
        let sum = filter[0].total_donation;

        if (baseResult == "totalDonation") {
          percentage.value = Math.floor((sum / amountGoal.value) * 100);
          return sum;
        }
      } else {
        if (baseResult == "totalDonation") {
          return 0;
        }
      }
    };
    onMounted(() => {
      calLastMnthExpense();
      getRescuedAnimal(filteredDate.value);

      getAnimalsAdopted(filteredDate.value);
      getRescuedAnimal(filteredDate.value)
        .then((totalOfRescue) => {
          let count = weekCount(
            filteredDate.value.year,
            filteredDate.value.month.value
          );
          const weeklySummary = {};
          let allRescue = 0;
          // Initialize weekly summary object
          for (let week = 1; week <= count; week++) {
            weeklySummary[week] = { cat: 0, dog: 0 };
          }

          // Process each rescue entry
          for (const entry of totalOfRescue) {
            const rescueDate = new Date(entry.care_start_date); // Assuming 'date' is the key for rescue date
            const weekNumber = weekCount(
              rescueDate.getFullYear(),
              rescueDate.getMonth() + 1
            );

            // Increment the count for the corresponding animal type
            if (entry.animal_type === "cat") {
              weeklySummary[weekNumber].cat++;
              allRescue++;
            } else if (entry.animal_type === "dog") {
              weeklySummary[weekNumber].dog++;
              allRescue++;
            }
          }
          objectsWeeklyRescue.value = weeklySummary;
          totalRescue.value = allRescue;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    return {
      animalsAdopted,
      filteredDate,
      allRescuedAnimal,
      filterAllYearTransaction,
      objectsWeeklyRescue,
      totalRescue,
      month,
      result,
      percentage,
      amountGoal,
      formatNumber,
      taaraFooter,
    };
  },
};
