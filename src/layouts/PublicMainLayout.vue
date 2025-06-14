<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      :style="{
        background: `linear-gradient(to bottom, white 0%, white 15%, ${headerColor} 15%, ${headerColor} 100%)`,
      }"
      class="q-header row justify-between items-center"
      reveal
    >
      <div class="left-header row no-wrap">
        <div class="column justify-start">
          <img src="TAARALogo.png" alt="" />
        </div>
        <div class="column no-wrap justify-start text-black">
          <div class="title">TAARA</div>
          <div class="sub-title">
            Tabaco Animal Rescue and Adoption:<br />
            Giving every pet a chance at a loving<br />
            home. 🐾
          </div>
        </div>
      </div>
      <div class="right-header text-black row no-wrap">
        <div class="nav-tab">
          <q-btn
            label="Home"
            no-caps
            dense
            flat
            to="home"
            @click="headerColor = 'white'"
            :class="
              ['/public', '/public/home'].includes($route.fullPath) || ''
                ? 'bg-primary text-white'
                : 'bg-white text-black'
            "
          />
          <q-btn
            label="Pets"
            no-caps
            dense
            flat
            to="/public/pet-list?page=1"
            :class="
              $route.fullPath.indexOf('/public/pet-list') !== -1
                ? 'bg-primary text-white'
                : 'bg-white text-black'
            "
          />
          <q-btn
            label="Charts"
            no-caps
            dense
            flat
            to="/public/taara-charts"
            :class="
              $route.fullPath == '/public/taara-charts'
                ? 'bg-primary text-white'
                : 'bg-white text-black'
            "
          />
          <q-btn
            label="Contact"
            no-caps
            dense
            flat
            :class="
              $route.fullPath == '/public/contact' ? 'bg-primary text-white' : 'bg-white text-black'
            "
            @click="goToContactUs()"
          />
          <q-btn-dropdown label="More" dense flat no-caps>
            <q-list>
              <q-item
                clickable
                v-close-popup
                to="/public/about-us"
                @click="headerColor = 'white'"
                :class="
                  $route.fullPath == '/public/about-us' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>About Us</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                to="/public/taara-faqs"
                @click="headerColor = '#ffd7ef'"
                :class="
                  $route.fullPath == '/public/taara-faqs' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>FAQs</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                to="/public/pet-care"
                @click="headerColor = 'white'"
                :class="
                  $route.fullPath == '/public/pet-care' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>Pet Care</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                to="/public/donation-channel?wish=0"
                @click="headerColor = 'white'"
                :class="
                  $route.fullPath == '/public/donation-channel?wish=0' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>Shelter Wishlist</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item
                clickable
                v-close-popup
                to="/public/pet-transfer"
                @click="headerColor = 'white'"
                :class="
                  $route.fullPath == '/public/pet-transfer' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>Pet Transfer</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                to="/public/report-and-rescue"
                @click="headerColor = 'white'"
                :class="
                  $route.fullPath == '/public/report-and-rescue' || ''
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                "
              >
                <q-item-section>
                  <q-item-label>Report & Rescue</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div
          class="profile-tab row no-rap justify-center items-center"
          v-if="Object.keys(store.userData ?? {}).length !== 0"
        >
          <div class="img-container relative-position">
            <q-img
              :src="
                store.userData?.image_path
                  ? getImageLink(store.userData?.image_path)
                  : store.userData?.sex == 1
                    ? 'no-profile-male.svg'
                    : 'no-profile-female.svg'
              "
              class="radius-100"
              height="40px"
              width="40px"
            />
          </div>
          <q-btn bordered icon="expand_more" round flat dense>
            <q-menu>
              <q-list>
                <q-item clickable v-close-popup to="/public/account-settings">
                  <q-item-section>My Account</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable v-close-popup @click="logOuts()">
                  <q-item-section>Log Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn bordered icon="sym_r_notifications" round flat dense class="q-ml-sm" />
          <q-btn bordered icon="sym_r_heart_plus" round flat dense class="q-ml-sm" color="red" />
        </div>
        <div class="get-started" v-else>
          <q-btn class="q-ml-md text-white" label="Log In" no-caps flat to="/user-login" />
        </div>
      </div>
      <q-btn
        icon="menu"
        class="mobile-only"
        dense
        color="black"
        flat
        @click="drawerLeft = !drawerLeft"
      />
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      :width="300"
      :breakpoint="500"
      class="column justify-between no-wrap"
    >
      <q-list padding class="menu-list">
        <q-item
          clickable
          v-ripple
          to="home"
          :class="
            ['/public', '/public/home'].includes($route.fullPath) || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section> Home </q-item-section>
        </q-item>

        <q-item
          active
          clickable
          v-ripple
          to="/public/pet-list?page=1"
          :class="
            $route.fullPath.indexOf('/public/pet-list') !== -1
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section> Pets </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/public/taara-charts"
          :class="
            $route.fullPath == '/public/taara-charts'
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section> Charts </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :class="
            $route.fullPath == '/public/contact' ? 'bg-primary text-white' : 'bg-white text-black'
          "
          @click="goToContactUs()"
        >
          <q-item-section> Contact </q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          to="/public/taara-faqs"
          @click="headerColor = '#ffd7ef'"
          :class="
            $route.fullPath == '/public/taara-faqs' || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section>
            <q-item-label>FAQs</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          to="/public/pet-care"
          @click="headerColor = 'white'"
          :class="
            $route.fullPath == '/public/pet-care' || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section>
            <q-item-label>Pet Care</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          to="/public/donation-channel?wish=0"
          @click="headerColor = 'white'"
          :class="
            $route.fullPath == '/public/donation-channel?wish=0' || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section>
            <q-item-label>Shelter Wishlist</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-item
          clickable
          v-close-popup
          to="/public/pet-transfer"
          @click="headerColor = 'white'"
          :class="
            $route.fullPath == '/public/pet-transfer' || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section>
            <q-item-label>Pet Transfer</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          to="/public/report-and-rescue"
          @click="headerColor = 'white'"
          :class="
            $route.fullPath == '/public/report-and-rescue' || ''
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          "
        >
          <q-item-section>
            <q-item-label>Report & Rescue</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-item clickable v-close-popup @click="logOuts()">
          <q-item-section avatar>
            <q-icon name="sym_r_logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <loginModal v-if="counterStore.showDialog == true" style="position: absolute"></loginModal>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script src="pages/taara/script/MainLayout"></script>
<style lang="scss" scoped src="pages/css/mainlayout.scss"></style>
