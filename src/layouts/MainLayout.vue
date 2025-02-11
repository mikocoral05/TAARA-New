<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar style="height: 70px" class="q-px-lg">
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
          v-model="text"
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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered width="270">
      <q-list class="q-px-lg">
        <q-item-label header class="text-h6 flex flex-center text-bold">
          <span class="text-primary">Dash</span> Stack
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <q-separator class="q-mt-lg q-mb-md" />
      <q-list class="q-px-lg">
        <q-item class="text-grey-7 text-caption">PAGES</q-item>
        <EssentialLink v-for="link in linksList2" :key="link.title" v-bind="link" />
      </q-list>
      <q-separator class="q-mt-lg q-mb-md" />
      <q-list class="q-px-lg">
        <EssentialLink v-for="link in linksList3" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
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
  },
  {
    title: 'Products',
    caption: 'github.com/quasarframework',
    icon: 'code',
  },
  {
    title: 'Favorites',
    caption: 'chat.quasar.dev',
    icon: 'chat',
  },
  {
    title: 'Inbox',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
  },
  {
    title: 'Order List',
    caption: '@quasarframework',
    icon: 'rss_feed',
  },
  {
    title: 'Product Stocks',
    caption: '@QuasarFramework',
    icon: 'public',
  },
]
const linksList2 = [
  {
    title: 'Pricing',
    caption: 'quasar.dev',
    icon: 'space_dashboard',
  },
  {
    title: 'Calendar',
    caption: 'github.com/quasarframework',
    icon: 'code',
  },
  {
    title: 'To-Do',
    caption: 'chat.quasar.dev',
    icon: 'chat',
  },
  {
    title: 'Contact',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
  },
  {
    title: 'Invoice',
    caption: '@quasarframework',
    icon: 'rss_feed',
  },
  {
    title: 'UI Elements',
    caption: '@QuasarFramework',
    icon: 'public',
  },
  {
    title: 'Team',
    caption: '@QuasarFramework',
    icon: 'public',
  },
  {
    title: 'Table',
    caption: '@QuasarFramework',
    icon: 'public',
  },
]
const linksList3 = [
  {
    title: 'Settings',
    caption: 'quasar.dev',
    icon: 'space_dashboard',
  },
  {
    title: 'Logout',
    caption: 'github.com/quasarframework',
    icon: 'code',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
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
