<template>
  <q-page>
    <div
      class="flex justify-center items-center q-pa-sm"
      style="background: rgba(240, 242, 245, 255)"
    >
      <div
        v-for="data in annoucementData.data"
        :key="data.announcement_id"
        class="q-mb-xl q-mt-sm q-pa-xl announcements-container"
        :id="'report-' + data.announcement_id"
      >
        <div class="flex row justify-between items-center big-announcement-title-container">
          <div class="flex row justify-center items-center q-px-md">
            <div class="flex column justify-start items-start q-ma-sm announcement-title-container">
              <h4 class="q-ma-none q-pa-none announcement-title">Announcements</h4>
            </div>
          </div>
          <div class="flex column justify-center items-center q-pr-md date-and-time-container">
            <p class="q-ma-sm">{{ wordifyDate(data.date) }}</p>
            <p>{{ wordifyTime(data.time) }}</p>
          </div>
        </div>
        <div class="q-ma-sm flex row no-wrap image-container">
          <div
            v-for="(image, index) in annoucementData.image
              .filter((image) => data.announcement_id === image.announcement_id)
              .splice(0, 5)"
            :key="image.id"
            @click="(viewImage(index, data.announcement_id), (carousel = true))"
          >
            <img
              v-if="data.announcement_id === image.announcement_id"
              class="animal_image q-ma-sm"
              :src="image.image"
              alt=""
            />
          </div>
          <q-dialog v-model="carousel" maximized>
            <q-carousel swipeable animated arrows v-model="slide" infinite dark>
              <q-carousel-slide
                v-for="(image, index) in annoucementData.image
                  .filter((image) => qDialogImageId === image.announcement_id)
                  .splice(0, 5)"
                :key="image.id"
                :name="index"
                class="flex justify-center items-center"
              >
                <q-icon
                  name="close"
                  class="absolute-top-right color-white q-ma-md close-dialog"
                  @click="carousel = false"
                />
                <img
                  v-if="qDialogImageId === image.announcement_id"
                  :src="image.image"
                  alt=""
                  style="max-width: 100%; height: auto"
                />
              </q-carousel-slide>
            </q-carousel>
          </q-dialog>
        </div>
        <div>
          <p class="q-ma-md announcement-details" v-if="showMore == true">
            <TextClamp :max-lines="5" :text="data.announcement_details">
              <template #after="{ toggle, expanded }">
                <q-btn class="showLessMoreButton" flat dense @click="toggle">
                  {{ expanded ? 'Show less' : 'Show more' }}
                </q-btn>
              </template>
            </TextClamp>
          </p>
          <p class="q-ma-md announcement-details" v-else-if="showMore == false">
            {{ data.announcement_details }}
          </p>
        </div>
      </div>
    </div>
    <PageFooter />
  </q-page>
</template>

<script src="../pages/taara/script/announcementsPage"></script>
<style lang="scss" scoped src="../pages/taara/style/announcementsPage.scss"></style>
