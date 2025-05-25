<template>
  <q-page>
    <div>
      <q-dialog
        v-model="filterAdvanceSearch"
        persistent
        full-height
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <div class="advancesearch-dropdown q-mx-lg">
          <q-icon
            name="close"
            size="1.5rem"
            class="absolute-right q-ma-sm"
            @click="filterAdvanceSearch = false"
          />
          <p class="text-center q-mt-md">PET NAME</p>
          <q-input
            v-model="search.animal_name"
            style="border: 1px solid #b157ae; border-radius: 5px"
            class="q-mx-md responsive-advance-search-input"
            :input-style="{
              marginTop: '-30px',
              textAlign: 'center',
              fontWeight: '300',
            }"
            borderless
          >
            <template v-slot:append>
              <q-avatar>
                <q-icon name="search" size="20px" style="color: #b157ae" class="search-icon" />
              </q-avatar>
            </template>
          </q-input>
          <p class="text-center q-mt-sm q-ma-none">ANIMAL TYPE</p>
          <div style="width: 100%" class="flex row no-wrap justify-center items-center">
            <q-btn
              label="Dog"
              class="q-ma-sm q-pa-none advance-button-responsive"
              no-caps
              dense
              flat
              @click="search.animal_type = search.animal_type === 'dog' ? '' : 'dog'"
              :style="
                search.animal_type == 'dog'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Cat"
              class="q-ma-sm q-pa-none advance-button-responsive"
              no-caps
              flat
              dense
              @click="search.animal_type = search.animal_type === 'cat' ? '' : 'cat'"
              :style="
                search.animal_type == 'cat'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <p class="text-center q-mb-none">BREED</p>
          <!-- //breed dropdown-button -->
          <div style="width: 100%" class="flex row no-wrap justify-center items-center">
            <q-select
              dense
              class="q-ma-sm bg-white advance-button-responsive-select"
              :input-style="{ textAlign: 'center' }"
              map-options
              emit-value
              borderless
              v-model="search.breed"
              :options="breed_option"
            />
          </div>
          <p class="text-center q-mb-none">AGE</p>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="Young"
              dense
              flat
              no-caps
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.age = search.age === 'young' ? '' : 'young'"
              :style="
                search.age == 'young'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Adult"
              dense
              flat
              no-caps
              @click="search.age = search.age === 'adult' ? '' : 'adult'"
              class="q-pa-none q-ma-sm advance-button-responsive"
              :style="
                search.age == 'adult'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Senior"
              dense
              flat
              no-caps
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.age = search.age === 'senior' ? '' : 'senior'"
              :style="
                search.age == 'senior'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <p class="text-center q-mb-none">SIZE</p>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="Small (0-6 lbs)"
              no-caps
              flat
              dense
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.size = search.size === 1 ? '' : 1"
              :style="
                search.size == 1
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Normal (7-11 lbs)"
              no-caps
              flat
              dense
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.size = search.size === 2 ? '' : 2"
              :style="
                search.size == 2
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>

          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="Large (12-16 lbs)"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.size = search.size === 3 ? '' : 3"
              :style="
                search.size == 3
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>

          <p class="text-center q-mb-none">GENDER</p>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="Male"
              no-caps
              flat
              dense
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.sex = search.sex === 'male' ? '' : 'male'"
              :style="
                search.sex == 'male'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Female"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.sex = search.sex === 'female' ? '' : 'female'"
              :style="
                search.sex == 'female'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <p class="text-center q-mb-none">GOOD WITH</p>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="People"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.good_with = search.good_with === 1 ? '' : 1"
              :style="
                search.good_with == 1
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Animal"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.good_with = search.good_with === 2 ? '' : 2"
              :style="
                search.good_with == 2
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Both"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.good_with = search.good_with === 3 ? '' : 3"
              :style="
                search.good_with == 3
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <p class="text-center q-mb-none">CARE & BEHAVIOUR</p>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="House Trained"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="
                search.behaviour = search.behaviour === 'house trained' ? '' : 'house trained'
              "
              :style="
                search.behaviour == 'house trained'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Declawed"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.behaviour = search.behaviour === 'declawed' ? '' : 'declawed'"
              :style="
                search.behaviour == 'declawed'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <div class="flex row no-wrap justify-center items-center" style="width: 100%">
            <q-btn
              label="Playful"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.behaviour = search.behaviour === 'playful' ? '' : 'playful'"
              :style="
                search.behaviour == 'playful'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
            <q-btn
              label="Loving"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="search.behaviour = search.behaviour === 'loving' ? '' : 'loving'"
              :style="
                search.behaviour == 'loving'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
          <div class="flex row no-wrap justify-center items-center q-mb-md" style="width: 100%">
            <q-btn
              label="Special Needs"
              dense
              no-caps
              flat
              class="q-pa-none q-ma-sm advance-button-responsive"
              @click="
                search.behaviour = search.behaviour === 'special needs' ? '' : 'special needs'
              "
              :style="
                search.behaviour == 'special needs'
                  ? { background: '#b157ae', color: 'white' }
                  : { background: 'white', color: 'black' }
              "
            />
          </div>
        </div>
      </q-dialog>
      <div class="column no-wrap items-center text-body1 first-layer">
        <h4 class="q-mb-lg title">Our pets <span class="text-primary"> Gallery </span></h4>
        <p class="text-center sub-text">
          “Welcome to Our Pets Gallery! Discover a diverse collection of animals, each on their
          unique journey.<br />
          From adoptable pets to those who’ve found homes or need medical care, our gallery
          showcases their resilience and charm.<br />
          Explore, connect with their stories, and learn how you can help.”
        </p>
        <div class="row no-wrap justify-between items-center q-btn-container q-mt-lg">
          <q-select
            outlined
            v-model="searchValue"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            placeholder="Search pet details"
            :options="options"
            @filter="filterFn"
            dense
            class="search-field"
            hide-dropdown-icon
            @update:model-value="onSelectionChange"
          >
            <!-- @new-value="onSelectionChange" -->

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-select>
          <div class="row no-wrap items-center justify-center">
            <p class="q-ma-none q-mr-sm">Sorted by:</p>
            <q-select
              v-model="sorted"
              emit-value
              map-options
              :options="sorted_by"
              dense
              @update:model-value="sortPets(sorted)"
            />
          </div>
        </div>
        <div class="categorize-container row justify-between items-center q-pt-md no-wrap">
          <q-btn
            label="Name"
            :icon-right="categorizeByName ? 'arrow_drop_up' : 'arrow_drop_down'"
            no-caps
            dense
            class="text-weight-regular"
            @click="sortByName(allAnimalData)"
          />
          <q-btn
            label="Age"
            no-caps
            dense
            class="text-weight-regular"
            :icon-right="categorizeByAge ? 'arrow_drop_up' : 'arrow_drop_down'"
            @click="sortByAge(allAnimalData)"
          />
          <q-btn
            label="Weight"
            no-caps
            dense
            class="text-weight-regular"
            :icon-right="categorizeByWeight ? 'arrow_drop_up' : 'arrow_drop_down'"
            @click="sortByWeight(allAnimalData)"
          />
          <q-btn
            label="Height"
            no-caps
            dense
            class="text-weight-regular"
            :icon-right="categorizeByHeight ? 'arrow_drop_up' : 'arrow_drop_down'"
            @click="sortByHeight(allAnimalData)"
          />
          <q-btn
            label="Year Rescued"
            no-caps
            dense
            class="text-weight-regular"
            :icon-right="categorizeByYearRescued ? 'arrow_drop_up' : 'arrow_drop_down'"
            @click="sortByDateRescued(allAnimalData)"
          />
        </div>
        <div class="flex q-pa-sm justify-center items-left">
          <q-card
            class="my-card q-ma-sm flex justify-center q-my-xl"
            v-for="data in paginatedItems"
            :key="data.animal_id"
            flat
          >
            <q-btn
              class="q-ma-none q-pa-none"
              flat
              @click="
                $router.push({
                  path: '/public/view-specific-animal',
                  query: { pet: encodeAnimalId(data.animal_id) },
                })
              "
              no-caps
            >
              <q-img
                class="q-img radius-10"
                :src="getImageLink(data.primary_image)"
                height="250px"
                width="240px"
                alt="Image is not available"
              />
              <q-card-section class="q-ma-none q-pa-none text-center text-capitalize">
                <div class="q-ma-none animal-name text-weight-regular">
                  <b> {{ data.breed }}</b>
                </div>
                <div class="q-ma-none text-caption">
                  Sex: {{ data.sex }} Age:
                  {{ calculateAge(data.date_of_birth) }}
                </div>
                <div class="q-ma-none text-caption">Name: {{ data.animal_name }}</div>
              </q-card-section>
            </q-btn>
          </q-card>
        </div>
        <q-pagination
          size="12px"
          v-model="currentPage"
          :max="totalPages"
          :max-pages="6"
          boundary-links
          @click="
            $router.push({
              query: { page: currentPage },
            })
          "
        />
      </div>
    </div>
    <TaaraFooter class="footer" />
  </q-page>
</template>
<script src="pages/taara/script/petInformation.js"></script>
<style lang="scss" scoped src="pages/taara/style/petInformation.scss"></style>
