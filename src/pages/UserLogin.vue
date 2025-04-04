<template>
  <!-- <div class="container row no-wrap q-pa-xl">
    <div class="left-div">
      <div class="border relative-position" :class="fadeValue ? '' : 'fade-in-left-right'">
        <div
          class="left-header row no-wrap full-width q-mt-lg q-pl-lg"
          v-if="fadeValue == true"
          :class="fadeValue ? 'fade-in' : ''"
        >
          <div class="column justify-start">
            <img src="taara-logo.jpg" alt="" />
          </div>
          <div class="column no-wrap justify-start text-black">
            <div class="title">TAARA</div>
            <div class="sub-title">
              Tabaco Animal Rescue and Adoption:<br />
              Giving every pet a chance at a loving<br />
              home. 🐾
            </div>
          </div>
        </div>
        <img src="login-removebg.png" alt="" class="absolute-bottom" />
      </div>
    </div>
    <div
      class="right-div column no-wrap justify-center items-center q-pa-xl relative-position"
      v-if="fadeValue == false"
    >
      <q-btn
        label="Home"
        no-caps
        flat
        class="absolute-top-right bg-primary text-white square"
        style="width: 100px; border-bottom-left-radius: 30%"
        to="home"
      />
      <div
        class="left-header row no-wrap full-width"
        v-if="fadeValue == false"
        :class="fadeValue ? '' : 'fade-in'"
      >
        <div class="column justify-start">
          <img src="TAARA_Logo.jpg" alt="" />
        </div>
        <div class="column no-wrap justify-start text-black">
          <div class="title">TAARA</div>
          <div class="sub-title">
            Tabaco Animal Rescue and Adoption:<br />
            Giving every pet a chance at a loving<br />
            home. 🐾
          </div>
        </div>
      </div>
      <q-form
        @submit="logInTaara(email_address, password)"
        class="full-width column justify-center items-center"
        :class="fadeValue ? '' : 'fade-in'"
        v-if="forgotPasswordStep == 0"
      >
        <h4 class="q-mt-md">Welcome Back</h4>

        <div class="column no-wrap q-py-md full-width">
          <p class="q-ma-none q-mb-sm">Email Address</p>
          <q-input
            outlined
            label="Ex: JuanDeLaCrus98@gmail.com"
            dense
            v-model="email_address"
            :rules="[(val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || '']"
            hide-bottom-space
          />
        </div>
        <div class="column no-wrap q-pt-md full-width">
          <p class="q-ma-none q-mb-sm">Password</p>
          <q-input
            outlined
            label="Password"
            type="password"
            dense
            v-model="password"
            :rules="[(val) => !!val || '']"
            hide-bottom-space
          />
        </div>
        <div class="full-width q-mb-xl row justify-between items-center no-wrap">
          <p class="text-red text-caption q-ma-none">{{ wrongUserOrPass }}</p>
          <q-btn
            flat
            type="submit"
            class="float-right"
            dense
            label="Forgot Password?"
            @click="forgotPassBtn(email_address)"
            no-caps
            style="width: 150px"
            :ripple="false"
          />
        </div>
        <q-btn label="Log In" no-caps class="bg-primary text-white" type="submit" rounded />
        <q-separator class="q-mt-md"></q-separator>
        <p @click="((fadeValue = true), resetLogInInfo())">
          <u>Don't have an account? Sign up</u>
        </p>
      </q-form>
      <q-form
        @submit="checkResetVerificationCode()"
        v-if="forgotPasswordStep == 1"
        :class="fadeValue ? '' : 'fade-in'"
      >
        <div class="full-width personal-info-fdiv q-mt-lg">
          <h5 class="q-mb-sm q-mt-none">Verification</h5>
          <p class="text-caption">Input the code we sent in you email</p>
          <div class="code-container column justify-center items-center">
            <div class="row no-wrap justify-center items-center">
              <q-input
                v-model="code"
                maxlength="4"
                :input-style="{
                  letterSpacing: '35px',
                  fontSize: '20px',
                  textAlign: 'center',
                  marginLeft: '25px',
                }"
                style="width: auto"
                :rules="[(val) => (!!val && val.length == 4) || '']"
              />
            </div>
            <div class="row no-wrap justify-center items-center">
              <q-btn
                label="Resend code?"
                no-caps
                size="md"
                flat
                rounded
                @click="resendVerification()"
                :disable="seconds !== 0"
              />
              <p v-if="seconds !== 0" class="q-ma-none">
                {{ minutes }}:{{ seconds < 10 ? '0' : '' }}{{ seconds }}
              </p>
            </div>
          </div>
        </div>
        <q-btn label="Confirm" rounded type="submit" class="text-white bg-primary" />
        <p class="text-center q-mt-sm" @click="forgotPasswordStep = 0">
          <u>Back</u>
        </p>
      </q-form>
      <q-form
        @submit="changePassBtn(email_address, password)"
        class="full-width column justify-center items-center"
        :class="fadeValue ? '' : 'fade-in'"
        v-if="forgotPasswordStep == 2"
      >
        <h4 class="q-mt-md q-mb-none">Change Your Password</h4>
        <p class="text-caption">Ensure your account is secure</p>
        <div class="column no-wrap q-py-md full-width">
          <p class="q-ma-none q-mb-sm">Password</p>
          <q-input
            label="Password"
            dense
            v-model="password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => val.length >= 8 || 'Password length atleast 8!']"
            hide-bottom-space
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="column no-wrap q-py-md full-width">
          <p class="q-ma-none q-mb-sm">Retype Password</p>
          <q-input
            label="Must match with your password"
            dense
            outlined
            stack-label
            v-model="registerRetypePass"
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => val == password || '']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>

        <q-btn label="Confirm" class="bg-primary text-white" type="submit" rounded />
        <q-separator class="q-mt-md"></q-separator>
        <p @click="((fadeValue = false), (forgotPasswordStep = 0))">
          <u>Already have an account? </u>
        </p>
      </q-form>
    </div>
    <div
      class="right-div column no-wrap justify-center items-center q-pa-xl relative-position"
      v-if="fadeValue == true"
    >
      <q-btn
        label="Home"
        no-caps
        flat
        class="absolute-top-right bg-primary text-white square"
        style="width: 100px; border-bottom-left-radius: 30%"
        to="home"
      />
      <div :class="fadeValue ? 'fade-in' : ''" class="full-width">
        <h5 class="q-ma-none q-px-lg text-bold">Register in 3 Steps</h5>
        <q-stepper v-model="step" color="primary" animated flat>
          <q-step :name="1" title="Personal Info" icon="settings" :done="step > 1">
            <q-form @submit="authenticationStep()" greedy>
              <div class="full-width personal-info-fdiv">
                <h5 class="q-mb-sm q-mt-none">Personal Info</h5>
                <p class="text-caption">Tell us about yourself</p>

                <div v-if="miniStep == 1">
                  <div class="column no-wrap q-py-md full-width">
                    <p class="q-ma-none q-mb-sm">First name</p>
                    <q-input
                      outlined
                      label="Ex: Juan DelaCrus"
                      dense
                      v-model="registerInfo.first_name"
                      stack-label
                      :rules="[(val) => !!val || '']"
                      hide-bottom-space
                    />
                  </div>
                  <div class="column no-wrap q-py-md q-pb-xl full-width">
                    <p class="q-ma-none q-mb-sm">Last name</p>
                    <q-input
                      outlined
                      label="Ex: Salvador"
                      dense
                      v-model="registerInfo.last_name"
                      stack-label
                      :rules="[(val) => !!val || '']"
                      hide-bottom-space
                    />
                  </div>
                </div>
                <div v-if="miniStep == 2">
                  <div class="row no-wrap justify-between">
                    <div class="column no-wrap q-py-md q-mr-sm" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">Birthdate</p>

                      <q-input
                        class="input"
                        outlined
                        v-model="registerInfo.birth_date"
                        label="Ex: 2000-05-12"
                        dense
                        mask="####-##-##"
                        :rules="[(val) => !!val || '']"
                        stack-label
                        hide-bottom-space
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date
                                v-model="registerInfo.birth_date"
                                :title="registerInfo.first_name"
                                subtitle="Birthday"
                                today-btn
                                emit-immediately
                                mask="YYYY-MM-DD"
                                default-year-month="2000/01"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat rounded />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="column no-wrap q-py-md" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">Phone no.</p>

                      <q-input
                        outlined
                        dense
                        prefix="+63"
                        mask="phone"
                        v-model="registerInfo.phone_number"
                        class="phone-number"
                        stack-label
                        :rules="[
                          (val) => (!!val && val.length == 16) || '',
                          (val) => (val && val[1] === '9') || '',
                        ]"
                        hide-bottom-space
                      />
                    </div>
                  </div>
                  <div class="column no-wrap q-py-md q-pb-xl" style="width: 100%">
                    <p class="q-ma-none q-mb-sm">Sex</p>
                    <div class="row no-wrap">
                      <q-btn
                        icon="male"
                        label="Male"
                        no-caps
                        class="q-mr-sm"
                        @click="registerInfo.sex = 'male'"
                        :class="
                          registerInfo.sex == 'male'
                            ? 'bg-primary text-white'
                            : 'bg-white text-black'
                        "
                        rounded
                      />

                      <q-btn
                        icon="female"
                        label="Female"
                        no-caps
                        @click="registerInfo.sex = 'female'"
                        :class="
                          registerInfo.sex == 'female'
                            ? 'bg-primary text-white'
                            : 'bg-white text-black'
                        "
                        rounded
                      />
                    </div>
                  </div>
                </div>
                <div v-if="miniStep == 3">
                  <div class="row no-wrap justify-between">
                    <div class="column no-wrap q-py-md q-mr-sm" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">House No. / Apartment No. / Street</p>
                      <q-input
                        outlined
                        label="Ex: Purok 2"
                        dense
                        v-model="registerInfo.street"
                        :rules="[(val) => !!val || '']"
                        stack-label
                        hide-bottom-space
                      />
                    </div>
                    <div class="column no-wrap q-py-md" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">Baranggay</p>
                      <q-input
                        outlined
                        label="Ex: Salvacion"
                        dense
                        v-model="registerInfo.brgy_name"
                        :rules="[(val) => !!val || '']"
                        stack-label
                        hide-bottom-space
                      />
                    </div>
                  </div>
                  <div class="row no-wrap justify-between">
                    <div class="column no-wrap q-py-md q-mr-sm" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">City/Municipality</p>
                      <q-input
                        outlined
                        label="Ex: Daraga"
                        dense
                        v-model="registerInfo.city_municipality"
                        :rules="[(val) => !!val || '']"
                        stack-label
                        hide-bottom-space
                      />
                    </div>
                    <div class="column no-wrap q-py-md" style="width: 100%">
                      <p class="q-ma-none q-mb-sm">Province</p>
                      <q-input
                        outlined
                        label="Ex: Albay"
                        dense
                        v-model="registerInfo.province"
                        :rules="[(val) => !!val || '']"
                        stack-label
                        hide-bottom-space
                      />
                    </div>
                  </div>
                </div>
                <div v-if="miniStep == 4">
                  <div class="column no-wrap q-py-md q-mr-sm" style="width: 100%">
                    <p class="q-ma-none q-mb-sm">Occupation</p>
                    <q-input
                      outlined
                      label="Ex: Teacher"
                      dense
                      v-model="registerInfo.occupation"
                      :rules="[(val) => !!val || '']"
                      stack-label
                      hide-bottom-space
                    />
                  </div>
                  <div class="column no-wrap q-py-md" style="width: 100%">
                    <p class="q-ma-none q-mb-sm">Civil status</p>
                    <q-select
                      outlined
                      dense
                      v-model="registerInfo.civil_status"
                      map-options
                      emit-value
                      :options="civil_status_options"
                      :rules="[(val) => !!val || '']"
                      stack-label
                      hide-bottom-space
                    />
                  </div>
                </div>
              </div>
              <div class="row no-wrap personal-info-nav justify-end">
                <q-btn
                  label="1"
                  :class="miniStep1 == false ? 'bg-primary text-white' : ''"
                  @click="miniStepCheck(1)"
                />
                <q-btn
                  label="2"
                  :class="miniStep2 == false ? 'bg-primary text-white' : ''"
                  @click="miniStepCheck(2)"
                />
                <q-btn
                  label="3"
                  :class="miniStep3 == false ? 'bg-primary text-white' : ''"
                  @click="miniStepCheck(3)"
                />
                <q-btn
                  label="4"
                  @click="miniStepCheck(4)"
                  :class="miniStep4 == false ? 'bg-primary text-white' : ''"
                />
              </div>
              <q-stepper-navigation class="full-width">
                <q-btn color="primary" label="Continue" rounded type="submit" />
              </q-stepper-navigation>
            </q-form>
            <p class="q-ma-none text-center" @click="((fadeValue = false), resetRegisterInfo())">
              <u>Back to login</u>
            </p>
          </q-step>

          <q-step :name="2" title="Authentication" icon="create_new_folder" :done="step > 2">
            <q-form @submit="finishUp(registerInfo.email_address)">
              <div class="full-width">
                <h5 class="q-mb-sm q-mt-none">Email & Password</h5>
                <p class="text-caption">Create your login info</p>
                <div class="column no-wrap q-py-md full-width">
                  <p class="q-ma-none q-mb-sm">Email address</p>
                  <q-input
                    outlined
                    label="Ex: JuanDeLaCrus98@gmail.com"
                    dense
                    v-model="registerInfo.email_address"
                    stack-label
                    :rules="[(val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || '']"
                    hide-bottom-space
                  />
                  <p class="q-ma-none q-mt-xs text-caption q-ml-xs text-red">
                    {{ registerInfo.email_address == errorEmail ? 'Email already exist' : '' }}
                  </p>
                </div>
                <div class="column no-wrap full-width">
                  <p class="q-ma-none q-mb-sm">Password</p>

                  <q-input
                    label="Password"
                    dense
                    v-model="registerInfo.password"
                    outlined
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[(val) => (!!val && val.length >= 8) || 'Password length atleast 8!']"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-my-md full-width">
                  <p class="q-ma-none q-mb-sm">Retype password</p>
                  <q-input
                    label="Must match with your password"
                    dense
                    outlined
                    stack-label
                    v-model="registerRetypePass"
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[(val) => (!!val && val == registerInfo.password) || '']"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <q-stepper-navigation class="row no-wrap">
                <q-btn
                  flat
                  @click="step = 1"
                  color="primary"
                  label="Back"
                  class="q-mr-sm back"
                  rounded
                />
                <q-btn color="primary" label="Continue" type="submit" rounded />
              </q-stepper-navigation>
            </q-form>
            <p class="q-ma-none text-center" @click="((fadeValue = false), resetRegisterInfo())">
              <u>Back to login</u>
            </p>
          </q-step>

          <q-step :name="3" title="Finish Up" icon="assignment">
            <q-form @submit="createAccount(registerInfo)">
              <div class="full-width personal-info-fdiv">
                <h5 class="q-mb-sm q-mt-none">Verification</h5>
                <p class="text-caption">Input the code we sent in you email</p>
                <div class="code-container column justify-center items-center">
                  <div class="row no-wrap justify-center items-center">
                    <q-input
                      v-model="code"
                      maxlength="4"
                      :input-style="{
                        letterSpacing: '35px',
                        fontSize: '20px',
                        textAlign: 'center',
                        marginLeft: '25px',
                      }"
                      style="width: auto"
                      :rules="[(val) => (!!val && val.length == 4) || '']"
                    />
                  </div>
                  <div class="row no-wrap justofy-center items-center q-mt-xs">
                    <q-btn
                      label="Resend code?"
                      no-caps
                      size="md"
                      flat
                      rounded
                      @click="resendVerification()"
                      :disable="seconds !== 0"
                    />
                    <p v-if="seconds !== 0" class="q-ma-none">
                      {{ minutes }}:{{ seconds < 10 ? '0' : '' }}{{ seconds }}
                    </p>
                  </div>
                </div>
                <div class="row no-wrap justify-start items-center">
                  <q-checkbox size="lg" class="q-mr-sm" v-model="aggree" />
                  <p class="q-ma-none">
                    By proceeding, you are confirming that you agree to our
                    <u class="text-primary">Terms & Conditions</u> and acknowledge our
                    <u class="text-primary">Privacy Policy</u>.
                  </p>
                </div>
              </div>
              <q-btn
                label="Sign up"
                rounded
                type="submit"
                class="text-white bg-primary q-mt-lg q-mb-xs"
                :disable="aggree == false"
              />
            </q-form>
            <p class="text-center" @click="((fadeValue = false), resetRegisterInfo())">
              Already have an account?<u class="text-primary"> log in</u>
            </p>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </div> -->
  <q-page class="relative-position overflow-hidden">
    <div class="absolute-right circle-border1"></div>
    <div class="absolute-right circle-border2"></div>
    <div class="row no-wrap items-center">
      <q-img src="TAARA_Logo.jpg" class="rad-100 q-mr-md" width="40px" />
      <div class="text-bold text-body1">
        <span class="text-primary">TAARA</span> <span class="text-grey-7">.Org</span>
      </div>
    </div>
    <div class="row no-wrap h-100 q-pa-xl">
      <div class="w-40 column no-wrap flex flex-center">
        <div class="text-h5 text-bold">Welcome Back</div>
        <div class="text-grey-7">Enter you username and password to proceed!</div>
        <q-form
          @submit="logInTaara(email_address, password)"
          class="full-width q-px-xl column justify-center items-center q-mt-xl"
          :class="fadeValue ? '' : 'fade-in'"
        >
          <div class="column no-wrap full-width">
            <p class="q-ma-none q-mb-sm">Email Address</p>
            <q-input
              outlined
              label="Ex: JuanDeLaCrus98@gmail.com"
              dense
              v-model="email_address"
              :rules="[(val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || '']"
              :error="showLoginError"
            />
          </div>
          <div class="column no-wrap q-pt-md full-width">
            <p class="q-ma-none q-mb-sm">Password</p>
            <q-input
              outlined
              label="Password"
              type="password"
              dense
              v-model="password"
              :rules="[(val) => !!val || '']"
              :error="showLoginError"
              error-message="Username or Password is incorrect!"
            />
          </div>
          <div class="full-width q-mb-xl row justify-between items-center no-wrap">
            <p class="text-red text-caption q-ma-none">{{ wrongUserOrPass }}</p>
            <q-btn
              flat
              type="submit"
              class="float-right"
              dense
              label="Forgot Password?"
              @click="forgotPassBtn(email_address)"
              no-caps
              style="width: 150px"
              :ripple="false"
            />
          </div>
          <q-btn label="Log In" no-caps class="bg-primary text-white full-width" type="submit" />
          <q-separator class="q-mt-md"></q-separator>
          <p @click="router.push('user-registration')">
            <u>Don't have an account? Sign up</u>
          </p>
        </q-form>
      </div>
      <div class="w-60 relative-position">
        <q-img
          src="login-image1.jpeg"
          class="absolute-center radius-10"
          width="120%"
          style="margin-left: 250px"
        />
      </div>
    </div>
  </q-page>
</template>
<script src="../pages/script/login.js"></script>
<style lang="scss" scoped src="../pages/css/loginPage.scss"></style>
