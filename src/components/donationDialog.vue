<template>
  <div>
    <q-dialog v-model="counterStore.donationDialog" persistent>
      <div class="my-div column no-wrap q-pa-md">
        <q-form @submit="submitPublicDonationFn(donatorsInfo)">
          <div class="container-update-icon row no-wrap justify-between items-start">
            <div class="text-purple">
              <q-icon class="update-icon" size="1.5rem" color="primary" name="wallet" />
            </div>
            <q-toggle
              v-model="donatorsInfo.anonymous"
              true-value="yes"
              false-value="no"
              color="black"
              icon="sym_r_domino_mask"
              label="Anonymous"
              dense
            />
          </div>

          <div class="" style="position: relative; height: 300px">
            <q-img
              :src="`G-dt/GCash-MyQR-${route.query.amount}.jpg`"
              class="absolute-center img-qr-code"
              style="width: 280px; height: 280px"
            />
          </div>
          <div class="flex column justify-center items-center full-width q-mb-xs">
            <h6 class="text-center q-ma-none">Ednalyn Cristo</h6>
            <p class="text-center number q-mb-none">09324710384</p>
          </div>
          <div class="row no-wrap justify-center items-center btn-container">
            <q-btn
              label="Upload"
              dense
              filled
              no-caps
              size="sm"
              color="accent"
              class="q-mr-xs"
              @click="((imageOrReference = true), (reference = null))"
            />
            <q-btn
              label="Reference"
              dense
              outline
              no-caps
              size="sm"
              color="accent"
              @click="((imageOrReference = false), (donationImage = null))"
            />
          </div>
          <div class="q-mt-sm">
            <q-file
              v-if="imageOrReference == true"
              filled
              bottom-slots
              v-model="donationImage"
              stack-label
              counter
              dense
              hint="Please upload the proof of donation"
              :required="imageOrReference == true"
            >
              <template v-slot:append>
                <q-icon
                  v-if="donationImage !== null"
                  name="close"
                  @click.stop.prevent="donationImage = null"
                  class="cursor-pointer"
                />
                <div v-if="controlSpinner == true">
                  <q-spinner-ios color="primary" size="1.2rem" />
                  <q-tooltip :offset="[0, 8]">QSpinnerIos</q-tooltip>
                </div>
                <q-icon name="create_new_folder" @click.stop.prevent />
              </template>
            </q-file>
            <q-input
              v-else
              type="number"
              filled
              bottom-slots
              v-model="reference"
              counter
              dense
              maxlength="100"
              hint="Please Enter the reference Code"
              prefix="Ref No. "
              :required="imageOrReference == false"
            >
              <template v-slot:append>
                <q-icon
                  v-if="reference !== ''"
                  name="close"
                  @click="reference = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              filled
              dense
              v-model="donatorsInfo.allocated_for"
              class="q-mt-md"
              placeholder="Allocated for?"
              hint="Any notes for this donation?"
            />
          </div>
          <div class="row no-wrap justify-between q-mt-md btn-container">
            <q-btn
              class="cancelbtn text-center q-mr-sm"
              dense
              no-caps
              outline
              unelevated
              v-close-popup
              size="md"
              color="accent"
              label="Cancel"
            />
            <q-btn
              type="submit"
              class="savebtn text-center q-ml-sm"
              dense
              no-caps
              filled
              size="md"
              color="accent"
              label="Submit"
              :disable="imageOrReference && controlSpinner"
            />
          </div>
        </q-form>
      </div>
    </q-dialog>
    <OutputDialog v-model:outputDialog="outputDialog" v-model:outputObj="outputObj" />
  </div>
</template>
<script>
import { defineComponent, watch, ref } from 'vue'
import { useCounterStore } from 'src/stores/example-store'
import { useRoute } from 'vue-router'
import { createWorker } from 'tesseract.js'
import { globalStore } from 'src/stores/global-store'
import { useQuasar } from 'quasar'
import { submitPublicDonation } from 'src/composable/latestPublicComposable'
import OutputDialog from './OutputDialog.vue'

export default defineComponent({
  name: 'DonationDialog',
  components: { OutputDialog },
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const store = globalStore()
    const counterStore = useCounterStore()
    const donatorsInfo = ref({
      donor_id: store.userData.user_id,
      donation_type: 'cash',
      anonymous: 'no',
      donation_amount: '',
      allocated_for: '',
      notes: '',
      image: null,
    })
    const reference = ref(null)
    const imgPath = ref('G-dt/GCash-MyQR-0.jpg')
    const controlSpinner = ref(false)
    const imageOrReference = ref(true)
    const donationImage = ref(null)
    const dialog = ref(counterStore.donationDialog)

    const desireNumber = ref(500)
    watch(
      () => [donationImage.value, reference.value],
      async () => {
        if (donationImage.value == null) {
          donatorsInfo.value.reference_code = reference.value
          donatorsInfo.value.image = null
          donatorsInfo.value.donation_amount = null
        } else {
          controlSpinner.value = true

          try {
            const reader = new FileReader()
            reader.readAsDataURL(donationImage.value)
            await new Promise((resolve) => {
              reader.onload = resolve
            })

            donatorsInfo.value.image = donationImage.value

            const worker = await createWorker('eng')
            const {
              data: { text },
            } = await worker.recognize(donationImage.value)

            const amountRegex = /(Total Amount Sent|Amount|Php)\s*(\d+(\.\d{1,2})?)/gi
            const amounts = []
            let match
            while ((match = amountRegex.exec(text)) !== null) {
              amounts.push(match[2])
            }
            if (amounts[0]) donatorsInfo.value.donation_amount = Number(amounts[0])

            const refNoRegex = /Ref No\.\s*([\d\s]+)/gi
            const refMatch = refNoRegex.exec(text)
            if (refMatch && refMatch[1]) {
              donatorsInfo.value.reference_code = refMatch[1]
            } else {
              donatorsInfo.value.reference_code = reference.value
            }

            await worker.terminate()
          } catch (err) {
            console.error('Error processing donation image:', err)
          } finally {
            controlSpinner.value = false
          }
        }

        console.log(donatorsInfo.value)
      },
    )
    const outputDialog = ref(false)
    const outputObj = ref({})
    const submitPublicDonationFn = async () => {
      $q.loading.show({ message: 'Sending donation. please wait...' })
      const response = await submitPublicDonation(donatorsInfo.value)
      setTimeout(() => {
        $q.loading.hide()
        outputDialog.value = true
        outputObj.value = {
          icon: 'check_circle',
          title: response.message,
          subtext: 'Donation has been recorded and is now pending for verification.',
        }
      }, 1000)
    }
    return {
      outputObj,
      outputDialog,
      submitPublicDonationFn,
      donatorsInfo,
      route,
      desireNumber,
      imgPath,
      donationImage,
      controlSpinner,
      imageOrReference,
      reference,
      dialog,
      counterStore,
    }
  },
})
</script>
<style lang="scss" scoped>
.my-div {
  width: 450px;
  border-radius: 10px;
  background-color: #f9f9f9;
  .number {
    font-size: 17px;
    border-bottom: 1px solid #922d84;
    width: 200px;
  }
  .img-qr-code {
    border-image: linear-gradient(#ea9921, #922d84) 30; /* Gradient colors */
    border-width: 1px; /* Border width */
    border-style: solid; /* Border style (solid, dashed, etc.) */
  }

  .btn-container {
    .q-btn {
      width: 90px;
    }
  }
}
</style>
