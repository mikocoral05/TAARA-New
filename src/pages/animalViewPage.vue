<template>
  <q-page>
    <div v-for="specific in specificAnimal.file" :key="specific.id">
      <div class="q-pa-md">
        <q-carousel v-model="slide" control-color="primary" class="rounded-borders">
          <q-carousel-slide
            name="style"
            class="flex justify-center items-center relative bg-black row no-wrap overflow-hidden carosel"
          >
            <img
              class="img-top"
              :src="inFront[0] ? inFront[0] : getImageLink(specificAnimal.file[0].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="img-top"
              :src="inFront[1] ? inFront[1] : getImageLink(specificAnimal.file[1].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="ccenters"
              :src="inFront[2] ? inFront[2] : getImageLink(specificAnimal.file[2].name)"
              alt=""
              style="opacity: none"
              loading="lazy"
            />

            <img
              class="img-top"
              :src="inFront[3] ? inFront[3] : getImageLink(specificAnimal.file[3].name)"
              alt=""
              loading="lazy"
            />
            <img
              class="img-top"
              :src="inFront[4] ? inFront[4] : getImageLink(specificAnimal.file[4].name)"
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

      <!-- <div
        class="q-mt-xl q-mb-md q-stepper-container"
        v-show="accountActive(adoptedAnimalOnProgress, specific.animal_id)"
      >
        <q-stepper
          v-model="step"
          ref="stepper"
          alternative-labels
          color="primary"
          animated
          flat
          :contracted="contactedQStepper"
        >
          <q-step
            :name="1"
            title="Request Submitted"
            icon="add_task"
            :done="step != 0"
          />
          <q-step
            :name="2"
            title="Reviewing Request"
            icon="mark_email_read"
            :done="step > 2"
          />

          <q-step
            :name="3"
            title="Qualified"
            icon="sports_handball"
            :done="step > 3"
          />
          <q-step
            :name="4"
            title="Ready for Pickup"
            icon="local_shipping"
            :done="step > 4"
          />
          <q-step :name="5" title="Adopted" icon="pets" :done="step > 5" />
        </q-stepper>
      </div> -->
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
                <!-- :disable="
                    accountActive(adoptedAnimalOnProgress, specificAnimal.animal_id)
                  " -->
                <!-- :style="
                    Object.keys(store.userData).length == 0
                      ? {
                          background: '#B157AE',
                        }
                      : {
                          background: adoptedAnimalOnProgress.some(
                            (obj) => obj.animal_id === specificAnimal.animal_id
                          )
                            ? 'gray'
                            : '#B157AE',
                        }
                  " -->
                <q-btn
                  class="q-my-sm q-px-lg buttons"
                  label="ADOPT "
                  :icon-right="
                    accountActive(adoptedAnimalOnProgress, specificAnimal.animal_id)
                      ? 'check_circle'
                      : 'pets'
                  "
                  @click="
                    Object.keys(store.userData).length == 0
                      ? (counterStore.showDialog = true)
                      : $router.push({
                          path: '/pet-adoption-form',
                          query: {
                            adopt: encodeAnimalId(specificAnimal.animal_id),
                          },
                        })
                  "
                  flat
                  filled
                />

                <q-btn
                  class="q-my-sm q-ml-sm q-px-lg buttons"
                  label="DONATE"
                  icon-right="volunteer_activism"
                  @click="
                    Object.keys(store.userData).length == 0
                      ? (counterStore.showDialog = true)
                      : (donateDialog = true)
                  "
                  flat
                  filled
                />
              </div>

              <p class="hidden">
                {{
                  like =
                    Object.keys(store.userData).length == 0
                      ? false
                      : likesData.some((obj) => obj.animal_id === specificAnimal.animal_id)
                }}
              </p>
              <q-btn
                class="q-ma-sm q-pa-none button-heart"
                icon="favorite"
                @click="
                  restrictionHeart(
                    specificAnimal.animal_id,
                    store.userData,
                    dateToday,
                    specificAnimal.file[0].name,
                    specificAnimal.animal_name,
                  )
                "
                flat
                dense
                :class="like ? 'red-button' : 'blue-button'"
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
                ((petId = encodeAnimalId(data.animal_id)),
                $router.push({
                  query: { pet: encodeAnimalId(data.animal_id) },
                }))
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
      <q-dialog v-model="donateDialog" persistent>
        <div class="my-div column no-wrap q-pa-md">
          <q-form @submit="(submitPublicDonation(donatorsInfo), (donateDialog = false))">
            <div class="container-update-icon">
              <div class="text-purple">
                <q-icon class="update-icon" size="1.5rem" color="primary" name="wallet" />
              </div>
            </div>

            <div class="" style="position: relative; height: 300px">
              <img
                src="../image/gcash_qr_small.png"
                class="absolute-center img-qr-code"
                style="width: 280px; height: 280px"
              />
            </div>
            <div class="flex column justify-center items-center full-width q-mb-xs">
              <h6 class="text-center q-ma-none">Ednalyn Cristo</h6>
              <p class="text-center number q-mb-none">09324710384</p>
            </div>
            <div class="row no-wrap justify-center items-center btn-container">
              <q-btn
                label="Upload"
                dense
                filled
                no-caps
                size="sm"
                color="accent"
                class="q-mr-xs"
                @click="((imageOrReference = true), (reference = null))"
              />
              <q-btn
                label="Reference"
                dense
                outline
                no-caps
                size="sm"
                color="accent"
                @click="((imageOrReference = false), (donationImage = null))"
              />
            </div>
            <div class="q-mt-sm">
              <q-file
                v-if="imageOrReference == true"
                filled
                bottom-slots
                v-model="donationImage"
                stack-label
                counter
                dense
                hint="Please upload the proof of donation"
                :required="imageOrReference == true"
              >
                <template v-slot:before>
                  <q-avatar size="md">
                    <img
                      :src="inFront[4] ? inFront[4] : specificAnimal.file[4].name"
                      class="img-animal"
                    />
                  </q-avatar>
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="donationImage !== null"
                    name="close"
                    @click.stop.prevent="donationImage = null"
                    class="cursor-pointer"
                  />
                  <div v-if="controlSpinner == true">
                    <q-spinner-ios color="primary" size="md" />
                    <q-tooltip :offset="[0, 8]">QSpinnerIos</q-tooltip>
                  </div>
                  <q-icon name="create_new_folder" @click.stop.prevent />
                </template>
              </q-file>
              <q-input
                v-else
                type="number"
                filled
                bottom-slots
                v-model="reference"
                counter
                dense
                maxlength="100"
                hint="Please Enter the reference Code"
                prefix="Ref No. "
                :required="imageOrReference == false"
              >
                <template v-slot:before>
                  <q-avatar size="md">
                    <img
                      :src="inFront[4] ? inFront[4] : specificAnimal.file[4].name"
                      class="img-animal"
                    />
                  </q-avatar>
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="reference !== ''"
                    name="close"
                    @click="reference = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="row no-wrap justify-between q-mt-md btn-container">
              <q-btn
                class="cancelbtn text-center q-mr-sm"
                dense
                no-caps
                outline
                unelevated
                v-close-popup
                size="md"
                color="accent"
                label="Cancel"
              />
              <q-btn
                type="submit"
                class="savebtn text-center q-ml-sm"
                dense
                no-caps
                filled
                size="md"
                color="accent"
                label="Submit"
                :disable="imageOrReference && controlSpinner"
              />
            </div>
          </q-form>
        </div>
      </q-dialog>
      <taaraFooter />
    </div>
    <donationDialog />
  </q-page>
</template>
<script src="pages/taara/script/animalViewPage"></script>
<style lang="scss" scoped src="pages/taara/style/animalViewPage.scss"></style>
