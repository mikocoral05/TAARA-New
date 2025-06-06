<template>
  <q-page>
    <div class="bg-white first-child radius-10">
      <div class="member-profile-card column justify-between no-wrap q-pa-lg">
        <q-icon name="photo_camera" size="sm" color="black" @click="triggerUpload()" />
        <q-file
          class="q-mt-sm hidden"
          v-model="userInfo.file"
          outlined
          dense
          ref="myFile"
          :readonly="mode == 'View'"
          @update:model-value="imageFnUpdate()"
        />
        <div class="row no-wrap">
          <div class="img-container column justify-center items-center">
            <div class="row justify-center items-center" v-if="userInfo.image == ''">
              <h4 class="q-ma-none">
                {{ userInfo.first_name }}
              </h4>
            </div>
            <q-img
              :src="
                previewImage
                  ? previewImage
                  : userInfo?.sex == 1
                    ? 'no-profile-male.svg'
                    : 'no-profile-female.svg'
              "
              class="radius-100 q-img"
            />
          </div>
          <div class="column justify-end items-end">
            <h4 class="q-ma-md">
              {{ store.userData.first_name + ' ' + store.userData.last_name }}
            </h4>
          </div>
        </div>
      </div>
      <div class="tabs row no-wrap">
        <div
          @click="tab = 1"
          :style="
            tab == 1
              ? { borderTop: '2px solid black', color: 'grey' }
              : { borderTop: 'none', color: 'black' }
          "
        >
          My Account
        </div>

        <div
          @click="tab = 2"
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
            <p class="q-mb-sm">Middle name <span class="text-grey-7">( optional )</span></p>
            <q-input outlined dense v-model="userInfo.middle_name" :readonly="more == false" />
          </div>
          <div class="column no-wrap each-div">
            <p class="q-mb-sm">Suffix <span class="text-grey-7">( optional )</span></p>
            <q-select
              v-model="userInfo.suffix"
              dense
              outlined
              :options="nameSuffixes"
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
              dense
              outlined
              :readonly="more == false"
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
                :options="sexOption"
                :readonly="more == false"
              />
            </div>
          </div>
          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Occupation <span class="text-grey-7">( optional )</span></p>
              <q-input v-model="userInfo.occupation" dense outlined :readonly="more == false" />
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
                :options="civilStatusOption"
                :readonly="more == false"
              />
            </div>
          </div>
          <div class="column q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Bio <span class="text-grey-7">( optional )</span></p>
              <q-input
                v-model="userInfo.bio"
                type="textarea"
                dense
                outlined
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
            @click="updateUserDataFn()"
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
              @click="((emailOrPassProgress = 1), (changeEmailOrPass = 1))"
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
              @click="((emailOrPassProgress = 1), (changeEmailOrPass = 2))"
            />
          </div>
        </div>
        <div class="column no-wrap q-mt-xl" v-if="emailOrPassProgress == 1">
          <div class="text-center">
            Choose where to send the OTP to change your
            {{ changeEmailOrPass == 1 ? 'Email' : 'Password' }}!
          </div>
          <div class="column no-wrap items-center justify-center q-mt-md">
            <div
              style="width: 300px"
              class="radius-10 bg-white light-border row no-wrap q-pa-md q-px-lg items-center"
              @click="sendEmailOrPhoneOtp(2)"
            >
              <q-icon name="sym_r_phone_iphone" size="2rem" class="q-mr-md" />
              <div class="column no-wrap">
                <div>Mobile phone</div>
                <div class="text-grey-7">+63 {{ userInfo?.phone_number }}</div>
              </div>
              <q-spinner-ios
                color="primary"
                size="2em"
                class="q-ml-md"
                v-if="loadingVar && emailOrPhone == 2"
              />
            </div>
            <div
              style="width: 300px"
              class="radius-10 bg-white light-border q-mt-md row no-wrap q-pa-md q-px-lg items-center"
              @click="sendEmailOrPhoneOtp(1)"
            >
              <q-icon name="sym_r_mail" size="2rem" />
              <div class="column no-wrap q-ml-md">
                <div>Email</div>
                <div class="text-grey-7">{{ userInfo?.email_address }}</div>
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

        <div v-if="emailOrPassProgress == 2" class="verification-container">
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
        <div v-if="emailOrPassProgress == 3 && changeEmailOrPass == 1">
          <h6 class="q-mb-md">Your new Email address</h6>

          <p class="q-mb-lg">you can now change your Email.</p>

          <div class="row no-wrap justify-between q-mb-lg">
            <div class="column no-wrap each-div">
              <p class="q-mb-sm">Email</p>
              <q-input
                outlined
                dense
                v-model="newEmailAddress"
                :rules="[(val) => !!val || 'Please input new email address!']"
                hide-bottom-space
                :error="showErrorEmailExist"
                error-message="This email already exist!"
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
        <div v-if="emailOrPassProgress == 4 && changeEmailOrPass == 2">
          <h6 class="q-mb-md">Log in Credentials</h6>
          <p class="q-mb-lg">Update your password.</p>
          <q-form @submit="updateChange()">
            <div class="row no-wrap justify-between q-mb-md">
              <div class="column no-wrap each-div">
                <p class="q-mb-sm">New Password</p>

                <q-input
                  placeholder="New password"
                  dense
                  v-model="newPassword"
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => !!val || 'New password is required!']"
                  :error="showErrorPassRequirement"
                  error-message="Didn't pass requrierements!"
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
                  placeholder="Enter your password again"
                  dense
                  outlined
                  stack-label
                  v-model="retypePassword"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => val == newPassword || `Password didn't match!`]"
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
              icon="check"
              dense
              label="Confirm"
              no-caps
              class="change-btn"
              flat
              type="submit"
            />
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref, watch } from 'vue'
import { sendTelerivetSms, getImageLink } from 'src/composable/simpleComposable'
import { logInDetails } from 'src/composable/taaraComposable'
import { globalStore } from 'src/stores/global-store'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  udpateUserInfo,
  updatePublicUserEmailAddress,
  updatePublicUserImage,
  updatePublicUserPassword,
} from 'src/composable/latestPublicComposable'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'
import { checkEmail, getUserInfo, sendChangeEmail } from 'src/composable/latestComposable'
import { watchEffect } from 'vue'

export default {
  setup() {
    const $q = useQuasar()
    const store = globalStore()
    const more = ref(false)
    const userInfo = ref({ ...store.userData })
    const dummyPassword = ref('*******************')
    const newPassword = ref(null)
    const retypePassword = ref(null)
    const emailOrPassProgress = ref(0)
    const newEmailAddress = ref(null)
    const tab = ref(1)
    const myFile = ref(null)
    const code = ref(null)
    const referenceCode = ref(Math.floor(1000 + Math.random() * 9000))

    const countdownTime = ref(2 * 60) // 2 minutes in seconds
    let timerId = null
    const minutes = ref(2)
    const seconds = ref(0)
    const emailOrPhone = ref(0)
    const loadingVar = ref(false)
    const changeEmailOrPass = ref(1)
    const showErrorEmailExist = ref(false)
    const minSixLenght = ref(false)
    const includeNumber = ref(false)
    const showErrorPassRequirement = ref(false)

    const changeSmsMess = (type = 1) => {
      const name = userInfo.value.first_name
      const code = referenceCode.value

      if (type === 1) {
        return (
          `Hello ${name},\n\n` +
          `We received a request to change the email address associated with your TAARA account. ` +
          `To confirm this change, please use the verification code below:\n\n` +
          `Verification Code: ${code}\n\n` +
          `If you did not request this change, please ignore this message or contact support.\n\n` +
          `- Tabaco Animal Rescue and Adoption (TAARA)`
        )
      }

      if (type === 2) {
        return (
          `Hello ${name},\n\n` +
          `We received a request to reset the password for your TAARA account. ` +
          `To proceed, please use the verification code below:\n\n` +
          `Verification Code: ${code}\n\n` +
          `If you did not request this, please ignore this message or contact support.\n\n` +
          `- Tabaco Animal Rescue and Adoption (TAARA)`
        )
      }

      return ''
    }

    const startCountdown = () => {
      countdownTime.value = 2 * 60 // reset to 10 seconds for testing
      minutes.value = Math.floor(countdownTime.value / 60)
      seconds.value = countdownTime.value % 60

      if (timerId) {
        clearInterval(timerId) // clear existing timer if any
      }

      timerId = setInterval(() => {
        if (countdownTime.value > 0) {
          countdownTime.value--
          minutes.value = Math.floor(countdownTime.value / 60)
          seconds.value = countdownTime.value % 60
        }

        if (countdownTime.value <= 0) {
          clearInterval(timerId)
        }
      }, 1000)
    }

    const sendEmailOrPhoneOtp = async (base) => {
      emailOrPhone.value = base
      loadingVar.value = true
      if (base == 1) {
        const response = await sendChangeEmail(userInfo.value.email_address, referenceCode.value)
        emailOrPassProgress.value = response.status == 'success' ? 2 : 1
        startCountdown()
      } else {
        const response = await sendTelerivetSms(
          userInfo.value.phone_number,
          changeSmsMess(changeEmailOrPass.value),
        )
        emailOrPassProgress.value = response.status == 'success' ? 2 : 1
        startCountdown()
      }
      loadingVar.value = false
    }

    const resendVerification = () => {
      sendEmailOrPhoneOtp(emailOrPhone.value)
      startCountdown()
    }

    const confirmCode = () => {
      if (referenceCode.value == code.value) {
        emailOrPassProgress.value = changeEmailOrPass.value == 1 ? 3 : 4
      }
    }

    const updateChange = async () => {
      if (changeEmailOrPass.value == 1) {
        const res = await checkEmail(newEmailAddress.value)
        if (res.data > 0) {
          showErrorEmailExist.value = true
          return
        }
        showErrorEmailExist.value = false
        $q.loading.show({ group: 'update', message: 'Updating new Email address. Please wait ...' })
        const response = await updatePublicUserEmailAddress(
          newEmailAddress.value,
          userInfo.value.user_id,
        )
        $q.loading.show({ group: 'update', message: response.message })
        setTimeout(() => {
          emailOrPassProgress.value = response.status == 'success' ? 0 : 3
          userInfo.value.email_address = newEmailAddress.value
          $q.loading.hide()
        }, 500)
      } else if (changeEmailOrPass.value == 2) {
        if (!minSixLenght.value || !includeNumber.value) {
          showErrorPassRequirement.value = true
          return
        }
        showErrorPassRequirement.value = false
        $q.loading.show({ group: 'update', message: 'Updating new password. Please wait ...' })
        const response = await updatePublicUserPassword(newPassword.value, userInfo.value.user_id)
        $q.loading.show({ group: 'update', message: response.message })
        setTimeout(() => {
          emailOrPassProgress.value = response.status == 'success' ? 0 : 3
          $q.loading.hide()
        }, 500)
      }
    }

    const updateUserDataFn = async () => {
      $q.loading.show({ group: 'update', message: 'Updating info. Please wait...' })
      const response = await udpateUserInfo(userInfo.value)
      setTimeout(() => {
        $q.loading.show({ group: 'update', message: response.message })
      }, 500)
      if (response.status == 'success') {
        const newData = await getUserInfo(userInfo.value.user_id)
        console.log(newData.data)
        store.userData = newData.data
        sessionStorage.setItem('user_data', JSON.stringify(newData.data))
        userInfo.value = newData.data
      }
      setTimeout(() => {
        $q.loading.hide()
      }, 1000)
    }

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(userInfo.value.file)
      console.log(previewImage.value)
    }

    const triggerUpload = () => {
      myFile.value.pickFiles()
    }

    onMounted(() => {
      previewImage.value = store.userData.image_path
      console.log(previewImage.value)
    })

    watch(
      () => userInfo.value.file,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          $q.loading.show({ group: 'update', message: 'Update your image. Please wait ...' })
          const response = await updatePublicUserImage(newVal, userInfo.value.user_id)
          $q.loading.show({ group: 'update', message: response.message })
          if (response.status == 'success') {
            const newData = await getUserInfo(userInfo.value.user_id)
            console.log(newData)
            store.userData = newData.data
            sessionStorage.setItem('user_data', JSON.stringify(newData.data))
          }
          setTimeout(() => {
            $q.loading.hide()
          }, 500)
        }
      },
    )

    watchEffect(() => {
      minSixLenght.value = newPassword.value?.length > 5
      includeNumber.value = /\d/.test(newPassword.value)
    })
    return {
      showErrorPassRequirement,
      minSixLenght,
      includeNumber,
      showErrorEmailExist,
      changeEmailOrPass,
      loadingVar,
      emailOrPhone,
      sendEmailOrPhoneOtp,
      triggerUpload,
      myFile,
      previewImage,
      imageFnUpdate,
      updateUserDataFn,
      nameSuffixes,
      getImageLink,
      store,
      isPwd: ref(false),
      newPassword,
      retypePassword,
      minutes,
      seconds,
      code,
      referenceCode,
      updateChange,
      newEmailAddress,
      confirmCode,
      resendVerification,
      userInfo,
      more,
      tab,
      logInDetails,
      dummyPassword,
      emailOrPassProgress,
      sexOption,
      civilStatusOption,
    }
  },
}
</script>
<style lang="scss" scope>
.first-child {
  .member-profile-card {
    height: 250px;
    div {
      .img-container {
        div {
          height: 100px;
          width: 100px;
          color: black;
          border-radius: 100%;
        }
        .q-img {
          height: 100px;
          width: 100px;
          border-radius: 100%;
          object-position: center;
          object-fit: cover;
        }
      }
    }
  }
  .tabs {
    div {
      font-size: 16px;
      padding: 15px 15px;
      margin: 0px 15px;
    }
  }
  .details {
    min-height: 500px;
    .account-title {
      font-size: 25px;
    }
    .btn-container {
      min-height: 36px;
      .q-btn {
        // font-size: 16px;
        border: 1px solid black;
        padding: 0px 25px;
      }
    }
    p {
      font-size: 16px;
    }
    .change-btn {
      height: 40px;
      background-color: black;
      color: white;
      padding: 0px 20px;
      margin-top: 30px;
    }
    .verification-container {
      .code-container {
        min-height: 200px;
        padding-top: 80px;
        .confirm {
          width: 300px;
          margin-top: 80px;
        }
      }
    }
  }
  .each-div {
    p {
      font-size: 14px;
    }
    .q-input {
      width: 400px;
    }
    .q-select {
      width: 400px;
    }
  }
}
</style>
