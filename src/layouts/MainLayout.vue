<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" v-if="store.showLayout">
      <q-toolbar style="height: 60px" class="q-px-lg row no-wrap justify-between items-center">
        <div class="row no-wrap">
          <q-btn
            flat
            :ripple="false"
            icon="menu"
            size=".7rem"
            @click="toggleLeftDrawer"
            class="q-mr-xl"
          />
          <q-input
            borderless
            style="width: 350px"
            class="bg-default radius-10 q-px-md"
            placeholder="Search"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="row no-wrap items-center q-mr-xl">
          <q-btn round icon="notifications" color="primary" class="q-mr-xl" flat dense>
            <q-badge color="red" floating>4</q-badge>
          </q-btn>
          <!-- <div class="row no-wrap items-center q-mr-lg">
            <q-img src="svg/united-kingdom-flag.svg" width="40px" class="q-mr-lg" />
            <q-select
              v-model="language"
              :options="['English', 'France']"
              borderless
              style="min-width: 100px"
              flat
              dense
            />
          </div> -->
          <div class="row no-wrap items-center q-mr-md">
            <q-img
              :src="
                store.userData?.image_path
                  ? getImageLink(store.userData?.image_path)
                  : store.userData?.sex == 1
                    ? 'no-profile-male.svg'
                    : 'no-profile-female.svg'
              "
              class="radius-100 q-mr-md"
              height="40px"
              width="40px"
            />
            <div class="column no-wrap">
              <div>{{ store.userData?.first_name + ' ' + store.userData?.last_name }}</div>
              <div class="text-grey-7 ellipsis" style="width: 100px">
                {{ store.userData?.position_title }}
                <q-tooltip class="bg-primary" :offset="[10, 10]">
                  {{ store.userData?.position_title }}
                </q-tooltip>
              </div>
            </div>
          </div>
          <q-btn round icon="sym_r_more_vert" color="primary" flat dense>
            <q-menu>
              <q-list style="width: 150px">
                <q-item clickable v-close-popup to="/management/account-settings">
                  <q-item-section class="row no-wrap">My Account</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable v-close-popup @click="logOuts()">
                  <q-item-section>Log Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="store.leftDrawerOpen"
      v-if="store.showLayout"
      show-if-above
      bordered
      :width="270"
      class="q-drawer"
    >
      <q-scroll-area
        :thumb-style="{ width: '0px' }"
        :bar-style="{ width: '0px' }"
        style="height: 100%; max-width: 270px"
        @scroll="scrollFn"
        ref="myScrollArea"
      >
        <q-list class="q-px-lg">
          <q-item-label header class="text-h6 flex flex-center text-bold">
            <span class="text-primary">Dash</span> Stack
          </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
            :tab="tab"
            @update-tab="tab = $event"
          />
        </q-list>
        <q-separator class="q-mt-lg q-mb-md" />
        <q-list class="q-px-lg">
          <q-item class="text-grey-7 text-caption">PAGES</q-item>
          <EssentialLink
            v-for="link in linksList2"
            :key="link.title"
            v-bind="link"
            :tab="tab"
            :pending="link.pending"
            @update-tab="tab = $event"
          />
        </q-list>
        <q-separator class="q-mt-lg q-mb-md" />
        <q-list class="q-px-lg">
          <EssentialLink
            v-for="link in linksList3"
            :key="link.title"
            v-bind="link"
            :tab="tab"
            @update-tab="tab = $event"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view class="q-pa-lg" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, watchEffect } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRoute, useRouter } from 'vue-router'
import { globalStore } from 'src/stores/global-store'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { getImageLink } from 'src/composable/simpleComposable'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const store = globalStore()
    const route = useRoute()
    const router = useRouter()
    const myScrollArea = ref(null)
    const scrollPosition = ref(0)
    const language = ref('English')
    const pathExclude = ref(['/management/user-login', '/management/user-registration'])
    // const leftDrawerOpen = ref(store.leftDrawerOpen)
    const $q = useQuasar()
    let logOuts = () => {
      $q.loading.show({
        message: 'Logging Out. Please wait...',
      })

      setTimeout(() => {
        sessionStorage.clear()
        store.reset()
        router.replace('/user-login')
        $q.loading.hide()
      }, 1000)
    }

    const linksList = computed(() => [
      {
        title: 'Dashboard',
        icon: 'space_dashboard',
        nav: '/management',
      },
      {
        title: 'User Management',
        icon: 'groups',
        nav: '/management/users',
        pending: store.pendingVolunteer,
      },
      {
        title: 'Report',
        icon: 'analytics',
        nav: '/management/analytic-report',
      },
      {
        title: 'Pets',
        icon: 'pets',
        nav: '/management/pets',
      },
      {
        title: 'Budget & Expenses',
        icon: 'payments',
        nav: '/management/budget-and-expenses',
      },
      {
        title: 'Announcement',
        icon: 'campaign',
        nav: '/management/announcement',
      },
      {
        title: 'Donation',
        icon: 'volunteer_activism',
        nav: '/management/donation',
      },
    ])

    const linksList2 = computed(() => [
      {
        title: 'Medicine Inventory',
        icon: 'inventory',
        nav: '/management/invetory',
      },
      {
        title: 'Rescue Report',
        icon: 'fire_truck',
        nav: '/management/rescue-report',
        pending: store.pendingRescueReport,
      },
      {
        title: 'Schedule',
        icon: 'schedule',
        nav: '/management/animal-schedule',
      },
      {
        title: 'Activities & Events',
        icon: 'calendar_month',
        nav: '/management/activities-and-events',
      },
      {
        title: 'Wishlist',
        icon: 'sym_r_folded_hands',
        nav: '/management/wishlist',
      },
      {
        title: 'Pet Transfer',
        icon: 'sym_r_airport_shuttle',
        nav: '/management/pet-transfer-request',
      },
    ])

    const linksList3 = computed(() => [
      {
        title: 'Settings',
        icon: 'settings',
        nav: '',
      },
      {
        title: 'Logout',
        icon: 'logout',
        nav: '',
        action: logOuts,
      },
    ])

    const routeToTabMap = {
      '/management/': 'Dashboard',
      '/management/users': 'User Management',
      '/management/report': 'Report',
      '/management/pets': 'Pets',
      '/management/budget-and-expenses': 'Budget & Expenses',
      '/management/donation': 'Donation',
      '/management/invetory': 'Medicine Inventory',
      '/management/pending-application': 'Pending',
      '/management/animal-schedule': 'Schedule',
      '/management/supplies': 'Supplies',
      '/management/activities-and-events': 'Activities & Events',
      '/management/announcement': 'Announcement',
      '/management/rescue-report': 'Rescue Report',
      '/management/analytic-report': 'Report',
      '/management/wishlist': 'Wishlist',
      '/management/pet-transfer-request': 'Pet Transfer',
    }

    const tab = ref(routeToTabMap[route.path] || 'Dashboard')

    const scrollFn = (event) => {
      scrollPosition.value = event.verticalPosition
      sessionStorage.setItem('myScrollPos', scrollPosition.value)
    }

    watchEffect(() => {
      store.showLayout = !pathExclude.value.includes(route.path)
    })

    onMounted(() => {
      const savedPosition = parseFloat(sessionStorage.getItem('myScrollPos') || '0')
      myScrollArea.value?.setScrollPosition('vertical', savedPosition)
    })
    return {
      store,
      getImageLink,
      logOuts,
      scrollPosition,
      myScrollArea,
      scrollFn,
      tab,
      language,
      linksList2,
      linksList3,
      linksList,
      toggleLeftDrawer() {
        store.leftDrawerOpen = !store.leftDrawerOpen
      },
    }
  },
})
</script>
