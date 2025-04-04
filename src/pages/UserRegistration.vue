<template>
  <q-page class="relative-position overflow-hidden">
    <div class="absolute-right circle-border1"></div>
    <div class="absolute-right circle-border2"></div>
    <div class="row no-wrap items-center">
      <q-img src="TAARA_Logo.jpg" class="rad-100 q-mr-md" width="40px" />
      <div class="text-bold text-body1">
        <span class="text-primary">TAARA</span> <span class="text-grey-7">.Org</span>
      </div>
    </div>
    <div class="flex flex-center h-100 w-100">
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        style="width: 1000px; max-width: 900px; min-height: 500px"
        class="bg-white z-max radius-10"
      >
        <q-step
          :name="1"
          title="Select Your Account Type"
          icon="sym_r_manage_accounts"
          :done="done1"
          class="flex flex-center"
        >
          <div class="text-center text-h6">Get Started by Selecting an Account Type</div>
          <div class="text-grey-7 text-center">Pick the option that best suits your role</div>
          <div class="row no-wrap flex flex-center q-px-xl" style="height: 400px">
            <q-card class="column q-pa-md no-wrap items-center q-mr-md light-border radius-10" flat>
              <q-img src="acc2.svg" width="100px" />
              <div class="text-h6 q-mt-md">Public User</div>
              <div class="text-center text-grey-7 q-mt-md text-body2">
                Access organization posts and updates, stay informed, and engage with shared
                content.
              </div>
            </q-card>
            <q-card class="column no-wrap q-pa-md items-center light-border radius-10" flat>
              <q-img src="acc1.svg" width="100px" />
              <div class="text-h6 q-mt-md">Volunteer</div>
              <div class="text-center q-mt-md text-grey-7 text-body2">
                Join the organization to actively support and care for animals through hands-on
                assistance.
              </div>
            </q-card>
          </div>
        </q-step>

        <q-step :name="2" title="Enter Detials" icon="sym_r_summarize" :done="done2"> </q-step>

        <q-step :name="3" title="Credentials" icon="sym_r_lock_clock" :done="done3"> </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const step = ref(1)
    const done1 = ref(false)
    const done2 = ref(false)
    const done3 = ref(false)

    return { step, done1, done2, done3 }
  },
}
</script>
<style lang="scss" scope>
@use 'sass:map';
.circle-border1 {
  border: 1px solid $purple-2;
  width: 50vw;
  height: 100vh;
  border-radius: 100%;
  margin-top: -60px;
}
.circle-border2 {
  border: 1px solid $purple-2;
  width: 50vw;
  height: 90vh;
  border-radius: 100%;
  margin-top: 160px;
}
</style>
