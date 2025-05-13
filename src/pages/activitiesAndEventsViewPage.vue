<template>
  <div class="flex justify-center items-center column all-container">
    <h4 class="text-center q-mt-sm q-mb-md">Activies & Events</h4>
    <div
      class="q-mb-xl event-container"
      v-for="data in activitiesAndEventsDataSpecific.data"
      :key="data.id"
    >
      <h4 class="text-center q-my-md">
        {{ data.activities_events_title }}
      </h4>
      <div
        :class="
          imageCount(data.activities_events_id) < 4
            ? 'flex row no-wrap q-ma-sm q-pa-none justify-center items-center oustside-image-container-less4 '
            : 'flex row no-wrap q-ma-sm q-pa-none oustside-image-container '
        "
      >
        <div
          v-for="(image, index) in activitiesAndEventsDataSpecific.image.slice(
            0,
            3
          )"
          :key="image.id"
        >
          <div
            class="flex row more-image-container full-width full-height"
            @click="test(index), (carousel = true)"
          >
            <q-icon name="add" class="text-white more-image-icon" />
            <p class="text-white text-h4">
              {{ imageCount(data.activities_events_id) - 3 }}
            </p>
          </div>
          <img
            v-if="data.activities_events_id === image.activities_events_id"
            :src="image.image"
            :class="
              imageCount(data.activities_events_id) < 3 ? 'q-ma-sm  ' : ''
            "
            alt=""
            @click="test(index), (carousel = true)"
          />
        </div>
      </div>
      <p class="text-bold text-center text-purple taara-small-header">
        {{ data.small_header }} - TAARA
      </p>
      <p class="text-bold text-center text-purple date">
        {{ time(data.date) }}
      </p>
      <p
        class="q-ma-sm q-mb-lg event-details q-mx-md"
        style="word-wrap: break-word"
      >
        {{ data.activities_events_details }}
      </p>
      <q-dialog v-model="carousel" maximized>
        <q-carousel swipeable animated arrows v-model="slide" infinite dark>
          <q-carousel-slide
            v-for="(image, index) in activitiesAndEventsDataSpecific.image"
            :key="image.id"
            :name="index"
            class="flex justify-center items-center"
          >
            <q-icon
              name="close"
              class="absolute-top-right color-white q-ma-md close-dialog"
              @click="carousel = false"
            />
            <img
              :src="image.image"
              alt=""
              style="max-width: 100%; height: auto"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-dialog>
    </div>
  </div>
  <PageFooter class="q-mt-xl"></PageFooter>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import PageFooter from "src/components/PageFooter.vue";
import {
  activitiesAndEventsDataSpecific,
  getActivitiesAndEventsSpecific,
} from "../composable/taaraComposable";
export default {
  components: {
    PageFooter,
  },
  setup() {
    let imageCount = (dataId) => {
      return activitiesAndEventsDataSpecific.value.image.filter(
        (image) => image.activities_events_id === dataId
      ).length;
    };

    onMounted(() => {
      getActivitiesAndEventsSpecific();
    });
    function time(param) {
      var date = new Date(param);
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      var mthNames = [
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
      ];
      return mthNames[m - 1] + " " + d + ", " + y;
    }
    let slide = ref(1);
    let nameIndexBased = ref(0);
    let test = (payload) => {
      slide.value = payload;
    };
    return {
      slide,
      nameIndexBased,
      carousel: ref(false),
      fullscreen: ref(false),
      test,
      activitiesAndEventsDataSpecific,
      time,
      imageCount,
    };
  },
};
</script>
<style
  lang="scss"
  scoped
  src="../pages/taara/style/activitiesAndEventsViewPage.scss"
/>
