<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" v-if="showLayout">
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
          <div class="row no-wrap items-center q-mr-lg">
            <q-img src="svg/united-kingdom-flag.svg" width="40px" class="q-mr-lg" />
            <q-select
              v-model="language"
              :options="['English', 'France']"
              borderless
              style="min-width: 100px"
              flat
              dense
            />
          </div>
          <div class="row no-wrap items-center">
            <q-avatar class="q-mr-md">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="column no-wrap">
              <div>Moni Roy</div>
              <div class="text-grey-7">Admin</div>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" v-if="showLayout" show-if-above bordered :width="270">
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

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const store = globalStore()
    const route = useRoute()
    const router = useRouter()
    const showLayout = ref(true)
    const myScrollArea = ref(null)
    const scrollPosition = ref(0)
    const language = ref('English')
    const pathExclude = ref(['/management/user-login', '/management/user-registration'])
    const leftDrawerOpen = ref(false)
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
      }, 2000)
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
        title: 'Inventory',
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
        title: 'Authorization',
        icon: 'manage_accounts',
        nav: '/management/users',
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
      '/management/invetory': 'Inventory',
      '/management/pending-application': 'Pending',
      '/management/animal-schedule': 'Schedule',
      '/management/supplies': 'Supplies',
      '/management/activities-and-events': 'Activities & Events',
      '/management/announcement': 'Announcement',
      '/management/rescue-report': 'Rescue Report',
      '/management/analytic-report': 'Report',
    }

    const tab = ref(routeToTabMap[route.path] || 'Dashboard')

    const scrollFn = (event) => {
      scrollPosition.value = event.verticalPosition
      sessionStorage.setItem('myScrollPos', scrollPosition.value)
    }

    watchEffect(() => {
      showLayout.value = !pathExclude.value.includes(route.path)
    })

    onMounted(() => {
      const savedPosition = parseFloat(sessionStorage.getItem('myScrollPos') || '0')
      myScrollArea.value?.setScrollPosition('vertical', savedPosition)
    })

    return {
      logOuts,
      scrollPosition,
      myScrollArea,
      scrollFn,
      showLayout,
      tab,
      language,
      linksList2,
      linksList3,
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
