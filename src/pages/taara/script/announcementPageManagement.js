import { onMounted, ref, watch, onUnmounted } from "vue";
import {
  getAllAnnouncement,
  annoucementData,
  updateAnnouncementManagement,
  addAnnouncementManagement,
  logInDetails,
} from "../../../composable/taaraComposable";
import {
  wordifyDate,
  wordifyTime,
  resizeImage,
  dateToday,
  timeNow,
} from "src/composable/simpleComposable";
import { useCounterStore } from "../../../stores/example-store";
import TextClamp from "vue3-text-clamp";
export default {
  components: {
    TextClamp,
  },

  setup() {
    const counterStore = useCounterStore();
    const myElement = ref(null);
    let textLength = ref(150);
    let addAnnouncement = ref(false);
    let addImageCarousel = ref(false);
    let addImage = ref(false);
    let addImageSlide = ref(1);
    let carousel = ref(false);
    let referenceAnnouncementId = ref();
    let showMore = ref(false);
    let images = ref([]);
    let slide = ref(1);
    let qDialogImageId = ref();
    let editOrAdd = ref(false);
    let announcementDetails = ref({
      user_id: logInDetails.value[0].user_id,
      announcement_details: null,
      date: dateToday,
      time: timeNow,
    });

    // const scrollToElement = () => {
    //   setTimeout(() => {
    //     const element = document.querySelector(
    //       `#report-${counterStore.announcement}`
    //     );
    //     if (element) {
    //       element.scrollIntoView({ behavior: "smooth" });
    //     }
    //   }, 10);
    // };
    let filteredImages = () => {
      // return this.annoucementData._value.image
      //   .filter(
      //     (image) => data._value.data.announcement_id === image.announcement_id
      //   )
      //   .slice(0, 4);
    };

    let test = (payload, id, based) => {
      if (based == "viewPost") {
        slide.value = payload;
        qDialogImageId.value = id;
        carousel.value = true;
      } else {
        addImageCarousel.value = true;
        addImageSlide.value = payload;
      }
    };
    let editAnnouncement = (payload) => {
      addAnnouncement.value = true;
      addImage.value = true;
      announcementDetails.value = { ...payload };
      images.value = annoucementData.value.image.filter((obj) => {
        return obj.announcement_id === payload.announcement_id;
      });
      editOrAdd.value = true;
      referenceAnnouncementId.value = payload.announcement_id;
    };

    const pickFile = () => {
      document.getElementById("fileInput").click();
    };

    const handleFileUpload = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl, fileName }) => {
              if (images.value.length <= 4 && editOrAdd.value == false) {
                images.value.push({
                  image: dataUrl,
                });
              } else if (images.value.length <= 4 && editOrAdd.value == true) {
                images.value.push({
                  announcement_id: referenceAnnouncementId.value,
                  image: dataUrl,
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };
      }
    };
    let removeValue = () => {
      announcementDetails.value.announcement_details = null;
      images.value = [];
      addAnnouncement.value = true;
      editOrAdd.value = false;
      addImage.value = false;
    };
    const handleWindowResize = () => {
      showMore.value = window.innerWidth < 415;
    };
    watch(
      () => counterStore.announcement,
      (newValue, oldValue) => {
        console.log(newValue + "d" + oldValue);
        // scrollToElement();
      }
    );
    onMounted(() => {
      window.addEventListener("resize", handleWindowResize);
      filteredImages();
      getAllAnnouncement();
      // setTimeout(() => {
      // scrollToElement();
      // }, 1000);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", handleWindowResize);
    });
    return {
      pickFile,
      editAnnouncement,
      qDialogImageId,
      updateAnnouncementManagement,
      test,
      removeValue,
      images,
      filteredImages,
      handleFileUpload,
      announcementDetails,
      editOrAdd,
      wordifyDate,
      wordifyTime,
      getAllAnnouncement,
      annoucementData,
      addAnnouncementManagement,
      myElement,
      showMore,
      textLength,
      slide,
      addAnnouncement,
      addImage,
      addImageCarousel,
      addImageSlide,
      carousel,
    };
  },
};
