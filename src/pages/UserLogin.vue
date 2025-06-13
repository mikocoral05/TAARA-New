<template>
  <q-page class="full-height no-padding fig-tree relative-position bg-white">
    <div class="row no-wrap q-pa-md" style="height: 100vh">
      <div class="column left-contianer no-wrap items-center justify-center q-mr-md">
        <q-tab-panels v-model="tab" animated class="q-tab-panels">
          <q-tab-panel name="register" class="column no-wrap justify-center q-px-xl q-tab-panel">
            <q-form
              @submit="logInTaara(email_address, password)"
              class="full-width full-height column q-form justify-center items-center no-wrap q-mt-lg q-px-lg"
            >
              <div class="column no-wrap q-px-md">
                <div class="text-h5 text-bold fig-tree">
                  Join Us in Our Mission to Help Animals in Need
                </div>
                <div class="text-grey-7 fig-tree">
                  Dedicated to rescuing, caring for, and cherishing every animal's life.
                </div>
              </div>
              <q-stepper
                v-model="step"
                ref="stepper"
                color="primary"
                animated
                flat
                class="q-pa-none full-height full-width"
                style="min-height: 450px"
                contracted
              >
                <q-step
                  :name="1"
                  title="Basic info"
                  icon="sym_r_account_circle"
                  :done="step > 1"
                  class="q-pa-none"
                >
                  <div class="row no-wrap">
                    <div class="column no-wrap q-mr-md w-100">
                      <p class="q-ma-none q-mb-sm">
                        First name<span class="q-ml-sm text-negative">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="First name"
                        dense
                        v-model="userInfo.first_name"
                        :rules="[(val) => !!val || 'First name is required!']"
                        :error="showLoginError"
                      />
                    </div>
                    <div class="column no-wrap w-100">
                      <p class="q-ma-none q-mb-sm">
                        Last name<span class="text-negative q-ml-sm">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="Last name"
                        dense
                        v-model="userInfo.last_name"
                        :rules="[(val) => !!val || 'Last name is required!']"
                      />
                    </div>
                  </div>
                  <div class="row no-wrap">
                    <div class="column no-wrap w-100 q-mr-md">
                      <p class="q-ma-none q-mb-sm">
                        Occupation<span class="q-ml-sm text-grey-7">( optional )</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="Occupation"
                        dense
                        v-model="userInfo.occupation"
                      />
                    </div>
                    <div class="column no-wrap w-100">
                      <p class="q-ma-none q-mb-sm">
                        Civil status<span class="text-negative q-ml-sm">*</span>
                      </p>

                      <q-select
                        v-model="userInfo.civil_status"
                        :rules="[(val) => !!val || 'Civil status is required!']"
                        outlined
                        dense
                        :options="civilStatusOption"
                        emit-value
                        map-options
                      />
                    </div>
                  </div>
                  <div class="row no-wrap">
                    <div class="column no-wrap w-100 q-mr-md">
                      <p class="q-ma-none q-mb-sm">
                        Birth date<span class="text-negative q-ml-sm">*</span>
                      </p>
                      <q-input
                        class="input"
                        outlined
                        v-model="userInfo.birth_date"
                        dense
                        mask="####-##-##"
                        :rules="[(val) => !!val || 'Birth date is required']"
                        stack-label
                        placeholder="####-##-##"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date
                                v-model="userInfo.birth_date"
                                :title="userInfo.first_name"
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
                    <div class="column no-wrap w-100">
                      <p class="q-ma-none q-mb-sm">
                        Phone Number<span class="q-ml-sm text-negative"> *</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="(947) 856 - 7856"
                        dense
                        v-model="userInfo.phone_number"
                        :rules="[Phone, (val) => !!val || 'Phone number is required!']"
                        prefix="+63"
                        mask="phone"
                        hint="We will send otp in this number"
                        error-message="Number already registered!"
                        :error="showPhoneError"
                      >
                      </q-input>
                    </div>
                  </div>
                </q-step>

                <q-step :name="2" title="Address" icon="sym_r_location_on" :done="step > 2">
                  <div class="row no-wrap">
                    <div class="column no-wrap q-mr-md w-100">
                      <p class="q-ma-none q-mb-sm">
                        Street<span class="q-ml-sm text-negative">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="Street"
                        dense
                        v-model="userInfo.street"
                        :rules="[(val) => !!val || 'Street is required!']"
                      />
                    </div>
                    <div class="column no-wrap w-100">
                      <p class="q-ma-none q-mb-sm">
                        Barangay<span class="text-negative q-ml-sm">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="Barangay"
                        dense
                        v-model="userInfo.brgy_name"
                        :rules="[(val) => !!val || 'Barangay is required!']"
                      />
                    </div>
                  </div>
                  <div class="row no-wrap">
                    <div class="column no-wrap w-100 q-mr-md">
                      <p class="q-ma-none q-mb-sm">
                        City or Municipality<span class="text-negative q-ml-sm">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="City or Municipality"
                        dense
                        v-model="userInfo.city_municipality"
                      />
                    </div>
                    <div class="column no-wrap w-100">
                      <p class="q-ma-none q-mb-sm">
                        Province<span class="text-negative q-ml-sm">*</span>
                      </p>
                      <q-input
                        outlined
                        placeholder="Province"
                        dense
                        v-model="userInfo.province"
                        :rules="[(val) => !!val || 'Province is required!']"
                      />
                    </div>
                  </div>
                </q-step>

                <q-step :name="3" title="Credentials" icon="sym_r_lock" :done="step > 3">
                  <div class="column no-wrap full-width">
                    <p class="q-ma-none q-mb-sm">
                      Username<span class="q-ml-sm text-negative">*</span>
                    </p>
                    <q-input
                      outlined
                      placeholder="Username"
                      dense
                      v-model="userInfo.username"
                      :rules="[(val) => !!val || 'Username is required!']"
                      hint="This will appear in your public profile"
                      error-message="This username is already taken!"
                      :error="showUsernameError"
                    />
                  </div>
                  <div class="column no-wrap full-width q-mt-md">
                    <p class="q-ma-none q-mb-sm">
                      Email Address<span class="text-negative q-ml-sm">*</span>
                    </p>
                    <q-input
                      outlined
                      placeholder="Email address"
                      dense
                      v-model="userInfo.email_address"
                      :rules="[
                        (val) => !!val || 'Email is required!',
                        (val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email is invalid!',
                      ]"
                      hint="We will send confirmation to this email!"
                      error-message="This email is already registered!"
                      :error="showEmailError"
                    />
                  </div>
                  <div class="column no-wrap q-pt-md full-width">
                    <p class="q-ma-none q-mb-sm">
                      Password<span class="q-ml-sm text-negative">*</span>
                    </p>
                    <q-input
                      outlined
                      label="Password"
                      dense
                      :type="isPwd ? 'password' : 'text'"
                      v-model="userInfo.password"
                      :rules="[(val) => !!val || 'Password is required!']"
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
                  <div class="column no-wrap full-width q-mb-xl q-mt-sm">
                    <div class="q-mb-md">Your password needs to include:</div>
                    <div class="row no-wrap items-center">
                      <q-icon
                        name="check_circle"
                        :color="includeNumber ? 'positive' : 'black'"
                        class="q-mr-sm"
                      />
                      <div>Must include one number</div>
                    </div>
                    <div class="row no-wrap items-center">
                      <q-icon
                        name="check_circle"
                        :color="minSixLenght ? 'positive' : 'black'"
                        class="q-mr-sm"
                      />
                      <div>Min 6 characters</div>
                    </div>
                  </div>
                </q-step>

                <q-step :name="4" title="Verification" icon="sym_r_vpn_key">
                  <div class="column no-wrap" v-if="!otpSent">
                    <div class="text-center">
                      Choose where to send the OTP to activate yoru account!
                    </div>
                    <div class="column no-wrap items-center justify-center q-mt-md">
                      <div
                        style="width: 200px"
                        class="radius-10 light-border row no-wrap q-pa-md q-px-lg items-center"
                        @click="registerVerification(2)"
                      >
                        <q-icon name="sym_r_phone_iphone" size="2rem" />
                        <div class="column no-wrap">
                          <div>Mobile phone</div>
                          <div class="text-grey-7">{{ userData?.phone_number }}</div>
                        </div>
                        <q-spinner-ios
                          color="primary"
                          size="2em"
                          class="q-ml-md"
                          v-if="loadingVar && emailOrPhone == 2"
                        />
                      </div>
                      <div
                        style="width: 200px"
                        class="radius-10 light-border q-mt-md row no-wrap q-pa-md q-px-lg items-center"
                        @click="registerVerification(1)"
                      >
                        <q-icon name="sym_r_mail" size="2rem" />
                        <div class="column no-wrap q-ml-md">
                          <div>Email</div>
                          <div class="text-grey-7">{{ userData?.email_address }}</div>
                        </div>
                        <q-spinner-ios
                          color="primary"
                          size="2em"
                          class="q-ml-md"
                          v-if="loadingVar && emailOrPhone == 1"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="column no-wrap q-pt-md full-width" v-if="otpSent">
                    <p class="q-ma-none q-mb-sm">
                      Enter the OTP sent to you choosen option<span class="q-ml-sm text-negative"
                        >*</span
                      >
                    </p>
                    <q-input
                      outlined
                      v-model="pin"
                      type="number"
                      dense
                      hint="Enter OTP send to your choosen option"
                      input-class="text-center text-body1"
                    />
                  </div>
                </q-step>
              </q-stepper>
              <div class="row no-wrap w-100 q-px-lg">
                <q-btn
                  :label="step == 4 ? 'SUBMIT' : 'CONTINUE'"
                  class="q-mr-md"
                  color="primary"
                  dense
                  style="width: 150px"
                  type="submit"
                >
                  <q-spinner-ios
                    color="white"
                    size="1.2rem"
                    class="q-ml-md"
                    v-if="loadingVar && [1, 3].includes(step)"
                /></q-btn>
                <q-btn
                  v-if="step > 1"
                  label="BACK"
                  @click="step -= 1"
                  color="primary"
                  dense
                  style="width: 150px"
                />
              </div>
              <q-separator class="q-mt-md"></q-separator>
              <p @click="tab = 'login'">
                <u>Already have an account? Login</u>
              </p>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="login" class="column q-tab-panel no-wrap justify-center q-px-xl">
            <div class="column no-wrap q-mr-md justify-center q-px-xl fd">
              <div class="text-h5 text-bold fig-tree">Welcome Back!</div>
              <div class="text-grey-7 fig-tree">
                Log in to continue supporting animals in need and access your account.
              </div>

              <q-form
                @submit="logInTaara()"
                class="full-width column justify-center items-center q-mt-lg"
              >
                <div class="column no-wrap full-width">
                  <p class="q-ma-none q-mb-sm">
                    Username or Email address<span class="q-ml-sm text-negative">*</span>
                  </p>
                  <q-input
                    placeholder="Username or Email address"
                    dense
                    outlined
                    v-model="userInfo.username"
                    :rules="[(val) => !!val || 'Username is required!']"
                  />
                </div>

                <div class="column no-wrap q-pt-md full-width">
                  <p class="q-ma-none q-mb-sm">
                    Password<span class="q-ml-sm text-negative">*</span>
                  </p>
                  <q-input
                    outlined
                    placeholder="Password"
                    dense
                    :type="isPwd ? 'password' : 'text'"
                    v-model="userInfo.password"
                    :rules="[(val) => !!val || 'Password is required!']"
                    :error="showPasswordError"
                    error-message="Username or Password is incorrect!"
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
                <div class="w-100 text-right">
                  <u @click="tab = 'forgot-password'">Forgot password?</u>
                </div>
                <q-btn
                  label="Login"
                  no-caps
                  class="bg-primary text-white full-width q-mt-xl"
                  type="submit"
                />
                <q-separator class="q-mt-md"></q-separator>
                <p @click="tab = 'register'">
                  <u>Don't have an account yet? Create now</u>
                </p>
              </q-form>
            </div>
          </q-tab-panel>

          <q-tab-panel
            name="forgot-password"
            class="q-tab-panel column no-wrap justify-center q-px-xl"
          >
            <div class="column no-wrap q-mr-md justify-center q-px-xl fd">
              <div class="text-h5 text-bold fig-tree">Forgot Password</div>
              <div class="text-grey-7 fig-tree">
                Enter your registered email or mobile number to reset your password and regain
                access to your account.
              </div>

              <q-form
                @submit="forgotPasswordStep > 1 ? validateForgotPassword() : forgotFn()"
                class="full-width q-form column justify-center items-center q-mt-lg"
              >
                <div class="column no-wrap q-pt-md full-width" v-if="forgotPasswordStep == 1">
                  <p class="q-ma-none q-mb-sm">
                    Enter Email or Phone number<span class="q-ml-sm text-negative">*</span>
                  </p>
                  <q-input
                    outlined
                    label="Email or Phone"
                    dense
                    v-model="forgotPasswordField"
                    :rules="[(val) => !!val || 'This field is required!']"
                  />
                </div>
                <div class="column no-wrap q-pt-md full-width" v-if="forgotPasswordStep == 2">
                  <p class="q-ma-none q-mb-sm">
                    Enter the OTP sent to you choosen option<span class="q-ml-sm text-negative"
                      >*</span
                    >
                  </p>
                  <q-input
                    outlined
                    v-model="pin"
                    type="number"
                    dense
                    hint="Enter OTP send to your choosen option"
                    input-class="text-center text-body1"
                  />
                </div>
                <div class="column no-wrap q-pt-md full-width" v-if="forgotPasswordStep == 3">
                  <div class="column no-wrap full-width">
                    <p class="q-ma-none q-mb-sm">
                      Input new password<span class="q-ml-sm text-negative">*</span>
                    </p>
                    <q-input
                      outlined
                      placeholder="New Password"
                      dense
                      :type="isPwd ? 'password' : 'text'"
                      v-model="userInfo.password"
                      :rules="[(val) => !!val || 'Password is required!']"
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
                  <div class="column no-wrap q-pt-md full-width">
                    <p class="q-ma-none q-mb-sm">
                      Password<span class="q-ml-sm text-negative">*</span>
                    </p>
                    <q-input
                      outlined
                      placeholder="Confirm New Password"
                      dense
                      :type="isPwd ? 'password' : 'text'"
                      v-model="userInfo.confirm_password"
                      :rules="[
                        (val) => !!val || 'Confirm Password is required!',
                        (val) => val == userInfo.password || `Password didn't match`,
                      ]"
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
                  <div class="column no-wrap full-width q-mb-xl q-mt-sm">
                    <div class="q-mb-md">Your password needs to include:</div>
                    <div class="row no-wrap items-center">
                      <q-icon
                        name="check_circle"
                        :color="includeNumber ? 'positive' : 'black'"
                        class="q-mr-sm"
                      />
                      <div>Must include one number</div>
                    </div>
                    <div class="row no-wrap items-center">
                      <q-icon
                        name="check_circle"
                        :color="minSixLenght ? 'positive' : 'black'"
                        class="q-mr-sm"
                      />
                      <div>Min 6 characters</div>
                    </div>
                  </div>
                </div>

                <q-btn
                  :label="
                    forgotPasswordStep == 1
                      ? 'SEND OTP'
                      : forgotPasswordStep == 2
                        ? 'VERIFY'
                        : 'CHANGE PASSWORD'
                  "
                  no-caps
                  class="bg-primary text-white full-width q-mt-xl"
                  type="submit"
                  :disable="loadingVar"
                >
                  <q-spinner-ios color="white" size="1.2rem" class="q-ml-md" v-if="loadingVar" />
                </q-btn>
                <q-separator class="q-mt-md"></q-separator>
                <p @click="tab = 'login'">
                  <u>Back to Login</u>
                </p>
              </q-form>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="bg-white radius-10 carousel-container" style="width: 55%">
        <q-carousel
          animated
          class="radius-10"
          v-model="slide"
          navigation
          infinite
          :autoplay="autoplay"
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
          height="100%"
        >
          <q-carousel-slide :name="1" img-src="login/1.jpg" />
          <q-carousel-slide :name="2" img-src="login/6.jpg" />
          <q-carousel-slide :name="3" img-src="login/7.jpg" />
          <q-carousel-slide :name="5" img-src="login/5.jpg" />
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>
<script src="../pages/script/login.js"></script>
<style lang="scss" scoped src="../pages/css/loginPage.scss"></style>
