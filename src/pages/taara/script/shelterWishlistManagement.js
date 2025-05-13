import { ref, onMounted, watch, computed } from "vue";
import { useQuasar } from "quasar";
import {
  getAllAnimalsNotAdopted, // composable function
  getAllAnimalsAdopted, // composable function
  allAnimalsNotAdopted, // composable variable
  allAnimalsAdopted, // composable variable
  updateRehomedPets,
  addRehomedPets,
  deleteRehomedPets,
  exportRehomedPets,
  rehomedBasicSearch,
  getWishlistFood,
  getWishlistMedicine,
  getWishlistSupplies,
  wishlistFoodData,
  wishlistMedicineData,
  wishlistSuppliesData,
  wishlistBasicSearch,
  updateWishlist,
  addWishlist,
  exportWishlist,
} from "../../../composable/taaraComposable.js";

export default {
  setup() {
    const $q = useQuasar();
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // pad with zero
    let day = ("0" + date.getDate()).slice(-2); // pad with zero
    let formattedDate = `${year}-${month}-${day}`;
    let hours = ("0" + date.getHours()).slice(-2); // pad with zero
    let minutes = ("0" + date.getMinutes()).slice(-2); // pad with zero
    let seconds = ("0" + date.getSeconds()).slice(-2); // pad with zero
    let formattedTime = `${hours}:${minutes}:${seconds}`;
    let deletePropHolder = ref({});
    let search = ref();
    let addOrUpdate = ref();
    let showUpdateItem = ref(false);
    let alertDelete = ref(false);
    let mobileViewDetails = ref(false);
    let mobileAdd = ref(false);
    let showSearch = ref(false);
    let tab = ref("medicine");
    let choicesRef = ref(0);

    let updateRecordHolder = ref({
      params: {},
      name: null,
      change: null,
    });

    const updateItem = (params, name, change) => {
      if (typeof name === "number") {
        if (name == 0) {
          name = "medicine";
        } else if (name == 1) {
          name = "food";
        } else {
          name = "supplies";
        }
      }
      let copy = { ...params };

      showUpdateItem.value = true;
      updateRecordHolder.value = { params: copy, name, change };
      addOrUpdate.value = false;
    };
    const updateBtn = () => {
      const { params, name, change } = updateRecordHolder.value;
      updateWishlist(params, name, change);
    };
    const resetUpdateRecord = () => {
      if (window.innerWidth < 501) {
        mobileAdd.value = true;
        mobileViewDetails.value = null;
      } else {
        showUpdateItem.value = true;
        addOrUpdate.value = true;
      }
      Object.keys(updateRecordHolder.value.params).forEach((key) => {
        updateRecordHolder.value.params[key] = null;
      });
    };

    let deleteWishlist = (params, name, change) => {
      if (typeof name === "number") {
        if (name == 0) {
          name = "medicine";
        } else if (name == 1) {
          name = "food";
        } else {
          name = "supplies";
        }
      }
      alertDelete.value = true;
      deletePropHolder.value = { params, name, change };
    };
    let confirmDelete = () => {
      const { params, name, change } = deletePropHolder.value;
      updateWishlist(params, name, change);
      if (window.innerWidth < 501) {
        mobileViewDetails.value = false;
        mobileAdd.value = false;
      }
    };
    let addWishlistBtn = (tab) => {
      for (let key in updateRecordHolder.value.params) {
        if (updateRecordHolder.value.params[key] === null) {
          delete updateRecordHolder.value.params[key];
        }
      }
      if (typeof tab === "number") {
        if (tab == 0) {
          tab = "medicine";
        } else if (tab == 1) {
          tab = "food";
        } else {
          tab = "supplies";
        }
      }

      addWishlist(updateRecordHolder.value.params, tab);
      mobileViewDetails.value = false;
      mobileAdd.value = false;
      showUpdateItem.value = false;
    };
    let showNotif = () => {
      $q.notify({
        message: "Change Successfully!",
        color: "purple",
        position: "top-right",
        timeout: 1000,
        icon: "sentiment_very_satisfied",
      });
    };
    let mobileGetInfo = (index, choicesRef) => {
      mobileViewDetails.value = true;
      let filterArray;
      if (choicesRef == 0) {
        filterArray = wishlistMedicineData.value.filter((obj) => {
          return obj.wishlist_medicine_id === index.wishlist_medicine_id;
        });
      } else if (choicesRef == 1) {
        filterArray = wishlistFoodData.value.filter((obj) => {
          return obj.wishlist_food_id === index.wishlist_food_id;
        });
      } else {
        filterArray = wishlistSuppliesData.value.filter((obj) => {
          return obj.wishlist_supplies_id === index.wishlist_supplies_id;
        });
      }

      updateRecordHolder.value.params = filterArray[0];
    };
    let updateWishlistBtn = (params, name, change, enable_disable) => {
      if (typeof name === "number") {
        if (name == 0) {
          name = "medicine";
        } else if (name == 1) {
          name = "food";
        } else {
          name = "supplies";
        }
      }
      if (enable_disable != null) {
        params.highlight_important = params.highlight_important === 0 ? 1 : 0;
      }
      updateWishlist(params, name, change);
    };
    const columnsMedicine = [
      {
        name: "wishlist_medicine_id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.wishlist_medicine_id,
        format: (val) => `${val}`,
        sortable: true,
        style: "width: 160px",
      },
      {
        name: "wishlist_medicine_name",
        align: "center",
        label: "Medicine name",
        field: "wishlist_medicine_name",
        sortable: true,
      },

      {
        name: "action",
        align: "center",
        label: "",
        field: "action",
        sortable: true,
        style: "width: 300px;min-width:130px",
      },
    ];
    const columnsFood = [
      {
        name: "wishlist_food_id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.wishlist_food_id,
        format: (val) => `${val}`,
        sortable: true,
        style: "width: 160px",
      },
      {
        name: "wishlist_food_name",
        align: "center",
        label: "Medicine name",
        field: "wishlist_food_name",
        sortable: true,
      },

      {
        name: "action",
        align: "center",
        label: "",
        field: "action",
        sortable: true,
        style: "width: 300px;min-width:130px",
      },
    ];
    const columnsSupplies = [
      {
        name: "wishlist_supplies_id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.wishlist_supplies_id,
        format: (val) => `${val}`,
        sortable: true,
        style: "width: 160px",
      },
      {
        name: "wishlist_supplies_name",
        align: "center",
        label: "Supply name",
        field: "wishlist_supplies_name",
        sortable: true,
      },

      {
        name: "action",
        align: "center",
        label: "",
        field: "action",
        sortable: true,
        style: "width: 300px;min-width:130px",
      },
    ];
    let columns = ref();
    let row = ref();
    let addButtonLabel = (tab) => {
      if (tab == "medicine" || tab == 0) {
        return "Add Medicine";
      } else if (tab == "food" || tab == 1) {
        return "Add Food";
      } else {
        return "Add Supply";
      }
    };
    watch(
      () => updateRecordHolder.value.animal_id,
      (newVal, oldVal) => {
        let filterArray = allAnimalsNotAdopted.value.filter((obj) => {
          return obj.animal_id === newVal;
        });
        if (filterArray.length > 0) {
          updateRecordHolder.value.animal_name = filterArray[0].animal_name;
          updateRecordHolder.value.animal_image = filterArray[0].animal_image;
          updateRecordHolder.value.date_adopted = formattedDate;
          updateRecordHolder.value.time_adopted = formattedTime;
        }
      }
    );

    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const totalPages = computed(() => {
      let adjustedTotalItems = ref();
      if (choicesRef.value == 0) {
        adjustedTotalItems.value = wishlistMedicineData.value.length;
      } else if (choicesRef.value == 1) {
        adjustedTotalItems.value = wishlistFoodData.value.length;
      } else {
        adjustedTotalItems.value = wishlistSuppliesData.value.length;
      }
      return Math.ceil(adjustedTotalItems.value / itemsPerPage.value);
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      let items = ref([]);
      if (choicesRef.value == 0) {
        items.value = wishlistMedicineData.value;
      } else if (choicesRef.value == 1) {
        items.value = wishlistFoodData.value;
      } else {
        items.value = wishlistSuppliesData.value;
      }
      return items.value.slice(start, end);
    });
    onMounted(() => {
      getWishlistFood();
      getWishlistMedicine();
      getWishlistSupplies();
      getAllAnimalsAdopted();
      getAllAnimalsNotAdopted();
    });
    return {
      columnsMedicine,
      columnsFood,
      columnsSupplies,
      columns,
      tab,
      currentPage,
      paginatedItems,
      totalPages,
      itemsPerPage,
      mobileGetInfo,
      showNotif,
      alertDelete,
      row,
      deleteWishlist,
      allAnimalsAdopted,
      allAnimalsNotAdopted,
      deleteRehomedPets,
      confirmDelete,
      addOrUpdate,
      updateRecordHolder,
      addRehomedPets,
      updateItem,
      columns,
      updateRehomedPets,
      highlightOptions: [
        { value: 1, label: "Yes" },
        { value: 0, label: "No" },
      ],
      choices: [
        { value: 0, label: "List of Medicine Wishlist" },
        { value: 1, label: "List of Foods Wishlist" },
        { value: 2, label: "List of Supplies Wishlist" },
      ],
      choicesRef,
      search,
      showUpdateItem,
      exportRehomedPets,
      resetUpdateRecord,
      rehomedBasicSearch,
      mobileViewDetails,
      mobileAdd,
      showSearch,
      wishlistFoodData,
      wishlistMedicineData,
      wishlistSuppliesData,
      addButtonLabel,
      wishlistBasicSearch,
      updateWishlistBtn,
      updateBtn,
      addWishlist,
      addWishlistBtn,
      exportWishlist,
    };
  },
};
