import {
  getActivitiesAndEvents,
  activitiesAndEventsData,
  addNewActivitiesAndEvents,
  eventBasicSearch,
} from "../../../composable/taaraComposable";
import {
  resizeImage,
  wordifyDate,
  wordifyTime,
  dateToday,
} from "src/composable/simpleComposable";
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const now = new Date();

    let images = ref([]);
    let upcomingOrPast = ref(true);
    let datedD = ref("2024-04-23");
    let closeMenu = ref(false);
    let addActivityOrEvent = ref(false);
    let activityEventDetails = ref({});
    let search = ref(null);
    let listOfEvents = ref([]);
    let upcomingoRNot = ref(true);
    let addBtn = (eventDetails) => {
      if (images.value.length > 0) {
        addNewActivitiesAndEvents(eventDetails);
        closeMenu.value = false;
      }
    };
    let getPastEvent = (search, bollean) => {
      eventBasicSearch(search, bollean);
      upcomingOrPast.value = false;
      listOfEvents.value = activitiesAndEventsData.value
        .filter((obj) => new Date(obj.event_date + " " + obj.event_time) < now)
        .map((obj) => {
          return obj.event_date.replace(/-/g, "/");
        });
    };
    let getUpcomingEvent = (search, bollean) => {
      eventBasicSearch(search, bollean);
      upcomingOrPast.value = true;
      listOfEvents.value = activitiesAndEventsData.value
        .filter((obj) => new Date(obj.event_date + " " + obj.event_time) > now)
        .map((obj) => {
          return obj.event_date.replace(/-/g, "/");
        });
    };
    let calculateTime = (duration) => {
      console.log(duration);
    };
    const handleFileUpload = (event, param) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl, fileName }) => {
              if (param == "profileImage") {
                images.value = [];
                images.value.push({ image: dataUrl, fileName: fileName });
                activityEventDetails.value.image = dataUrl;
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };
      }
    };
    let base = ref(true);
    let resizeFunction = () => {
      if (window.innerWidth >= 823 && window.innerWidth >= 533) {
        base.value = true;
      } else {
        base.value = false;
      }
    };
    let navigateEvents = (eventId) => {
      router.push("activitiesAndEventsManagement");
      localStorage.setItem(
        "activitiesAndEventsDataSpecificId",
        JSON.stringify(eventId)
      );
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    const pickFile = () => {
      document.getElementById("fileInput").click();
    };
    onMounted(() => {
      window.addEventListener("resize", resizeFunction);
      getActivitiesAndEvents()
        .then((response) => {
          listOfEvents.value = response.data
            .filter(
              (obj) => new Date(obj.event_date + " " + obj.event_time) >= now
            )
            .map((obj) => {
              return obj.event_date.replace(/-/g, "/");
            });
          if (response.status == "success") {
            eventBasicSearch(search.value, true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
    onUnmounted(() => {
      getRandomColor();
      window.removeEventListener("resize", resizeFunction);
    });
    return {
      getRandomColor,
      pickFile,
      handleFileUpload,
      addActivityOrEvent,
      navigateEvents,
      base,
      images,
      activityEventDetails,
      getActivitiesAndEvents,
      activitiesAndEventsData,
      addNewActivitiesAndEvents,
      events: ["2024/04/25", "2024/04/23", "2024/04/29", "2024/04/28"],
      upcomingOrPast,
      datedD,
      wordifyDate,
      wordifyTime,
      addBtn,
      closeMenu,
      eventBasicSearch,
      search,
      dateToday,
      upcomingoRNot,
      listOfEvents,
      getEventColor(date) {
        const colors = [
          "secondary",
          "accent",
          "warning",
          "purple",
          "positive",
          "negative",
        ];
        return colors[date[9] % colors.length];
      },
      getPastEvent,
      getUpcomingEvent,
      calculateTime,
    };
  },
};
