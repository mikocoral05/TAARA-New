<template>
  <div>
    <q-dialog v-model="counterStore.donationDialog" persistent>
      <div class="my-div column no-wrap q-pa-md">
        <q-form
          @submit="submitPublicDonation(donatorsInfo), (donateDialog = false)"
        >
          <div class="container-update-icon">
            <div class="text-purple">
              <q-icon
                class="update-icon"
                size="1.5rem"
                color="primary"
                name="wallet"
              />
            </div>
          </div>

          <div class="" style="position: relative; height: 300px">
            <q-img
              :src="`G-dt/GCash-MyQR-${decodeAnimalId(route.query.G)}.jpg`"
              class="absolute-center img-qr-code"
              style="width: 280px; height: 280px"
            />
          </div>
          <div
            class="flex column justify-center items-center full-width q-mb-xs"
          >
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
              @click="(imageOrReference = true), (reference = null)"
            />
            <q-btn
              label="Reference"
              dense
              outline
              no-caps
              size="sm"
              color="accent"
              @click="(imageOrReference = false), (donationImage = null)"
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
                  <q-spinner-ios color="primary" size="md" />
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
  </div>
</template>
<script>
import { defineComponent, watch, ref } from "vue";
import { useCounterStore } from "src/stores/example-store";
import { useRoute } from "vue-router";
import { createWorker } from "tesseract.js";
import {
  decodeAnimalId,
  resizeImage,
  dateToday,
  timeNow,
} from "src/composable/simpleComposable";
import {
  submitPublicDonation,
  logInDetails,
} from "src/composable/taaraComposable";
export default defineComponent({
  name: "donationDialog",

  setup() {
    const route = useRoute();
    const counterStore = useCounterStore();
    let donatorsInfo = ref({});
    let reference = ref(null);
    const imgPath = ref("G-dt/GCash-MyQR-0.jpg");
    let controlSpinner = ref(false);
    let imageOrReference = ref(true);
    let donationImage = ref(null);
    let dialog = ref(counterStore.donationDialog);

    let desireNumber = ref(500);
    watch(
      () => [donationImage.value, reference.value],
      (newVal, oldVal) => {
        (async () => {
          let obj = {
            donators_id: logInDetails.value[0].user_id,
            donation_amount: null,
            image: null,
            reference: null,
            donation_date: dateToday,
            donation_time: timeNow,
            donation_status: 1,
          };
          if (donationImage.value == null) {
            obj.reference = "Ref No. " + reference.value;
            obj.image = null;
            obj.donation_amount = null;
          } else {
            controlSpinner.value = true;
            const reader = new FileReader();
            reader.readAsDataURL(donationImage.value);
            reader.onload = () => {
              resizeImage(donationImage.value, 500, 500)
                .then(({ dataUrl, fileName }) => {
                  obj.image = dataUrl;
                })
                .catch((error) => {
                  console.error(error);
                });
            };
            const worker = await createWorker("eng");
            const {
              data: { text },
            } = await worker.recognize(donationImage.value);
            const amountRegex =
              /(Total Amount Sent|Amount|Php)\s*(\d+(\.\d{1,2})?)/gi;

            let match;
            const amounts = [];
            while ((match = amountRegex.exec(text)) !== null) {
              amounts.push(match[2]); // This will push only the numerical amounts to the array
              console.log(match);
            }
            donationImage.value !== null
              ? (obj.donation_amount = Number(amounts[0]))
              : null;
            const refNoRegex = /Ref No\.\s*([\d\s]+)/gi; // Adjusted to match the format of the reference number
            let refMatch;
            if ((refMatch = refNoRegex.exec(text)) !== null) {
              // This will set the reference number in the object
              donationImage.value !== null
                ? (obj.reference = refMatch[1])
                : (obj.reference = reference.value);
            }
            controlSpinner.value = false;
            await worker.terminate();
          }
          donatorsInfo.value = { ...obj };
          console.log(donatorsInfo.value);
        })();
      }
    );
    return {
      donatorsInfo,
      submitPublicDonation,
      route,
      desireNumber,
      decodeAnimalId,
      imgPath,
      donationImage,
      controlSpinner,
      imageOrReference,
      reference,
      dialog,
      counterStore,
    };
  },
});
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
