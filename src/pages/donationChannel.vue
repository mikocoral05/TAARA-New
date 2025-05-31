<template>
  <q-page class="column justify-start items-center relative-position">
    <div class="background-image absolute-top"></div>
    <div class="container column justify-start items-center relative-position">
      <div class="donation-container q-pt-xl">
        <h3 class="q-mb-md text-center">
          Make the <span class="text-primary">Biggest Impact</span> Today
        </h3>
        <p class="text-center text-caption">
          Your support keeps our shelter running. Choose from our most impactful donation options
          and help change lives.
        </p>
      </div>

      <div class="row no-wrap justify-center items-center">
        <div class="column no-wrap best-value-container justify-center items-center">
          <div class="column no-wrap">
            <div class="bg-amber text-black price column no-wrap q-pa-xl">
              <h6 class="q-my-md">Best amount</h6>
              <div class="row no-wrap">
                <span class="text-caption">₱</span>
                <h4 class="q-ma-none">500</h4>
              </div>
              <p class="text-caption">Donate anytime</p>
              <p class="">Your donation helps us provide care and shelter for animals in need.</p>
              <p class="text-caption">Can sustain 2 set of lunch</p>
              <div class="column justify-center items-center">
                <q-btn
                  label="Donate"
                  class="bg-black text-white q-pa-sm"
                  flat
                  no-caps
                  @click="counterStore.donationDialog = true"
                  style="width: 200px"
                  to="/public/donation-channel?amount=500"
                />
              </div>
            </div>
            <div class="text-black benefit text-black q-px-xl q-pt-xl">
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 1kg meat</p>
              </div>
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 5kg Rice</p>
              </div>
              <div class="row no-wrap q-mt-md overlooping-avatar items-center">
                <q-avatar
                  v-for="n in filterDonator(500).splice(0, 9)"
                  :key="n"
                  size="25px"
                  :style="`left: ${n * -5}px`"
                >
                  <img :src="n.image ? n.image : 'anonymous/379817-PCBJ5N-46.jpg'" />
                </q-avatar>
                <span class="text-caption">{{ countDonators(500) }}</span>
              </div>
              <p class="text-caption q-ma-none choose-option">People choose this option...</p>
            </div>
          </div>
        </div>
        <div
          class="column no-wrap best-value-container justify-center items-center relative-position"
        >
          <div class="absolute-center best-value bg-amber text-black text-center">Best Value</div>
          <div class="column no-wrap">
            <div class="bg-black text-white price column no-wrap q-pa-xl">
              <h6 class="q-my-md">Best amount</h6>
              <div class="row no-wrap">
                <span class="text-caption">₱</span>
                <h4 class="q-ma-none">1000</h4>
              </div>
              <p class="text-caption">Donate anytime</p>
              <p class="">Your donation helps us provide care and shelter for animals in need.</p>
              <p class="text-caption">Can sustain 2 set of lunch</p>
              <div class="column justify-center items-center">
                <q-btn
                  label="Donate"
                  class="bg-white text-black q-pa-sm"
                  flat
                  no-caps
                  @click="counterStore.donationDialog = true"
                  to="/public/donation-channel?amount=1000"
                  style="width: 200px"
                />
              </div>
            </div>
            <div class="text-black benefit text-black q-px-xl q-pt-xl">
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 1kg meat</p>
              </div>
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 5kg Rice</p>
              </div>
              <div class="row no-wrap q-mt-md overlooping-avatar items-center">
                <q-avatar
                  v-for="n in filterDonator(1000).splice(0, 10)"
                  :key="n"
                  size="25px"
                  :style="`left: ${n * -5}px`"
                >
                  <img :src="n.image ? n.image : 'anonymous/379817-PCBJ5N-46.jpg'" />
                </q-avatar>
                <span class="text-caption">{{ countDonators(1000) }}</span>
              </div>
              <p class="text-caption q-ma-none choose-option">People choose this option...</p>
            </div>
          </div>
        </div>
        <div class="column no-wrap best-value-container justify-center items-center">
          <div class="column no-wrap">
            <div class="bg-amber text-black price column no-wrap q-pa-xl">
              <h6 class="q-my-md">Best amount</h6>
              <div class="row no-wrap">
                <span class="text-caption">₱</span>
                <h4 class="q-ma-none">1500</h4>
              </div>
              <p class="text-caption">Donate anytime</p>
              <p class="">Your donation helps us provide care and shelter for animals in need.</p>
              <p class="text-caption">Can sustain 2 set of lunch</p>
              <div class="column justify-center items-center">
                <q-btn
                  label="Donate"
                  class="bg-black text-white q-pa-sm"
                  flat
                  no-caps
                  @click="counterStore.donationDialog = true"
                  to="/public/donation-channel?amount=1500"
                  style="width: 200px"
                />
              </div>
            </div>
            <div class="text-black benefit text-black q-px-xl q-pt-xl column no-wrap">
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 1kg meat</p>
              </div>
              <div class="row no-wrap justify-start items-center">
                <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                <p class="text-caption q-ma-none">Can buy 5kg Rice</p>
              </div>
              <div class="row no-wrap q-mt-md overlooping-avatar items-center">
                <q-avatar
                  v-for="n in filterDonator(1500).splice(0, 10)"
                  :key="n"
                  size="25px"
                  :style="`left: ${n * -5}px`"
                >
                  <img :src="n.image ? n.image : 'anonymous/379817-PCBJ5N-46.jpg'" />
                </q-avatar>
                <span class="text-caption">{{ countDonators(1500) }}</span>
              </div>
              <p class="text-caption q-ma-none choose-option">People choose this option...</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column no-wrap flex-center">
        <q-btn
          outline
          style="color: goldenrod"
          label="Other Amount"
          class="other-amount q-mt-lg bg-white"
          @click="counterStore.donationDialog = true"
        />
        <div class="row no-wrap q-mt-md overlooping-avatar items-center">
          <q-avatar
            v-for="n in filterOtherDonator().splice(0, 5)"
            :key="n"
            size="25px"
            :style="`left: ${n * -5}px`"
          >
            <img :src="n.image ? n.image : 'anonymous/379817-PCBJ5N-46.jpg'" />
          </q-avatar>
          <span class="text-caption">{{ countOtherDonator() }}</span>
        </div>
      </div>
      <div class="donation-container q-pt-xl">
        <h4 class="q-mb-md text-center">Thank You, Donors!</h4>
        <p class="text-center text-caption">
          Your kindness and generosity give our animals a second chance at a better life. We’re
          truly grateful for your support.
        </p>
      </div>
      <div class="thanks-donor-section">
        <q-scroll-area
          style="height: 230px; max-width: 80vw"
          class="rounded-borders"
          :horizontal-thumb-style="{
            right: '4px',
            borderRadius: '5px',
            height: '5px',
            opacity: 0.75,
          }"
          :horizontal-bar-style="{
            right: '2px',
            borderRadius: '9px',
            height: '5px',
            opacity: 0.2,
          }"
        >
          <div class="row no-wrap">
            <div
              v-for="(n, index) in randomDonor"
              :key="index"
              class="q-pa-sm bg-white radius-10 q-mx-md column no-wrap"
            >
              <q-img
                :src="
                  n?.image_path
                    ? getImageLink(n?.image_path)
                    : n?.sex == 1
                      ? 'no-profile-male.svg'
                      : 'no-profile-female.svg'
                "
                class="q-mr-md radius-10 bg-white"
                height="150px"
                width="150px"
              />
              <div class="text-body1 q-mt-sm">{{ n.name ?? 'Annonymous' }}</div>
              <div class="text-grey-7">
                Donate: <span class="q-ml-sm">{{ n.donation_type }}</span>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="donor-summary-section row no-wrap justify-center items-center q-mt-xl">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <q-card-section class="q-pt-xs column justify-center items-center q-pb-none">
              <q-icon name="groups" size="xl" color="primary" />
              <div class="text-caption q-mt-sm q-mb-xs text-center">Overall No. Donors</div>
            </q-card-section>

            <q-card-section class="column items-center justify-center">
              <div class="row no-wrap justify-center items-center text-body1">
                <p class="q-ma-none">Since start...</p>
              </div>
              <div class="q-mt-md row no-wrap">
                <h4 class="q-ma-none">{{ countOverallDonors }}</h4>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <q-card-section class="column justify-center items-center q-pb-none">
              <q-icon name="volunteer_activism" size="xl" color="primary" />
              <div class="text-caption">Monthly Donations</div>
            </q-card-section>

            <q-card-section class="column items-center justify-center">
              <div class="row no-wrap justify-center items-center text-body1">
                <!-- <q-btn icon="chevron_left" flat dense /> -->
                <p class="q-ma-none">June</p>
                <!-- <q-btn icon="chevron_right" flat dense /> -->
              </div>
              <div class="q-mt-md row no-wrap">
                <h4 class="q-ma-none">{{ formatNumber(countThisMonthDonation) }}</h4>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <q-card-section class="column justify-center items-center q-pb-none">
              <q-icon name="calendar_month" size="xl" color="primary" />
              <div class="text-caption">Total Amount Raised</div>
            </q-card-section>

            <q-card-section class="column items-center justify-center">
              <div class="text-body1">
                <p class="q-ma-none">Year {{ yearToday }}</p>
              </div>
              <div class="q-mt-md row no-wrap">
                <h4 class="q-ma-none">{{ formatNumber(countOverallDonation) }}</h4>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="walkin-donation q-mt-xl" ref="targetWishlist">
        <div class="donation-container q-pt-xl">
          <h4 class="q-mb-md text-center">We Welcome Walk-In Donations</h4>
          <p class="text-center text-caption">
            Every visit, every gift — you're helping us care for animals in need.
          </p>
        </div>

        <div class="row no-wrap">
          <div class="flex justify-center items-center row" style="width: 100%">
            <div class="box flex column items-center justify-start q-ma-md">
              <h4 class="text-center q-ma-md subject">Medicine</h4>
              <q-scroll-area
                style="height: 400px; width: 100%"
                class="q-px-xl"
                :thumb-style="thumbStyle"
              >
                <div v-for="(medicine, index) in wishlistMedicineData" :key="index" class="q-my-xs">
                  <p class="q-ma-none row no-wrap justify-start items-center">
                    <span style="font-size: 22px" class="q-ma-none">•</span>
                    <span
                      :class="
                        medicine.is_priority === 1
                          ? 'text-red text-bold q-ma-none q-px-sm'
                          : 'text-black  q-ma-none q-px-sm'
                      "
                      style="border-radius: 5px"
                    >
                      {{ medicine.name }}</span
                    >
                  </p>
                </div>
              </q-scroll-area>
            </div>
            <div class="box flex column items-center justify-start q-ma-md">
              <h4 class="text-center q-ma-md subject">Food</h4>
              <q-scroll-area
                style="height: 400px; width: 100%"
                class="q-px-xl"
                :thumb-style="thumbStyle"
              >
                <div v-for="(food, index) in wishlistFoodData" :key="index" class="q-my-xs">
                  <p class="q-ma-none row no-wrap justify-start items-center">
                    <span style="font-size: 22px" class="q-ma-none">•</span>
                    <span
                      :class="
                        food.is_priority === 1
                          ? 'text-red text-bold q-ma-none q-px-sm'
                          : 'text-black  q-ma-none q-px-sm'
                      "
                      style="border-radius: 5px"
                    >
                      {{ food.name }}</span
                    >
                  </p>
                </div>
              </q-scroll-area>
            </div>
            <div class="box flex column items-center justify-start q-ma-md">
              <h4 class="text-center q-ma-md subject">Supplies</h4>
              <q-scroll-area
                style="height: 400px; width: 100%"
                class="q-px-xl"
                :thumb-style="thumbStyle"
              >
                <div v-for="(supplies, index) in wishlistSuppliesData" :key="index" class="q-my-xs">
                  <p class="q-ma-none row no-wrap justify-start items-center">
                    <span style="font-size: 22px" class="q-ma-none">•</span>
                    <span
                      :class="
                        supplies.is_priority === 1
                          ? 'text-red text-bold q-ma-none q-px-sm'
                          : 'text-black  q-ma-none q-px-sm'
                      "
                      style="border-radius: 5px"
                    >
                      {{ supplies.name }}</span
                    >
                  </p>
                </div>
              </q-scroll-area>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <donationDialog />
  <TaaraFooter style="margin-top: 100px" />
</template>
<script src="pages/taara/script/donationChannel.js"></script>
<style lang="scss" scoped src="pages/taara/style/donationChannel.scss"></style>
