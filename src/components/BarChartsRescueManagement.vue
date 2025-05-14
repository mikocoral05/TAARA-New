<template>
  <div class="canvased">
    <!-- <canvas id="acquisitions" width="800" height="400"></canvas> -->
    <canvas ref="acquisitions" class="text"></canvas>
  </div>
</template>
<script>
import { defineComponent, ref, onUnmounted, onMounted } from "vue";
import Chart from "chart.js/auto";
export default defineComponent({
  name: "BarChartsRescue",
  setup() {
    let acquisitions = ref();
    let dataShow = null;
    // (async function () {
    const data = [
      { month: "Jan", count: 10 },
      { month: "Feb", count: 20 },
      { month: "Mar", count: 15 },
      { month: "Apr", count: 25 },
      { month: "May", count: 22 },
      { month: "Jun", count: 30 },
      { month: "Jul", count: 28 },
      { month: "Aug", count: 28 },
      { month: "Sep", count: 28 },
      { month: "Oct", count: 28 },
      { month: "Nov", count: 28 },
      { month: "Dec", count: 48 },
    ];
    const data2 = [
      { month: "Jn", count: 10 },
      { month: "Fb", count: 20 },
      { month: "Mr", count: 15 },
      { month: "Ap", count: 25 },
      { month: "My", count: 22 },
      { month: "Jn", count: 30 },
      { month: "Jl", count: 28 },
      { month: "Au", count: 28 },
      { month: "Sp", count: 28 },
      { month: "Oc", count: 28 },
      { month: "Nv", count: 28 },
      { month: "Dc", count: 48 },
    ];
    const data3 = [
      { month: "J", count: 10 },
      { month: "F", count: 20 },
      { month: "M", count: 15 },
      { month: "A", count: 25 },
      { month: "M", count: 22 },
      { month: "J", count: 30 },
      { month: "J", count: 28 },
      { month: "A", count: 28 },
      { month: "S", count: 28 },
      { month: "O", count: 28 },
      { month: "N", count: 28 },
      { month: "D", count: 48 },
    ];
    if (window.innerWidth >= 365 && window.innerWidth <= 420) {
      dataShow = data2;
    } else if (window.innerWidth <= 364) {
      dataShow = data3;
    } else {
      dataShow = data;
    }
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
              data: data.map((row) => row.count),
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
          dataShow = data2;
        } else if (window.innerWidth <= 364) {
          dataShow = data3;
        } else {
          dataShow = data;
        }
        createChart();
      }, 250);
    }

    onMounted(() => {
      window.addEventListener("resize", onWindowResize);
      createChart();
    });
    onUnmounted(() => {
      window.removeEventListener("resize", onWindowResize);
    });
    // })();

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
