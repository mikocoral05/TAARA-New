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
            v-model="search.name"
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
          <q-input
            v-model="searchValue"
            outlined
            dense
            type="search"
            style="width: 350px"
            placeholder="Search pet here ..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="row no-wrap items-center justify-center">
            <p class="q-ma-none q-mr-sm">Sorted by:</p>
            <q-select v-model="sorted" emit-value map-options :options="sorted_by" dense />
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
                <div class="q-ma-none text-caption">Name: {{ data.name }}</div>
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
<script>
import { ref, onMounted, watch, computed, watchEffect } from 'vue'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { useRoute } from 'vue-router'
import { getAllAnimals, specificAnimalId, SearchAnimalByName } from 'src/composable/taaraComposable'
import { calculateAge, encodeAnimalId, getImageLink } from 'src/composable/simpleComposable'

export default {
  components: { TaaraFooter },

  setup() {
    const miniState = ref(false)
    const route = useRoute()
    const searchValue = ref(null)
    const filterAdvanceSearch = ref(false)
    const drawer = ref(true)
    const sorted = ref('')
    const categorizeByName = ref(false)
    const categorizeByAge = ref(false)
    const categorizeByWeight = ref(false)
    const categorizeByHeight = ref(false)
    const categorizeByYearRescued = ref(false)
    const allAnimalData = ref([])
    const search = ref(null)
    const options = ref()
    const watchRoute = () => {
      return route.query.page
    }
    const currentPage = ref(1)
    const itemsPerPage = ref(20)

    const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredRows.value.slice(start, end)
    })

    const categorizeByNameFn = () => {}
    const sortByName = (array) => {
      categorizeByName.value = !categorizeByName.value
      return array.sort((a, b) => {
        let nameA = a.name.toUpperCase() // ignore upper and lowercase
        let nameB = b.name.toUpperCase() // ignore upper and lowercase

        if (categorizeByName.value == false) {
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
        } else {
          if (nameA > nameB) {
            return -1
          }
          if (nameA < nameB) {
            return 1
          }
        }

        // names must be equal
        return 0
      })
    }

    const sortByAge = (array) => {
      categorizeByAge.value = !categorizeByAge.value

      const getAgeInMonths = (dob) => {
        const birthDate = new Date(dob)
        const now = new Date()

        const years = now.getFullYear() - birthDate.getFullYear()
        const months = now.getMonth() - birthDate.getMonth()
        const totalMonths = years * 12 + months

        return totalMonths
      }

      return array.sort((a, b) => {
        const ageA = getAgeInMonths(a.date_of_birth)
        const ageB = getAgeInMonths(b.date_of_birth)

        // If categorizeByAge is true, sort ascending (youngest to oldest)
        return categorizeByAge.value ? ageA - ageB : ageB - ageA
      })
    }

    const sortByWeight = (array) => {
      categorizeByWeight.value = !categorizeByWeight.value
      let convertWeightToGrams = (weightString) => {
        let value = parseFloat(weightString)
        let unit = weightString.replace(value, '')

        if (unit.includes('kg')) {
          value = value * 1000 // convert kilograms to grams
        }
        // if unit is 'g' or 'mg', value remains the same

        return value
      }

      return array.sort((a, b) => {
        let weightA = convertWeightToGrams(a.weight)
        let weightB = convertWeightToGrams(b.weight)

        if (categorizeByWeight.value == false) {
          return weightA - weightB
        } else {
          return weightB - weightA
        }
      })
    }

    const sortByHeight = (array) => {
      categorizeByHeight.value = !categorizeByHeight.value
      return array.sort((a, b) => {
        let heightA = a.height
        let heightB = b.height

        if (categorizeByHeight.value == false) {
          return heightB - heightA
        } else {
          return heightA - heightB
        }
      })
    }

    const sortByDateRescued = (array) => {
      console.log(array)
      categorizeByYearRescued.value = !categorizeByYearRescued.value
      return array.sort((a, b) => {
        let dateA = new Date(a.care_start_date)
        let dateB = new Date(b.care_start_date)

        if (categorizeByYearRescued.value == false) {
          // if condition is true, sort in descending order
          return dateB - dateA
        } else {
          // if condition is false, sort in ascending order
          return dateA - dateB
        }
      })
    }

    watch(watchRoute, (newVal) => {
      currentPage.value = route.query.page == undefined ? 1 : Number(newVal)
    })

    const filteredRows = computed(() => {
      if (!searchValue.value) return allAnimalData.value
      const keyword = searchValue.value.toLowerCase().trim()
      return allAnimalData.value.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(keyword)),
      )
    })
    watchEffect(() => {
      getAllAnimals(sorted.value).then((response) => {
        allAnimalData.value = response
        console.log(allAnimalData.value)
      })
    })
    onMounted(() => {
      if (window.innerWidth <= 581) {
        drawer.value = false
      }
      currentPage.value = route.query.page == undefined ? 1 : route.query.page
    })
    return {
      filteredRows,
      getImageLink,
      sortByDateRescued,
      sortByHeight,
      sortByWeight,
      sortByAge,
      sortByName,
      categorizeByNameFn,
      options,
      encodeAnimalId,

      totalPages,
      paginatedItems,
      currentPage,
      itemsPerPage,
      filterAdvanceSearch,
      search,
      animal_type_option: [
        {
          label: 'Any',
          value: 'Any',
        },
        {
          label: 'Dog',
          value: 'dog',
        },
        {
          label: 'Cat',
          value: 'cat',
        },
      ],
      breed_option: [
        {
          label: 'Any',
          value: 'Any',
        },
        {
          label: 'Aspin',
          value: 'aspin',
        },
        {
          label: 'German Shepherd',
          value: 'german shepherd',
        },
        {
          label: 'Golden retriever',
          value: 'golden retriever',
        },
        {
          label: 'Chihuahua',
          value: 'chihuahua',
        },
        {
          label: 'Beagle',
          value: 'beagle',
        },
      ],

      age_option: [
        { label: 'Any', value: 'Any' },
        { label: 'Young', value: 'young' },
        { label: 'Adult', value: 'adult' },
        { label: 'Senior', value: 'senior' },
      ],
      sex_option: [
        { label: 'Any', value: 'Any' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      size_option: [
        { label: 'Any', value: 'Any' },
        { label: 'Small', value: 1 },
        { label: 'Normal', value: 2 },
        { label: 'Big', value: 3 },
      ],
      color_option: [
        { label: 'Any', value: 'Any' },
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Brown', value: 'brown' },
        { label: 'Orange', value: 'orange' },
        { label: 'Mix', value: 'mix' },
      ],
      good_with_option: [
        { label: 'Any', value: 'Any' },
        { label: 'People', value: 1 },
        { label: 'Animal', value: 2 },
        { label: 'Both', value: 3 },
      ],
      care_behavior: [
        { label: 'Any', value: 'Any' },
        { label: 'House Trained', value: 'house trained' },
        { label: 'Declawed', value: 'declawed' },
        { label: 'Playful', value: 'playful' },
        { label: 'Loving', value: 'loving' },
        { label: 'Special Needs', value: 'special needs' },
      ],
      sorted_by: [
        { label: 'All', value: '' },
        { label: 'Ready for Adoption', value: 1 },
        { label: 'In Rehabilitation', value: 2 },
        { label: 'In Medication', value: 3 },
        // { label: "Adopted", value: 4 },
      ],
      drawer,
      miniState,
      getAllAnimals,
      allAnimalData,
      specificAnimalId,
      SearchAnimalByName,
      categorizeByName,
      categorizeByAge,
      categorizeByWeight,
      categorizeByHeight,
      categorizeByYearRescued,
      drawerClick(e) {
        if (miniState.value) {
          miniState.value = false
          e.stopPropagation()
        }
      },
      calculateAge,
      sorted,
      searchValue,
    }
  },
}
</script>
<style lang="scss" scoped src="pages/taara/style/petInformation.scss"></style>
