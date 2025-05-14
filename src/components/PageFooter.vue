<template>
  <div class="containerFooter">
    <div class="first_text">
      <i>Looking for unconditional love? Visit the shelter today!</i>
    </div>
    <div class="tabaco_footer">
      <h5 class="q-mt-sm q-mb-md q-ml-md">
        <b>Tabaco Animal Rescue and Adoption</b>
      </h5>
    </div>
    <div class="lower_footer q-pl-md">
      <div class="flex column footer-square">
        <h4 class="title-footer-box">
          <b>Connect With Us</b>
        </h4>
        <p><q-icon class="icon" name="call" /> 0905-523-8105</p>
        <p>
          <q-icon class="icon" name="place" /> P-3 Burac St., San Lorenzo,
          Tabaco, Philippines
        </p>
        <div class="icon-container">
          <q-icon class="icon" name="mail" />
          <q-icon class="icon" name="facebook" />
          <q-icon class="icon" name="instagram" />
          <q-icon class="icon" name="tiktok" />
        </div>
      </div>
      <div class="flex column footer-square">
        <b
          ><q-btn
            flat
            to="donation-channel"
            dense
            class="btn--no-hover donation-channel-button"
          >
            <u><h4 class="q-ma-none">Our Donation Channel</h4></u></q-btn
          ></b
        >

        <p><b>Gcash Number:</b> 0905-523-8105</p>
        <p><b>BDO:</b> 005150343294</p>
        <p><b>PayPal:</b> 0905-523-8105</p>
        <p><b>Account Name:</b> EDNALYN C.</p>
      </div>
      <div class="flex column q-mr-md footer-square">
        <p class="footer_right_side">
          Help Us Rescue More Animals <br />
          Be A Volunteer Today!
        </p>
        <q-btn
          class="button_join_us"
          :disable="specificVolunteerFormData == true"
          @click="restriction()"
          flat
          dense
          >Join Us</q-btn
        >
      </div>
    </div>
    <div class="border-bottom"></div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import {
  logInDetails,
  specificVolunteerFormData,
} from "src/composable/taaraComposable";
import { useCounterStore } from "src/stores/example-store";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "PageFooter",

  setup() {
    const counterStore = useCounterStore();
    const router = useRouter();
    logInDetails.value = JSON.parse(localStorage.getItem("logInDetails"));
    let restriction = () => {
      if (logInDetails.value == null) {
        counterStore.showDialog = true;
      } else {
        router.push("volunteer-form");
      }
    };
    return {
      restriction,
      logInDetails,
      specificVolunteerFormData,
    };
  },
});
</script>
<style lang="scss" src="../pages/taara/style/pageFooter.scss" scoped></style>
