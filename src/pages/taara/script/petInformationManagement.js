import { ref, onMounted, watch } from "vue";
import { useCounterStore } from "src/stores/example-store";
import {
  allAnimalDataManagement,
  getAllAnimalsManagement,
  addNewAnimal,
  SearchAnimalByNameManagement,
} from "../../../composable/taaraComposable";
import { resizeImage } from "src/composable/simpleComposable";
export default {
  component: {},
  setup() {
    const userStore = useCounterStore();
    const miniState = ref(false);
    const animals = ref(true);
    let search = ref({
      animal_name: null,
      animal_type: "Any",
      breed: "Any",
      age: "Any",
      sex: "Any",
      size: "Any",
      fur_color: "Any",
      good_with: "Any",
      behaviour: "Any",
    });
    let animalDetails = ref({
      animal_name: null,
      breed: null,
      age: null,
      sex: null,
      size: null,
      fur_color: null,
      good_with: null,
      health: null,
      behaviour: null,
      current_state: null,
    });
    let justRef = ref("blacky.jpg");
    let addAnimal = ref(false);
    let mobileAdd = ref(false);

    watch(search.value, (newVal) => {
      SearchAnimalByNameManagement(newVal.animal_name, search);
    });
    let filterAdvanceSearch = ref(false);
    let toggleAnimalType = (type) => {
      if (type === "dog") {
        search.value.animal_type =
          search.value.animal_type === "dog" ? "" : "dog";
      } else if (type === "cat") {
        search.value.animal_type =
          search.value.animal_type === "cat" ? "" : "cat";
      }
    };
    let toggleAnimalSize = (size) => {
      if (size === "small") {
        search.value.size = search.value.size === "small" ? "" : "small";
      } else if (size === "medium") {
        search.value.size = search.value.size === "medium" ? "" : "medium";
      } else if (size === "large") {
        search.value.size = search.value.size === "large" ? "" : "large";
      } else if (size === "extra large") {
        search.value.size =
          search.value.size === "extra large" ? "" : "extra large";
      }
    };
    let toggleAnimalSex = (sex) => {
      if (sex === "male") {
        search.value.sex = search.value.sex === "male" ? "" : "male";
      } else if (sex === "female") {
        search.value.sex = search.value.sex === "female" ? "" : "female";
      }
    };
    let toggleAnimalGoodWith = (good_width) => {
      if (good_width === "kids") {
        search.value.good_with =
          search.value.good_with === "kids" ? "" : "kids";
      } else if (good_width === "dogs") {
        search.value.good_with =
          search.value.good_with === "dogs" ? "" : "dogs";
      } else if (good_width === "cats") {
        search.value.good_with =
          search.value.good_with === "cats" ? "" : "cats";
      }
    };
    // let age = ref();
    function getAge(age) {
      var today = new Date();
      var birthDate = new Date(age);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 2) {
        return "Young";
      } else if ((age) => 2 && age <= 10) {
        return "Adult";
      } else {
        return "Senior";
      }
    }
    let viewAnimal = (id) => {
      localStorage.setItem("specificAnimalId-management", JSON.stringify(id));
    };
    let images = ref([]);
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
              if (images.value.length <= 4) {
                images.value.push({ animal_image: dataUrl });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };
      }
    };
    let resetAnimalDetails = () => {
      Object.keys(animalDetails.value).forEach((key) => {
        animalDetails.value[key] = null;
      });
      images.value = [];

      addAnimal.value = true;
    };

    watch(
      () => userStore.manageAnimal,
      (newValue, oldValue) => {
        getAllAnimalsManagement();
      }
    );
    onMounted(() => {
      getAllAnimalsManagement();
    });
    return {
      animals,
      pickFile,
      handleFileUpload,
      viewAnimal,
      getAge,
      images,
      toggleAnimalGoodWith,
      toggleAnimalSex,
      toggleAnimalSize,
      toggleAnimalType,
      filterAdvanceSearch,
      justRef,
      search,
      animal_type_option: [
        {
          label: "Any",
          value: "Any",
        },
        {
          label: "Dog",
          value: "dog",
        },
        {
          label: "Cat",
          value: "cat",
        },
      ],
      breed_option: [
        {
          label: "Any",
          value: "Any",
        },
        {
          label: "Aspin",
          value: "aspin",
        },
        {
          label: "German Shepherd",
          value: "german shepherd",
        },
        {
          label: "Golden retriever",
          value: "golden retriever",
        },
        {
          label: "Chihuahua",
          value: "chihuahua",
        },
        {
          label: "Beagle",
          value: "beagle",
        },
      ],

      age_option: [
        { label: "Any", value: "Any" },
        { label: "Young", value: "young" },
        { label: "Adult", value: "adult" },
        { label: "Senior", value: "senior" },
      ],
      sex_option: [
        { label: "Any", value: "Any" },
        { label: "Male", value: 1 },
        { label: "Female", value: 2 },
      ],
      size_option: [
        { label: "Any", value: "any" },
        { label: "Small", value: 1 },
        { label: "Normal", value: 2 },
        { label: "Big", value: 3 },
      ],
      color_option: [
        { label: "Any", value: "Any" },
        { label: "Black", value: "black" },
        { label: "White", value: "white" },
        { label: "Brown", value: "brown" },
        { label: "Orange", value: "orange" },
        { label: "Mix", value: "mix" },
      ],
      good_with_option: [
        { label: "Any", value: "Any" },
        { label: "People", value: 1 },
        { label: "Animals", value: 2 },
        { label: "Both Animals and People", value: 3 },
      ],
      care_behavior: [
        { label: "Any", value: "Any" },
        { label: "House Trained", value: "house trained" },
        { label: "Declawed", value: "declawed" },
        { label: "Playful", value: "playful" },
        { label: "Loving", value: "loving" },
        { label: "Special Needs", value: "special needs" },
      ],
      miniState: ref(true),
      drawer: ref(true),
      drawer: ref(false),
      miniState,
      getAllAnimalsManagement,
      addAnimal,
      allAnimalDataManagement,
      SearchAnimalByNameManagement,
      animalDetails,
      resetAnimalDetails,
      addNewAnimal,
      mobileAdd,
      drawerClick(e) {
        // if in "mini" state and user
        // click on drawer, we switch it to "normal" mode
        if (miniState.value) {
          miniState.value = false;

          // notice we have registered an event with capture flag;
          // we need to stop further propagation as this click is
          // intended for switching drawer to "normal" mode only
          e.stopPropagation();
        }
      },
    };
  },
};
