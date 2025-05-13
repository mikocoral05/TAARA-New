import { ref } from "vue";
import { resizeImage } from "src/composable/simpleComposable";
export default {
  setup() {
    let petTransferInfo = ref({});
    let requestResult = ref(false);
    let imageShow = () => {
      document.getElementById("file").click();
    };
    let fileUploadName = ref(null);
    const handleFileUpload = (event, param) => {
      const files = event.target.files;
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resizeImage(file, 500, 500)
          .then(({ dataUrl, fileName }) => {
            fileUploadName.value = fileName;
            if (param == "profileImage") {
              petTransferInfo.value.image = dataUrl;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
    };
    return {
      requestResult,
      fileUploadName,
      handleFileUpload,
      petTransferInfo,
      miniStep: ref(1),
      step: ref(1),
      imageShow,
    };
  },
};
