import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import {
  addMedicine,
  medicineListBasicSearch,
  getListOfMedicine,
  updateMedicine,
  deleteMedicine,
  getGroupName,
  listOfMedicine,
  groupNameMedicine,
  exportMedicine,
} from 'src/composable/taaraComposable.js'

export default {
  setup() {
    const $q = useQuasar()
    let deletePropHolder = ref([])
    let search = ref()
    let addOrUpdate = ref()
    let showUpdateItem = ref(false)
    let alertDelete = ref(false)
    let mobileViewDetails = ref(false)
    let mobileAdd = ref(false)
    let showSearch = ref(false)
    let showAdd = ref(false)
    let showDeleteCheckBox = ref(false)
    let groupName = ref('--Select Group--')
    let updateRecordHolder = ref({
      medicine_id: null,
      medicine_name: null,
      group_name: '--Select Group--',
      bought_date: null,
      expiry_date: null,
      medicine_stocks_qty: null,
      medicine_use_for: null,
    })
    const updateItem = (props) => {
      showUpdateItem.value = true
      updateRecordHolder.value = { ...props }
      addOrUpdate.value = false
    }
    const resetUpdateRecord = () => {
      if (window.innerWidth < 501) {
        mobileAdd.value = true
        mobileViewDetails.value = null
      } else {
        showUpdateItem.value = true
        addOrUpdate.value = true
      }
      Object.keys(updateRecordHolder.value).forEach((key) => {
        if (!key.includes('group_name')) {
          updateRecordHolder.value[key] = null
        }
        updateRecordHolder.value.group_name = '--Select Group--'
      })
      let date = new Date()
      let year = date.getFullYear()
      let month = (1 + date.getMonth()).toString().padStart(2, '0')
      let day = date.getDate().toString().padStart(2, '0')

      updateRecordHolder.value.bought_date = year + '-' + month + '-' + day
    }

    let clickDeleteMedicine = (payload) => {
      deletePropHolder.value = []
      alertDelete.value = true
      deletePropHolder.value.push(payload)
    }
    let confirmDelete = () => {
      // if (window.innerWidth < 501) {
      //   mobileAdd.value = false;
      //   mobileViewDetails.value = false;
      // }
      deleteMedicine(deletePropHolder.value)
      deletePropHolder.value = []
      showDeleteCheckBox.value = false
    }
    let addMedicineButton = (payload) => {
      addMedicine(payload)
      if (window.innerWidth < 501) {
        mobileAdd.value = false
        mobileViewDetails.value = false
      } else {
        showUpdateItem.value = false
      }
      updateRecordHolder.value.group_name = '--Select Group--'
    }
    const columns = [
      {
        name: 'medicine_id',
        align: 'center',
        field: (row) => row.animal_id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'medicine_name',
        align: 'left',
        label: 'Name',
        field: 'medicine_name',
        sortable: true,
      },
      {
        name: 'group_name',
        align: 'left',
        label: 'Group Name',
        field: 'group_name',
        sortable: true,
      },
      {
        name: 'expiry_date',
        align: 'center',
        label: 'Expiry Date',
        field: 'expiry_date',
        sortable: true,
      },
      {
        name: 'medicine_stocks_qty',
        align: 'center',
        label: 'Stocks in Qty',
        field: 'medicine_stocks_qty',
        sortable: true,
      },
      {
        name: 'medicine_use_for',
        align: 'center',
        label: 'Used for',
        field: 'medicine_use_for',
        sortable: true,
      },

      {
        name: 'action',
        align: 'center',
        label: '',
        field: 'action',
        sortable: true,
      },
    ]
    const row = listOfMedicine
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
    let mobileGetInfo = (medicine_id) => {
      mobileViewDetails.value = true
      let filterArray = listOfMedicine.value.filter((obj) => {
        return obj.medicine_id === medicine_id
      })
      updateRecordHolder.value = filterArray[0]
    }
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const totalPages = computed(() => Math.ceil(listOfMedicine.value.length / itemsPerPage.value))

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return listOfMedicine.value.slice(start, end)
    })
    onMounted(() => {
      getListOfMedicine()
      getGroupName()
    })
    return {
      groupNameMedicine,
      groupName,
      addMedicineButton,
      currentPage,
      paginatedItems,
      totalPages,
      itemsPerPage,
      mobileGetInfo,
      isDateExpired,
      showNotif,
      alertDelete,
      row,
      clickDeleteMedicine,
      confirmDelete,
      addOrUpdate,
      updateRecordHolder,
      updateItem,
      columns,
      search,
      medicineListBasicSearch,
      showUpdateItem,
      resetUpdateRecord,
      getListOfMedicine,
      addMedicine,
      exportMedicine,
      updateMedicine,
      mobileViewDetails,
      mobileAdd,
      showSearch,
      listOfMedicine,
      showAdd,
      showDeleteCheckBox,
      deletePropHolder,
    }
  },
}
