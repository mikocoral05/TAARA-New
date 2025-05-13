<template>
  <q-page>
    <div class="all-container q-pb-xl">
      <div v-for="userDetails in logInDetails" :key="userDetails.id">
        <div class="q-pt-lg third-child-container">
          <h4
            v-if="forgotPassword == 0"
            class="q-ma-md q-mb-none q-pb-none text-center q-mt-md q-mb-xl title-first"
          >
            Security and Password
          </h4>
          <div v-if="forgotPassword == 0" class="column items-center">
            <div
              class="flex column justify-center q-px-xl items-center q-ma-none q-pa-none padding-controler"
            >
              <div class="p-input-container">
                <p class="q-mx-md q-mb-none q-mt-none">
                  <b>Current Password</b>
                </p>
                <div
                  class="q-mx-md flex column justify-center items-center q-ma-none q-pa-none"
                >
                  <q-input
                    dense
                    square
                    filled
                    class="q-ma-none full-width"
                    v-model="currentPassword"
                    label="New password"
                    :type="isPwd ? 'password' : 'text'"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                  <p class="text-red q-ma-none q-pa-none">
                    {{ wrongPassword }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex column jutify-center q-px-xl items-center q-ma-none q-pa-none q-my-md padding-controler"
            >
              <div class="p-input-container">
                <p class="q-mx-md q-mb-none q-mt-none"><b>New Password</b></p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input
                    class="q-ma-none full-width"
                    label="New password"
                    dense
                    square
                    filled
                    v-model="newPass"
                    :type="isPwde ? 'password' : 'text'"
                  >
                    <!-- <p class="hidden">{{ (userDetails.password = newPass) }}</p> -->
                    <template v-slot:append>
                      <q-icon
                        :name="isPwde ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwde = !isPwde"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div
              class="flex column q-px-xl justify-center items-center q-ma-none q-pa-none padding-controler"
            >
              <div class="p-input-container">
                <p class="q-mx-md q-mb-none q-mt-none">
                  <b>Confirm New Password</b>
                </p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input
                    class="q-mb-sm full-width"
                    label="Retype new password"
                    dense
                    square
                    filled
                    v-model="retypeNewPassword"
                    :type="isPwde ? 'password' : 'text'"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwde ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwde = !isPwde"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <p class="text-red text-center">{{ didNotMatchPassword }}</p>
            <div
              class="flex justify-center items-center update-cance-button-container"
            >
              <q-btn
                label="Update"
                class="text-white q-ma-sm update-button"
                @click="clickUpdatePassword(userDetails)"
                dense
                flat
              />
            </div>
            <div
              class="flex justify-center items-center update-cance-button-container"
            >
              <q-btn
                label="Cancel"
                class="q-ma-sm cancel-button"
                dense
                flat
                @click="$router.go(-1)"
              />
            </div>
            <div class="flex justify-center items-center" style="width: 100%">
              <q-btn
                dense
                flat
                label="Forgot Password?"
                no-caps
                @click="
                  (forgotPassword = true),
                    sendEmail(userDetails.email_address, body)
                "
              />
            </div>
          </div>

          <div class="flex justify-center items-center">
            <div
              v-if="forgotPassword == 2"
              class="outer_box q-mt-xl q-mb-xl q-mb-xl"
            >
              <h4 class="login q-ma-none q-mt-xl">
                We have send message to your email
              </h4>
              <h6 class="text-center q-mt-md" style="font-size: 17px">
                Enter the code below to proceed.
              </h6>
              <div class="flex justify-center items-center">
                <q-input
                  dense
                  type="number"
                  class="q-mx-lg q-mb-lg"
                  v-model.number="pin"
                  inputmode="numeric"
                  mask="####"
                  :input-style="{
                    fontSize: '30px',
                    letterSpacing: '25px',
                    textAlign: 'center',
                  }"
                  style="
                    width: 40%;
                    border: none;
                    border-bottom: 2px solid #b157ae;
                  "
                />
              </div>
              <div class="flex row justify-end items-end" style="width: 100%">
                <q-btn
                  rounded
                  filled
                  class="login_button q-mx-lg q-mb-lg text-white"
                  @click="confirmPin(pin)"
                  style="width: 150px"
                  ><p class="q-ma-none" style="font-size: 15px">Next</p></q-btn
                >
              </div>
            </div>
            <!-- ------------ -->
            <div
              class="outer_box q-mt-xl q-mb-xl q-mb-xl"
              v-if="forgotPassword == 3"
            >
              <h3 class="login">New Password</h3>
              <q-input
                dense
                filled
                class="email q-mx-lg q-mb-sm"
                v-model="password"
                label="New password"
                :type="isPwd ? 'password' : 'text'"
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
                class="password q-mx-lg q-mb-none"
                label="Confirm password"
                v-model="confirm_password"
                filled
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <p v-if="pop == true" class="text-red q-ml-lg q-ma-none">
                Password didn't match!
              </p>
              <q-btn
                rounded
                @click="
                  NewPassword(
                    password,
                    confirm_password,
                    userDetails.email_address
                  )
                "
                filled
                class="login_button q-mx-lg q-mb-lg q-mt-lg text-white"
                ><p class="q-ma-none" style="font-size: 15px">Confirm</p></q-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter class="footer"></PageFooter>
  </q-page>
</template>
<script src="../pages/taara/script/userSetting"></script>
<style lang="scss" scoped src="../pages/taara/style/userSetting.scss"></style>
