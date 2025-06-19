<template>
  <q-page class="column no-wrap all-container items-center q-py-xl">
    <div class="animal-description row no-wrap q-pa-xl shadow-1">
      <div class="column no-wrap items-center">
        <img :src="getImageLink(animalDetails.primary_image)" alt="" />
        <div class="name-div q-mt-md">
          <p class="text-center q-mb-none text-primary text-overline">
            {{ animalDetails.name }}
          </p>
        </div>
      </div>
      <q-separator vertical class="q-mx-xl"></q-separator>
      <div
        class="details-container column no-wrap justify-center items-center full-width text-caption"
        v-if="formToProgress == false"
      >
        <h5 class="petadapt text-center text-weight-medium q-mt-md">
          Pet Adoption Application Form
        </h5>
        <q-stepper v-model="step" ref="stepper" color="primary" flat>
          <q-step
            :name="1"
            title="Application Information"
            icon="settings"
            caption="Please answer the question truthfuly"
            :done="step > 1"
          >
            <q-form
              @submit="nextInfo(adoptionDetails)"
              class="q-ma-none q-pa-none"
              style="width: 100%; width: 600px"
            >
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Do you own any pets?*</p>
                </div>
                <div class="q-ma-sm row justify-center">
                  <q-radio
                    v-model="adoptionDetails.have_other_pet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.have_other_pet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.have_other_pet == 'Yes'"
              >
                <p class="q-ma-sm q-mr-md" style="width: 230px">How many pets do you own?</p>
                <q-input
                  class="q-ma-sm q-mx-md"
                  :disable="
                    adoptionDetails.have_other_pet == 'No' || adoptionDetails.have_other_pet == null
                  "
                  outlined
                  :rules="[(val) => (!!val && adoptionDetails.have_other_pet == 'Yes') || '']"
                  hide-bottom-space
                  :value="
                    adoptionDetails.have_other_pet == 'No'
                      ? (adoptionDetails.pet_number = null)
                      : adoptionDetails.have_other_pet
                  "
                  v-model="adoptionDetails.pet_number"
                  dense
                  style="width: 300px"
                  type="number"
                  :style="
                    adoptionDetails.have_other_pet == 'Yes'
                      ? adoptionDetails.pet_number == null
                        ? {
                            border: '1px solid #b157ae',
                            borderRadius: '5px',
                          }
                        : { borderRadius: '10px' }
                      : {}
                  "
                />
              </div>

              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.have_other_pet == 'Yes'"
              >
                <div class="q-ma-sm" style="width: 230px">
                  <p>Are your pets well behaved toward other pets? *</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.behavior_other_animals"
                    :disable="
                      adoptionDetails.have_other_pet == 'No' ||
                      adoptionDetails.have_other_pet == null
                    "
                    :color="adoptionDetails.have_other_pet == 'Yes' ? 'accent' : 'gray'"
                    :keep-color="adoptionDetails.have_other_pet == 'Yes' ? true : false"
                    :value="
                      adoptionDetails.have_other_pet == 'Yes'
                        ? adoptionDetails.behavior_other_animals
                        : (adoptionDetails.behavior_other_animals = '')
                    "
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.behavior_other_animals"
                    :disable="
                      adoptionDetails.have_other_pet == 'No' ||
                      adoptionDetails.have_other_pet == null
                    "
                    :color="adoptionDetails.have_other_pet == 'Yes' ? 'accent' : 'gray'"
                    :keep-color="adoptionDetails.have_other_pet == 'Yes' ? true : false"
                    :value="
                      adoptionDetails.have_other_pet == 'No'
                        ? (adoptionDetails.behavior_other_animals = '')
                        : adoptionDetails.behavior_other_animals
                    "
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="no"
                    label="No"
                  />
                </div>
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Do you have a veterinarian? *</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.have_vet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.have_vet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.have_vet == 'Yes'"
              >
                <p class="q-ma-sm q-mr-md" style="width: 230px">Phone Number</p>
                <q-input
                  class="q-ma-sm q-mx-md"
                  outlined
                  v-model="adoptionDetails.vet_phone_number"
                  :style="
                    adoptionDetails.have_other_pet == 'Yes'
                      ? adoptionDetails.vet_phone_number == null
                        ? {
                            border: '1px solid #b157ae',
                            borderRadius: '5px',
                          }
                        : { borderRadius: '10px' }
                      : {}
                  "
                  :color="
                    adoptionDetails.have_other_pet == 'Yes' &&
                    adoptionDetails.vet_phone_number == null
                      ? 'accent'
                      : 'gray'
                  "
                  :value="
                    adoptionDetails.have_other_pet == 'No'
                      ? (adoptionDetails.vet_phone_number = null)
                      : adoptionDetails.vet_phone_number
                  "
                  :rules="[
                    (val) =>
                      (!!val && adoptionDetails.have_other_pet == 'Yes' && val.length == 16) || '',
                    (val) => (val && val[1] === '9') || 'Phone number must start with 9',
                  ]"
                  hide-bottom-space
                  :disable="
                    adoptionDetails.have_other_pet == 'No' || adoptionDetails.have_other_pet == null
                  "
                  mask="phone"
                  prefix="+63"
                  dense
                  style="width: 300px"
                />
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Do you own or rent your home?*</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.own_or_rent"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    :val="1"
                    label="Own"
                  />
                  <q-radio
                    v-model="adoptionDetails.own_or_rent"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    :val="2"
                    label="Rent"
                  />
                </div>
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Do you have an adequate space for your pets? *</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.have_enough_space"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.have_enough_space"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Do you have any children at home?</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.have_children"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.have_children"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.have_children == 'Yes'"
              >
                <p class="q-ma-sm q-mr-md" style="width: 230px">If yes, number of children</p>
                <q-input
                  class="q-ma-sm q-mx-md"
                  type="number"
                  :style="
                    adoptionDetails.have_children == 'Yes'
                      ? adoptionDetails.number_of_children == null
                        ? {
                            border: '1px solid #b157ae',
                            borderRadius: '5px',
                          }
                        : { borderRadius: '10px' }
                      : {}
                  "
                  :rules="[(val) => (!!val && adoptionDetails.have_children == 'Yes') || '']"
                  hide-bottom-space
                  :value="
                    adoptionDetails.have_children == 'No'
                      ? (adoptionDetails.number_of_children = '')
                      : adoptionDetails.number_of_children
                  "
                  :disable="
                    adoptionDetails.have_children == 'No' || adoptionDetails.have_children == null
                  "
                  outlined
                  v-model="adoptionDetails.number_of_children"
                  dense
                  style="width: 300px"
                />
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Will there be someone to take care of your pets while you're away?</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.someone_gonna_takecare_of_pet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.someone_gonna_takecare_of_pet"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.someone_gonna_takecare_of_pet == 'Yes'"
              >
                <p class="q-ma-sm q-mr-md" style="width: 230px">If yes,</p>
                <q-select
                  class="q-ma-sm q-mx-md"
                  outlined
                  v-model="adoptionDetails.pet_caretaker"
                  :style="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'Yes'
                      ? adoptionDetails.pet_caretaker == ''
                        ? {
                            border: '1px solid #b157ae',
                            borderRadius: '5px',
                          }
                        : { borderRadius: '10px' }
                      : {}
                  "
                  :disable="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'No' ||
                    adoptionDetails.someone_gonna_takecare_of_pet == null
                  "
                  :options="takeCareOptions"
                  dense
                  style="width: 300px"
                  :value="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'No'
                      ? (adoptionDetails.pet_caretaker = '')
                      : adoptionDetails.pet_caretaker
                  "
                  :rules="[
                    (val) =>
                      (!!val && adoptionDetails.someone_gonna_takecare_of_pet == 'Yes') || '',
                  ]"
                  hide-bottom-space
                />
              </div>
              <div
                class="flex row justify-start items-center"
                v-show="adoptionDetails.someone_gonna_takecare_of_pet == 'No'"
              >
                <p class="q-ma-sm q-mr-md" style="width: 230px">
                  If no, what are your plans in taking care of your pets while you're away?
                </p>
                <q-input
                  class="q-ma-sm q-mx-md"
                  :style="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'No'
                      ? adoptionDetails.plans_for_pet_when_away == null
                        ? {
                            border: '1px solid #b157ae',
                            borderRadius: '5px',
                          }
                        : { borderRadius: '10px' }
                      : {}
                  "
                  :disable="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'Yes' ||
                    adoptionDetails.someone_gonna_takecare_of_pet == null
                  "
                  :value="
                    adoptionDetails.someone_gonna_takecare_of_pet == 'Yes'
                      ? (adoptionDetails.plans_for_pet_when_away = null)
                      : adoptionDetails.plans_for_pet_when_away
                  "
                  :rules="[
                    (val) => (!!val && adoptionDetails.someone_gonna_takecare_of_pet == 'No') || '',
                  ]"
                  hide-bottom-space
                  type="textarea"
                  outlined
                  v-model="adoptionDetails.plans_for_pet_when_away"
                  dense
                  style="width: 300px"
                />
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>
                    Are you easily disturbed or triggered by loud noises (such as barking), or
                    unpleasant smell (such as animal poop)?
                  </p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.easily_trigger_by_pet_noise"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.easily_trigger_by_pet_noise"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>
                    Have you ever been convicted of an animal related crime, such as cruelty to
                    animals, animal theft, or animal abandonment?*
                  </p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.convicted_animal_crime"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Yes"
                    label="Yes"
                  />
                  <q-radio
                    v-model="adoptionDetails.convicted_animal_crime"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="No"
                    label="No"
                  />
                </div>
              </div>
              <div class="flex row justify-start items-center">
                <p class="q-ma-sm q-mr-md" style="width: 230px">
                  Please provide valid ID’s for personal references:*
                </p>
                <div class="column no-wrap">
                  <q-file
                    v-model="adoptionDetails.valid_id"
                    label="Pick one file"
                    filled
                    dense
                    accept=".jpg, image/*"
                    style="max-width: 300px"
                  />
                </div>
              </div>

              <div class="flex row justify-start items-center">
                <div class="q-ma-sm" style="width: 230px">
                  <p>Pick up the pet or Deliver to your house?*</p>
                </div>
                <div class="q-ma-sm row justify-start">
                  <q-radio
                    v-model="adoptionDetails.pickup_or_delivery"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Pickup"
                    label="Pick up"
                  />
                  <q-radio
                    v-model="adoptionDetails.pickup_or_delivery"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Deliver"
                    label="Deliver"
                  />
                </div>
              </div>
              <p v-if="alert == true" class="text-red text-center">Please input the red fields!</p>
              <div class="row no-wrap justify-end">
                <q-btn class="submit" filled flat label="Continue" type="submit" />
              </div>
            </q-form>
          </q-step>

          <q-step
            :name="2"
            title="Aggrement"
            caption="Optional"
            icon="create_new_folder"
            :done="step > 2"
          >
            <p class="text-center aggreement">
              <b class="q-ma-none q-pa-none text-body1">•</b>By submitting the form, you agree to
              provide adequate<br />care for the pet, pay the adoption fee, surrender the pet to the
              organization if you<br />
              can no longer care for it, and hold the organization harmless against any losses.<br />
              The organization discloses known health or behavior issues with the pet prior to<br />
              adoption.
            </p>

            <div class="flex row justify-around items-center q-my-lg">
              <q-btn class="back" filled flat label="Back" @click="step = 1" icon="arrow_left" />
              <q-btn class="submit" filled flat @click="submitAdoption()" label="Submit" />
            </div>
          </q-step>

          <q-step :name="3" title="Done" icon="assignment" :done="step == 3">
            <div class="flex column justify-center items-center">
              <q-icon class="q-mx-xl" size="10rem" name="task_alt" style="color: #b157ae" />
              <p class="text-h4 q-mx-xl text-weight-medium">Thank you!</p>
              <p class="text-body1 q-mx-xl text-weight-medium" style="color: gray">
                You submission has been sent!
              </p>
            </div>
          </q-step>
        </q-stepper>
      </div>
      <div
        class="animal-details column no-wrap justify-center items-center full-width"
        v-if="formToProgress == true"
      >
        <p class="petadapt text-h5 text-center text-weight-medium q-mt-md">Pet Adoption Progress</p>
        <q-stepper
          v-model="stepProgress"
          ref="stepper"
          alternative-labels
          color="primary"
          animated
          flat
        >
          <q-step :name="0" title="Request Submitted" icon="add_task" :done="stepProgress > 0">
            <ul>
              <li>
                📝 Step Description: You’ve submitted your request to adopt a pet. Thank you for
                your interest!
              </li>
              <li>
                🕒 Expected Duration: We’ll process your request promptly, typically within one
                business day.
              </li>
            </ul>
          </q-step>
          <q-step
            :name="1"
            title="Reviewing Request"
            icon="mark_email_read"
            :done="stepProgress > 1"
          >
            <ul>
              <li>
                🧐 Step Description: Our organization is carefully examining your adoption request.
                We want to ensure the best match for both you and the pet.
              </li>
              <li>
                🕒 Expected Duration: This step usually takes at least one business day as we review
                your information.
              </li>
            </ul>
          </q-step>

          <q-step :name="2" title="Qualified" icon="sports_handball" :done="stepProgress > 2">
            <ul>
              <li>
                ✅ Step Description: Congratulations! Your request has met our initial criteria.
                You’re one step closer to adopting a furry friend.
              </li>
              <li>
                🕒 Expected Duration: The qualification process varies but generally doesn’t take
                long.
              </li>
            </ul>
          </q-step>
          <q-step :name="3" title="Ready for Pickup" icon="local_shipping" :done="stepProgress > 3">
            <ul>
              <li>
                🚚 Step Description: Your pet is almost ready! We’re making arrangements for you to
                pick up your new companion.
              </li>
              <li>🕒 Expected Duration: We’ll notify you when your pet is prepared for pickup.</li>
            </ul>
          </q-step>
          <q-step :name="4" title="Adopted" icon="pets" :done="stepProgress > 4">
            <ul>
              <li>
                🎉 Step Description: Success! You’ve officially adopted your pet. Thank you for
                choosing to give them a loving home.
              </li>
              <li>
                🕒 Expected Duration: This step happens immediately upon completing the adoption
                process.
              </li>
            </ul>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
  <TaaraFooter></TaaraFooter>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter'
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
    TaaraFooter,
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
            $q.loading.hide()
          }, 1500)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    onMounted(async () => {
      const response1 = await viewSpecificAnimal(decodeAnimalId(route.query.adopt))

      animalDetails.value = response1
      adoptionDetails.value.animal_id = response1.animal_id

      if (Object.keys(store.userData).length > 0) {
        const response = await getSubmitAdoptionForm(store.userData.user_id)

        let findMatchAdoptionReq = response.some(
          (obj) => obj.animal_id === decodeAnimalId(route.query.adopt),
        )
        formToProgress.value = findMatchAdoptionReq

        const filterMatch = response.filter(
          (obj) => obj.animal_id === decodeAnimalId(route.query.adopt),
        )
        const adoptionStatus =
          filterMatch.length > 0 ? filterMatch.map((obj) => obj.adoption_status) : 1

        step.value = adoptionStatus
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
      TaaraFooter,
      adoptionDetails,
    }
  },
})
</script>
<style lang="scss" src="../pages/taara/style/petAdoptionForm.scss" scoped></style>
