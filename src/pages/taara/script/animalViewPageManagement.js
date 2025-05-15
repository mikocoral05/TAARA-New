import { ref, onMounted, watch, onUnmounted } from 'vue'
import {
  logInDetails,
  specificAnimalManagement,
  viewSpecificAnimal,
  updateSpecificAnimal,
  viewSpecificAnimalManagement,
  AnimalScheduleData,
  deleteScheduleAnimal,
  updateScheduleAnimal,
  addNewScheduleMedicationOrCheckUp,
  getAnimalSchedule,
  AnimalScheduleDataMedication,
  AnimalScheduleDataCheckUp,
} from 'src/composable/taaraComposable'
import { resizeImage, switchCaseSize } from 'src/composable/simpleComposable'
export default {
  setup() {
    let animalId = ref(JSON.parse(localStorage.getItem('specificAnimalId-management')))
    let manageAnimal = ref(JSON.parse(localStorage.getItem('manage-animal')))
    let inFront = ref([])
    let watchNumber = ref(0)
    let contactedQStepper = ref(false)
    let addNewItem = ref(false)
    let deletePropHolder = ref()
    let dialog = ref(false)
    let followUpOrMedication = ref(true)
    let viewVetSched = ref(false)
    let viewSpecificVet = ref(false)
    let images = ref([])
    let referenceAnimalId = ref()
    let AddORUpdateOrDelete = ref(0)
    let alertDelete = ref(false)
    let editVetIndex = ref()

    let animalDetails = ref({
      breed: null,
      age: null,
      size: null,
      sex: null,
      fur_color: null,
      good_with: null,
      behaviour: null,
      health: null,
      story: null,
    })
    let scheduleDetails = ref({
      animal_id: animalId.value,
      schedule_date: null,
      medicine_used: null,
      next_schedule: null,
      veterinarian: null,
      status: null,
      medication_or_check_up: 1,
    })

    let rearrangeImage = (button) => {
      let temp = []
      for (let i = 0; i < 5; i++) {
        let j = (button + i) % 5
        temp[i] = specificAnimalManagement.value.image[j].animal_image
      }
      inFront.value = temp
    }
    let switchCase = (payload) => {
      switch (payload) {
        case 1:
          return 'People'
        case 2:
          return 'Animal'
        case 3:
          return 'Both Animal and People'
      }
    }

    const updateItem = (props) => {
      addNewItem.value = true
      scheduleDetails.value = { ...props }
      AddORUpdateOrDelete.value = 2
    }
    const mobileEditVetSched = () => {
      addNewItem.value = true
      scheduleDetails.value = { ...editVetIndex.value }
      AddORUpdateOrDelete.value = 2
    }
    const resetScheduleDetails = () => {
      addNewItem.value = true
      AddORUpdateOrDelete.value = 1
      let excludedKeys = ['animal_id', 'medication_or_check_up']
      Object.keys(scheduleDetails.value).forEach((key) => {
        if (!excludedKeys.includes(key)) scheduleDetails.value[key] = null
      })
    }

    let deleteSchedule = (payload) => {
      alertDelete.value = true
      deletePropHolder.value = payload
    }
    let confirmDelete = () => {
      deleteScheduleAnimal(deletePropHolder.value)
      if (window.innerWidth <= 500) viewSpecificVet.value = false
    }
    let mobileShowMedSched = () => {
      if (window.innerWidth <= 501) {
        viewVetSched.value = true
        followUpOrMedication.value = true
      } else {
        followUpOrMedication.value = true
      }
    }
    let mobileShowFollCheckUp = () => {
      if (window.innerWidth <= 501) {
        followUpOrMedication.value = false
        scheduleDetails.value.medication_or_check_up = 2
        viewVetSched.value = true
      } else {
        scheduleDetails.value.medication_or_check_up = 2
        followUpOrMedication.value = false
      }
    }
    let mobileGetVetInfo = (id) => {
      let arrayToFilter =
        followUpOrMedication.value == true
          ? AnimalScheduleDataMedication.value
          : AnimalScheduleDataCheckUp.value
      let filteredArray = arrayToFilter.filter((obj) => {
        return obj.id === id
      })

      if (followUpOrMedication.value == true) {
        scheduleDetails.value = filteredArray[0]
      } else {
        scheduleDetails.value = filteredArray[0]
      }
      editVetIndex.value = scheduleDetails.value
      deletePropHolder.value = editVetIndex.value
      viewSpecificVet.value = true
    }
    function getAge(age) {
      var today = new Date()
      var birthDate = new Date(age)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      if (age < 2) {
        return 'Young'
      } else if ((age) => 2 && age <= 10) {
        return 'Adult'
      } else {
        return 'Senior'
      }
    }
    let editPet = (payload) => {
      dialog.value = true
      animalDetails.value = { ...payload }
    }

    const pickFile = (imageData) => {
      document.getElementById('fileInput').click()
      images.value.push(imageData)
      referenceAnimalId.value = imageData.id
    }

    const handleFileUpload = (event) => {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl, fileName }) => {
              images.value.forEach((obj) => {
                if (obj.id === referenceAnimalId.value) {
                  obj.animal_image = dataUrl
                }
              })
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }
    const handleWindowResize = () => {
      contactedQStepper.value = window.innerWidth < 779
    }

    const columns = [
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
    watch(watchNumber, (newVal) => {
      viewSpecificAnimal(newVal)
      inFront.value = []
    })
    onMounted(() => {
      window.addEventListener('resize', handleWindowResize)
      viewSpecificAnimalManagement(animalId.value)
      getAnimalSchedule(animalId.value)
      handleWindowResize()
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })

    return {
      followUpOrMedication,
      columns,
      handleFileUpload,
      getAge,
      editPet,
      addNewScheduleMedicationOrCheckUp,
      switchCase,
      pickFile,
      AnimalScheduleDataMedication,
      AnimalScheduleDataCheckUp,
      deleteSchedule,
      updateItem,
      editVetIndex,
      mobileEditVetSched,
      AddORUpdateOrDelete,
      AnimalScheduleData,
      images,
      alertDelete,
      updateScheduleAnimal,
      logInDetails,
      inFront,
      viewVetSched,
      resetScheduleDetails,
      specificAnimalManagement,
      addNewItem,
      updateSpecificAnimal,
      contactedQStepper,
      deleteSchedule,
      confirmDelete,
      scheduleDetails,
      animalDetails,
      dialog,
      manageAnimal,
      mobileGetVetInfo,
      viewSpecificVet,
      mobileShowMedSched,
      mobileShowFollCheckUp,
      switchCaseSize,
      rearrangeImage,
      options: [
        {
          value: 'True',
        },
      ],
      sexOptions: [
        {
          label: 'Male',
          value: 1,
        },
        {
          label: 'Female',
          value: 2,
        },
      ],
      sizeOptions: [
        {
          label: 'Small',
          value: 1,
        },
        {
          label: 'Normal',
          value: 2,
        },
        {
          label: 'Big',
          value: 3,
        },
      ],
      goodWithOptions: [
        {
          label: 'People',
          value: 1,
        },
        {
          label: 'Animals',
          value: 2,
        },
        {
          label: 'Both Animal and People',
          value: 3,
        },
      ],
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
      slide: ref('style'),
    }
  },
}
