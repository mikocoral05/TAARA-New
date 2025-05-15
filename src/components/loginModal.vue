<template>
  <q-page>
    <q-dialog
      full-height
      full-width
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="showDialog"
    >
      <div class="flex row no-wrap absolute-center justify-center items-center q-px-md">
        <div class="flex column justify-center items-center left-container q-pa-xl">
          <div class="flex row no-wrap" style="width: 100%">
            <img src="../image/cat-png-26.png" alt="" height="60" width="40" />
            <div class="flex column">
              <h6 class="q-ma-none h6-text">But wait...there’s more!</h6>
              <p style="white-space: preline">Please log in first to access our features</p>
            </div>
          </div>
          <q-input class="qinput bg-white" filled v-model="email_address" label="Email" dense />
          <q-input class="qinput bg-white" filled v-model="password" label="Password" dense />
          <p
            class="text-red q-pa-none q-ma-none"
            v-if="wrongUserOrPass === 'Wrong Username or Password!'"
          >
            {{ wrongUserOrPass }}
          </p>

          <q-btn
            class="q-ma-sm login-button"
            flat
            dense
            label="Log in"
            @click="
              (logIn(email_address, password),
              wrongUserOrPass == true ? (counterStore.showDialog = false) : '')
            "
            style="background: white; width: 100%; color: #b157ae; border-radius: 5px"
          />
          <q-btn
            flat
            dense
            label="Sign Up here"
            to="register"
            class="sign-up-button"
            @click="counterStore.showDialog = false"
          />
        </div>
        <div class="flex column justify-center items-center bg-white q-mr-sm q-pa-sm register-box">
          <h6 class="q-ma-sm" style="white-space: nowrap">Don’t have an account yet?</h6>
          <div class="flex no-wrap justify-center items-center q-ma-none">
            <p style="font-size: 15px; width: 100px; white-space: pre-line">
              Our pets would like to know you more...but you need to sign up first.
            </p>
            <div class="img q-mb-sm"></div>
          </div>
          <q-btn flat dense label="Sign Up here" to="register" style="color: #b157ae" />
        </div>
        <q-icon
          @click="counterStore.showDialog = false"
          name="close"
          class="text-white float-right close-button"
        />
      </div>
    </q-dialog>
  </q-page>
</template>
<script>
import { ref, defineComponent, watch } from 'vue'
import { logIn, wrongUserOrPass } from '../composable/taaraComposable'
import { useCounterStore } from '../stores/example-store'
export default defineComponent({
  name: 'loginModal',

  setup() {
    const counterStore = useCounterStore()
    let email_address = ref('')
    let password = ref('')
    watch(wrongUserOrPass, (newValue) => {
      if (newValue == true) {
        counterStore.showDialog = false
      }
    })
    return {
      logIn,
      wrongUserOrPass,
      counterStore,
      email_address,
      password,
      showDialog: ref(true),
    }
  },
})
</script>
<style lang="scss" scoped src="../pages/taara/style/loginModal.scss"></style>
