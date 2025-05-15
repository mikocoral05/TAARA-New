import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import {
  //
  getGroupNameVitamin,
  groupNameVitamin,
  vitaminGroupBasicSearch,
  addVitaminGroupName,
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
      no_of_vitamin: 0,
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
      updateRecordHolder.value.no_of_vitamin = 0
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
        name: 'no_of_vitamin',
        align: 'center',
        label: 'No of Medicines',
        field: 'no_of_vitamin',
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
    const row = groupNameVitamin
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
      console.log(groupNameVitamin.value[index])
      updateRecordHolder.value = { ...groupNameVitamin.value[index] }
    }
    onMounted(() => {
      getGroupNameVitamin()
    })
    return {
      mobileGetInfo,
      groupNameVitamin,
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
      search,
      showUpdateItem,
      resetUpdateRecord,
      vitaminGroupBasicSearch,
      addVitaminGroupName,
      mobileViewDetails,
      mobileAdd,
      showSearch,
    }
  },
}
