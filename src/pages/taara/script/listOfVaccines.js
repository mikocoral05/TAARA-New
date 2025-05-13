import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import {
  getListOfVaccine,
  listOfVaccine,
  vaccineListBasicSearch,
  updateVaccine,
  getGroupNameVaccine,
  groupNameVaccine,
  addVaccine,
  deleteVaccine,
  exportVaccine,
} from "../../../composable/taaraComposable.js";

export default {
  setup() {
    const $q = useQuasar();
    let deletePropHolder = ref([]);
    let search = ref();
    let addOrUpdate = ref();
    let showUpdateItem = ref(false);
    let alertDelete = ref(false);
    let mobileViewDetails = ref(false);
    let mobileAdd = ref(false);
    let showSearch = ref(false);
    let groupName = ref("--Select Group--");
    let showAdd = ref(false);
    let showDeleteCheckBox = ref(false);
    let updateRecordHolder = ref({
      vaccine_id: null,
      vaccine_name: null,
      group_name: "--Select Group--",
      bought_date: null,
      expiry_date: null,
      vaccine_stocks_qty: null,
      vaccine_use_for: null,
    });
    const updateItem = (props) => {
      showUpdateItem.value = true;
      updateRecordHolder.value = { ...props };
      addOrUpdate.value = false;
    };
    const resetUpdateRecord = () => {
      if (window.innerWidth < 501) {
        mobileAdd.value = true;
        mobileViewDetails.value = null;
      } else {
        showUpdateItem.value = true;
        addOrUpdate.value = true;
      }
      Object.keys(updateRecordHolder.value).forEach((key) => {
        updateRecordHolder.value[key] = null;
      });
      let date = new Date();
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");

      updateRecordHolder.value.bought_date = year + "-" + month + "-" + day;
      updateRecordHolder.value.group_name = "--Select Group--";
    };
    let addVaccineButton = (payload) => {
      addVaccine(payload);
      if (window.innerWidth < 501) {
        mobileAdd.value = false;
        mobileViewDetails.value = false;
      } else {
        showUpdateItem.value = false;
      }
      updateRecordHolder.value.group_name = "--Select Group--";
    };
    let clickDeleteVaccine = (payload) => {
      deletePropHolder.value = [];
      alertDelete.value = true;
      deletePropHolder.value.push(payload);
    };
    let confirmDelete = () => {
      // if (window.innerWidth < 501) {
      //   mobileAdd.value = false;
      //   mobileViewDetails.value = false;
      // }
      deleteVaccine(deletePropHolder.value);
      deletePropHolder.value = [];
      showDeleteCheckBox.value = false;
    };
    const columns = [
      {
        name: "vaccine_id",
        align: "center",
        field: (row) => row.vaccine_id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "vaccine_name",
        align: "left",
        label: "Name",
        field: "vaccine_name",
        sortable: true,
      },
      {
        name: "group_name",
        align: "left",
        label: "Group Name",
        field: "group_name",
        sortable: true,
      },
      {
        name: "expiry_date",
        align: "center",
        label: "Expiry Date",
        field: "expiry_date",
        sortable: true,
      },
      {
        name: "vaccine_stocks_qty",
        align: "center",
        label: "Stocks in Qty",
        field: "vaccine_stocks_qty",
        sortable: true,
      },
      {
        name: "vaccine_use_for",
        align: "center",
        label: "Used for",
        field: "vaccine_use_for",
        sortable: true,
      },

      {
        name: "action",
        align: "center",
        label: "",
        field: "action",
        sortable: true,
      },
    ];
    const row = listOfVaccine;
    let showNotif = () => {
      $q.notify({
        message: "Change Successfully!",
        color: "purple",
        position: "top-right",
        timeout: 1000,
        icon: "sentiment_very_satisfied",
      });
    };
    function isDateExpired(dateString) {
      var expiryDate = new Date(dateString);
      var currentDate = new Date();
      return currentDate > expiryDate;
    }
    let mobileGetInfo = (vaccine_id) => {
      mobileViewDetails.value = true;
      let filterArray = listOfVaccine.value.filter((obj) => {
        return obj.vaccine_id === vaccine_id;
      });
      updateRecordHolder.value = filterArray[0];
    };
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const totalPages = computed(() =>
      Math.ceil(listOfVaccine.value.length / itemsPerPage.value)
    );

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return listOfVaccine.value.slice(start, end);
    });
    onMounted(() => {
      getGroupNameVaccine();
      getListOfVaccine();
    });
    return {
      addVaccineButton,
      currentPage,
      paginatedItems,
      totalPages,
      itemsPerPage,
      mobileGetInfo,
      listOfVaccine,
      isDateExpired,
      showNotif,
      alertDelete,
      row,
      clickDeleteVaccine,
      groupNameVaccine,
      confirmDelete,
      addOrUpdate,
      updateRecordHolder,
      updateItem,
      columns,
      addVaccine,
      search,
      vaccineListBasicSearch,
      showUpdateItem,
      resetUpdateRecord,
      updateVaccine,
      mobileViewDetails,
      mobileAdd,
      showSearch,
      exportVaccine,
      groupName,
      showAdd,
      showDeleteCheckBox,
      deletePropHolder,
    };
  },
};
