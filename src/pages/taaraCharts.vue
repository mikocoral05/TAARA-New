<template>
  <q-page class="column items-center">
    <div class="first-layer text-body1">
      <div class="background-image absolute-top"></div>
      <h3 class="text-center q-my-md q-pt-lg text-white">
        {{ formattedString }}
      </h3>
      <p class="text-center text-white">“Uncover patterns in rescues, adoptions, and donations.”</p>
      <div class="flex row justify-center items-center">
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ allRescuedAnimal?.length ?? 0 }}
                </h2>
                <p class="box-label">Total of Rescue</p>
              </div>
              <q-img src="../image/pet-care.png" class="images" />
            </div>
            <q-btn
              no-caps
              class="text-white text-center q-pa-sm click-for-more"
              flat
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              to="totalOfRescue"
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
        <!-- ------------------ -->
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ animalsAdopted?.length ?? 0 }}
                </h2>
                <p class="box-label">Total of Adoption</p>
              </div>
              <q-img src="../image/pet-adoption.png" class="images" />
            </div>
            <q-btn
              to="totalOfAdoption"
              no-caps
              flat
              class="text-white text-center q-pa-sm click-for-more"
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
        <!-- ------------------------- -->
        <div class="flex justify-center items-center q-ma-sm squares-container">
          <div class="squares flex column">
            <div class="flex row justify-center items-center text-white q-mx-md">
              <div class="flex column q-ma-md q-mx-md q-mr-xl total-container">
                <h2 class="q-my-sm total-number">
                  {{ formatNumber(thisMonthDonation, 'noDecimal') }}
                </h2>
                <p class="box-label">Total of Donations</p>
              </div>
              <q-img src="../image/handheart.png" class="images" />
            </div>
            <q-btn
              to="totalOfDonations"
              flat
              no-caps
              class="text-white text-center q-pa-sm click-for-more"
              style="
                background: #d66dd2;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
              >Click for more info <q-icon name="arrow_circle_right" class="click-for-more-icon"
            /></q-btn>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center q-mb-xl almost-container">
        <div class="bottom-div flex justify-center items-center column q-mb-xl q-ma-md">
          <h2 class="text-center almost-there q-my-sm">We're Almost There!</h2>
          <div style="width: 100%" class="flex justify-between items-center">
            <div>
              <p class="text-zize-left q-ml-xl">We Have Received</p>
              <p class="text-zize-left q-ml-xl">
                {{ formatNumber(0) }}
              </p>
            </div>
            <div>
              <p class="text-zize-right q-mr-xl">Our Goal</p>
              <p class="text-zize-right q-mr-xl">
                {{ formatNumber(amountGoal) }}
              </p>
            </div>
          </div>
          <div
            class="flex row justify-center items-center q-mb-xl percentage-container no-wrap"
            style="width: 100%"
          >
            <q-img src="../image/sad-dog.png" class="dog-cat-image q-ml-sm" />
            <div class="container-skill">
              <div class="skill" :style="{ width: percentage + '%' }">{{ percentage }}%</div>
            </div>
            <q-img src="../image/happy-cat.jpg" class="dog-cat-image q-mr-sm" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="second-layer column no-wrap items-center q-mt-xl"></div> -->

    <taaraFooter class="footer full-width"></taaraFooter>
  </q-page>
</template>
<script src="pages/taara/script/taaraCharts.js"></script>
<style lang="scss" scoped src="pages/taara/style/taaraCharts.scss"></style>
