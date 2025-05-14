<template>
  <div
    v-for="userDetails in logInDetails"
    :key="userDetails.user_id"
    class="flex column justify-center items-center"
  >
    <div class="relative-position full-width">
      <q-icon
        name="arrow_back"
        size="2rem"
        style="color: #b157ae"
        class="arrow-back q-ml-md"
        @click="$router.go(-1)"
      />
      <h4 class="text-center q-my-sm q-mr-sm title">Edit Profile</h4>
    </div>
    <div class="q-mb-xl" style="max-width: 890px; width: 100%">
      <div class="small-image-container q-ma-none q-pa-none full-width">
        <div class="flex items-end justify-end q-mx-xl q-mb-sm image-container">
          <img
            :src="
              userdata.image
                ? userdata.image
                  ? userdata.image
                  : ''
                : userdata.image
                  ? userdata.image
                  : ''
            "
            alt=""
            class="profile-small text-center"
          />
          <q-btn class="filebtn text-black" @click="pickFile" icon="person_add" dense></q-btn>
          <input
            id="fileInput"
            type="file"
            style="display: none"
            @change="handleFileUpload($event, 'profileImage')"
          />
        </div>

        <div class="q-mx-xl all-margin-controler">
          e
          <h6 class="q-mx-md q-mb-none q-mt-none">
            <b>Personal Information</b>
          </h6>
          <div class="flex row q-my-sm justify-center items-center full-width no-wrap">
            <div class="flex column q-ma-none q-pa-none full-width">
              <p class="q-mx-md q-mb-none q-mt-none"><b>First Name</b></p>
              <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                <q-input v-model="userdata.first_name" dense filled class="full-width" />
              </div>
            </div>
            <div class="flex column q-ma-none q-pa-none full-width">
              <p class="q-mx-md q-mb-none q-mt-none"><b>Last Name</b></p>
              <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                <q-input v-model="userdata.last_name" dense filled class="full-width" />
              </div>
            </div>
          </div>
          <div
            class="flex row justify-center items-center q-my-sm full-width no-wrap mssb-container"
          >
            <div class="flex column q-ma-none q-pa-none full-width">
              <p class="q-mx-md q-mb-none q-mt-none"><b>Middle name</b></p>
              <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                <q-input v-model="userdata.middle_name" dense filled class="full-width" />
              </div>
            </div>
            <div class="flex row justify-center full-width items-center no-wrap ssb-container">
              <div class="flex row no-wrap q-pa-none q-ma-none full-width ss-container">
                <div class="suffix-container">
                  <p class="q-ma-none q-ml-sm text-bold">Suffix</p>
                  <q-select
                    v-model="userdata.suffix"
                    dense
                    filled
                    emit-value
                    :options="suffix_options"
                    class="suffix"
                  />
                </div>
                <div class="flex column q-ma-none q-pa-none sex-container">
                  <p class="q-mx-md q-mb-none q-mt-none"><b>Sex</b></p>
                  <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                    <q-select
                      v-model="userdata.sex"
                      dense
                      filled
                      emit-value
                      map-options
                      :options="sex_options"
                    />
                  </div>
                </div>
              </div>
              <div class="flex column q-mr-md birthdate-container full-width">
                <p class="q-ma-none q-ml-sm text-bold">Birthdate</p>
                <q-input
                  filled
                  dense
                  square
                  v-model="userdata.birth_date"
                  mask="date"
                  :rules="[(val) => !!val || '']"
                  class="birthdate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="userdata.birth_date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <div
            class="flex row q-my-sm justify-center full-width items-center no-wrap ocp-container"
          >
            <div class="flex row no-wrap oc-container">
              <div class="flex column q-ma-none q-pa-none full-width">
                <p class="q-mx-md q-mb-none q-mt-none"><b>Occupation</b></p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input
                    v-model="userdata.occupation"
                    dense
                    filled
                    class="full-width occupation"
                  />
                </div>
              </div>

              <div class="flex column q-ma-none q-pa-none full-width">
                <p class="q-mb-none q-mt-none"><b>Civil Status</b></p>
                <q-select
                  v-model="userdata.civil_status"
                  dense
                  filled
                  emit-value
                  map-options
                  :options="civil_status_options"
                  class="full-width civil-status"
                />
              </div>
            </div>
            <div class="flex column q-ma-none q-pa-none full-width phone-number-container">
              <p class="q-mx-md q-mb-none q-mt-none"><b>Phone Number</b></p>
              <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                <q-input
                  filled
                  dense
                  prefix="+63"
                  mask="phone"
                  v-model="userdata.phone_number"
                  class="phone-number"
                  :rules="[
                    (val) => (!!val && val.length == 16) || '',
                    (val) => (val && val[1] === '9') || 'Phone number must start with 9',
                  ]"
                  hide-bottom-space
                />
              </div>
            </div>
          </div>
          <div class="flex justify-start items-start q-my-sm">
            <div class="flex column q-ma-none q-pa-none q-mx-md" style="width: 500px">
              <h6 class="q-mb-none q-mt-none details-title">
                <b>Email Adrress</b>
              </h6>
              <div class="flex row justify-left items-center q-ma-none q-pa-none">
                <q-input
                  class="q-mx-md full-width"
                  dense
                  square
                  filled
                  :readonly="read == 0"
                  v-model="userdata.email_address"
                />
              </div>
            </div>
          </div>

          <div class="full-width">
            <h6 class="q-mx-md q-mb-none q-mt-none"><b>Address</b></h6>
            <div class="flex row justify-center items-center no-wrap full-width">
              <div class="flex column q-ma-none q-pa-none full-width">
                <p class="q-mx-md q-mb-none q-mt-none">
                  <b>House No. / Apartment No. / Street</b>
                </p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input v-model="userdata.street" dense filled class="full-width" />
                </div>
              </div>
              <div class="flex column q-ma-none q-pa-none full-width barangay-margin">
                <p class="q-mx-md q-mb-none q-mt-none"><b>Barangay</b></p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input v-model="userdata.brgy_name" class="full-width" dense filled />
                </div>
              </div>
            </div>
            <div class="flex row justify-center items-center no-wrap full-width q-mt-sm">
              <div class="flex column q-ma-none q-pa-none full-width">
                <p class="q-mx-md q-mb-none q-mt-none">
                  <b>City/Municipality</b>
                </p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input v-model="userdata.city_municipality" dense filled class="full-width" />
                </div>
              </div>
              <div class="flex column q-ma-none q-pa-none full-width">
                <p class="q-mx-md q-mb-none q-mt-none"><b>Province</b></p>
                <div class="q-mx-md flex row justify-left q-ma-none q-pa-none">
                  <q-input v-model="userdata.province" dense filled class="full-width" />
                </div>
              </div>
            </div>
            <div class="q-mr-sm q-ml-md q-pr-sm" style="max-width: 400px">
              <h6 class="q-mb-none q-mt-sm"><b>Valid ID</b></h6>
              <div
                class="flex justify-center items-center q-ml-sm full-width upload-image"
                @click="imageShow2()"
              >
                <input
                  type="file"
                  accept="image/*"
                  ref="file"
                  id="file2"
                  style="display: none"
                  @change="handleFileUpload($event, 'validId')"
                />

                <div class="upload flex justify-center items-center q-mt-sm row no-wrap">
                  <q-icon
                    class="q-ml-md q-mr-none"
                    name="add_photo_alternate"
                    size="2rem"
                    color="purple"
                  />
                  <p
                    class="q-mr-xl q-ml-md text-h7 q-ma-none"
                    :style="
                      userdata.valid_id_name !== null
                        ? {
                            color: 'gray',
                            fontSize: '13px',
                            position: 'absolute',
                            marginTop: '-30px',
                            marginLeft: '40px',
                          }
                        : null
                    "
                  >
                    Add Image
                  </p>
                  <p
                    v-if="userdata.valid_id_name !== null"
                    class="q-mr-xl q-ml-md text-h7 q-ma-none text-black"
                    style="min-width: 90px"
                  >
                    {{ userdata.valid_id_name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="q-ma-md row no-wrap">
              <q-btn
                label="Cancel"
                @click="cancel()"
                dense
                flat
                class="q-px-sm q-mr-xl q-pa-sm q-px-md cancel-button"
              />
              <q-btn
                label="Update"
                @click="update(userdata)"
                dense
                flat
                class="text-white q-px-sm q-mr-xl q-pa-sm q-px-md update-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter class="q-mt-xl" v-if="logInDetails.account_identifier == 'publicUser'"></PageFooter>
  </div>
</template>
<script src="../pages/taara/script/editProfile"></script>
<style lang="scss" scoped src="../pages/taara/style/editProfile.scss"></style>
