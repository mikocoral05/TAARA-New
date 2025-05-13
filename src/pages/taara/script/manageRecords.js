import { ref, onMounted, watch } from "vue";
import BarChartsRescue from "src/components/BarChartsRescue.vue";
import {
  manageRecordBasicSearch,
  //new
  getAllAnimalsNotAdopted, // composable function
  getAllAnimalsAdopted, // composable function
  allAnimalsNotAdopted, // composable variable
  allAnimalsAdopted, // composable variable
  updateRehomedPets,
  addRehomedPets,
  deleteRehomedPets,
  exportRehomedPets,
  rehomedBasicSearch,
  //rescued stray
  getAllAnimalsStray,
  getAllAnimalsNotStray,
  allStrayAnimals,
  allNotStrayAnimals,
  addRescuedStrayAnimals,
  updateRescuedStrayAnimals,
  deleteRescuedStrayAnimal,
  exportRescuedStrayAnimals,
  rescuedStrayBasicSearch,
  //deceased
  getAllAnimalsDeceased,
  getAllAnimalsNotDeceased,
  deleteDeceasedAnimal,
  addDeceasedAnimals,
  allAnimalsNotDeceased,
  allAnimalsDeceased,
  deceasedBasicSearch,
  exportDeceasedAnimals,
  updateDeceasedAnimals,
  //surrendered animals
  getAllSurrenderedAnimals,
  getAllNotSurrenderedAnimals,
  allSurrenderedAnimals,
  allNotSurrenderedAnimals,
  addSurrenderAnimal,
  updateSurrenderedAnimal,
  deleteSurrenderedAnimal,
  exportSurrenderedAnimals,
  surrenderedBasicSearch,
  //kind donation
  getallInKindDonations,
  allInKindDonations,
  addInKindDonation,
  updateInKindDonation,
  deleteInKindDonation,
  exportInKindDonations,
  inKindDonationBasicSearch,
  //tracker
  getDonations,
  allDonations,
  addWalkIn,
  updateCashWalkInDonation,
  deleteWalkInDonation,
  exportDonationTracker,
  donationTrackerBasicSearch,
} from "../../../composable/taaraComposable.js";
import {
  dateToday,
  timeNow,
  calculateAge,
  formatNumber,
} from "src/composable/simpleComposable.js";
import surrenderedAnimals from "src/pages/managementRecords/script/surrenderedAnimals.js";
export default {
  components: {
    BarChartsRescue,
  },
  setup() {
    let isActive = ref(1);
    let searchUser = ref({ search: null });
    let deletePropHolder = ref([]);
    let deleteCheckBox = ref(false);
    let alertDelete = ref(false);
    let showUpdateItem = ref(false);
    let addOrUpdate = ref();
    let profileDetailsHolder = ref({
      account_identifier: null,
      age: null,
      email_address: null,
      last_name: null,
      first_name: null,
      middle_name: null,
      suffix: null,
      occupation: null,
      civil_status: null,
      birth_date: null,
      phone_number: null,
      password: null,
      brgy_name: null,
      street: null,
      province: null,
      city_municipality: null,
      date_archieved: null,
      date_created: null,
      image: null,
      image: null,
      position: null,
      username: null,
      password: null,
      emergency_contact_name: null,
      emergency_contact_number: null,
      emergency_contact_relationship: null,
    });
    let updateRecordHolder = ref({});
    const updateItem = (props) => {
      showUpdateItem.value = true;
      updateRecordHolder.value = { ...props };
      addOrUpdate.value = false;
      console.log(updateRecordHolder.value);
    };
    const resetUpdateRecord = () => {
      showUpdateItem.value = true;
      addOrUpdate.value = true;
      updateRecordHolder.value = {};
    };

    const addNewRecord = (based) => {
      if (based == 1) {
        addRehomedPets(updateRecordHolder.value);
      } else if (based == 2) {
        addRescuedStrayAnimals(updateRecordHolder.value);
      } else if (based == 3) {
        addDeceasedAnimals(updateRecordHolder.value);
      } else if (based == 4) {
        addSurrenderAnimal(updateRecordHolder.value);
      } else if (based == 5) {
        addInKindDonation(updateRecordHolder.value);
      } else if (based == 6) {
        addWalkIn(updateRecordHolder.value);
      }
      deletePropHolder.value = [];
      showUpdateItem.value = false;
    };
    const updateRecord = (based) => {
      if (based == 1) {
        updateRehomedPets(updateRecordHolder.value);
      } else if (based == 2) {
        updateRescuedStrayAnimals(updateRecordHolder.value);
      } else if (based == 3) {
        updateDeceasedAnimals(updateRecordHolder.value);
      } else if (based == 4) {
        updateSurrenderedAnimal(updateRecordHolder.value);
      } else if (based == 5) {
        updateInKindDonation(updateRecordHolder.value);
      } else if (based == 6) {
        updateCashWalkInDonation(updateRecordHolder.value);
      }
      showUpdateItem.value = false;
    };
    const deleteBtn = (id) => {
      deletePropHolder.value = [];
      deletePropHolder.value.push(id);
      alertDelete.value = true;
    };
    const deleteRecord = (based) => {
      let filterData = [];
      if (based == 1) {
        filterData = allAnimalsAdopted.value;
      } else if (based == 2) {
        filterData = allStrayAnimals.value;
      } else if (based == 3) {
        filterData = allAnimalsDeceased.value;
      } else if (based == 4) {
        filterData = allSurrenderedAnimals.value;
      } else if (based == 5) {
        filterData = [];
      } else if (based == 6) {
        filterData = [];
      }
      let returnAnimalChoices = filterData
        .filter((obj) => {
          return deletePropHolder.value.includes(obj.id);
        })
        .map((obj) => {
          return {
            animal_id: obj.animal_id,
            animal_name: obj.animal_name,
            animal_image: obj.animal_image,
          };
        });

      if (based == 1) {
        deleteRehomedPets(deletePropHolder.value, returnAnimalChoices);
      } else if (based == 2) {
        deleteRescuedStrayAnimal(deletePropHolder.value, returnAnimalChoices);
      } else if (based == 3) {
        deleteDeceasedAnimal(deletePropHolder.value, returnAnimalChoices);
      } else if (based == 4) {
        deleteSurrenderedAnimal(deletePropHolder.value, returnAnimalChoices);
      } else if (based == 5) {
        deleteInKindDonation(deletePropHolder.value);
      } else if (based == 6) {
        deleteWalkInDonation(deletePropHolder.value);
      }
      showUpdateItem.value = false;
      deletePropHolder.value = [];
      deleteCheckBox.value = false;
    };
    let fetchData = (based) => {
      deleteCheckBox.value = false;
      isActive.value = based;
      deletePropHolder.value = [];
      if (based == 2) {
        getAllAnimalsStray();
        getAllAnimalsNotStray();
      } else if (based == 3) {
        getAllAnimalsDeceased();
        getAllAnimalsNotDeceased();
      } else if (based == 4) {
        getAllSurrenderedAnimals();
        getAllNotSurrenderedAnimals();
      } else if (based == 5) {
        getallInKindDonations();
      } else if (based == 6) {
        getDonations();
      }
    };
    let exportData = (based) => {
      if (based == 1) {
        exportRehomedPets();
      } else if (based == 2) {
        exportRescuedStrayAnimals();
      } else if (based == 3) {
        exportDeceasedAnimals();
      } else if (based == 4) {
        exportSurrenderedAnimals();
      } else if (based == 5) {
        exportInKindDonations();
      } else if (based == 6) {
        exportDonationTracker();
      }
    };
    const columnsRehomed = [
      {
        name: "id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "animal_name",
        align: "center",
        label: "Animal Name",
        field: "animal_name",
        sortable: true,
      },
      {
        name: "adopter_name",
        align: "center",
        label: "Pet Owner Name",
        field: "adopter_name",
        sortable: true,
      },
      {
        name: "adopter_city_municipality",
        align: "center",
        label: "Municipality",
        field: "adopter_city_municipality",
        sortable: true,
      },
      // {
      //   name: "adopter_sex",
      //   align: "center",
      //   label: "Sex",
      //   field: "adopter_sex",
      //   sortable: true,
      // },
      // {
      //   name: "adopter_birth_date",
      //   align: "center",
      //   label: "Birthdate",
      //   field: "adopter_birth_date",
      //   sortable: true,
      // },

      {
        name: "adopter_phone_number",
        align: "center",
        label: "Phone Number",
        field: "adopter_phone_number",
        sortable: true,
      },
      {
        name: "date_adopted",
        align: "center",
        label: "Date",
        field: "date_adopted",
        sortable: true,
      },
      {
        name: "time_adopted",
        align: "center",
        label: "Time",
        field: "time_adopted",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const rowRehomed = allAnimalsAdopted;
    const columnsRescued = [
      {
        name: "id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "animal_name",
        align: "center",
        label: "Animal Name",
        field: "animal_name",
        sortable: true,
      },
      {
        name: "reporter_name",
        align: "center",
        label: "Reported By",
        field: "reporter_name",
        sortable: true,
      },
      {
        name: "reporter_municipality",
        align: "center",
        label: "Municipality",
        field: "reporter_municipality",
        sortable: true,
      },
      // {
      //   name: "reporter_sex",
      //   align: "center",
      //   label: "Sex",
      //   field: "reporter_sex",
      //   sortable: true,
      // },
      // {
      //   name: "reporter_birth_date",
      //   align: "center",
      //   label: "Age",
      //   field: "reporter_birth_date",
      //   sortable: true,
      // },

      {
        name: "reporter_phone_number",
        align: "center",
        label: "Phone Number",
        field: "reporter_phone_number",
        sortable: true,
      },

      {
        name: "rescue_date",
        align: "center",
        label: "Date",
        field: "rescue_date",
        sortable: true,
      },

      {
        name: "rescue_time",
        align: "center",
        label: "Time",
        field: "rescue_time",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const columnsDeceased = [
      {
        name: "id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "animal_name",
        align: "center",
        label: "Animal Name",
        field: "animal_name",
        sortable: true,
      },
      {
        name: "breed",
        align: "center",
        label: "Breed",
        field: "breed",
        sortable: true,
      },
      {
        name: "age",
        align: "center",
        label: "Age",
        field: "age",
        sortable: true,
      },
      // {
      //   name: "size",
      //   align: "center",
      //   label: "Size",
      //   field: "size",
      //   sortable: true,
      // },

      {
        name: "sex",
        align: "center",
        label: "Gender",
        field: "sex",
        sortable: true,
      },
      // {
      //   name: "fur_color",
      //   align: "center",
      //   label: "Color",
      //   field: "fur_color",
      //   sortable: true,
      // },
      {
        name: "deceased_date",
        align: "center",
        label: "Date",
        field: "deceased_date",
        sortable: true,
      },
      {
        name: "deceased_time",
        align: "center",
        label: "Time",
        field: "deceased_time",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const rowDeceased = allAnimalsDeceased;
    const rowRescued = allStrayAnimals;
    const columnsSurrendered = [
      {
        name: "id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "animal_name",
        align: "center",
        label: "Animal Name",
        field: "animal_name",
        sortable: true,
      },
      {
        name: "surrenderer_name",
        align: "center",
        label: "Pet Owner Name",
        field: "surrenderer_name",
        sortable: true,
      },
      {
        name: "surrenderer_city_municipality",
        align: "center",
        label: "Municipality",
        field: "surrenderer_city_municipality",
        sortable: true,
      },
      // {
      //   name: "surrenderer_sex",
      //   align: "center",
      //   label: "Sex",
      //   field: "surrenderer_sex",
      //   sortable: true,
      // },
      // {
      //   name: "surrenderer_birth_date",
      //   align: "center",
      //   label: "Age",
      //   field: "surrenderer_birth_date",
      //   sortable: true,
      // },
      {
        name: "surrenderer_phone_number",
        align: "center",
        label: "Phone Number",
        field: "surrenderer_phone_number",
        sortable: true,
      },
      {
        name: "surrender_date",
        align: "center",
        label: "Date",
        field: "surrender_date",
        sortable: true,
      },
      {
        name: "surrender_time",
        align: "center",
        label: "Time",
        field: "surrender_time",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const rowSurrendered = allSurrenderedAnimals;
    const columnsKindDonation = [
      {
        name: "donation_in_kind_id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.donation_in_kind_id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "Name",
        field: "name",
        sortable: true,
      },
      {
        name: "donation_type",
        align: "center",
        label: "Donation Type",
        field: "donation_type",
        sortable: true,
      },
      {
        name: "qty",
        align: "center",
        label: "Qty",
        field: "qty",
        sortable: true,
      },
      {
        name: "qty_type",
        align: "center",
        label: "Qty Type",
        field: "qty_type",
        sortable: true,
      },
      {
        name: "address",
        align: "center",
        label: "Address",
        field: "address",
        sortable: true,
      },
      {
        name: "phone_number",
        align: "center",
        label: "Phone Number",
        field: "phone_number",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const rowKindDonation = allInKindDonations;
    const columnsTracker = [
      {
        name: "donation_id",
        required: true,
        label: "ID",
        align: "center",
        field: (row) => row.donation_id,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "donation_amount",
        align: "center",
        label: "Donation Amount",
        field: "donation_amount",
        sortable: true,
      },
      {
        name: "walk_in_name",
        align: "center",
        label: "Donor Name",
        field: "walk_in_name",
        sortable: true,
      },
      {
        name: "walk_in_address",
        align: "center",
        label: "Donor Address",
        field: "walk_in_address",
        sortable: true,
      },
      {
        name: "phone_number",
        align: "center",
        label: "Phone Number",
        field: "phone_number",
        sortable: true,
      },
      {
        name: "donation_date",
        align: "center",
        label: "Donation Date",
        field: "donation_date",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ];
    const rowTracker = allDonations;

    onMounted(() => {
      //new
      getAllAnimalsAdopted();
      getAllAnimalsNotAdopted();
    });
    watch(searchUser.value, (newVal) => {
      manageRecordBasicSearch(searchUser.value.search, isActive.value);
    });

    return {
      columnsRehomed,
      rowRehomed,
      columnsRescued,
      rowRescued,
      columnsDeceased,
      rowDeceased,
      columnsSurrendered,
      rowSurrendered,
      rowKindDonation,
      columnsKindDonation,
      columnsTracker,
      rowTracker,
      resetUpdateRecord,
      profileDetailsHolder,
      civilStatusOption: ["Single", "Married", "Divorced"],
      sexOption: ["Male", "Female"],
      isActive,
      searchUser,
      //new
      updateRehomedPets,
      addRehomedPets,
      deleteRehomedPets,
      exportRehomedPets,
      rehomedBasicSearch,
      fetchData,
      calculateAge,
      formatNumber,
      exportData,
      deletePropHolder,
      deleteCheckBox,
      updateItem,
      showUpdateItem,
      showUpdateItem,
      addOrUpdate,
      updateRecordHolder,
      addNewRecord,
      allAnimalsNotAdopted,
      allNotStrayAnimals,
      allAnimalsNotDeceased,
      getAllNotSurrenderedAnimals,
      allNotSurrenderedAnimals,
      updateRecord,
      deleteRecord,
      deleteBtn,
      alertDelete,
    };
  },
};
