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
import { defineComponent, ref, watchEffect } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRoute } from 'vue-router'

const linksList = [
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    nav: '/',
  },
  {
    title: 'User Management',
    icon: 'groups',
    nav: 'users',
  },
  {
    title: 'Report',
    icon: 'analytics',
    nav: 'report',
  },
  {
    title: 'Pets',
    icon: 'pets',
    nav: 'pets',
  },
  {
    title: 'Budget & Expenses',
    icon: 'payments',
    nav: 'budget-and-expenses',
  },
  {
    title: 'Announcement',
    icon: 'campaign',
    nav: '',
  },
  {
    title: 'Donation',
    icon: 'volunteer_activism',
    nav: 'donation',
  },
]
const linksList2 = [
  {
    title: 'Inventory',
    icon: 'inventory',
    nav: 'invetory',
  },
  {
    title: 'Pending',
    icon: 'pending_actions',
    nav: 'pending',
  },
  {
    title: 'Schedule',
    icon: 'schedule',
    nav: 'animal-schedule',
  },
  {
    title: 'Activities & Events',
    icon: 'calendar_month',
    nav: '',
  },
  {
    title: 'Supplies',
    icon: 'precision_manufacturing',
    nav: 'supplies',
  },
  {
    title: 'Authorization',
    icon: 'manage_accounts',
    nav: 'users',
  },
  {
    title: 'Record',
    icon: 'assignment',
    nav: '',
  },
]
const linksList3 = [
  {
    title: 'Settings',
    icon: 'settings',
    nav: '',
  },
  {
    title: 'Logout',
    icon: 'logout',
    nav: '',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const route = useRoute()
    const showLayout = ref(true)
    const pathExclude = ref(['/user-login', '/user-registration'])

    watchEffect(() => {
      showLayout.value = !pathExclude.value.includes(route.path)
    })
    const leftDrawerOpen = ref(false)
    console.log(route.name)

    const routeToTabMap = {
      '/': 'Dashboard',
      '/users': 'User Management',
      '/report': 'Report',
      '/pets': 'Pets',
      '/budget-and-expenses': 'Budget & Expenses',
      '/donation': 'Donation',
      '/invetory': 'Inventory',
      '/pending': 'Pending',
      '/animal-schedule': 'Schedule',
      '/supplies': 'Supplies',
    }

    const tab = ref(routeToTabMap[route.path] || 'Dashboard')

    const language = ref('English')
    return {
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
