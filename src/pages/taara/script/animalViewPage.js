import { ref, onMounted, watch, onUnmounted } from 'vue'
import taaraFooter from 'src/components/taaraFooter.vue'
import { useCounterStore } from 'src/stores/example-store'
import { createWorker } from 'tesseract.js'
import { useRoute } from 'vue-router'
import {
  dateToday,
  timeNow,
  resizeImage,
  decodeAnimalId,
  encodeAnimalId,
} from 'src/composable/simpleComposable'
import {
  specificAnimalId,
  allAnimalData6,
  viewSpecificAnimal,
  logInDetails,
  adoptedAnimalOnProgress,
  likesData,
  getSubmitAdoptionForm,
  likes,
  removeLikes,
  getLikes,
  specificAnimal,
  moreAnimalForAdoption,
  submitPublicDonation,
} from 'src/composable/taaraComposable'

export default {
  components: {
    taaraFooter,
  },
  setup() {
    const route = useRoute()
    const counterStore = useCounterStore()
    let showPorgressAndOther = ref(false)
    let contactedQStepper = ref(false)
    let donateDialog = ref(false)
    let imageOrReference = ref(true)
    let donationImage = ref(null)
    let reference = ref(null)
    let controlSpinner = ref(false)
    let inFront = ref([])
    let petId = ref()
    let step = ref(1)
    const like = ref()

    let donatorsInfo = ref({
      donators_id: null,
      animal_id: null,
      donation_amount: null,
      image: null,
      reference: null,
      donation_date: null,
      donation_time: null,
      donation_status: 1,
    })

    let rearrangeImage = (button) => {
      let temp = []
      for (let i = 0; i < 5; i++) {
        let j = (button + i) % 5
        temp[i] = specificAnimal.value.image[j].animal_image
      }
      inFront.value = temp
    }

    let restrictionHeart = (animal_id, logInDetails, dateToday, animalImage, animalName) => {
      if (logInDetails == null) {
        counterStore.showDialog = true
      } else {
        like.value = !like.value
        if (like.value == true) {
          likes(animal_id, logInDetails[0].user_id, dateToday, animalImage, animalName)
        } else {
          removeLikes(animal_id, logInDetails[0].user_id, dateToday, animalImage, animalName)
        }
      }
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

    function getAge(age) {
      var today = new Date()
      var birthDate = new Date(age)
      age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      if (age < 2) {
        return 'Young'
      }
      //  else if ((age) => 2 && age <= 10) {
      //   return 'Adult'
      // }
      else {
        return 'Senior'
      }
    }

    let accountActive = (pay1, pay2) => {
      let progressAdotpion = pay1.filter((obj) => {
        return obj.animal_id === pay2
      })
      let checkAdopt =
        logInDetails.value == null
          ? false
          : pay1.some((obj) => obj.animal_id === pay2) &&
            pay1.some((obj) => obj.user_id === logInDetails.value[0].user_id)
      if (checkAdopt == true) {
        step.value = progressAdotpion[0].review_form
      }
      return checkAdopt
    }

    const handleWindowResize = () => {
      contactedQStepper.value = window.innerWidth < 779
    }

    watch(petId, (newVal) => {
      viewSpecificAnimal(decodeAnimalId(newVal))
      inFront.value = []
    })
    watch(
      () => [donationImage.value, reference.value],
      () => {
        ;(async () => {
          let obj = {
            donators_id: logInDetails.value[0].user_id,
            animal_id: specificAnimal.value.data[0].animal_id,
            donation_amount: null,
            image: null,
            reference: null,
            donation_date: dateToday,
            donation_time: timeNow,
            donation_status: 1,
          }
          if (donationImage.value == null) {
            obj.reference = 'Ref No. ' + reference.value
            obj.image = null
            obj.donation_amount = null
          } else {
            controlSpinner.value = true
            const reader = new FileReader()
            reader.readAsDataURL(donationImage.value)
            reader.onload = () => {
              resizeImage(donationImage.value, 500, 500)
                .then(({ dataUrl }) => {
                  obj.image = dataUrl
                })
                .catch((error) => {
                  console.error(error)
                })
            }
            const worker = await createWorker('eng')
            const {
              data: { text },
            } = await worker.recognize(donationImage.value)
            const amountRegex = /(Total Amount Sent|Amount|Php)\s*(\d+(\.\d{1,2})?)/gi

            let match
            const amounts = []
            while ((match = amountRegex.exec(text)) !== null) {
              amounts.push(match[2]) // This will push only the numerical amounts to the array
              console.log(match)
            }
            donationImage.value !== null ? (obj.donation_amount = Number(amounts[0])) : null
            const refNoRegex = /Ref No\.\s*([\d\s]+)/gi // Adjusted to match the format of the reference number
            let refMatch
            if ((refMatch = refNoRegex.exec(text)) !== null) {
              // This will set the reference number in the object
              donationImage.value !== null
                ? (obj.reference = refMatch[1])
                : (obj.reference = reference.value)
            }
            controlSpinner.value = false
            await worker.terminate()
          }
          donatorsInfo.value = { ...obj }
        })()
      },
    )
    onMounted(() => {
      window.addEventListener('resize', handleWindowResize)
      viewSpecificAnimal(decodeAnimalId(route.query.pet))
      logInDetails.value == null ? '' : getSubmitAdoptionForm(logInDetails.value[0].user_id)
      logInDetails.value == null ? '' : getLikes(logInDetails.value[0].user_id)
      moreAnimalForAdoption()
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize)
    })

    return {
      petId,
      encodeAnimalId,
      donatorsInfo,
      submitPublicDonation,
      controlSpinner,
      donationImage,
      reference,
      imageOrReference,
      donateDialog,
      accountActive,
      counterStore,
      getAge,
      switchCase,
      step,
      like,
      showPorgressAndOther,
      getSubmitAdoptionForm,
      adoptedAnimalOnProgress,
      restrictionHeart,
      dateToday,
      rearrangeImage,
      likesData,
      allAnimalData6,
      specificAnimalId,
      logInDetails,
      viewSpecificAnimal,
      inFront,
      specificAnimal,
      contactedQStepper,
      options: [
        {
          value: 'True',
        },
      ],
      slide: ref('style'),
    }
  },
}
