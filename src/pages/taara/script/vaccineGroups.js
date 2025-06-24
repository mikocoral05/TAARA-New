import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import {
  vaccineGroupBasicSearch,
  getListOfMedicine,
  groupNameMedicine,
  updateMedicine,
  getGroupNameVaccine,
  groupNameVaccine,
  addMedicineGroupName,
  addVaccineGroupName,
} from 'src/composable/taaraComposable.js'

export default {
  setup() {
    const $q = useQuasar()
    let deletePropHolder = ref()
    let search = ref()
    let addOrUpdate = ref()
    let showUpdateItem = ref(false)
    let alertDelete = ref(false)
    let mobileViewDetails = ref(false)
    let mobileAdd = ref(false)
    let showSearch = ref(false)

    let updateRecordHolder = ref({
      group_id: null,
      group_name: null,
      no_of_vaccine: 0,
    })
    const updateItem = (props) => {
      showUpdateItem.value = true
      updateRecordHolder.value = { ...props }
      addOrUpdate.value = false
    }
    const resetUpdateRecord = () => {
      showUpdateItem.value = true
      addOrUpdate.value = true
      Object.keys(updateRecordHolder.value).forEach((key) => {
        // if (!key.includes("group_name")) {
        updateRecordHolder.value[key] = null
        // }
      })
      updateRecordHolder.value.no_of_vaccine = 0
    }

    let deleteVaccine = (payload) => {
      alertDelete.value = true
      deletePropHolder.value = payload
    }
    let confirmDelete = () => {
      // deleteMedicine(deletePropHolder.value);
    }
    const columns = [
      {
        name: 'group_name',
        align: 'center',
        label: 'Group Name',
        field: 'group_name',
        sortable: true,
      },

      {
        name: 'no_of_vaccine',
        align: 'center',
        label: 'No of Medicines',
        field: 'no_of_vaccine',
        sortable: true,
      },

      {
        name: 'action',
        align: 'center',
        label: 'Action',
        field: 'action',
        sortable: true,
      },
    ]
    const row = groupNameVaccine
    let showNotif = () => {
      $q.notify({
        message: 'Change Successfully!',
        color: 'purple',
        position: 'top-right',
        timeout: 1000,
        icon: 'sentiment_very_satisfied',
      })
    }
    function isDateExpired(dateString) {
      var expiryDate = new Date(dateString)
      var currentDate = new Date()
      return currentDate > expiryDate
    }
    let mobileGetInfo = (index) => {
      mobileViewDetails.value = true
      updateRecordHolder.value = { ...groupNameVaccine.value[index] }
    }
    onMounted(() => {
      getListOfMedicine()
      getGroupNameVaccine()
    })
    return {
      groupNameVaccine,
      mobileGetInfo,
      isDateExpired,
      showNotif,
      alertDelete,
      row,
      deleteVaccine,

      confirmDelete,
      addOrUpdate,
      updateRecordHolder,

      updateItem,
      columns,
      groupNameOptions: [
        { value: 'Antibiotics', label: 'Antibiotics' },
        { value: 'General Medicine', label: 'General Medicine' },
      ],

      search,
      vaccineGroupBasicSearch,
      showUpdateItem,
      groupNameMedicine,
      resetUpdateRecord,
      getListOfMedicine,
      updateMedicine,
      addMedicineGroupName,
      addVaccineGroupName,
      mobileViewDetails,
      mobileAdd,
      showSearch,
      vaccineGroupBasicSearch,
    }
  },
}
