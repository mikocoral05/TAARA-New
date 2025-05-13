<template>
  <q-page class="container column justify-start items-center">
    <div class="background-image absolute-top"></div>
    <div class="first-child-privacy">
      <div>
        <h3 class="text-left title">Privacy Policy</h3>
        <p>
          A privacy policy is a statement that discloses some or all of the ways
          a website collects, uses, discloses, and manages the data of its
          visitors and customers. It fulfills a legal requirement to protect a
          visitor or client's privacy. ​ Countries have their own laws with
          different requirements per jurisdiction regarding the use of privacy
          policies. Make sure you are following the legislation relevant to your
          activities and location.
        </p>
        <h6 class="q-mb-sm q-mt-md questions">
          In general, what should you cover in your Privacy Policy?
        </h6>
        <p>
          1. What type of information do you collect? How do you collect
          information?
        </p>
        <p>2. Why do you collect such personal information?</p>
        <p>
          3. How do you store, use, share and disclose your site visitors'
          personal information?
        </p>
        <p>4. How (and if) do you communicate with your site visitors?</p>
        <p>
          5. Is your service targeting and collecting information from Minors?
        </p>
        <p>6. Privacy policy updates Contact Information</p>
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
