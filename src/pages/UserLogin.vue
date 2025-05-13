<template>
  <q-page class="full-height no-padding fig-tree relative-position bg-white">
    <!-- <div class="row no-wrap items-center absolute-top q-pa-md">
      <q-img src="TAARA_Logo.jpg" class="rad-100 q-mr-md" width="40px" />
      <div class="text-bold text-body1">
        <span class="text-primary">TAARA</span> <span class="text-grey-7">.Org</span>
      </div>
    </div> -->
    <div class="row no-wrap q-pa-md" style="height: 100vh">
      <div
        class="column no-wrap items-center justify-center q-mr-md"
        style="height: 100%; width: 45%"
      >
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="register" class="column no-wrap justify-center q-px-xl">
            <div class="column no-wrap q-mr-md justify-center q-px-xl">
              <div class="text-h5 text-bold fig-tree">
                Join Us in Our Mission to Help Animals in Need
              </div>
              <div class="text-grey-7 fig-tree">
                Dedicated to rescuing, caring for, and cherishing every animal's life.
              </div>

              <q-form
                @submit="logInTaara(email_address, password)"
                class="full-width column justify-center items-center q-mt-lg"
                :class="fadeValue ? '' : 'fade-in'"
              >
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
                    :error="showLoginError"
                    hint="This will appear ini you public profile"
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
                  />
                </div>
                <div class="column no-wrap q-pt-md full-width">
                  <p class="q-ma-none q-mb-sm">
                    Password<span class="q-ml-sm text-negative">*</span>
                  </p>
                  <q-input
                    outlined
                    label="Password"
                    type="password"
                    dense
                    v-model="userInfo.password"
                    :rules="[(val) => !!val || 'Password is required!']"
                  />
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
                <q-btn
                  label="Sign In"
                  no-caps
                  class="bg-primary text-white full-width"
                  type="submit"
                />
                <q-separator class="q-mt-md"></q-separator>
                <p @click="tab = 'login'">
                  <u>Already have an account? Login</u>
                </p>
              </q-form>
            </div>
          </q-tab-panel>

          <q-tab-panel name="login" class="column no-wrap justify-center q-px-xl">
            <div class="column no-wrap q-mr-md justify-center q-px-xl">
              <div class="text-h5 text-bold fig-tree">Welcome Back!</div>
              <div class="text-grey-7 fig-tree">
                Log in to continue supporting animals in need and access your account.
              </div>

              <q-form
                @submit="logInTaara(email_address, password)"
                class="full-width column justify-center items-center q-mt-lg"
                :class="fadeValue ? '' : 'fade-in'"
              >
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
                    :error="showLoginError"
                    hint="This will appear ini you public profile"
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
                  />
                </div>
                <div class="column no-wrap q-pt-md full-width">
                  <p class="q-ma-none q-mb-sm">
                    Password<span class="q-ml-sm text-negative">*</span>
                  </p>
                  <q-input
                    outlined
                    label="Password"
                    type="password"
                    dense
                    v-model="userInfo.password"
                    :rules="[(val) => !!val || 'Password is required!']"
                  />
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
                <q-btn
                  label="Sign In"
                  no-caps
                  class="bg-primary text-white full-width"
                  type="submit"
                />
                <q-separator class="q-mt-md"></q-separator>
                <p @click="router.push('user-registration')">
                  <u>Already have an account? Login</u>
                </p>
              </q-form>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="bg-white radius-10" style="width: 55%">
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
