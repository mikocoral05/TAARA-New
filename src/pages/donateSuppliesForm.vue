<template>
  <q-page>
    <div class="flex justify-center items-center all-container">
      <div class="container flex column no-wrap q-ma-sm q-mb-xl q-mx-lg">
        <h4 class="text-center q-my-md title">Donate Supplies Form</h4>
        <div class="flex justify-center items-center">
          <q-img class="image" src="../image/TAARA_Logo.jpg" />
        </div>
        <div class="flex column justify-center items-center long-div-cantainer">
          <q-form
            @submit="submitForm(donatorDetails)"
            class="q-ma-none q-pa-none full-width column justify-center items-center"
          >
            <div class="long-div flex column justify-start items-start q-ma-md">
              <p class="q-ma-none">What would you like to donate?</p>

              <q-input
                class="div-details input"
                dense
                v-model="donatorDetails.summarize"
                outlined
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                readonly
                @click="card = true"
              >
                <template v-slot:append>
                  <q-icon name="list" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="long-div flex column justify-start items-start q-ma-md">
              <p class="q-ma-none">Notes</p>
              <q-input
                v-model="donatorDetails.supplies_details"
                flat
                class="div-details input-autgrow"
                dense
                type="textarea"
                outlined
                :rules="[(val) => !!val || '']"
                hide-bottom-space
              />
            </div>

            <div
              class="flex row justify-around items-center q-my-lg"
              style="width: 100%"
            >
              <q-btn
                class="back"
                filled
                flat
                label="Back"
                to="donation-channel"
                icon="arrow_left"
              />
              <q-btn
                class="submit"
                filled
                flat
                label="Submit"
                type="submit"
                icon-right="arrow_right"
              />
            </div>
          </q-form>
        </div>
      </div>
      <q-dialog v-model="card">
        <q-card class="my-card">
          <q-form @submit="conCat(donatorDetails)">
            <q-card-section class="text-center">
              <div class="text-subtitle1">What would you like to donate?</div>
            </q-card-section>

            <q-card-section class="q-py-none">
              <div class="row no-wrap">
                <div class="column input-label-container" style="width: 50%">
                  <label>Type of Donation</label>
                  <q-select
                    class="input"
                    outlined
                    dense
                    v-model="donatorDetails.donation_type"
                    lazy-rules
                    :options="typeOfDonation"
                    :rules="[(val) => (val && val.length > 0) || '']"
                    hide-bottom-space
                  />
                </div>
                <div
                  class="column q-ml-sm input-label-container"
                  style="width: 50%"
                >
                  <label>Quantity</label>
                  <q-input
                    type="number"
                    class="input"
                    v-model="donatorDetails.qty"
                    dense
                    outlined
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <div
                  class="column q-ml-sm input-label-container"
                  style="width: 80%"
                >
                  <label>Quantity type</label>
                  <q-select
                    class="input"
                    dense
                    outlined
                    :options="QuantityTypeOptions(donatorDetails.donation_type)"
                    v-model="donatorDetails.qty_type"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="text-caption text-grey q-ma-none q-pa-none q-mt-sm">
                This fields are required to know the type and No. of vehicles to
                use.
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions
              align="right"
              class="q-ma-none q-pa-none row justify-between items-center"
            >
              <q-btn
                v-close-popup
                flat
                class="q-ma-sm"
                color="primary"
                dense
                label="Cancel"
              />
              <q-btn
                class="q-ma-sm"
                flat
                color="primary"
                dense
                type="submit"
                label="Ok"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>

      <PageFooter class="q-mt-xl"></PageFooter>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import PageFooter from "src/components/PageFooter.vue";
import { useRouter } from "vue-router";
import { QSpinnerGears, useQuasar } from "quasar";
import { dateToday, timeNow } from "../composable/simpleComposable";
import {
  logInDetails,
  submitSuppliesForm,
} from "../composable/taaraComposable";
export default {
  components: {
    PageFooter,
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    let card = ref(true);
    let donatorDetails = ref({
      donator_id:
        logInDetails.value == null ? null : logInDetails.value[0].user_id,
      supplies_details: null,
      donation_type: null,
      qty: null,
      summarize: null,
      qty_type: null,
      donation_in_kind_status: 1,
      date: dateToday,
      time: timeNow,
    });
    let submitForm = (payload) => {
      submitSuppliesForm(payload)
        .then((response) => {
          if (response == "success") {
            setTimeout(() => {
              $q.notify({
                spinner: QSpinnerGears,
                message: "Thanks you for donating...",
                timeout: 1500,
                position: "center",
                color: "purple",
              });
            }, 100);
            setTimeout(() => {
              $q.notify({
                spinner: QSpinnerGears,
                message: "Redirecting to donation channel...",
                timeout: 500,
                position: "center",
                color: "purple",
              });
            }, 1500);
            setTimeout(() => {
              router.push("/donation-channel");
            }, 3500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    let QuantityTypeOptions = (type) => {
      if (type == "Food") {
        return [
          "Sack",
          "Box",
          "Carton",
          "Dozen",
          "Pound",
          "Pouch",
          "Kg",
          "mg",
          "Piece",
        ];
      } else if (type == "Medicine") {
        return [
          "Tablet",
          "Liquid Medication",
          "Cream and Ointment",
          "Vial or Ampoule",
          "Tab",
        ];
      } else if (type == "Supplies") {
        return ["Box", "Bundle", "Case", "Gallon", "Pieces"];
      }
    };
    let conCat = (details) => {
      donatorDetails.value.summarize =
        details.qty > 1
          ? details.qty +
            " " +
            details.qty_type +
            "s of " +
            details.donation_type
          : details.qty +
            " " +
            details.qty_type +
            " of " +
            details.donation_type;
      card.value = false;
    };
    let inputStyleAdjuster = ref(false);

    let handleWindowSize = () => {
      inputStyleAdjuster.value = window.innerWidth < 553;
    };
    onMounted(() => {
      window.addEventListener("resize", handleWindowSize);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", handleWindowSize);
    });
    return {
      inputStyleAdjuster,
      submitForm,
      // pop,
      alert,
      logInDetails,
      donatorDetails,
      card,
      typeOfDonation: ["Food", "Medicine", "Supplies"],
      QuantityTypeOptions,
      conCat,
    };
  },
};
</script>

<style
  lang="scss"
  scoped
  src="../pages/taara/style/donateSuppliesForm.scss"
></style>
