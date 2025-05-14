<template>
  <div class="canvased">
    <!-- <canvas id="acquisitions" width="800" height="400"></canvas> -->
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>
<script>
import { defineComponent, ref, onUnmounted } from "vue";
import { onMounted } from "vue";
import {
  monthlyAdoption,
  getMonthlyAdoption,
} from "src/composable/taaraComposable";
import {
  yearToday,
  threeWordsAbbMonth,
  twoWordsAbbMonth,
} from "src/composable/simpleComposable";
import Chart from "chart.js/auto";
export default defineComponent({
  name: "BarChartsRescue",
  setup() {
    let acquisitions = ref();
    let dataShow = null;

    let chart = null;

    function createChart() {
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(acquisitions.value, {
        type: "bar",
        data: {
          labels: dataShow.map((row) => row.month),
          datasets: [
            {
              label: "Rescued Animal by Month ",
              data: monthlyAdoption.value.map((row) => row.Number_of_Adoption),
              backgroundColor: "#B157AE",
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    let resizeTimeout = null;

    function onWindowResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 365 && window.innerWidth <= 420) {
          dataShow = twoWordsAbbMonth;
        } else if (window.innerWidth <= 364) {
          let newData = threeWordsAbbMonth.map((item) => {
            return { month: item.month.charAt(0) };
          });
          dataShow = newData;
        } else {
          dataShow = threeWordsAbbMonth;
        }
        createChart();
      }, 250);
    }

    onMounted(() => {
      window.addEventListener("resize", onWindowResize);
      onWindowResize();
      getMonthlyAdoption(yearToday)
        .then(() => {
          createChart();
        })
        .catch((error) => {
          console.log(error);
        });
    });
    onUnmounted(() => {
      window.removeEventListener("resize", onWindowResize);
    });

    return {
      acquisitions,
    };
  },
});
</script>
<style scoped lang="scss">
.canvased {
  max-width: 90%;
  width: 100%;
}
.text {
  font-size: 3px;
}
</style>
