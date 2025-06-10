<template>
  <q-page class="column items-center justify-center">
    <div style="width: 100%; max-width: 800px" class="bg-white q-my-md q-py-lg radius-10">
      <h5 class="q-ma-none q-px-lg text-bold">Transfer in 3 Steps</h5>
      <q-form @submit="submitTransfer()">
        <q-stepper class="q-mt-md" v-model="step" color="primary" animated flat>
          <q-step :name="1" title="Basic Pet Info" icon="sym_r_pets" :done="step > 1">
            <h5 class="q-mb-none q-mt-none">Pet Information</h5>
            <p class="text-grey-7 text-overline">Tell us about your pet</p>
            <div class="input-fields-container row">
              <div class="row q-mt-md">
                <div class="column no-wrap q-mr-md">
                  <p class="q-ma-none q-mb-sm">Pet name</p>
                  <q-input
                    outlined
                    placeholder="Pet name"
                    dense
                    v-model="petTransferInfo.pet_name"
                    stack-label
                    :rules="[(val) => !!val || 'Pet name is required!']"
                    style="width: 200px"
                  />
                </div>
                <div class="column no-wrap q-mr-md">
                  <p class="q-ma-none q-mb-sm">Fur color</p>
                  <q-input
                    outlined
                    placeholder="Fur color"
                    dense
                    v-model="petTransferInfo.fur_color"
                    stack-label
                    :rules="[(val) => !!val || 'Fur color is required!']"
                    style="width: 200px"
                  />
                </div>
                <div class="column no-wrap">
                  <p class="q-ma-none q-mb-sm">Breed</p>
                  <q-input
                    outlined
                    placeholder="Breed"
                    dense
                    v-model="petTransferInfo.breed"
                    stack-label
                    :rules="[(val) => !!val || 'Breed is required!']"
                    style="width: 200px"
                  />
                </div>
                <div class="column no-wrap q-py-md q-mr-md">
                  <p class="q-ma-none q-mb-sm">Birthdate</p>

                  <q-input
                    class="input"
                    outlined
                    v-model="petTransferInfo.birth_date"
                    placeholder="####-##-##"
                    dense
                    mask="####-##-##"
                    :rules="[(val) => !!val || 'Date of birth is required!']"
                    stack-label
                    hint="Can estimated Birthdate"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="petTransferInfo.birth_date"
                            :title="petTransferInfo.pet_name"
                            subtitle="Birthday"
                            today-btn
                            emit-immediately
                            mask="YYYY-MM-DD"
                            default-year-month="2000/01"
                          >
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat rounded />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-py-md q-mr-md">
                  <p class="q-ma-none q-mb-sm">Size</p>
                  <q-select
                    v-model="petTransferInfo.size"
                    outlined
                    :options="petSizes"
                    map-options
                    dense
                    :rules="[(val) => !!val || 'Size is required!']"
                    style="width: 200px"
                    behaviour="menu"
                    hint="To determine cage the size"
                  />
                </div>
                <div class="column no-wrap q-py-md">
                  <p class="q-ma-none q-mb-sm">Sex</p>
                  <q-select
                    v-model="petTransferInfo.sex"
                    outlined
                    :options="sexOption"
                    map-options
                    dense
                    :rules="[(val) => !!val || 'Sex is required!']"
                    style="width: 200px"
                    behaviour="menu"
                  />
                </div>
                <div class="column no-wrap q-py-md q-mr-md">
                  <p class="q-ma-none q-mb-sm">Has Anti-rabbies?</p>
                  <q-select
                    v-model="petTransferInfo.has_anti_rabies"
                    outlined
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 2 },
                    ]"
                    map-options
                    emit-value
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                  />
                </div>
                <div class="column no-wrap q-py-md q-mr-md">
                  <p class="q-ma-none q-mb-sm">Has been Dewormed?</p>
                  <q-select
                    v-model="petTransferInfo.has_been_dewormed"
                    outlined
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 2 },
                    ]"
                    map-options
                    emit-value
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                  />
                </div>
                <div class="column no-wrap q-py-md q-mr-md">
                  <p class="q-ma-none q-mb-sm">Sleeping Place</p>
                  <q-select
                    v-model="petTransferInfo.pet_sleeping_place"
                    outlined
                    :options="[
                      { label: 'Indoor', value: 1 },
                      { label: 'Outdoor', value: 2 },
                    ]"
                    emit-value
                    map-options
                    dense
                    :rules="[(val) => !!val || 'This field is required!']"
                    style="width: 200px"
                    behaviour="menu"
                  />
                </div>
                <div class="column no-wrap q-pb-md q-mr-sm" style="width: 100%">
                  <p class="q-ma-none q-mb-sm">Behaviour</p>
                  <q-input
                    outlined
                    placeholder="Explain in words"
                    dense
                    type="textarea"
                    v-model="petTransferInfo.behaviour"
                    :rules="[(val) => !!val || 'Behaviour is required!']"
                  />
                </div>
                <div class="column no-wrap q-pb-md q-mr-sm" style="width: 100%">
                  <p class="q-ma-none q-mb-sm">Reason for transfer</p>
                  <q-input
                    outlined
                    placeholder="Explain in words"
                    dense
                    type="textarea"
                    v-model="petTransferInfo.reason_for_transfer"
                    :rules="[(val) => !!val || 'Reason is required!']"
                  />
                </div>
              </div>
            </div>
          </q-step>

          <q-step :name="2" title="Upload Image" icon="sym_r_add_photo_alternate" :done="step > 2">
            <div class="row no-wrap justify-between items-start">
              <div class="column no-wrap">
                <h5 class="q-mb-sm q-mt-none">Upload Photo</h5>
                <p class="text-caption">Upload a photo with you pet</p>
              </div>
              <q-btn
                label="Choose image"
                icon="sym_r_add_a_photo"
                flat
                dense
                @click="showFolder()"
              />
              <q-file
                v-model="petTransferInfo.file"
                ref="fileInput"
                label="Standard"
                class="hidden"
                accept=".jpg, .pdf, image/*"
                @update:model-value="imageFnUpdate()"
              />
            </div>
            <div class="flex flex-center q-my-md">
              <q-img
                :src="previewImage"
                class="light-border-dashed radius-10"
                height="200px"
                width="200px"
              />
            </div>
            <div class="text-center text-negative q-my-md" v-if="showFileError">
              Image with your pet is required!
            </div>
            <div class="row no-wrap justify-start items-start q-mb-md">
              <q-icon name="sym_r_error" size="1.2rem" color="negative" class="q-mr-sm" />
              <p class="q-ma-none text-grey-7">
                Please note that not all pet transfer requests are guaranteed to be approved, as the
                organization assesses shelter availability.
              </p>
            </div>
          </q-step>

          <q-step :name="3" title="Result" icon="sym_r_verified">
            <div class="full-width">
              <h5 class="q-mb-sm q-mt-none">Transfer Request sent</h5>
              <p class="text-caption">The result of your request will show here .</p>
              <div>
                <p class="text-overline text-amber" v-if="requestResult == null">
                  waiting result...
                </p>
                <div class="result" v-if="requestResult != null">
                  <div class="row no-wrap items-center q-my-sm">
                    <p class="text-overline text-amber q-ma-none q-mr-sm">Result:</p>
                    <div
                      class="row no-wrap items-center q-px-md"
                      :style="
                        transferTransaction.status == 1
                          ? {
                              border: '1px solid orange',
                              borderRadius: '2px',
                            }
                          : transferTransaction.status == 2
                            ? {
                                border: '1px solid green',
                                borderRadius: '2px',
                              }
                            : { border: '1px solid red', borderRadius: '2px' }
                      "
                    >
                      <q-icon
                        :name="
                          transferTransaction.status == 1
                            ? 'sym_r_schedule'
                            : transferTransaction.status == 2
                              ? 'sym_r_check_circle'
                              : 'sym_r_cancel'
                        "
                        size="xs"
                        class="q-mr-sm"
                        :color="
                          transferTransaction.status == 1
                            ? 'orange'
                            : transferTransaction.status == 2
                              ? 'positive'
                              : 'negative'
                        "
                      />
                      <p
                        class="q-ma-none"
                        :class="{
                          'text-orange': transferTransaction.status == 1,
                          'text-positive': transferTransaction.status == 2,
                          'text-negative': transferTransaction.status == 3,
                        }"
                      >
                        {{
                          transferTransaction.status == 1
                            ? 'Pending'
                            : transferTransaction.status == 2
                              ? 'Approved'
                              : 'Disapproved'
                        }}
                      </p>
                    </div>
                  </div>
                  <p v-if="transferTransaction.status == 1">
                    Your transfer request has been received and is currently under review. Please
                    allow up to
                    <strong>3 working days</strong> for our team to carefully evaluate your request.
                    <br /><br />
                    We appreciate your patience during this time. You will be notified once a
                    decision has been made. Thank you for your continued commitment to animal
                    welfare.
                  </p>
                  <p v-if="transferTransaction.status == 3">
                    Thank you for submitting your transfer request. After careful consideration, we
                    regret to inform you that your request has been declined. Unfortunately, due to
                    limitations in shelter capacity or other factors, we are unable to accommodate
                    the transfer at this time.
                    <br /><br />
                    We appreciate your understanding and encourage you to explore other options for
                    your pet’s well-being. If you have any further questions or need assistance,
                    feel free to reach out to us. Thank you for your compassion and commitment to
                    animals.
                  </p>
                  <p v-if="transferTransaction.status == 2">
                    Your transfer request has been approved! You can deliver your pet to our shelter
                    at your convenience. We look forward to welcoming them into our organization.
                    Thank you for your compassion and commitment to animals.
                  </p>
                  <div v-if="[2, 3].includes(transferTransaction.status)">
                    <q-separator class="q-mb-sm" />
                    <div>Note: You can apply again after 30 days!</div>
                  </div>
                </div>
              </div>
            </div>
          </q-step>
        </q-stepper>
        <div class="row no-wrap q-px-lg">
          <q-btn
            v-if="step != 3"
            :label="step == 2 ? 'Submit' : 'Continue'"
            type="submit"
            class="text-white bg-primary q-mb-xs"
            style="width: 100%"
          />
          <q-btn
            v-if="step == 2"
            label="Back"
            @click="step -= 1"
            style="width: 100%"
            outline
            color="primary"
            class="q-ml-md q-mb-xs"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { onMounted, ref } from 'vue'
import { petSizes, sexOption } from 'src/composable/optionsComposable'
import { getPetTransferRequest, submitPetTransfer } from 'src/composable/latestPublicComposable'
import { useQuasar } from 'quasar'
import { globalStore } from 'src/stores/global-store'
import { isPastThirtyDays } from 'src/composable/simpleComposable'
export default {
  setup() {
    const $q = useQuasar()
    const store = globalStore()
    const petTransferInfo = ref({ sex: 1 })
    const requestResult = ref(false)
    const step = ref(1)
    const fileInput = ref(null)
    const transferTransaction = ref([])
    const showFileError = ref(false)
    const showFolder = () => {
      fileInput.value && fileInput.value.$el.querySelector('input').click()
    }

    const submitTransfer = async () => {
      if (step.value != 2) {
        step.value += 1
        return
      }
      if (!petTransferInfo.value?.file) {
        showFileError.value = true
        return
      }
      showFileError.value = false
      $q.loading.show({ group: 'post', message: 'Submitting pet transfer. Pleast wait ...' })
      petTransferInfo.value.user_id = store.userData.user_id
      const response = await submitPetTransfer(
        petTransferInfo.value,
        store.userData.user_id,
        store.userData.user_type,
      )
      $q.loading.show({ group: 'post', message: response.message })
      console.log(response)
      if (response.status == 'success') {
        step.value = 3
      }
      transferTransaction.value = await getPetTransferRequest(store.userData.user_id)
      setTimeout(() => {
        $q.loading.hide()
      }, 500)
    }
    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(petTransferInfo.value.file)
    }
    onMounted(async () => {
      transferTransaction.value = await getPetTransferRequest(store.userData.user_id)
      console.log(transferTransaction.value)
      step.value = transferTransaction.value?.status
        ? 3
        : isPastThirtyDays(transferTransaction.value?.date_request)
          ? 1
          : 3
    })
    return {
      transferTransaction,
      showFileError,
      previewImage,
      imageFnUpdate,
      fileInput,
      submitTransfer,
      petSizes,
      sexOption,
      requestResult,
      petTransferInfo,
      miniStep: ref(1),
      step,
      showFolder,
    }
  },
}
</script>
<style lang="scss" scoped></style>
