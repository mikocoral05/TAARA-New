import { ref, onMounted, watch, computed } from "vue";
import taaraFooter from "../../../components/taaraFooter.vue";
import { useRoute } from "vue-router";
import {
  allAnimalData,
  allAnimalBackUp,
  getAllAnimals,
  specificAnimalId,
  SearchAnimalByName,
} from "../../../composable/taaraComposable";
import { calculateAge, encodeAnimalId } from "src/composable/simpleComposable";

export default {
  components: { taaraFooter },

  setup() {
    const miniState = ref(false);
    const route = useRoute();
    let searchValue = ref(null);
    let filterAdvanceSearch = ref(false);
    let drawer = ref(true);
    let sorted = ref(null);
    let categorizeByName = ref(false);
    let categorizeByAge = ref(false);
    let categorizeByWeight = ref(false);
    let categorizeByHeight = ref(false);
    let categorizeByYearRescued = ref(false);

    // let search = ref({
    //   animal_name: null,
    //   animal_type: "Any",
    //   breed: "Any",
    //   age: "Any",
    //   sex: "Any",
    //   size: "Any",
    //   fur_color: "Any",
    //   good_with: "Any",
    //   behaviour: "Any",
    // });
    let search = ref(null);
    const stringOptions = ["Name", "Sex", "Twitter", "Apple", "Oracle"];
    const options = ref();
    let watchRoute = () => {
      return route.query.page;
    };
    const currentPage = ref(1);
    const itemsPerPage = ref(20);

    const totalPages = computed(() =>
      Math.ceil(allAnimalData.value.length / itemsPerPage.value)
    );

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return allAnimalData.value.slice(start, end);
    });
    let categorizeByNameFn = () => {};
    let sortByName = (array) => {
      categorizeByName.value = !categorizeByName.value;
      return array.sort((a, b) => {
        let nameA = a.animal_name.toUpperCase(); // ignore upper and lowercase
        let nameB = b.animal_name.toUpperCase(); // ignore upper and lowercase

        if (categorizeByName.value == false) {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        } else {
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
        }

        // names must be equal
        return 0;
      });
    };
    let sortByAge = (array) => {
      categorizeByAge.value = !categorizeByAge.value;
      let convertAgeToMonths = (ageString) => {
        let [value, unit] = ageString.split(" ");
        value = parseInt(value);
        if (unit.includes("year")) {
          value = value * 12; // convert years to months
        }
        // if unit is 'month' or 'months', value remains the same

        return value;
      };

      return array.sort((a, b) => {
        let ageA = convertAgeToMonths(a.age);
        let ageB = convertAgeToMonths(b.age);

        if (categorizeByAge.value == false) {
          return ageB - ageA;
        } else {
          return ageA - ageB;
        }
      });
    };
    let sortByWeight = (array, condition = false) => {
      categorizeByWeight.value = !categorizeByWeight.value;
      let convertWeightToGrams = (weightString) => {
        let value = parseFloat(weightString);
        let unit = weightString.replace(value, "");

        if (unit.includes("kg")) {
          value = value * 1000; // convert kilograms to grams
        }
        // if unit is 'g' or 'mg', value remains the same

        return value;
      };

      return array.sort((a, b) => {
        let weightA = convertWeightToGrams(a.weight);
        let weightB = convertWeightToGrams(b.weight);

        if (categorizeByWeight.value == false) {
          return weightA - weightB;
        } else {
          return weightB - weightA;
        }
      });
    };
    let sortByHeight = (array) => {
      categorizeByHeight.value = !categorizeByHeight.value;
      return array.sort((a, b) => {
        let heightA = a.height;
        let heightB = b.height;

        if (categorizeByHeight.value == false) {
          return heightB - heightA;
        } else {
          return heightA - heightB;
        }
      });
    };
    let sortByDateRescued = (array) => {
      console.log(array);
      categorizeByYearRescued.value = !categorizeByYearRescued.value;
      return array.sort((a, b) => {
        let dateA = new Date(a.care_start_date);
        let dateB = new Date(b.care_start_date);

        if (categorizeByYearRescued.value == false) {
          // if condition is true, sort in descending order
          return dateB - dateA;
        } else {
          // if condition is false, sort in ascending order
          return dateA - dateB;
        }
      });
    };
    let sortPets = (sort) => {
      if (sort == null) {
        allAnimalData.value = allAnimalBackUp.value;
      } else {
        allAnimalData.value = allAnimalBackUp.value;
        allAnimalData.value = allAnimalData.value.filter((obj) => {
          return obj.current_state === sort;
        });
      }
    };
    // watch(search.value, (newVal) => {
    //   SearchAnimalByName(newVal);
    // });
    watch(watchRoute, (newVal) => {
      currentPage.value = route.query.page == undefined ? 1 : Number(newVal);
    });
    onMounted(() => {
      getAllAnimals();
      if (window.innerWidth <= 581) {
        drawer.value = false;
      }
      console.log();
      currentPage.value = route.query.page == undefined ? 1 : route.query.page;
    });
    return {
      sortPets,
      sortByDateRescued,
      sortByHeight,
      sortByWeight,
      sortByAge,
      sortByName,
      categorizeByNameFn,
      options,
      encodeAnimalId,
      filterFn(val, update, abort) {
        console.log(val.toLowerCase());
        // call abort() at any time if you can't retrieve data somehow
        let notEqual = ["animal_image", "animal_id"];

        let filteredArr = allAnimalData.value.filter((obj) =>
          Object.keys(obj).some(
            (key) => key.includes(val.toLowerCase()) && !notEqual.includes(key)
          )
        );
        // .slice(0, 15)
        // If no matching keys, search in the object's values
        if (filteredArr.length === 0) {
          filteredArr = allAnimalData.value.filter((obj) =>
            Object.values(obj).some((value) =>
              value.toString().toLowerCase().includes(val.toLowerCase())
            )
          );
        }

        // Extract the values of the keys that include the user's input and remove duplicates
        let values = [
          ...new Set(
            filteredArr.flatMap(
              (obj) =>
                Object.entries(obj)
                  .filter(
                    ([key, value]) =>
                      (key.includes(val) ||
                        value
                          .toString()
                          .toLowerCase()
                          .includes(val.toLowerCase())) &&
                      key !== "animal_image"
                  )
                  .map(([, value]) => value)
                  .filter((value) => value) // This will remove empty values
            )
          ),
        ];
        console.log(values);

        setTimeout(() => {
          update(
            () => {
              if (val === "") {
                options.value = stringOptions;
              } else {
                const needle = val.toLowerCase();
                options.value = values.filter(
                  (v) => v.toLowerCase().indexOf(needle) > -14
                );
              }
            },

            // "ref" is the Vue reference to the QSelect
            (ref) => {
              if (val !== "" && ref.options.length > 0) {
                ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
                ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
              }
            }
          );
        }, 300);
      },
      onSelectionChange(val, doneFn) {
        allAnimalData.value = allAnimalBackUp.value;
        let filteredArr = allAnimalData.value.filter((obj) =>
          Object.values(obj).some(
            (value) => value.toString().toLowerCase() === val.toLowerCase()
          )
        );
        allAnimalData.value = filteredArr;
        // doneFn();
      },

      totalPages,
      paginatedItems,
      currentPage,
      itemsPerPage,
      filterAdvanceSearch,
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
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
      size_option: [
        { label: "Any", value: "Any" },
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
        { label: "Animal", value: 2 },
        { label: "Both", value: 3 },
      ],
      care_behavior: [
        { label: "Any", value: "Any" },
        { label: "House Trained", value: "house trained" },
        { label: "Declawed", value: "declawed" },
        { label: "Playful", value: "playful" },
        { label: "Loving", value: "loving" },
        { label: "Special Needs", value: "special needs" },
      ],
      sorted_by: [
        { label: "All", value: null },
        { label: "Ready for Adoption", value: 1 },
        { label: "In Medication", value: 3 },
        { label: "In Rehabilitation", value: 2 },
        // { label: "Adopted", value: 4 },
      ],
      drawer,
      miniState,
      getAllAnimals,
      allAnimalData,
      specificAnimalId,
      SearchAnimalByName,
      categorizeByName,
      categorizeByAge,
      categorizeByWeight,
      categorizeByHeight,
      categorizeByYearRescued,
      drawerClick(e) {
        if (miniState.value) {
          miniState.value = false;
          e.stopPropagation();
        }
      },
      calculateAge,
      sorted,
      searchValue,
    };
  },
};
