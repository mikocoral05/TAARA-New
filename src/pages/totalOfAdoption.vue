<template>
  <q-page>
    <div class="flex justify-center items-center text-white">
      <div class="first-container q-ma-lg q-mx-xl q-pb-sm">
        <div class="flex row justify-between items-center q-pb-md">
          <div class="flex justify-center items-center column date-year">
            <h3 class="q-mb-none q-ml-xl month q-ma-none q-mt-md q-mb-none">
              {{ filteredDate.month.label }}
            </h3>
            <h3 class="q-mt-xs q-ml-xl year q-ma-none q-mb-none">
              {{ filteredDate.year }}
            </h3>
          </div>
          <div
            class="row justify-center items-center q-ml-xl total-adoption-container"
          >
            <div
              class="column justify-center items-center q-mr-xl total-label-container q-pa-none q-mt-md"
            >
              <h3 class="q-pa-none q-ma-none q-mb-sm">
                {{ totalAdopted }}
              </h3>
              <p class="q-mb-none total-label q-mt-none">Total of Adopted</p>
            </div>
            <div class="q-mr-xl image-container q-mt-md">
              <q-img src="../image/pet-adoption.png" class="image" />
            </div>
          </div>
        </div>

        <div class="column justify-center items-center" style="width: 100%">
          <div
            class="small-div flex row justify-around items-center q-mb-md"
            v-for="(value, week) in objectsWeeklyRescue"
            :key="week"
          >
            <p class="q-ma-sm">{{ week }} Week</p>
            <p class="q-ma-sm">Total adotped</p>
            <div>
              <p class="q-ma-sm">
                {{ value.dog }} {{ value.dog < 2 ? "Dog" : "Dogs" }}
              </p>
              <p class="q-ma-sm">
                {{ value.cat }} {{ value.cat < 2 ? "Cat" : "Cats" }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="full-width">
        <h3 class="text-black year-adopt-bottom text-center q-mb-none">
          {{ filteredDate.year }} Adoption
        </h3>
      </div>
      <div
        class="flex column justify-center items-center bar-container q-ma-lg q-mx-xl q-mb-xl q-pa-lg q-mt-xl"
      >
        <BarChartsAdoption />
      </div>
      <PageFooter class="footer"></PageFooter>
    </div>
  </q-page>
</template>
<script>
import BarChartsAdoption from "src/components/BarChartsAdoption.vue";
import PageFooter from "src/components/PageFooter.vue";
import { ref, onMounted } from "vue";
import { getAnimalsAdopted } from "src/composable/taaraComposable";
import {
  weekCount,
  yearToday,
  monthToday,
  monthNames,
} from "src/composable/simpleComposable";
export default {
  components: {
    BarChartsAdoption,
    PageFooter,
  },
  setup() {
    let filteredDate = ref({
      month: monthNames[monthToday],
      year: yearToday,
    });

    let totalAdopted = ref(0);
    let objectsWeeklyRescue = ref({});
    onMounted(() => {
      getAnimalsAdopted(filteredDate.value)
        .then((totalOfAdopted) => {
          console.log(totalOfAdopted);
          let count = weekCount(
            filteredDate.value.year,
            filteredDate.value.month.value
          );
          const weeklySummary = {};
          let allAdopted = 0;
          // Initialize weekly summary object
          for (let week = 1; week <= count; week++) {
            weeklySummary[week] = { cat: 0, dog: 0 };
          }

          // Process each rescue entry
          for (const entry of totalOfAdopted) {
            const rescueDate = new Date(entry.care_start_date); // Assuming 'date' is the key for rescue date
            const weekNumber = weekCount(
              rescueDate.getFullYear(),
              rescueDate.getMonth() + 1
            );

            // Increment the count for the corresponding animal type
            if (entry.animal_type === "cat") {
              weeklySummary[weekNumber].cat++;
              allAdopted++;
            } else if (entry.animal_type === "dog") {
              weeklySummary[weekNumber].dog++;
              allAdopted++;
            }
          }
          objectsWeeklyRescue.value = weeklySummary;
          console.log(objectsWeeklyRescue.value);
          totalAdopted.value = allAdopted;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    return {
      objectsWeeklyRescue,
      totalAdopted,
      filteredDate,
    };
  },
};
</script>
<style
  lang="scss"
  scoped
  src="../pages/taara/style/totalOfRescueAdoptionDonation.scss"
></style>
