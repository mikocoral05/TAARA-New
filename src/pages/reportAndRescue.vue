<template>
  <q-page>
    <div>
      <div class="flex justify-center q-pb-xl q-pt-sm all-container">
        <div class="containerss flex column q-mx-sm">
          <h4 class="q-ma-none q-my-sm text-center report-title q-mt-md">
            Animal Report Incident
          </h4>
          <div class="divider invisible"></div>
          <div class="flex justify-center items-center">
            <img class="image" src="../image/TAARA_Logo.jpg" />
          </div>

          <div class="flex justify-center items-center column">
            <!-- {{ images.length }} -->
            <p class="hidden">{{ images.splice(5) }}</p>
            <div @click="images.length <= 4 ? imageShow() : ''">
              <input
                type="file"
                accept="image/*"
                ref="file"
                id="file"
                style="display: none"
                @change="handleFileUpload"
                multiple
              />
              <div
                class="upload flex justify-center row no-wrap items-center q-mt-sm"
              >
                <q-icon class="" name="add" />
                <p class="text-h6 q-ma-none">Add Image</p>
              </div>
            </div>
            <div
              v-show="images.length > 0"
              class="flex justify-end q-pr-xl"
              style="width: 100%"
            >
              <q-icon @click="imageRemover" name="clear" size="2rem"></q-icon>
            </div>
            <div class="flex row justify-center items-center">
              <img
                v-for="showImage in images"
                :key="showImage"
                :src="showImage"
                id="previewImage"
                class="uploading-image"
              />
            </div>
          </div>
          <div class="flex column justify-center items-center q-mt-lg q-px-md">
            <div
              class="flex row no-wrap justify-center items-center input-container"
            >
              <div class="flex column input-container q-pr-sm">
                <p class="q-pa-none q-ma-none">Reporter Name</p>

                <q-input
                  class="q-my-sm input"
                  :disable="logInDetails == null ? false : true"
                  v-model="reporterDetails.reporter_name"
                  :input-style="
                    inputStyleAdjuster
                      ? {
                          height: '22px',
                          margin: '5px 5px 5px 10px',
                          fontSize: '13px',
                        }
                      : { margin: '10px' }
                  "
                  dense
                  filled
                  :rules="[(val) => !!val || '']"
                  hide-bottom-space
                />
              </div>
              <div class="flex column input-container q-pl-sm">
                <p class="q-pa-none q-ma-none">Phone Number</p>
                <q-input
                  class="q-my-sm input"
                  :disable="logInDetails == null ? false : true"
                  mask="phone"
                  v-model="reporterDetails.phone_number"
                  :input-style="
                    inputStyleAdjuster
                      ? {
                          height: '22px',
                          margin: '5px 5px 5px 10px',
                          fontSize: '13px',
                        }
                      : { margin: '10px' }
                  "
                  prefix="+63"
                  :rules="[
                    (val) => (!!val && val.length == 16) || '',
                    (val) =>
                      (val && val[1] === '9') ||
                      'Phone number must start with 9',
                  ]"
                  hide-bottom-space
                  dense
                  filled
                />
              </div>
            </div>
            <div class="flex column input-container">
              <p class="q-pa-none q-ma-none">Location</p>
              <q-input
                class="q-my-sm input"
                v-model="reporterDetails.location"
                dense
                filled
                :rules="[(val) => !!val || '']"
                hide-bottom-space
                :input-style="
                  inputStyleAdjuster
                    ? {
                        height: '22px',
                        margin: '5px 5px 5px 10px',
                        fontSize: '13px',
                      }
                    : { margin: '10px' }
                "
              />
            </div>
            <div class="flex justify-around items-center hidden">
              <q-input
                class="q-my-sm"
                readonly
                filled
                v-model="reporterDetails.date_report"
                label="Date"
                stack-label
                dense
              />
              <q-input
                class="q-my-sm"
                readonly
                filled
                v-model="reporterDetails.time_report"
                label="Time"
                stack-label
                dense
              />
            </div>
            <div class="flex column input-container">
              <p class="q-pa-none q-ma-none">Report Details</p>
              <q-input
                class="input-autgrow"
                v-model="reporterDetails.report_details"
                :input-style="
                  inputStyleAdjuster
                    ? {
                        margin: '-5px 5px 5px 10px',
                        fontSize: '13px',
                      }
                    : { margin: '10px' }
                "
                autogrow
                dense
                borderless
                flat
              />
            </div>
            <!-- <p style="color: black;">{{ previewImage }}</p> -->
            <div
              class="flex justify-between items-start button no-wrap full-width input-container"
            >
              <q-btn
                label="Cancel"
                class="q-ma-lg cancel-button"
                @click="cancelInput"
                flat
              />
              <q-btn
                label="Report"
                @click="submitReport(reporterDetails, images)"
                class="text-white q-ma-lg report-button"
                flat
              />
            </div>
          </div>
        </div>
      </div>

      <PageFooter></PageFooter>
    </div>
  </q-page>
</template>
<script src="../pages/taara/script/reportAndRescue"></script>
<style
  scoped
  lang="scss"
  src="../pages/taara/style/reportAndRescue.scss"
></style>
