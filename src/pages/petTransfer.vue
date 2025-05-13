<template>
  <q-page class="column justify-center items-center">
    <div class="row no-wrap transfer-container">
      <div class="fc">
        <div
          class="column no-wrap justify-center items-center q-px-xl relative-position"
        >
          <div :class="fadeValue ? 'fade-in' : ''" class="full-width">
            <h5 class="q-ma-none q-px-lg text-bold">Transfer in 3 Steps</h5>
            <q-stepper
              v-model="step"
              color="primary"
              animated
              flat
              :alternative-labels="true"
            >
              <q-step
                :name="1"
                title="Pet Info"
                icon="settings"
                :done="step > 1"
              >
                <q-form @submit="step = 2">
                  <div class="full-width">
                    <h5 class="q-mb-sm q-mt-none">Pet Information</h5>
                    <p class="text-caption">Tell us about your pet</p>
                    <div class="input-fields-container">
                      <div v-if="miniStep == 1">
                        <div class="row no-wrap details">
                          <div class="column no-wrap q-py-md q-mr-sm">
                            <p class="q-ma-none q-mb-sm">Pet name</p>
                            <q-input
                              outlined
                              label="Ex: Rockie"
                              dense
                              v-model="petTransferInfo.first_name"
                              stack-label
                              :rules="[(val) => !!val || '']"
                              hide-bottom-space
                            />
                          </div>
                        </div>
                        <div class="row no-wrap q-py-md q-pb-xl details">
                          <div class="column no-wrap q-mr-sm">
                            <p class="q-ma-none q-mb-sm">Color</p>
                            <q-input
                              outlined
                              label="Ex: Salvador"
                              dense
                              v-model="petTransferInfo.last_name"
                              stack-label
                              :rules="[(val) => !!val || '']"
                              hide-bottom-space
                            />
                          </div>
                          <div class="column no-wrap">
                            <p class="q-ma-none q-mb-sm">Breed</p>
                            <q-input
                              outlined
                              label="Ex: Rockie"
                              dense
                              v-model="petTransferInfo.first_name"
                              stack-label
                              :rules="[(val) => !!val || '']"
                              hide-bottom-space
                            />
                          </div>
                        </div>
                      </div>
                      <div v-if="miniStep == 2">
                        <div class="row no-wrap justify-between details">
                          <div class="column no-wrap q-py-md q-mr-sm">
                            <p class="q-ma-none q-mb-sm">Pet Birthdate</p>

                            <q-input
                              class="input"
                              outlined
                              v-model="petTransferInfo.birth_date"
                              label="Ex: 2000-05-12"
                              dense
                              mask="####-##-##"
                              :rules="[(val) => !!val || '']"
                              stack-label
                              hide-bottom-space
                              hint="Estimated Birthdate"
                            >
                              <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <q-date
                                      v-model="petTransferInfo.birth_date"
                                      :title="petTransferInfo.first_name"
                                      subtitle="Birthday"
                                      today-btn
                                      emit-immediately
                                      mask="YYYY-MM-DD"
                                      default-year-month="2000/01"
                                    >
                                      <div class="row items-center justify-end">
                                        <q-btn
                                          v-close-popup
                                          label="Close"
                                          color="primary"
                                          flat
                                          rounded
                                        />
                                      </div>
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="column no-wrap q-py-md">
                            <p class="q-ma-none q-mb-sm">Size</p>
                            <q-input
                              outlined
                              label="Ex: Rockie"
                              dense
                              v-model="petTransferInfo.first_name"
                              stack-label
                              :rules="[(val) => !!val || '']"
                              hide-bottom-space
                            />
                          </div>
                        </div>
                        <div class="column no-wrap q-pb-md q-pb-xl details">
                          <p class="q-ma-none q-mb-sm">Sex</p>
                          <div class="row no-wrap">
                            <q-btn
                              icon="male"
                              label="Male"
                              no-caps
                              class="q-mr-sm"
                              @click="petTransferInfo.sex = 'male'"
                              :class="
                                petTransferInfo.sex == 'male'
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-black'
                              "
                              rounded
                            />

                            <q-btn
                              icon="female"
                              label="Female"
                              no-caps
                              @click="petTransferInfo.sex = 'female'"
                              :class="
                                petTransferInfo.sex == 'female'
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-black'
                              "
                              rounded
                            />
                          </div>
                        </div>
                      </div>
                      <div v-if="miniStep == 3">
                        <div
                          class="column no-wrap q-py-md q-mr-sm"
                          style="width: 100%"
                        >
                          <p class="q-ma-none q-mb-sm">Good With</p>
                          <q-input
                            outlined
                            label="Ex: Purok 2"
                            dense
                            v-model="petTransferInfo.street"
                            :rules="[(val) => !!val || '']"
                            stack-label
                            hide-bottom-space
                          />
                        </div>
                        <div class="column no-wrap q-py-md q-mr-sm q-mb-md">
                          <p class="q-ma-none q-mb-sm">Behaviour</p>
                          <q-input
                            outlined
                            label="Ex: Daraga"
                            dense
                            v-model="petTransferInfo.city_municipality"
                            :rules="[(val) => !!val || '']"
                            stack-label
                            hide-bottom-space
                            autogrow
                            input-style="min-height:40px;max-heigth:40px;"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row no-wrap justify-between items-center">
                    <q-stepper-navigation class="q-pa-none">
                      <q-btn
                        color="primary"
                        label="Continue"
                        rounded
                        type="submit"
                      />
                    </q-stepper-navigation>
                    <div class="row no-wrap first-step-nav justify-end">
                      <q-btn
                        label="1"
                        :class="miniStep > 0 ? 'bg-primary text-white' : ''"
                        @click="miniStep = 1"
                      />
                      <q-btn
                        label="2"
                        :class="miniStep > 1 ? 'bg-primary text-white' : ''"
                        @click="miniStep = 2"
                      />
                      <q-btn
                        label="3"
                        :class="miniStep > 2 ? 'bg-primary text-white' : ''"
                        @click="miniStep = 3"
                      />
                    </div>
                  </div>
                </q-form>
              </q-step>

              <q-step
                :name="2"
                title="Health Evaluation"
                icon="create_new_folder"
                :done="step > 2"
              >
                <q-form @submit="step = 3">
                  <div class="full-width">
                    <h5 class="q-mb-sm q-mt-none">Health Evaluation</h5>
                    <p class="text-caption">Pet health status</p>
                    <div class="input-fields-container">
                      <div class="column no-wrap q-py-md">
                        <p class="q-ma-none q-mb-sm">Vaccinated</p>
                        <div class="row no-wrap justify-between items-center">
                          <div class="row no-wrap items-center justify-center">
                            <q-checkbox v-model="val" size="lg" label="Yes" />
                            <q-checkbox v-model="val" size="lg" label="No" />
                          </div>
                          <q-input
                            class="input"
                            outlined
                            v-model="petTransferInfo.birth_date"
                            label="Last Date of Vaccination"
                            dense
                            mask="####-##-##"
                            :rules="[(val) => !!val || '']"
                            stack-label
                            hide-bottom-space
                          >
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-date
                                    v-model="petTransferInfo.birth_date"
                                    :title="petTransferInfo.first_name"
                                    subtitle="Birthday"
                                    today-btn
                                    emit-immediately
                                    mask="YYYY-MM-DD"
                                    default-year-month="2000/01"
                                  >
                                    <div class="row items-center justify-end">
                                      <q-btn
                                        v-close-popup
                                        label="Close"
                                        color="primary"
                                        flat
                                        rounded
                                      />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <div class="column no-wrap details">
                        <p class="q-ma-none q-mb-sm">Sex</p>
                        <div class="row no-wrap">
                          <q-btn
                            icon="male"
                            label="Spayed"
                            no-caps
                            class="q-mr-sm"
                            @click="petTransferInfo.sex = 'male'"
                            :class="
                              petTransferInfo.sex == 'male'
                                ? 'bg-primary text-white'
                                : 'bg-white text-black'
                            "
                            rounded
                          />

                          <q-btn
                            icon="female"
                            label="Neutered"
                            no-caps
                            @click="petTransferInfo.sex = 'female'"
                            :class="
                              petTransferInfo.sex == 'female'
                                ? 'bg-primary text-white'
                                : 'bg-white text-black'
                            "
                            rounded
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <q-stepper-navigation
                    class="row no-wrap details-q-step q-ma-none q-pa-none"
                  >
                    <q-btn
                      flat
                      @click="step = 1"
                      color="primary"
                      label="Back"
                      class="q-mr-sm back"
                      rounded
                    />
                    <q-btn
                      color="primary"
                      label="Continue"
                      type="submit"
                      rounded
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <q-step
                :name="3"
                title="Finish Up"
                icon="assignment"
                :done="step > 3"
              >
                <q-form @submit="step = 4">
                  <div class="full-width">
                    <h5 class="q-mb-sm q-mt-none">Upload Photo</h5>
                    <p class="text-caption">Upload a photo with you pet</p>
                    <div class="input-fields-container column justify-around">
                      <div
                        class="column no-wrap justify-center items-center upload-container q-py-xl"
                      >
                        <q-icon
                          name="add_a_photo "
                          size="md"
                          @click="imageShow()"
                        />
                        <p class="q-mt-md">
                          <u>
                            {{ fileUploadName }}
                          </u>
                        </p>
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
                      </div>
                      <div
                        class="row no-wrap justify-start items-center q-mb-md"
                      >
                        <p class="q-ma-none">
                          Please note that not all pet transfer requests are
                          guaranteed to be approved, as the organization
                          assesses shelter availability.
                        </p>
                      </div>
                    </div>
                  </div>
                  <q-btn
                    label="Submit"
                    rounded
                    type="submit"
                    class="text-white bg-primary q-mb-xs full-width"
                  />
                </q-form>
              </q-step>
              <q-step :name="4" title="Result" icon="verified">
                <div class="full-width">
                  <h5 class="q-mb-sm q-mt-none">Transfer Request sent</h5>
                  <p class="text-caption">
                    The result of your request will show here .
                  </p>
                  <div class="input-fields-container">
                    <p
                      class="text-overline text-amber"
                      v-if="requestResult == null"
                    >
                      waiting result...
                    </p>
                    <div class="result" v-if="requestResult != null">
                      <div class="row no-wrap items-center q-my-sm">
                        <p class="text-overline text-amber q-ma-none q-mr-sm">
                          Result:
                        </p>
                        <div
                          class="row no-wrap items-center q-px-md"
                          :style="
                            requestResult
                              ? {
                                  border: '1px solid green',
                                  borderRadius: '2px',
                                }
                              : { border: '1px solid red', borderRadius: '2px' }
                          "
                        >
                          <q-icon
                            name="cancel"
                            size="xs"
                            :color="requestResult ? 'positive' : 'red'"
                          />
                          <p class="q-ma-none text-red">
                            {{ requestResult ? "Approved" : "Decline" }}
                          </p>
                        </div>
                      </div>
                      <p class="text-caption" v-if="requestResult == false">
                        Thank you for submitting your transfer request. After
                        careful consideration, we regret to inform you that your
                        request has been declined. Unfortunately, due to
                        limitations in shelter capacity or other factors, we are
                        unable to accommodate the transfer at this time.
                        <br /><br />
                        We appreciate your understanding and encourage you to
                        explore other options for your pet’s well-being. If you
                        have any further questions or need assistance, feel free
                        to reach out to us. Thank you for your compassion and
                        commitment to animals.
                      </p>
                      <p v-if="requestResult == true">
                        Your transfer request has been approved! You can deliver
                        your pet to our shelter at your convenience. We look
                        forward to welcoming them into our organization. Thank
                        you for your compassion and commitment to animals.
                      </p>
                    </div>
                  </div>
                </div>
              </q-step>
            </q-stepper>
          </div>
        </div>
      </div>
      <div class="sc"></div>
    </div>
  </q-page>
</template>
<script src="./taara/script/petTransfer.js"></script>
<style src="../pages/taara/style/petTransfer.scss" scoped lang="scss"></style>
