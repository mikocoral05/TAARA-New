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
    <div class="row justify-between items-center second-layer">
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Contact</p>
        <p class="paragraph2">P-3 Burac St., San Lorenzo, Tabaco, Philippines</p>
        <p class="paragraph2">
          General Inquiries: <br />
          0905-523-8105
        </p>
        <p class="paragraph2">Donations: donate@taara.org</p>
      </div>
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Quick Links</p>
        <p class="paragraph2" @click="$router.push('/public/volunteer-form')">
          <u>Become a Volunteer</u>
        </p>
        <p class="paragraph2" @click="$router.push('/public/donation-channel')">
          <u>Donation Channel</u>
        </p>
        <p class="paragraph2" @click="$router.push('/public/termsAndConditions')">
          <u>Terms & Conditions</u>
        </p>
        <p class="paragraph2" @click="$router.push('/public/privacyPolicy')">
          <u>Privacy Policy</u>
        </p>
      </div>
      <div class="colum no-wrap justify-start items-center">
        <p class="paragraph1">Donate</p>
        <p class="paragraph2">Gcash Number: 0905-523-8105</p>
        <p class="paragraph2">BDO: 005150343294</p>
        <p class="paragraph2">PayPal: 0905-523-8105</p>
        <p class="paragraph2">Account Name: EDNALYN C.</p>
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
import { specificVolunteerFormData } from 'src/composable/taaraComposable'
import { useCounterStore } from 'src/stores/example-store'
import { useRouter } from 'vue-router'
import { globalStore } from 'src/stores/global-store'
export default defineComponent({
  name: 'TaaraFooter',

  setup() {
    const store = globalStore()
    const counterStore = useCounterStore()
    const router = useRouter()
    let restriction = () => {
      if (Object.keys(store.userData).length == 0) {
        counterStore.showDialog = true
      } else {
        router.push('volunteer-form')
      }
    }
    return {
      router,
      restriction,
      specificVolunteerFormData,
    }
  },
})
</script>

<style lang="scss" src="pages/css/taaraFooter.scss" scoped></style>
