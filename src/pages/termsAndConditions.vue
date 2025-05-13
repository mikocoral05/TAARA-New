<template>
  <q-page class="container column justify-start items-center">
    <div class="background-image absolute-top"></div>
    <div class="first-child-terms">
      <div>
        <h3 class="text-left title">Terms & Conditions</h3>
        <p>
          At TAARA, we believe in transparency and accountability. Our Terms &
          Conditions outline the rules and regulations for the use of our
          website. By accessing our website, we assume you accept these terms
          and conditions. Do not continue to use TAARA's website if you do not
          agree to take all of the terms and conditions stated on this page.
        </p>
        <h6 class="q-mb-sm q-mt-md questions">
          In general, our Terms & Conditions cover the following:
        </h6>
        <ul>
          <li>
            Who can use our website and the requirements to create an account
            (if relevant)
          </li>
          <li>Key information about our adoption process</li>
          <li>Rights and responsibilities for adopters</li>
          <li>Ownership of content and logos</li>
          <li>Right to suspend or cancel an adoption application</li>
          <li>Limitation of liability</li>
          <li>Right to change and modify Terms</li>
          <li>Preference of law and dispute resolution</li>
          <li>Contact information</li>
        </ul>
      </div>
    </div>
  </q-page>
  <taaraFooter />
</template>
<script>
import { ref } from "vue";
import taaraFooter from "src/components/taaraFooter.vue";

export default {
  components: {
    taaraFooter,
  },
  setup() {
    let tabReference = ref(1);
    return {
      tabReference,
    };
  },
};
</script>
<style lang="scss" scoped src="../pages/taara/style/taaraFaqs.scss"></style>
