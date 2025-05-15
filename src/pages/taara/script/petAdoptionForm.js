import { defineComponent, ref, onMounted } from 'vue'
import taaraFooter from 'src/components/taaraFooter'
import { useRoute } from 'vue-router'
import { useQuasar, QSpinnerBars } from 'quasar'
import {
  logInDetails,
  submitAdoptionForm,
  viewSpecificAnimal,
  specificAnimal,
  getSubmitAdoptionForm,
} from 'src/composable/taaraComposable'
import { resizeImage, decodeAnimalId } from 'src/composable/simpleComposable'
import { dateToday, timeNow } from 'src/composable/simpleComposable'
export default defineComponent({
  components: {
    taaraFooter,
  },
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    let animalDetails = ref({})
    let idName = ref(null)
    let stepProgress = ref(1)
    let formToProgress = ref(false)
    let adoptionDetails = ref({
      user_id: logInDetails.value[0].user_id,
      animal_id: null,

      have_other_pet: null,
      pet_number: null,
      behavior_other_animals: null,
      have_vet: null,
      vet_phone_number: null,
      own_or_rent: null,
      have_enough_space: null,
      have_children: null,
      number_of_children: null,
      someone_gonna_takecare_of_pet: null,
      pet_caretaker: null,
      plans_for_pet_when_away: null,
      easily_trigger_by_pet_noise: null,
      convicted_animal_crime: null,
      valid_id: null,
      pickup_or_delivery: null,
      date: dateToday,
      time: timeNow,
      adoption_status: 1,
      review_form: 1,
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

    let submitAdoption = (payload) => {
      const notif = $q.notify({
        group: false, // required to be updatable
        timeout: 0, // we want to be in control when it gets dismissed
        spinner: QSpinnerBars,
        message: 'Submitting request...',
        color: 'primary',
      })
      setTimeout(() => {
        submitAdoptionForm(payload)
          .then((response) => {
            notif({
              spinner: false, // we reset the spinner setting so the icon can be displayed
              icon: response == 'success' ? 'check_circle' : 'cancel',
              message: response == 'success' ? 'Submit succesfully !' : 'Submit failed !',
              timeout: 1000,
            })
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
      }, 1000)
    }

    onMounted(() => {
      viewSpecificAnimal(decodeAnimalId(route.query.adopt))
        .then((specificAnimal) => {
          console.log(specificAnimal)
          animalDetails.value = specificAnimal.data[0]
          adoptionDetails.value.animal_id = specificAnimal.data[0].animal_id
        })
        .catch((error) => {
          console.error(error)
        })
      logInDetails.value == null
        ? ''
        : getSubmitAdoptionForm(logInDetails.value[0].user_id)
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
      logInDetails.value == null ? '' : null
    })
    return {
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
