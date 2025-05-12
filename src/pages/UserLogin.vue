<template>
  <q-page class="full-height no-padding">
    <div class="row no-wrap q-pa-md" style="height: 100vh">
      <div class="column no-wrap items-center" style="height: 100%; width: 45%">
        <div class="row no-wrap items-center full-width">
          <q-img src="TAARA_Logo.jpg" class="rad-100 q-mr-md" width="40px" />
          <div class="text-bold text-body1">
            <span class="text-primary">TAARA</span> <span class="text-grey-7">.Org</span>
          </div>
        </div>
        <div class="column no-wrap q-mr-md justify-center q-mt-xl" style="width: 70%">
          <div class="text-h5 text-bold fig-tree">Join Our Loving Community</div>
          <div class="text-grey-7 fig-tree">Cherishing the life of animals!</div>
          <q-form
            @submit="logInTaara(email_address, password)"
            class="full-width column justify-center items-center q-mt-xl"
            :class="fadeValue ? '' : 'fade-in'"
          >
            <div class="column no-wrap full-width">
              <p class="q-ma-none q-mb-sm">Username<span class="q-ml-sm text-negative">*</span></p>
              <q-input
                outlined
                label="Username"
                dense
                v-model="Username"
                :rules="[(val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Username is required!']"
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
                label="Ex: JuanDeLaCrus98@gmail.com"
                dense
                v-model="email_address"
                :rules="[(val) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email address is required!']"
                :error="showLoginError"
              />
            </div>
            <div class="column no-wrap q-pt-md full-width">
              <p class="q-ma-none q-mb-sm">Password<span class="q-ml-sm text-negative">*</span></p>
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
      </div>
      <div class="q-pa-md bg-white radius-10" style="width: 55%"></div>
    </div>
  </q-page>
</template>
<script src="../pages/script/login.js"></script>
<style lang="scss" scoped src="../pages/css/loginPage.scss"></style>
