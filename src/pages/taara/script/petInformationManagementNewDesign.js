import { ref, onMounted, watch } from 'vue'
// import { useCounterStore } from "src/stores/example-store";
import {
  allAnimalDataManagement,
  getAllAnimalsManagement,
  addNewAnimal,
  SearchAnimalByNameManagement,
  allAnimalManagementBackUp,
  filterAnimalByState,
  specificAnimalImage,
  getSpecificAnimalImage,
  updateSpecificAnimal,
  deleteAnimal,
  exportSpecificAnimal,
  getAnimalSchedule,
  AnimalScheduleDataMedication,
  AnimalScheduleDataCheckUp,
  deleteScheduleAnimal,
  updateScheduleAnimal,
  addNewScheduleMedicationOrCheckUp,
} from 'src/composable/taaraComposable'
import VueScrollTo from 'vue-scrollto'
import { resizeImage, getAge } from 'src/composable/simpleComposable'
export default {
  component: {},
  setup() {
    // const userStore = useCounterStore();
    const miniState = ref(false)
    const animals = ref(true)

    let AddORUpdateOrDelete = ref(0)
    let addNewItem = ref(false)
    let followUpOrMedication = ref(true)
    let justRef = ref('blacky.jpg')
    let addAnimal = ref(false)
    let mobileAdd = ref(false)
    let isActive = ref(0)
    let showAnimal = ref(false)
    let showAnimalImage = ref(false)
    let addOrEdit = ref(null)
    let showDeleteBox = ref(false)
    let addAnimalOrMedicine = ref()
    let toggleLeftNavi = ref(0)
    let alterData = ref(0)
    let deletePropHolder = ref([])
    let images = ref([])
    let addImages = ref([])
    const physical = ref(null)
    const behaviour = ref(null)
    const story = ref(null)
    const health = ref(false)
    const favorite = ref(false)
    let alertDelete = ref(false)
    let dialogImg = ref(false)
    let imgExist = ref(true)
    let imgError = ref(false)
    let animalInfoTab = ref(0)
    let animalIdBackUp = ref()
    let animalDetails = ref({})
    let search = ref({
      animal_name: null,
      animal_type: 'Any',
      breed: 'Any',
      age: 'Any',
      sex: 'Any',
      size: 'Any',
      fur_color: 'Any',
      good_with: 'Any',
      behaviour: 'Any',
    })
    let scheduleDetails = ref({
      animal_id: null,
      schedule_date: null,
      medicine_used: null,
      next_schedule: null,
      veterinarian: null,
      status: null,
      medication_or_check_up: 1,
    })
    let removeImage = (imgData) => {
      imgExist.value = false
      images.value.forEach((obj) => {
        if (obj.id == imgData.id) {
          obj.animal_image = null
        }
      })
    }

    let cancelChangeInImage = () => {
      imgExist.value = true
      getSpecificAnimalImage(animalIdBackUp.value)
        .then((response) => {
          images.value = response
        })
        .catch((error) => {
          console.log(error)
        })
    }
    let addAnimalTriggerBTn = () => {
      addOrEdit.value = true
      showAnimal.value = true
      alterData.value = 1
      showAnimalImage.value = true
      addAnimalOrMedicine.value = true
      images.value = []
      addImages.value = []
      if (isActive.value != 0) {
        animalDetails.value.current_state = isActive.value
      }
      Object.keys(animalDetails.value).forEach((key) => {
        if (isActive.value != 0 && key != 'current_state') {
          animalDetails.value[key] = null
        } else if (isActive.value == 0) {
          animalDetails.value[key] = null
        }
      })
    }
    let addAnimalFinaleBTn = (animalDetails, images) => {
      if (images.length == 5) {
        animalDetails.animal_image = images[0]
        addNewAnimal(animalDetails, images)
        showAnimal.value = false
        imgError.value = false
      } else {
        imgError.value = true
      }
    }
    let getFavorites = (favorite) => {
      if (favorite == null) {
        return ['N/a']
      } else {
        return favorite.includes(',') ? favorite.split(',') : [favorite]
      }
    }
    let confirmDelete = (based) => {
      if (based == true) {
        deleteAnimal(deletePropHolder.value)
        showAnimal.value = false
        deletePropHolder.value = []
        showDeleteBox.value = false
      } else {
        deleteScheduleAnimal(deletePropHolder.value)
      }
    }
    let filterAdvanceSearch = ref(false)

    let toggleBtn = () => {
      showAnimalImage.value = !showAnimalImage.value
    }
    let scrollToDiv = (goTo) => {
      if (goTo == 1) {
        VueScrollTo.scrollTo(physical.value, 500, { offset: -130 })
      } else if (goTo == 2) {
        VueScrollTo.scrollTo(behaviour.value, 500, { offset: -130 })
      } else if (goTo == 3) {
        VueScrollTo.scrollTo(story.value, 500, { offset: -130 })
      } else if (goTo == 4) {
        VueScrollTo.scrollTo(health.value, 500, { offset: -130 })
      } else if (goTo == 5) {
        VueScrollTo.scrollTo(favorite.value, 500, { offset: -130 })
      }
      toggleLeftNavi.value = goTo
    }

    let viewAnimal = (data) => {
      animalIdBackUp.value = data.animal_id
      deletePropHolder.value.push(data.animal_id)
      showAnimal.value = true
      showAnimalImage.value = true
      addOrEdit.value = false
      getAnimalSchedule(animalIdBackUp.value)

      getSpecificAnimalImage(data.animal_id)
        .then((response) => {
          images.value = response
        })
        .catch((error) => {
          console.log(error)
        })
      animalDetails.value = { ...data }
    }
    const pickFile = () => {
      document.getElementById('file').click()
    }
    const resetScheduleDetails = () => {
      addNewItem.value = true
      AddORUpdateOrDelete.value = 1
      addAnimalOrMedicine.value = false
      let excludedKeys = ['animal_id', 'medication_or_check_up']
      Object.keys(scheduleDetails.value).forEach((key) => {
        if (!excludedKeys.includes(key)) scheduleDetails.value[key] = null
      })
      scheduleDetails.value.animal_id = animalIdBackUp.value
    }
    let mobileShowMedSched = () => {
      if (window.innerWidth <= 501) {
        followUpOrMedication.value = true
      } else {
        followUpOrMedication.value = true
      }
    }
    let mobileShowFollCheckUp = () => {
      if (window.innerWidth <= 501) {
        followUpOrMedication.value = false
        scheduleDetails.value.medication_or_check_up = 2
      } else {
        scheduleDetails.value.medication_or_check_up = 2
        followUpOrMedication.value = false
      }
    }
    const updateItem = (props) => {
      addNewItem.value = true
      scheduleDetails.value = { ...props }
      AddORUpdateOrDelete.value = 2
    }
    let deleteSchedule = (payload) => {
      alertDelete.value = true
      addAnimalOrMedicine.value = false
      deletePropHolder.value = payload
    }

    const handleFileUpload = (event, imageId, base) => {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl, fileName }) => {
              if (base == 'changeImage') {
                images.value.map((obj) => {
                  if (obj.id == imageId) {
                    obj.animal_image = dataUrl
                  }
                })
              } else if (base == 'addImage') {
                if (addImages.value.length <= 4) {
                  addImages.value.push(dataUrl)
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }

    const columns = [
      {
        name: 'animal_id',
        align: 'center',
        label: 'Id',
        field: 'animal_id',
        sortable: true,
      },

      {
        name: 'animal_image',
        align: 'center',
        label: '',
        field: 'animal_image',
        sortable: true,
      },

      {
        name: 'animal_name',
        align: 'center',
        label: 'Name',
        field: 'animal_name',
        sortable: true,
      },
      {
        name: 'age',
        align: 'center',
        label: 'Age',
        field: 'age',
        sortable: true,
      },
      {
        name: 'weight',
        align: 'center',
        label: 'Weight',
        field: 'weight',
        sortable: true,
      },
      {
        name: 'height',
        align: 'center',
        label: 'Height',
        field: 'height',
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
    const row = allAnimalDataManagement
    const medicineColumns = [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'center',
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'schedule_date',
        align: 'center',
        label: 'Date',
        field: 'schedule_date',
        sortable: true,
      },
      {
        name: 'medicine_used',
        align: 'center',
        label: 'Medicine Used',
        field: 'medicine_used',
        sortable: true,
      },
      {
        name: 'next_schedule',
        align: 'center',
        label: 'Next Medication Schedule',
        field: 'next_schedule',
        sortable: true,
      },
      {
        name: 'veterinarian',
        align: 'center',
        label: 'Veterinarian',
        field: 'veterinarian',
        sortable: true,
      },
      {
        name: 'status',
        align: 'center',
        label: 'Status',
        field: 'status',
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
    watch(search.value, (newVal) => {
      SearchAnimalByNameManagement(newVal.animal_name, search)
    })
    // watch(
    //   () => userStore.manageAnimal,
    //   (newValue, oldValue) => {
    //     getAllAnimalsManagement();
    //   }
    // );
    onMounted(() => {
      getAllAnimalsManagement()
    })
    return {
      columns,
      row,
      animals,
      pickFile,
      handleFileUpload,
      viewAnimal,
      images,
      filterAdvanceSearch,
      justRef,
      search,
      age_option: [
        { label: 'Young', value: 'young' },
        { label: 'Adult', value: 'adult' },
        { label: 'Senior', value: 'senior' },
      ],
      sex_option: ['Male', 'Female'],
      size_option: ['Small', 'Normal', 'Big'],
      good_with_option: ['People', 'Animals', 'Both Animals and People'],
      current_state: [
        { label: 'Ready for Adoption', value: 1 },
        { label: 'Under Rehabilitation', value: 2 },
        { label: 'Under Medication', value: 3 },
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
      addNewAnimal,
      mobileAdd,
      drawerClick(e) {
        // if in "mini" state and user
        // click on drawer, we switch it to "normal" mode
        if (miniState.value) {
          miniState.value = false

          // notice we have registered an event with capture flag;
          // we need to stop further propagation as this click is
          // intended for switching drawer to "normal" mode only
          e.stopPropagation()
        }
      },
      isActive,
      filterAnimalByState,
      showAnimal,
      specificAnimalImage,
      getSpecificAnimalImage,
      showAnimalImage,
      toggleBtn,
      physical,
      behaviour,
      story,
      health,
      favorite,
      scrollToDiv,
      toggleLeftNavi,
      alterData,
      updateSpecificAnimal,
      dialogImg,
      getAge,
      imgExist,
      removeImage,
      cancelChangeInImage,
      animalIdBackUp,
      alertDelete,
      confirmDelete,
      exportSpecificAnimal,
      deletePropHolder,
      showDeleteBox,
      addAnimalTriggerBTn,
      addImages,
      addOrEdit,
      addAnimalFinaleBTn,
      imgError,
      getFavorites,
      medicineColumns,
      followUpOrMedication,
      resetScheduleDetails,
      AnimalScheduleDataMedication,
      AnimalScheduleDataCheckUp,
      mobileShowFollCheckUp,
      mobileShowMedSched,
      addNewItem,
      AddORUpdateOrDelete,
      scheduleDetails,
      statusOptions: [
        {
          label: 'Done',
          value: 1,
        },
        {
          label: 'Pending',
          value: 2,
        },
      ],
      updateScheduleAnimal,
      addNewScheduleMedicationOrCheckUp,
      updateItem,
      deleteSchedule,
      addAnimalOrMedicine,
      animalInfoTab,
    }
  },
}
