import { ref, onMounted, watch } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { useCounterStore } from 'src/stores/example-store'
import { useRoute, useRouter } from 'vue-router'
import { globalStore } from 'src/stores/global-store'
import {
  dateToday,
  decodeAnimalId,
  encodeAnimalId,
  getImageLink,
  checkUserIfPublic,
} from 'src/composable/simpleComposable'
import {
  specificAnimalId,
  viewSpecificAnimal,
  adoptedAnimalOnProgress,
  getSubmitAdoptionForm,
  moreAnimalForAdoption,
  submitPublicDonation,
  getRandomAnimal,
} from 'src/composable/taaraComposable'
import DonationDialog from 'src/components/DonationDialog.vue'
import NeedToLogin from 'src/components/NeedToLogin.vue'
import { getLikes, likes, removeLikes } from 'src/composable/latestPublicComposable'

export default {
  components: {
    TaaraFooter,
    DonationDialog,
    NeedToLogin,
  },
  setup() {
    const store = globalStore()
    const route = useRoute()
    const router = useRouter()
    const counterStore = useCounterStore()
    let inFront = ref([])
    let step = ref(1)
    const textNoAccount = ref('')
    const noAccount = ref(false)
    const like = ref()
    const specificAnimal = ref({})
    const allAnimalData6 = ref([])
    const likesData = ref([])

    let rearrangeImage = (button) => {
      let temp = []
      for (let i = 0; i < 5; i++) {
        let j = (button + i) % 5
        temp[i] = getImageLink(specificAnimal.value.file[j].name)
      }
      inFront.value = temp
    }

    const likeFn = async () => {
      if (Object.keys(store.userData).length == 0) {
        textNoAccount.value = `Save ${specificAnimal.value.name} to your Likes`
        noAccount.value = true
      } else {
        if (!likesData.value.includes(specificAnimal.value.animal_id)) {
          const response = await likes(
            [...likesData.value, specificAnimal.value.animal_id],
            store.userData.user_id,
          )
          if (response.status == 'success') {
            likesData.value.push(specificAnimal.value.animal_id)
          }
        } else {
          likesData.value = likesData.value.filter(
            (animalId) => animalId !== specificAnimal.value.animal_id,
          )
          removeLikes(likesData.value, store.userData.user_id)
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

    const getAge = (age) => {
      var today = new Date()
      var birthDate = new Date(age)
      age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      if (age < 2) {
        return 'Young'
      } else {
        return 'Senior'
      }
    }

    let accountActive = () => {
      // pay1, pay2
      // let progressAdotpion = pay1.filter((obj) => {
      //   return obj.animal_id === pay2
      // })
      // let checkAdopt =
      //   Object.keys(store.userData).length == 0
      //     ? false
      //     : pay1.some((obj) => obj.animal_id === pay2) &&
      //       pay1.some((obj) => obj.user_id === store.userData.user_id)
      // if (checkAdopt == true) {
      //   step.value = progressAdotpion[0].review_form
      // }
      return false
    }

    watch(
      () => route.query.pet,
      (newVal) => {
        viewSpecificAnimal(decodeAnimalId(newVal)).then((response) => {
          specificAnimal.value = response
        })
        inFront.value = []
      },
    )

    const donateBtnFn = () => {
      if (checkUserIfPublic()) {
        counterStore.donationDialog = true
        router.push({
          query: {
            ...route.query,
            amount: 0,
            allocated: `For ${specificAnimal.value.name}`,
          },
        })
      } else {
        textNoAccount.value = `Donate for ${specificAnimal.value.name}`
        noAccount.value = true
      }
    }

    const adoptBtnFn = () => {
      if (checkUserIfPublic()) {
        router.push({
          path: '/public/pet-adoption-form',
          query: {
            adopt: encodeAnimalId(specificAnimal.value.animal_id),
          },
        })
      } else {
        textNoAccount.value = `Proceed to adopting ${specificAnimal.value.name}`
        noAccount.value = true
      }
    }

    onMounted(async () => {
      viewSpecificAnimal(decodeAnimalId(route.query.pet)).then((response) => {
        specificAnimal.value = response
      })
      getRandomAnimal().then((response) => {
        allAnimalData6.value = response
      })
      if (Object.keys(store.userData).length != 0) {
        getSubmitAdoptionForm(store.userData.user_id).then((response) => {
          console.log(response)
        })
        const response = await getLikes(store.userData.user_id)
        console.log(response)
        if (response) {
          likesData.value = response?.animal_id ? JSON.parse(response.animal_id) : []
          console.log(likesData.value)
        }
      }
      moreAnimalForAdoption()
    })

    return {
      adoptBtnFn,
      noAccount,
      textNoAccount,
      donateBtnFn,
      checkUserIfPublic,
      getImageLink,
      store,
      encodeAnimalId,
      submitPublicDonation,
      accountActive,
      counterStore,
      getAge,
      switchCase,
      step,
      like,
      getSubmitAdoptionForm,
      adoptedAnimalOnProgress,
      likeFn,
      dateToday,
      rearrangeImage,
      likesData,
      allAnimalData6,
      specificAnimalId,
      viewSpecificAnimal,
      inFront,
      specificAnimal,
      options: [
        {
          value: 'True',
        },
      ],
      slide: ref('style'),
    }
  },
}
