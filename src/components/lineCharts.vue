<template>
  <div class="acquisitions">
    <!-- <canvas id="acquisitions" width="800" height="400"></canvas> -->
    <canvas ref="acquisitions"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, Utils } from "vue";
import { onMounted } from "vue";
import Chart from "chart.js/auto";
export default defineComponent({
  name: "lineCharts",
  setup() {
    // --------------------------------
    let acquisitions = ref();
    (async function () {
      // const labels = Utils.months({count: 7});
      const data = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Funds",
            data: [12, 20, 19, 18, 18, 25, 15, 30, 25, 35, 30, 50],
            // fill: "start",
            borderColor: "#B157AE",
            // tension: 0.3,
            backgroundColor: "rgb(253, 248, 254,0.7)",
            // pointRadius: 5,
            pointHoverRadius: 15,
          },
          {
            label: "Expense",
            data: [2, 10, 15, 10, 15, 18, 20, 28, 30, 30, 35, 40],
            // fill: "start",
            backgroundColor: "rgb(244, 255, 255,0.7)",
            borderColor: "teal",
            // tension: 0.3,
            // pointRadius: 5,
            pointHoverRadius: 15,
          },
        ],
      };

      onMounted(() => {
        new Chart(acquisitions.value, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },

            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                ticks: {
                  stepSize: 10, // This line sets the increment to 10.
                },
              },
            },
          },
        });
      });
    })();
    return {
      acquisitions,
    };
  },
});
</script>

<style lang="scss" scope>
.acquisitions {
  // width: 100%;
  // height: 100%;
}
</style>
