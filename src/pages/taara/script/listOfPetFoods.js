import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import {
  deletePetFood,
  petFoodBasicSearch,
  getFoodInventory,
  addPetFood,
  updatePetFood,
  foodInventory,
  exportPetsFoods,
} from 'src/composable/taaraComposable.js'
import { formatNumber } from 'src/composable/simpleComposable.js'

export default {
  setup() {
    const $q = useQuasar()
    let deletePropHolder = ref([])
    let search = ref()
    let addOrUpdate = ref()
    let showAdd = ref(false)
    let showUpdateItem = ref(false)
    let alertDelete = ref(false)
    let showDeleteCheckBox = ref(false)
    let mobileViewDetails = ref(false)
    let mobileAdd = ref(false)
    let showSearch = ref(false)
    let dateRange = ref({ from: '2020-04-17', to: '2020-05-10' })
    let today = new Date()
    let formatted_date = today.toISOString().split('T')[0]
    let petFoodDetails = ref({
      food_id: null,
      food_name: null,
      food_type: null,
      food_qty: null,
      food_qty_type: null,
      food_weight: null,
      weight_unit: null,
      food_weight_consume: null,
      consume_weight_unit: null,
      food_x_feed: null,
      food_range: {},
      food_cost: null,
      food_total_cost: null,
      bought_date: formatted_date,
    })
    let foodNameOptions = ref([])
    let FoodWillLast = ref(null)

    let calculateFoodDuration = (details) => {
      let quantity = Number(details.food_qty)
      let foodWeightPerSack = Number(details.food_weight) // This is in kg, g, or mg based on details.weight_unit
      let totalFoodWeight = quantity * foodWeightPerSack // Total weight in the same unit as foodWeightPerSack
      let useFoodWeight = Number(details.food_weight_consume) // This might be in mg, g, or kg

      if (useFoodWeight > 0) {
        // Convert useFoodWeight to the same unit as foodWeightPerSack for consistency
        if (
          details.weight_unit.toLowerCase() === 'kg' &&
          details.consume_weight_unit.toLowerCase() !== 'kg'
        ) {
          if (details.consume_weight_unit.toLowerCase() === 'g') {
            useFoodWeight = useFoodWeight / 1000 // convert g to kg
          } else if (details.consume_weight_unit.toLowerCase() === 'mg') {
            useFoodWeight = useFoodWeight / 1000000 // convert mg to kg
          }
        } else if (
          details.weight_unit.toLowerCase() === 'g' &&
          details.consume_weight_unit.toLowerCase() !== 'g'
        ) {
          if (details.consume_weight_unit.toLowerCase() === 'kg') {
            useFoodWeight = useFoodWeight * 1000 // convert kg to g
          } else if (details.consume_weight_unit.toLowerCase() === 'mg') {
            useFoodWeight = useFoodWeight / 1000 // convert mg to g
          }
        } else if (
          details.weight_unit.toLowerCase() === 'mg' &&
          details.consume_weight_unit.toLowerCase() !== 'mg'
        ) {
          if (details.consume_weight_unit.toLowerCase() === 'kg') {
            useFoodWeight = useFoodWeight * 1000000 // convert kg to mg
          } else if (details.consume_weight_unit.toLowerCase() === 'g') {
            useFoodWeight = useFoodWeight * 1000 // convert g to mg
          }
        }

        let timesAWeek = Number(details.food_x_feed)
        let totalFoodUsedPerWeek = timesAWeek * useFoodWeight // in the same unit as foodWeightPerSack
        let totalWeeks = totalFoodWeight / totalFoodUsedPerWeek
        let totalDays = Math.floor(totalWeeks * 7)
        let currentDate = new Date()
        let startDate = new Date(currentDate).toISOString().split('T')[0] // format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + totalDays - 1)
        let endDate = currentDate.toISOString().split('T')[0] // format as YYYY-MM-DD
        petFoodDetails.value.food_range = { from: startDate, to: endDate }
        FoodWillLast.value = totalDays
      }
    }

    let dateRangeToDays = (range) => {
      let dateObject = JSON.parse(range)
      // Use the current date and set the time to the start of the day
      let startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      let endDate = new Date(dateObject.to)

      // Calculate the difference between the two dates
      let difference = endDate - startDate

      // The difference is in milliseconds, so convert it to days
      let totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24))

      return totalDays > 1 ? totalDays + ' days' : totalDays + ' day'
    }

    const updateItem = (props) => {
      petFoodDetails.value = { ...props }
      showAdd.value = true
      addOrUpdate.value = false
    }
    const resetUpdateRecord = () => {
      addOrUpdate.value = true
      showAdd.value = true
      let excludedKeys = ['bought_date']
      Object.keys(petFoodDetails.value).forEach((key) => {
        if (!excludedKeys.includes(key)) petFoodDetails.value[key] = null
      })
    }

    let deleteFood = (payload) => {
      alertDelete.value = true
      deletePropHolder.value = []
      deletePropHolder.value.push(payload)
    }
    let confirmDelete = () => {
      // if (window.innerWidth < 501) {
      //   mobileAdd.value = false;
      //   mobileViewDetails.value = false;
      // }
      deletePetFood(deletePropHolder.value)
      deletePropHolder.value = []
      showDeleteCheckBox.value = false
    }
    const columns = [
      {
        name: 'food_id',
        required: true,
        label: 'ID',
        align: 'center',
        field: (row) => row.food_id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'food_name',
        align: 'center',
        label: 'Food Name',
        field: 'food_name',
        sortable: true,
      },
      {
        name: 'food_type',
        align: 'center',
        label: 'Item Type',
        field: 'food_type',
        sortable: true,
      },
      {
        name: 'food_qty',
        align: 'center',
        label: 'Qty',
        field: 'food_qty',
        sortable: true,
      },
      {
        name: 'food_qty_type',
        align: 'center',
        label: 'Qty Type',
        field: 'food_qty_type',
        sortable: true,
      },
      {
        name: 'food_cost',
        align: 'center',
        label: 'Unit Cost',
        field: 'food_cost',
        sortable: true,
      },
      {
        name: 'food_total_cost',
        align: 'center',
        label: 'Total Cost',
        field: 'food_total_cost',
        sortable: true,
      },
      {
        name: 'food_range',
        align: 'center',
        label: 'Supply Duration',
        field: 'food_range',
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
    const row = foodInventory
    let showNotif = () => {
      $q.notify({
        message: 'Change Successfully!',
        color: 'purple',
        position: 'top-right',
        timeout: 1000,
        icon: 'sentiment_very_satisfied',
      })
    }

    let mobileGetInfo = (food_id) => {
      mobileViewDetails.value = true
      let filterArray = foodInventory.value.filter((obj) => {
        return obj.food_id === food_id
      })
      petFoodDetails.value = filterArray[0]
    }
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const totalPages = computed(() => Math.ceil(foodInventory.value.length / itemsPerPage.value))

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return foodInventory.value.slice(start, end)
    })

    watch(
      () => [petFoodDetails.value.food_cost, petFoodDetails.value.food_qty],
      () => {
        petFoodDetails.value.food_total_cost =
          petFoodDetails.value.food_cost * petFoodDetails.value.food_qty
      },
    )
    watch(
      () => [
        petFoodDetails.value.food_qty,
        petFoodDetails.value.food_weight,
        petFoodDetails.value.food_weight_consume,
        petFoodDetails.value.weight_unit,
        petFoodDetails.value.food_x_feed,
        petFoodDetails.value.consume_weight_unit,
      ],
      (newValues) => {
        if (
          newValues.every((value, index) => {
            // Check if value is a number
            console.log(index)

            if (typeof value === 'number') {
              return value !== null && value > 0
            }
            // Check if value is a string
            else if (typeof value === 'string') {
              return value !== ''
            }
            // For any other type
            else {
              return value !== null
            }
          })
        ) {
          calculateFoodDuration(petFoodDetails.value)
        }
      },
    )

    onMounted(() => {
      getFoodInventory()
        .then((response) => {
          foodNameOptions.value = response.map((obj) => {
            return obj.food_name
          })
        })
        .catch((error) => {
          console.log(error)
        })
    })
    return {
      currentPage,
      paginatedItems,
      totalPages,
      itemsPerPage,
      mobileGetInfo,
      foodInventory,
      showNotif,
      alertDelete,
      row,
      deleteFood,

      confirmDelete,
      addOrUpdate,
      petFoodDetails,
      updatePetFood,

      updateItem,
      columns,
      addPetFood,

      sexOptions: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
      ],
      weightUnitOption: [
        { value: 'Kg', label: 'Kilogram (Kg)' },
        { value: 'g', label: 'Gram (g)' },
        { value: 'mg', label: 'Milogram (mg)' },
      ],
      timesAWeek: [
        { value: 7, label: 'Everyday' },
        { value: 6, label: '6x a week' },
        { value: 5, label: '5x a week' },
        { value: 4, label: '4x a week' },
        { value: 3, label: '3x a week' },
        { value: 2, label: '2x a week' },
        { value: 1, label: '1x a week' },
      ],
      itemType: ['Dog Food', 'Cat Food', 'For Everyone'],

      search,
      showUpdateItem,

      petFoodBasicSearch,
      exportPetsFoods,
      resetUpdateRecord,
      mobileViewDetails,
      mobileAdd,
      showSearch,
      deletePropHolder,
      showDeleteCheckBox,
      foodNameOptions,
      showAdd,
      calculateFoodDuration,
      dateRange,
      FoodWillLast,
      formatNumber,
      dateRangeToDays,
    }
  },
}
