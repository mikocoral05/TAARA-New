<template>
  <div class="canvased">
    <canvas ref="acquisitions" class="text canvas"></canvas>
  </div>
</template>
<script>
import { onMounted, onUnmounted, defineComponent, ref, watch } from "vue";
import {
  monthlyDonationData,
  getMonthlyDonation,
} from "../composable/taaraComposable";
import Chart from "chart.js/auto";
import { useCounterStore } from "../stores/example-store";
export default defineComponent({
  name: "BarChartsRescue",
  setup() {
    let acquisitions = ref();
    const counterStore = useCounterStore();
    const date = new Date();
    let year = date.getFullYear();
    let filteFundsExpenses = ref({
      year: year,
    });
    const data = [
      { month: "Jan", count: null },
      { month: "Feb", count: null },
      { month: "Mar", count: null },
      { month: "Apr", count: null },
      { month: "May", count: null },
      { month: "Jun", count: null },
      { month: "Jul", count: null },
      { month: "Aug", count: null },
      { month: "Sep", count: null },
      { month: "Oct", count: null },
      { month: "Nov", count: null },
      { month: "Dec", count: null },
    ];
    const data2 = [
      { month: "J", count: null },
      { month: "F", count: null },
      { month: "M", count: null },
      { month: "A", count: null },
      { month: "M", count: null },
      { month: "J", count: null },
      { month: "J", count: null },
      { month: "A", count: null },
      { month: "S", count: null },
      { month: "O", count: null },
      { month: "N", count: null },
      { month: "D", count: null },
    ];

    let chart = null;

    function createChart(response, text) {
      let alteredData = ref([]);
      if (window.innerWidth <= 364) {
        alteredData.value = data2;
      } else {
        alteredData.value = data;
      }
      let newData = alteredData.value.map((item, index) => {
        if (response[index]) {
          return { ...item, count: response[index].month_donation };
        } else {
          return item;
        }
      });

      if (!chart) {
        chart = new Chart(acquisitions.value, {
          type: "bar",
          data: {
            labels: newData.map((row) => row.month),
            datasets: [
              {
                label: "Total Donations ",
                data: newData.map((row) => row.count),
                backgroundColor: "#B157AE",
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: true,
                align: "start",
                labels: {
                  padding: 30,
                  font: {
                    size: 15,
                  },
                  boxWidth: 0,
                },
              },
            },
          },
        });
      } else {
        // Update the chart data if it already exists
        if (text == "destroy") {
          chart.destroy();
          chart = new Chart(acquisitions.value, {
            type: "bar",
            data: {
              labels: newData.map((row) => row.month),
              datasets: [
                {
                  label: "Total Donations ",
                  data: newData.map((row) => row.count),
                  backgroundColor: "#B157AE",
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  align: "start",
                  labels: {
                    padding: 30,
                    font: {
                      size: 15,
                    },
                    boxWidth: 0,
                  },
                },
              },
            },
          });
        } else {
          chart.data.labels = newData.map((row) => row.month);
          chart.data.datasets[0].data = newData.map((row) => row.count);
          chart.update();
        }
      }
    }

    let resizeTimeout = null;

    function onWindowResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        getMonthlyDonation(filteFundsExpenses.value, "budget_allocation").then(
          (response) => {
            createChart(response, "destroy");
          }
        );
      }, 250);
    }

    watch(
      () => counterStore.donChart,
      (newValue, oldValue) => {
        filteFundsExpenses.value.year = newValue;
        getMonthlyDonation(filteFundsExpenses.value, "budget_allocation").then(
          (response) => {
            let filterByYear = response.filter((obj) => {
              return obj.year === filteFundsExpenses.value.year;
            });
            createChart(filterByYear);
          }
        );
      }
    );
    onMounted(() => {
      window.addEventListener("resize", onWindowResize);
      getMonthlyDonation(filteFundsExpenses.value, "budget_allocation").then(
        (response) => {
          let filterByYear = response.filter((obj) => {
            return obj.year === filteFundsExpenses.value.year;
          });
          createChart(filterByYear);
        }
      );
    });
    onUnmounted(() => {
      window.removeEventListener("resize", onWindowResize);
    });
    return {
      acquisitions,
      monthlyDonationData,
    };
  },
});
</script>
<style scoped lang="scss">
.canvased {
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .canvas {
    width: 100%;
  }
}
.text {
  font-size: 3px;
}
</style>
