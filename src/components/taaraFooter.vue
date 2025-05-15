<template>
  <div class="containerFooter column no-wrap justify-center items-center bg-amber text-black">
    <div class="left-header row no-wrap full-width">
      <div class="column justify-start">
        <img src="../image/TAARA_Logo.jpg" />
      </div>
      <div class="column no-wrap justify-start">
        <div class="title">TAARA</div>
        <div class="sub-title">
          Tabaco Animal Rescue and Adoption:<br />
          Giving every pet a chance at a loving<br />
          home. 🐾
        </div>
      </div>
    </div>
    <div class="row no-wrap justify-between items-center second-layer">
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Contact</p>
        <p class="paragraph2">123 Main Street, Tabaco City, Philippines</p>
        <p class="paragraph2">General Inquiries: info@taara.org</p>
        <p class="paragraph2">Donations: donate@taara.org</p>
        <p class="paragraph2">Volunteer Opportunities: volunteer@taara.org</p>
      </div>
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Quick Links</p>
        <p class="paragraph2"><u>Adoption Process</u></p>
        <p class="paragraph2" @click="$router.push('/donation-channel')">
          <u>Donation Channel</u>
        </p>
        <p class="paragraph2" @click="$router.push('/termsAndConditions')">
          <u>Terms & Conditions</u>
        </p>
        <p class="paragraph2" @click="$router.push('/privacyPolicy')">
          <u>Privacy Policy</u>
        </p>
      </div>
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Donate</p>
        <p class="paragraph2">Sign up to get the latest updates on our mission and activities.</p>
      </div>
      <div class="column no-wrap justify-start items-center">
        <p class="paragraph1">Instagram</p>
        <p class="paragraph1">Twitter</p>
        <p class="paragraph1">Facebook</p>
      </div>
    </div>
    <div class="reserve bg-black q-pa-sm text-white full-width row justify-center items-center">
      <p class="q-ma-none">© 2024 by TAARA. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { logInDetails, specificVolunteerFormData } from 'src/composable/taaraComposable'
import { useCounterStore } from 'src/stores/example-store'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'taaraFooter',

  setup() {
    const counterStore = useCounterStore()
    const router = useRouter()
    logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))
    let restriction = () => {
      if (logInDetails.value == null) {
        counterStore.showDialog = true
      } else {
        router.push('volunteer-form')
      }
    }
    return {
      router,
      restriction,
      logInDetails,
      specificVolunteerFormData,
    }
  },
})
</script>

<style lang="scss" scoped>
.containerFooter {
  // background-color: #ffbf23;
  min-height: 60vh;
  .left-header {
    padding-left: 100px;
    margin-top: 100px;
    margin-bottom: 50px;
    img {
      padding: 3px;
      background: white;
      border-radius: 100%;
      margin-top: 8px;
      border: 1px solid lightgray;
      margin-right: 10px;
      color: white;
      height: 50px;
      width: 50px;
    }
    .title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: bold;
    }
    .sub-title {
      font-family: 'Proxima Nova', sans-serif;
      font-size: 14px;
    }
  }
  .second-layer {
    width: 1150px;
    div {
      min-height: 260px;
      width: 200px;
      margin: 20px; // background: green;
      .paragraph1 {
        font-family: 'Proxima Nova', sans-serif;
        font-size: 20px;
        font-weight: bold;
      }
      .paragraph2 {
        font-family: 'Proxima Nova', sans-serif; // font-size: 16px;
      }
    }
  }
  .reserve {
    font-family: 'Proxima Nova', sans-serif;
  }
}
</style>
