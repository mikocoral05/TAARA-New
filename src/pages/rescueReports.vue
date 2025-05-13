<template>
  <q-page class="column justify-center items-center">
    <div class="row no-wrap justify-between search-section">
      <div class="row no-wrap">
        <q-input
          class="report-search"
          v-model="search"
          outlined
          dense
          @update:model-value="filterBySearch(search)"
          placeholder="Title / Reporter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="grey-4"
          text-color="purple"
          glossy
          unelevated
          icon="add_circle"
          label="Add Report"
          class="q-ml-md"
        />
      </div>
      <div class="row no-wrap">
        <q-btn
          :outline="sortReport"
          :class="sortReport ? 'text-primary' : ''"
          label="All"
          no-caps
          unelevated
          @click="(sortReport = true), filterReport('All')"
          :ripple="false"
        />
        <q-btn
          @click="(sortReport = false), filterReport('MyReport')"
          class="q-ml-md"
          :class="sortReport == false ? 'text-primary' : ''"
          label="My Report"
          no-caps
          :outline="sortReport == false"
          unelevated
          :ripple="false"
        />
      </div>
    </div>
    <div
      class="flex justify-center items-center q-pa-sm report-container"
      ref="myElement"
    >
      <div
        v-for="data in getReportRescueData.data"
        :key="data.report_id"
        class="q-mb-xl q-mt-sm rescueReport-container"
        :id="'report-' + data.report_id"
      >
        <div class="row no-wrap justify-center items-start">
          <div
            class="column justify-start items-start report-description q-pt-lg q-px-lg"
          >
            <div class="row no-wrap justify-between items-center full-width">
              <div class="row no-wrap justify-start items-center">
                <img :src="data.reporter_image" class="bg-amber" />
                <p class="q-ma-none q-ml-md text-capitalize">
                  <Span class="text-grey">Reported By:</Span>
                  {{ data.reporter_name }}
                </p>
              </div>
              <div class="row no-wrap icon-container">
                <img src="../image/icon/communication_15047435.png" alt="" />
                <img src="../image/icon/instagram_2111463.png" alt="" />
                <img src="../image/icon/twitter_3670151.png" alt="" />
              </div>
            </div>
            <h6 class="q-ma-none q-px-sm q-mt-md text-primary">
              {{ data.report_title }}
            </h6>

            <!-- <div class="q-my-md details q-px-sm">
              <TextClamp :max-lines="3" :text="data.report_details">
              </TextClamp>
            </div> -->
            <q-scroll-area
              class="q-my-md details q-px-sm full-width text-weight-light"
            >
              {{ data.report_details }}
            </q-scroll-area>
            <div
              class="row no-wrap justify-between items-center full-width q-px-sm q-mt-md"
            >
              <div class="row no-wrap text-weight-light text-caption">
                <p class="q-ma-none q-mr-md">{{ wordifyDate(data.date) }}</p>
                <p class="q-ma-none">{{ wordifyTime(data.time) }}</p>
              </div>

              <q-btn
                class="bg-primary text-white col-2"
                label=" Donate"
                no-caps
                flat
                dense
                @click="
                  (counterStore.donationDialog = true),
                    $router.push({
                      query: {
                        G: encodeAnimalId(0),
                      },
                    })
                "
                v-if="step == 4"
              />
            </div>
            <q-stepper
              v-model="step"
              ref="stepper"
              alternative-labels
              color="primary"
              animated
              flat
            >
              <q-step
                :name="1"
                title="Reported"
                icon="add_task"
                :done="step > 1"
              />

              <q-step :name="2" title="Rescued" icon="pets" :done="step > 2" />
              <q-step
                :name="3"
                title="Arrive at Vet"
                icon="medication"
                :done="step > 3"
              />
              <q-step
                :name="4"
                title="Released"
                icon="corporate_fare"
                :done="step > 4"
              />
            </q-stepper>
          </div>
          <div class="column report-image">
            <div class="q-pa-sm bg-grey-4">
              <q-carousel
                animated
                v-model="slide[`id${data.report_id}`]"
                infinite
                arrows
                transition-prev="slide-right"
                transition-next="slide-left"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = true"
              >
                <q-carousel-slide
                  v-for="(image, index) in getFilteredImages(data.report_id)"
                  :key="image.report_id"
                  :name="index"
                  :img-src="image.image"
                />
              </q-carousel>
            </div>
            <!-- <div class="row no-wrap justify-between q-pa-md">
              <q-btn label="Help this pet" />
              <q-btn label="Help this pet" />
            </div> -->
          </div>
        </div>
      </div>
      <div
        class="q-mb-xl q-mt-sm no-report column no-wrap flex-center"
        v-if="noReport"
      >
        <q-icon name="mood" size="xl" color="grey" />
        <h6 class="text-grey-6 q-mt-none">You don't have any Report!</h6>
      </div>
      <q-dialog v-model="addReport" persistent>
        <q-card class="my-card" style="width: 450px">
          <q-form
            class="q-ma-none q-pa-none"
            @submit="addReportManagement(reportDetails, images)"
          >
            <q-card-section class="row justify-end relative-position">
              <div
                class="text-weight-medium absolute-center"
                style="font-size: 17px"
              ></div>
              <q-icon
                name="close"
                class="bg-blue-grey-1 q-pa-xs"
                size="sm"
                color="grey-7"
                style="border-radius: 100%"
                v-close-popup
              />
            </q-card-section>
            <q-separator />
            <q-card-section
              class="q-pa-sm q-px-md row no-wrap justify-between items-center"
            >
              <div class="row no-wrap">
                <q-img
                  src="../image/TAARA_Logo.jpg"
                  width="40px"
                  style="border-radius: 100%"
                />
                <div class="column q-ml-sm">
                  <p class="no-margin text-subtitle2">TAARA Community</p>
                  <p class="no-margin text-caption">Report</p>
                </div>
              </div>
              <q-btn
                flat
                color="primary"
                round
                icon="image"
                @click="addImage = true"
              />
            </q-card-section>
            <q-card-section class="q-ma-md q-pa-none">
              <div class="row no-wrap full-width" v-if="logInDetails == null">
                <q-input
                  dense
                  outlined
                  v-model="reportDetails.reporter_name"
                  label="Reporter name"
                  class="q-mr-sm"
                  style="width: 100%"
                  stack-label
                  :input-class="'text-weight-light'"
                  :input-style="{ fontSize: '13.5px' }"
                />
                <q-input
                  dense
                  outlined
                  v-model="reportDetails.phone_number"
                  label="Phone number"
                  stack-label
                  style="width: 100%"
                  prefix="+63"
                  mask="phone"
                  :input-class="'text-weight-light'"
                  :input-style="{ fontSize: '13.5px' }"
                />
              </div>
              <q-input
                dense
                outlined
                v-model="reportDetails.phone_number"
                label="Location"
                stack-label
                style="width: 100%"
                class="q-mt-sm"
                :input-class="'text-weight-light'"
                :input-style="{ fontSize: '13.5px' }"
              />
            </q-card-section>

            <q-card-section
              class="q-pt-none q-mx-md q-mb-md relative-position"
              v-if="addImage == true"
              style="min-height: 200px; border-radius: 5px"
            >
              <div
                v-if="images.length == 0"
                class="row absolute-center justify-center items-center bg-grey-2"
                style="
                  flex-direction: column;
                  height: 100%;
                  width: 100%;
                  border-radius: 5px;
                "
                @click="pickFile()"
              >
                <q-icon name="add_photo_alternate" size="md" />
                <p>Add Photos</p>
                <q-icon
                  name="close"
                  class="bg-white absolute-top-right q-mt-sm q-mr-sm q-pa-xs"
                  size="xs"
                  style="border-radius: 100%"
                  color="grey-7"
                  @click="addImage = false"
                />

                <input
                  id="fileInput"
                  type="file"
                  multiple
                  style="display: none"
                  @change="handleFileUpload"
                  :disabled="images.length == 5"
                />
              </div>
              <div
                class="row no-wrap add-image-container absolute-center justify-center items-center bg-grey-2"
              >
                <div
                  v-for="(image, index) in images"
                  :key="image"
                  @click="test(index, null, 'viewAddPost')"
                >
                  <img class="animal_image q-ma-sm" :src="image.image" alt="" />
                </div>
                <q-icon
                  name="close"
                  class="bg-grey absolute-top-right q-mt-md q-mr-sm q-pa-xs"
                  size="xs"
                  style="border-radius: 100%"
                  color="white"
                  @click="(addImage = false), (images = [])"
                />
                <q-btn
                  label="Add photo"
                  icon="add_photo_alternate"
                  no-caps
                  style="border-radius: 5px"
                  size="sm"
                  class="bg-grey absolute-top-left q-mt-md q-ml-sm q-pa-xs text-white"
                  @click="pickFile()"
                  :disabled="images.length == 5"
                />

                <input
                  id="fileInput"
                  type="file"
                  multiple
                  style="display: none"
                  @change="handleFileUpload"
                  :disabled="images.length == 5"
                />
              </div>
            </q-card-section>
            <div class="q-px-md q-pb-md" style="max-height: 200px">
              <q-input
                v-model="reportDetails.report_details"
                outlined
                flat
                dense
                label="Your report details here."
                stack-label
                type="textarea"
              />
            </div>

            <q-separator />

            <q-card-actions
              class="row justify-center items-center add-update-container"
            >
              <q-btn
                v-close-popup
                label="Post"
                class="full-width"
                no-caps
                color="purple-4"
                :disabled="reportDetails.report_details == null"
                type="submit"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <donationDialog />
    </div>
    <taaraFooter class="q-mt-xl full-width"></taaraFooter>
  </q-page>
</template>

<script src="../pages/taara/script/rescueReports"></script>
<style lang="scss" scoped src="../pages/taara/style/rescueReports.scss"></style>
