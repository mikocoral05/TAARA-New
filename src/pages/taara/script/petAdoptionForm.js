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
import { decodeAnimalId, getImageLink } from 'src/composable/simpleComposable'
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
    let stepProgress = ref(1)
    let formToProgress = ref(false)
    let adoptionDetails = ref({
      user_id: store.userData?.user_id,
    })
    let step = ref(1)
    const images = ref()

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
          setTimeout(() => {
            if (response == 'success') {
              formToProgress.value = true
              stepProgress.value = 2
              step.value = 3
            } else {
              formToProgress.value = false
              step.value = 2
            }
          }, 1500)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    onMounted(() => {
      viewSpecificAnimal(decodeAnimalId(route.query.adopt))
        .then((response) => {
          animalDetails.value = response
          adoptionDetails.value.animal_id = response.animal_id
        })
        .catch((error) => {
          console.error(error)
        })

      if (Object.keys(store.userData).length !== 1) {
        getSubmitAdoptionForm(store.userData.user_id)
          .then((response) => {
            let findMatchAdoptionReq = response.some(
              (obj) => obj.animal_id === decodeAnimalId(route.query.adopt),
            )
            formToProgress.value = findMatchAdoptionReq
            console.log(findMatchAdoptionReq)

            step.value = response
              .filter((obj) => obj.animal_id === decodeAnimalId(route.query.adopt))
              .map((obj) => obj.adoption_status)[0]
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
      step,
      animalDetails,
      specificAnimal,
      submitAdoption,
      takeCareOptions: ['Spouse', 'Children', 'Parents', 'Househelper', 'Others'],
      alert,
      nextInfo,
      images,
      taaraFooter,
      adoptionDetails,
    }
  },
})
