<template>
  <q-page>
    <div>
      <div class="q-pa-md">
        <q-carousel v-model="slide" control-color="primary" class="rounded-borders">
          <q-carousel-slide
            name="style"
            class="flex justify-center items-center relative bg-black row no-wrap overflow-hidden carosel"
          >
            <img
              class="img-top"
              :src="inFront[0] ? inFront[0] : getImageLink(specificAnimal?.file?.[0].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="img-top"
              :src="inFront[1] ? inFront[1] : getImageLink(specificAnimal?.file?.[1].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="ccenters"
              :src="inFront[2] ? inFront[2] : getImageLink(specificAnimal?.file?.[2].name)"
              alt=""
              style="opacity: none"
              loading="lazy"
            />

            <img
              class="img-top"
              :src="inFront[3] ? inFront[3] : getImageLink(specificAnimal?.file?.[3].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="img-top"
              :src="inFront[4] ? inFront[4] : getImageLink(specificAnimal?.file?.[4].name)"
              alt=""
              loading="lazy"
            />
          </q-carousel-slide>
        </q-carousel>

        <div class="row justify-center">
          <q-btn label="1" @click="rearrangeImage(0)" />
          <q-btn label="2" @click="rearrangeImage(1)" />
          <q-btn label="3" @click="rearrangeImage(2)" />
          <q-btn label="4" @click="rearrangeImage(3)" />
          <q-btn label="5" @click="rearrangeImage(4)" />
        </div>
      </div>

      <div class="flex justify-center items-center">
        <div class="animal-label" style="text-transform: capitalize">
          {{ specificAnimal.animal_name }}
        </div>
      </div>
      <div class="flex justify-center items-center">
        <div class="flex row justify-between items-center details-div no-wrap text-body1">
          <div class="details-left-container q-mt-none q-pt-none">
            <p class="q-mx-sm q-mb-sm q-pa-none q-mt-none" style="text-transform: capitalize">
              <b>Breed:</b> {{ specificAnimal.breed }}
            </p>
            <p class="q-ma-sm q-pa-none"><b>Age:</b> {{ getAge(specificAnimal.age) }}</p>

            <p class="q-ma-sm q-pa-none" style="text-transform: capitalize">
              <b>Sex:</b> {{ specificAnimal.sex }}
            </p>
            <p class="q-ma-sm q-pa-none" style="text-transform: capitalize">
              <b>Color:</b> {{ specificAnimal.fur_color }}
            </p>
            <p class="q-ma-sm q-pa-none" style="text-transform: capitalize">
              <b>Good with:</b> {{ switchCase(specificAnimal.good_with) }}
            </p>
            <p class="q-ma-sm q-pa-none" style="text-transform: capitalize">
              <b>Care & Behaviour:</b> {{ specificAnimal.behaviour }}
            </p>
          </div>
          <div class="flex column justify-center items-center q-mt-xl story-contianer">
            <div class="story-contianer-first-child">
              <p class="text-center q-mt-sm q-mb-none animal-story-title">
                {{ specificAnimal.name }}'s Story
              </p>
              <div class="q-ma-sm story-inner-container">
                <p class="q-mx-sm q-mb-none story-p">
                  {{ specificAnimal.story_background }}
                </p>
              </div>
            </div>
            <div class="flex justify-between items-center button-container no-wrap full-width">
              <div class="flex row no-wrap full-width">
                <q-btn
                  class="q-my-sm q-px-lg buttons"
                  label="ADOPT "
                  :icon-right="
                    accountActive(adoptedAnimalOnProgress, specificAnimal.animal_id)
                      ? 'check_circle'
                      : 'pets'
                  "
                  @click="adoptBtnFn()"
                  flat
                  filled
                />

                <q-btn
                  class="q-my-sm q-ml-sm q-px-lg buttons"
                  label="DONATE"
                  icon-right="volunteer_activism"
                  @click="donateBtnFn()"
                  flat
                  filled
                />
              </div>

              <q-btn
                class="q-ma-sm q-pa-none button-heart"
                icon="favorite"
                @click="likeFn()"
                flat
                dense
                :class="likesData.includes(specificAnimal.animal_id) ? 'red-button' : 'blue-button'"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <div style="width: 70%" class="flex column">
          <h5 class="q-my-md"><b>About</b></h5>
          <p class="q-ma-none" style="font-weight: 500">HEALTH</p>
          <p>Vaccinations up to date, spayed / neutered</p>
        </div>
      </div>
      <div class="q-mb-xl">
        <div class="q-pt-xl">
          <h5 class="text-center more-pets-title text-weight-bold">
            More Pets Available for Adoption
          </h5>
        </div>
        <div class="flex justify-center items-center q-px-sm">
          <div class="flex q-pa-md justify-center items-center more-pets-container">
            <q-card
              class="my-card col more-pets"
              v-for="data in allAnimalData6"
              :key="data.animal_id"
              flat
              @click="
                $router.push({
                  query: { pet: encodeAnimalId(data.animal_id) },
                })
              "
            >
              <img
                class="iimg"
                :src="getImageLink(data.primary_image)"
                alt="Looks like image is not available"
              />
              <q-card-section class="q-ma-none q-pa-none text-center">
                <div class="q-ma-none more-pets-animal-name text-capitalize">
                  <b>{{ data.name }}</b>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <TaaraFooter />
    </div>
    <DonationDialog />
    <NeedToLogin v-model="noAccount" v-model:text="textNoAccount" />
  </q-page>
</template>
<script src="pages/taara/script/animalViewPage"></script>
<style lang="scss" scoped src="pages/taara/style/animalViewPage.scss"></style>
