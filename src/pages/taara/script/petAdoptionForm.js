import { defineComponent, ref, onMounted } from 'vue'
import taaraFooter from 'src/components/taaraFooter'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  submitAdoptionForm,
  viewSpecificAnimal,
  specificAnimal,
  getSubmitAdoptionForm,
} from 'src/composable/taaraComposable'
import { resizeImage, decodeAnimalId, getImageLink } from 'src/composable/simpleComposable'
import { dateToday, timeNow } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
export default defineComponent({
  components: {
    taaraFooter,
  },
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const store = globalStore()
    let animalDetails = ref({})
    let idName = ref(null)
    let stepProgress = ref(1)
    let formToProgress = ref(false)
    let adoptionDetails = ref({
      user_id: store.userData?.user_id,
      animal_id: null,
      have_other_pet: null,
      vet_phone_number: null,
      pet_number: null,
      have_vet: null,
      own_or_rent: null,
      have_enough_space: null,
      have_children: null,
      number_of_children: null,
      someone_gonna_takecare_of_pet: null,
      pet_caretaker: null,
      easily_trigger_by_pet_noise: null,
      convicted_animal_crime: null,
      valid_id: null,
      pickup_or_delivery: null,
      adoption_status: 1,
    })
    let step = ref(1)
    const images = ref()
    const fileInput = ref(null)
    const pickFile = () => {
      document.getElementById('fileInput').click()
    }
    const handleFileUpload = (event) => {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[0]
        console.log(file.name)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500)
            .then(({ dataUrl, fileName }) => {
              adoptionDetails.value.valid_id = dataUrl
              idName.value = fileName
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }

    let alert = ref(false)
    let nextInfo = (payload) => {
      let arrayKeys = [
        'animal_name',
        'own_or_rent',
        'have_enough_space',
        'have_children',
        'someone_gonna_takecare_of_pet',
        'easily_trigger_by_pet_noise',
        'convicted_animal_crime',
        'valid_id',
        'pickup_or_delivery',
      ]
      let isNullFound = arrayKeys.some((key) => {
        if (payload[key] === null) {
          console.log(`The key "${key}" is null.`)
          return true
        }
      })

      if (isNullFound) {
        return null
      } else {
        step.value = 2
      }
    }

    let submitAdoption = () => {
      $q.loading.show({ group: 'sub', message: 'Submitting application. please wait...' })
      submitAdoptionForm(adoptionDetails.value)
        .then((response) => {
          if (response == 'success') {
            formToProgress.value = true
            stepProgress.value = 2
            step.value = 3
          } else {
            formToProgress.value = false
            step.value = 2
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    onMounted(() => {
      viewSpecificAnimal(decodeAnimalId(route.query.adopt))
        .then((response) => {
          console.log(response)
          animalDetails.value = response
          adoptionDetails.value.animal_id = response.animal_id
        })
        .catch((error) => {
          console.error(error)
        })

      if (Object.keys(store.userData).length !== 1) {
        getSubmitAdoptionForm(store.userData.user_id)
          .then((response) => {
            console.log(response)
            let findMatchAdoptionReq = response.some(
              (obj) => obj.animal_id === decodeAnimalId(route.query.adopt),
            )
            let formStatus = response
              .filter((obj) => obj.animal_id === decodeAnimalId(route.query.adopt))
              .map((obj) => obj.review_form)[0]
            console.log(formStatus)
            if (findMatchAdoptionReq == false) {
              step.value = 1
              formToProgress.value = false
            } else {
              formToProgress.value = true
              stepProgress.value = formStatus
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
    return {
      getImageLink,
      formToProgress,
      stepProgress,
      idName,
      step,
      animalDetails,
      specificAnimal,
      submitAdoption,
      takeCareOptions: ['Spouse', 'Children', 'Parents', 'Househelper', 'Others'],
      alert,
      nextInfo,
      handleFileUpload,
      images,
      fileInput,
      pickFile,
      taaraFooter,
      adoptionDetails,
    }
  },
})
