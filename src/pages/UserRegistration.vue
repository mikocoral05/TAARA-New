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
        style="width: 1000px; max-width: 900px; min-height: 600px"
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
            <q-card
              class="column q-pa-md no-wrap items-center q-mr-md light-border radius-10"
              flat
              @click="((step = 2), (done1 = !done1))"
            >
              <q-img src="acc2.svg" width="100px" />
              <div class="text-h6 q-mt-md">Public User</div>
              <div class="text-center text-grey-7 q-mt-md text-body2">
                Access organization posts and updates, stay informed, and engage with shared
                content.
              </div>
            </q-card>
            <q-card
              class="column no-wrap q-pa-md items-center light-border radius-10"
              flat
              @click="((step = 2), (done1 = !done1))"
            >
              <q-img src="acc1.svg" width="100px" />
              <div class="text-h6 q-mt-md">Volunteer</div>
              <div class="text-center q-mt-md text-grey-7 text-body2">
                Join the organization to actively support and care for animals through hands-on
                assistance.
              </div>
            </q-card>
          </div>
        </q-step>

        <q-step :name="2" title="Enter Detials" icon="sym_r_summarize" :done="done2">
          <q-form class="column no-wrap justify-between" @click="((done2 = true), (step = 3))">
            <div class="column no-wrap">
              <div class="row no-wrap">
                <div class="column no-wrap">
                  <div class="text-body1">Basic Information:</div>
                  <div class="row">
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="First name"
                      v-model="registrationDetails.first_name"
                      :rules="[(val) => !!val || 'First name required!']"
                      hide-bottom-space
                    />
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="Middle name"
                      v-model="registrationDetails.middle_name"
                      :rules="[(val) => !!val || 'Middle name requried!']"
                      hide-bottom-space
                    />
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="Surname"
                      v-model="registrationDetails.last_name"
                      :rules="[(val) => !!val || 'Surname name requried!']"
                      hide-bottom-space
                    />
                    <q-select
                      class="q-mt-sm q-mr-md"
                      outlined
                      dense
                      v-model="registrationDetails.suffix"
                      :options="nameSuffixes"
                      hint="Suffix"
                    />
                    <q-select
                      class="q-mt-sm q-mr-md"
                      outlined
                      dense
                      v-model="registrationDetails.sex"
                      :options="sexOption"
                      hint="Sex"
                      :rules="[(val) => !!val || 'Sex required!']"
                      hide-bottom-space
                    />
                    <q-input
                      class="q-mt-sm q-mr-md"
                      outlined
                      dense
                      v-model="registrationDetails.birth_date"
                      mask="date"
                      :rules="['date']"
                      hint="Birthdate"
                      error-message="Birthdate required!"
                      hide-bottom-space
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="registrationDetails.birth_date">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <q-select
                      class="q-mt-sm q-mr-md"
                      outlined
                      dense
                      v-model="registrationDetails.civil_status"
                      :options="civilStatusOption"
                      hint="Civil status"
                      :rules="[(val) => !!val || 'Civil status required!']"
                      hide-bottom-space
                    />
                  </div>
                </div>
              </div>
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap">
                  <div class="text-body1">Address Information:</div>
                  <div class="row">
                    <q-input
                      dense
                      v-model="registrationDetails.street"
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="Street"
                      :rules="[(val) => !!val || 'Street required!']"
                      hide-bottom-space
                    />
                    <q-input
                      dense
                      v-model="registrationDetails.barangay_name"
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="Barangay Name"
                      :rules="[(val) => !!val || 'Barangay Name required!']"
                      hide-bottom-space
                    />
                    <q-input
                      dense
                      outlined
                      v-model="registrationDetails.city_or_municipality"
                      class="q-mt-sm q-mr-md"
                      hint="City or Municipality"
                      :rules="[(val) => !!val || 'City or Municipality required!']"
                      hide-bottom-space
                    />
                    <q-input
                      dense
                      outlined
                      v-model="registrationDetails.province"
                      class="q-mt-sm q-mr-md"
                      hint="Province"
                      :rules="[(val) => !!val || 'Province required!']"
                      hide-bottom-space
                    />
                  </div>
                </div>
              </div>
              <div class="row no-wrap q-mt-md">
                <div class="column no-wrap">
                  <div class="text-body1">Contact Details:</div>
                  <div class="row">
                    <q-input
                      dense
                      outlined
                      v-model="registrationDetails.email_address"
                      class="q-mt-sm q-mr-md"
                      hint="Email address"
                      :rules="[
                        (val) => !!val || 'Email address required!',
                        (val) => /.+@.+\..+/.test(val) || 'Enter a valid email address',
                      ]"
                    />
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm q-mr-md"
                      hint="Contact no."
                      v-model="registrationDetails.contact_no"
                      hide-bottom-space
                      :rules="[
                        (val) => !!val || 'Contact no. required!',
                        (val) =>
                          /^\+?[0-9]*$/.test(val) ||
                          'Only numbers and an optional + at the start are allowed',
                      ]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row no-wrap items-start q-mt-xl">
              <q-btn label="Back" no-caps outlined style="width: 200px" class="q-mr-md" />
              <q-btn label="Next" no-caps outlined style="width: 200px" color="primary" />
            </div>
          </q-form>
        </q-step>

        <q-step :name="3" title="Credentials" icon="sym_r_lock_clock" :done="done3">
          <div class="text-center text-h6">Get Started by Selecting an Account Type</div>
          <div class="text-grey-7 text-center">Pick the option that best suits your role</div>
          <q-form class="column no-wrap items-center" @click="((done3 = true), (step = 4))">
            <div class="column no-wrap q-mt-lg">
              <div class="row no-wrap">
                <div class="column no-wrap">
                  <div class="column">
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm"
                      hint="Username"
                      v-model="registrationDetails.username"
                      :rules="[(val) => !!val || 'Username required!']"
                      hide-bottom-space
                      style="width: 300px"
                    />
                    <q-input
                      v-model="registrationDetails.password"
                      dense
                      outlined
                      class="q-mt-sm"
                      :type="isPwd ? 'password' : 'text'"
                      hint="Password "
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                    <q-input
                      dense
                      outlined
                      class="q-mt-sm"
                      hint="Confirm password"
                      v-model="registrationDetails.last_name"
                      :rules="[
                        (val) => !!val || 'Must match with password!',
                        (val) => val != registrationDetails.password || 'Must match with password!',
                      ]"
                      hide-bottom-space
                      style="width: 300px"
                    />
                  </div>
                </div>
              </div>
            </div>
            <q-btn
              class="q-mt-lg"
              label="Create Account"
              no-caps
              outlined
              style="width: 300px"
              color="primary"
            />
          </q-form>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>
<script>
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import { ref } from 'vue'

export default {
  setup() {
    const step = ref(3)
    const done1 = ref(true)
    const done2 = ref(true)
    const done3 = ref(false)
    const registrationDetails = ref({ sex: 'Male', civil_status: 'Single', suffix: 'none' })
    return {
      sexOption,
      civilStatusOption,
      registrationDetails,
      nameSuffixes,
      step,
      done1,
      done2,
      done3,
      isPwd: ref(true),
    }
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
