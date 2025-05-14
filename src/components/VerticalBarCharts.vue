<template>
  <div>
     <!-- <canvas id="acquisitions" width="800" height="400"></canvas> -->
     <canvas ref="acquisitions" width="800"></canvas>
    </div>

  </template>
  <script >

  import { defineComponent,ref } from 'vue'
  import { onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  export default defineComponent({
    name:"VerticalBarCharts",
    setup() {
      let acquisitions = ref();
      (async function() {
    const data = [
      { month: "January", count: 10000 },
      { month: "February", count: 20000 },
      { month: "March", count: 15000 },
      { month: "April", count: 22500 },
      { month: "May", count: 22030 },
      { month: "June", count: 30009 },
      { month: "July", count: 28254 },
      { month: "August", count: 28623 },
      { month: "September", count: 12834 },
      { month: "October", count: 29423 },
      { month: "November", count: 42834 },
      { month: "December", count: 14228 },
    ];

    onMounted(() => {
       new Chart(
        acquisitions.value,
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.month),
          datasets: [
            {axis: "y",
              label: 'Donation by Month ',
              data: data.map(row => row.count),
              backgroundColor: '#B157AE',
              borderWidth: 1,
            }
          ]
        },options:{
          indexAxis: "y",
        }
      }
    );
    })
  })();
  return{
    acquisitions,
  }
    },
  })

  </script>
