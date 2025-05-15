<template>
  <div class="column justify-start items-center">
    <div class="first-child">
      <div class="member-profile-card column justify-between no-wrap q-pa-lg">
        <q-icon name="photo_camera" size="sm" color="white" @click="imageShow()" />
        <input
          type="file"
          accept="image/*"
          ref="file"
          id="file"
          style="display: none"
          @change="handleFileUpload($event, 'profileImage')"
          :rules="[(val) => !!val || '']"
          hide-bottom-space
        />
        <div class="row no-wrap">
          <div class="img-container column justify-center items-center">
            <div class="row justify-center items-center" v-if="userInfo.image == ''">
              <h4 class="q-ma-none">
                {{ userInfo.first_name[0] }}
              </h4>
            </div>
            <img :src="userInfo.image" alt="" v-if="userInfo.image !== ''" />
          </div>
          <div class="column justify-end items-end">
            <h4 class="q-ma-md">
              {{ userInfo.first_name + ' ' + userInfo.last_name }}
            </h4>
          </div>
        </div>
      </div>
      <div class="tabs row no-wrap">
        <div
          @click="
            ((tab = 1),
            $router.push({
              path: '/account-settings',
              query: { 'my-account': null },
            }))
          "
          :style="
            tab == 1
              ? { borderTop: '2px solid black', color: 'grey' }
              : { borderTop: 'none', color: 'black' }
          "
        >
          My Account
        </div>

        <div
          @click="
            ((tab = 2),
            $router.push({
              path: '/account-settings',
              query: { 'email-password': null },
            }))
          "
          :style="
            tab == 2
              ? { borderTop: '2px solid black', color: 'grey' }
              : { borderTop: 'none', color: 'black' }
          "
        >
          Email & Password
        </div>
      </div>
      <div class="details q-pa-md column no-wrap" v-if="tab == 1">
        <div class="row no-wrap justify-between">
          <h5 class="q-ma-none account-title">Account</h5>
          <div class="row no-wrap btn-container">
            <!-- <q-btn
              class="q-mr-md text-black bg-white"
              label="Discard"
              no-caps
              flat
            /> -->
            <q-btn
              flat
              class="text-white bg-black"
              label="Update Info"
              no-caps
              @click="more = true"
            />
          </div>
        </div>
        <p class="">View and edit your personal info below.</p>
        <q-separator class="q-mt-md"></q-separator>
        <h6 class="q-mb-md">Personal Info</h6>
        <p class="q-mb-lg">Update your personal info.</p>

        <div class="row no-wrap justify-between q-mb-lg">
          <div class="column no-wrap each-div">
            <p class="q-mb-sm">First name</p>
            <q-input
              outlined
              dense
              v-model="userInfo.first_name"
              :rules="[(val) => !!val || '']"
              hide-bottom-space
              :readonly="more == false"
            />
          </div>
          <div class="column no-wrap each-div">
            <p class="q-mb-sm">Last name</p>
            <q-input
              outlined
              dense
              v-model="userInfo.last_name"
              :rules="[(val) => !!val || '']"
              hide-bottom-space
              :readonly="more == false"
            />
          </div>
        </div>
        <div class="row no-wrap justify-between q-mb-lg">
          <div class="column no-wrap each-div">
            <p class="q-mb-sm">Phone</p>
            <q-input
              mask="phone"
              v-model="userInfo.phone_number"
              prefix="+63"
              :rules="[(val) => !!val || '']"
              hide-bottom-space
              :readonly="more == false"
              dense
              outlined
            />
          </div>
        </div>

        <div v-if="more == true">
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">BirthDate</p>

              <q-input
                dense
                v-model="userInfo.birth_date"
                outlined
                mask="####-##-##"
                :rules="[(val) => !!val || '']"
                emit-value
                hide-bottom-space
                :readonly="more == false"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="userInfo.birth_date"
                        mask="YYYY-MM-DD"
                        emit-immediately
                        :title="userInfo.first_name"
                        subtitle="Birthday"
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Sex</p>
              <q-select
                v-model="userInfo.sex"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                emit-value
                map-options
                outlined
                :options="sex_options"
                :readonly="more == false"
              />
            </div>
          </div>
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Occupation</p>
              <q-input
                v-model="userInfo.occupation"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                :readonly="more == false"
              />
            </div>

            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Civil Status</p>
              <q-select
                v-model="userInfo.civil_status"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                emit-value
                map-options
                :options="civil_status_options"
                :readonly="more == false"
              />
            </div>
          </div>
          <h6 class="q-mb-md">Address</h6>
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">House No. / Apartment No. / Street</p>
              <q-input
                v-model="userInfo.street"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                :readonly="more == false"
              />
            </div>
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Baranggay</p>
              <q-input
                v-model="userInfo.brgy_name"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                :readonly="more == false"
              />
            </div>
          </div>
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">City/Municipality</p>
              <q-input
                v-model="userInfo.city_municipality"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                :readonly="more == false"
              />
            </div>
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Province</p>
              <q-input
                v-model="userInfo.province"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                dense
                outlined
                :readonly="more == false"
              />
            </div>
          </div>
        </div>
        <div class="row no-wrap justify-end btn-container" v-if="more == true">
          <q-btn
            class="q-mr-md text-black bg-white"
            label="Discard"
            no-caps
            flat
            @click="more = false"
          />
          <q-btn
            flat
            class="text-white bg-black"
            label="Save Changes"
            no-caps
            @click="updatePublicUserDetails(userInfo)"
          />
        </div>
      </div>

      <div class="details q-pa-md column no-wrap" v-if="tab == 2">
        <div class="row no-wrap justify-between">
          <h5 class="q-ma-none account-title">Email & Password</h5>
          <div class="row no-wrap btn-container"></div>
        </div>
        <p class="">View and change your email and password.</p>
        <q-separator class="q-mt-md"></q-separator>
        <div v-if="emailOrPassProgress == 0">
          <h6 class="q-mb-md">Log in Credentials</h6>
          <p class="q-mb-lg">Update your log in info.</p>

          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Email</p>
              <q-input
                outlined
                dense
                v-model="userInfo.email_address"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                readonly
              />
            </div>
            <q-btn
              icon="change_circle"
              dense
              label="Change"
              no-caps
              class="change-btn"
              flat
              @click="changeEmail()"
            />
          </div>
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Password</p>
              <q-input
                v-model="dummyPassword"
                readonly
                dense
                outlined
                :rules="[(val) => !!val || '']"
                hide-bottom-space
              />
            </div>
            <q-btn
              icon="change_circle"
              dense
              label="Change"
              no-caps
              class="change-btn"
              flat
              @click="changePass()"
            />
          </div>
        </div>
        <div v-if="emailOrPassProgress == 1" class="verification-container">
          <div>
            <h6 class="q-mb-sm">Verification</h6>
            <p class="text-caption">Input the code we sent in you email</p>
            <div class="code-container column justify-center items-center no-wrap">
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
              <q-btn
                label="Confirm"
                no-caps
                class="text-white bg-black q-mt-xl q-mb-xs q-px-lg confirm"
                @click="confirmCode()"
              />
            </div>
          </div>
        </div>
        <div v-if="emailOrPassProgress == 2">
          <h6 class="q-mb-md">Your new Email address</h6>

          <p class="q-mb-lg">you can now change your Email.</p>

          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Email</p>
              <q-input
                outlined
                dense
                v-model="newEmailAddress"
                :rules="[(val) => !!val || '']"
                hide-bottom-space
              />
            </div>
          </div>

          <q-btn
            icon="check"
            dense
            label="Confirm"
            no-caps
            class="change-btn"
            flat
            @click="updateChange()"
          />
        </div>
        <div v-if="emailOrPassProgress == 3">
          <h6 class="q-mb-md">Log in Credentials</h6>
          <p class="q-mb-lg">Update your password.</p>
          <q-form @submit="updateChange()">
            <div class="row no-wrap justify-between q-mb-lg">
              <div class="column no-wrap each-div">
                <p class="q-mb-sm">New Password</p>

                <q-input
                  label="Password"
                  dense
                  v-model="newPassword"
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
            </div>
            <div class="row no-wrap justify-between q-mb-lg">
              <div class="column no-wrap each-div">
                <p class="q-mb-sm">Retype Password</p>

                <q-input
                  label="Must match with your password"
                  dense
                  outlined
                  stack-label
                  v-model="retypePassword"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => val == newPassword || '']"
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
              <q-btn
                icon="check"
                dense
                label="Confirm"
                no-caps
                class="change-btn"
                flat
                type="submit"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
  <taaraFooter></taaraFooter>
</template>
<script src="./taara/script/accountSettings.js"></script>
<style lang="scss" scope src="../pages/taara/style/accountSettings.scss"></style>
