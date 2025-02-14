<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar style="height: 60px" class="q-px-lg row no-wrap justify-between items-center">
        <div class="row no-wrap">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="270">
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
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'quasar.dev',
    icon: 'space_dashboard',
    nav: '/',
  },
  {
    title: 'Volunteer',
    caption: 'github.com/quasarframework',
    icon: 'code',
    nav: 'volunteer',
  },
  {
    title: 'Report',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    nav: '',
  },
  {
    title: 'Pets',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    nav: '',
  },
  {
    title: 'Budget Allocation',
    caption: '@quasarframework',
    icon: 'rss_feed',
    nav: '',
  },
  {
    title: 'Daily Expenses',
    caption: '@QuasarFramework',
    icon: 'public',
    nav: '',
  },
  {
    title: 'Announcement',
    caption: '@QuasarFramework',
    icon: 'public',
    nav: '',
  },
]
const linksList2 = [
  {
    title: 'Inventories',
    caption: 'quasar.dev',
    icon: 'space_dashboard',
    nav: 'invetory',
  },
  {
    title: 'Pending',
    caption: 'github.com/quasarframework',
    icon: 'code',
    nav: 'pending',
  },
  {
    title: 'Schedule',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    nav: 'schedule',
  },
  {
    title: 'Activities & Events',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    nav: '',
  },
  {
    title: 'Supplies',
    caption: '@quasarframework',
    icon: 'rss_feed',
    nav: 'supplies',
  },
  {
    title: 'Authorization',
    caption: '@QuasarFramework',
    icon: 'public',
    nav: '',
  },
  {
    title: 'Team',
    caption: '@QuasarFramework',
    icon: 'public',
    nav: '',
  },
  {
    title: 'Table',
    caption: '@QuasarFramework',
    icon: 'public',
    nav: '',
  },
]
const linksList3 = [
  {
    title: 'Settings',
    caption: 'quasar.dev',
    icon: 'space_dashboard',
    nav: '',
  },
  {
    title: 'Logout',
    caption: 'github.com/quasarframework',
    icon: 'code',
    nav: '',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const tab = ref('Dashboard')
    const language = ref('English')
    return {
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
