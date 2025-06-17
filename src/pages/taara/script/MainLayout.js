import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import loginModal from 'src/components/loginModal.vue'
import reportAnnouncementDialog from 'src/components/reportAnnouncementDialog.vue'
import {
  notifCount,
  likesData,
  viewSpecificAnimal,
  lastObjectNotif,
  items,
  getNotification,
} from 'src/composable/taaraComposable.js'
import { encodeAnimalId, getImageLink, timeAgo } from 'src/composable/simpleComposable'
import { useCounterStore } from 'src/stores/example-store'
import { useQuasar } from 'quasar'
import { globalStore } from 'src/stores/global-store'
import { getFavorites } from 'src/composable/latestPublicComposable'
import {
  getNotif,
  readNotif,
  //  readNotif
} from 'src/composable/latestComposable'
export default defineComponent({
  name: 'MainLayout',

  components: {
    loginModal,
    reportAnnouncementDialog,
  },

  setup() {
    const store = globalStore()
    notifCount.value = JSON.parse(localStorage.getItem('count'))

    const counterStore = useCounterStore()
    const router = useRouter()
    const route = useRoute()
    const headerColor = ref('white')
    const secondDialog = ref()
    const $q = useQuasar()
    const fundRaiser = ref(false)
    const rescueReport = ref(false)
    const ourPetsMenu = ref(false)
    const contactUs = ref(false)
    const drawerLeft = ref(false)
    const responsiveNav = ref(false)
    const responsiveNavAll = ref(false)
    const rightDrawerNotification = ref(false)
    let myFavorites
    let myNotification
    let mySettings
    const rightDrawerFavorites = ref(false)
    const menu = ref(false)
    const responsiveNavAllSlideHide = ref('slide-left')
    const responsiveNavAllSlideShow = ref('slide-left')
    let resizeTimeout = null

    const showDropDown = (payload) => {
      ourPetsMenu.value = payload == 1
      fundRaiser.value = payload == 2
      rescueReport.value = payload == 3
      contactUs.value = payload == 4
    }

    const logOuts = () => {
      $q.loading.show({
        message: 'Logging Out. Please wait...',
      })
      setTimeout(() => {
        router.replace('/user-login')
        sessionStorage.clear()
        store.reset()
        $q.loading.hide()
      }, 1000)
    }

    const goToContactUs = () => {
      if (route.fullPath == '/public/home') {
        counterStore.incrementFooter()
      } else {
        router.push('/public/home')
        setTimeout(() => {
          counterStore.incrementFooter()
        }, 500)
      }
    }

    const likeShow = () => {
      // logInDetails.value == null ? '' : getLikes(logInDetails.value[0].user_id)
      rightDrawerFavorites.value = !rightDrawerFavorites.value
      console.log(rightDrawerFavorites.value)
      rightDrawerNotification.value = false
    }
    const showLikeAnimal = (payload) => {
      localStorage.setItem('specificAnimalId', JSON.stringify(payload))
      viewSpecificAnimal(payload)
      rightDrawerFavorites.value = false
    }

    const numberNotif = ref([])
    const notificationShow = () => {
      rightDrawerNotification.value = !rightDrawerNotification.value
    }

    const viewNotification = (payload, notif_id) => {
      if (payload == 'rescue_report') {
        if (route.path == '/rescue-reports') {
          counterStore.changeReport(notif_id)
        } else {
          router.push('/rescue-reports')
          counterStore.changeReport(notif_id)
        }
      } else if (payload == 'Announcement') {
        if (route.path == '/announcementsPage') {
          counterStore.changeAnnounce(notif_id)
        } else {
          router.push('/announcementsPage')
          counterStore.changeAnnounce(notif_id)
        }
      } else if (payload == 'New Animal for Adoption') {
        router.push('/view-specific-animal')
        viewSpecificAnimal(notif_id)
      } else if (payload == 'pEt-o-sHooT') {
        router.push('/activitiesAndEventsViewEvent')
      }
    }

    const updateViewNotifFn = async (notif) => {
      if (notif.related_url) {
        router.push(notif.related_url)
      }
      const isRead = JSON.parse(notif.is_read)

      if (!isRead.includes(store.userData.user_id)) {
        isRead.push(store.userData.user_id)
        await readNotif(notif.id, isRead)
        notifData.value = await getNotif([store.userData.user_id, '-1', '-3'])
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 376) {
          responsiveNavAllSlideHide.value = 'slide-right'
          responsiveNavAllSlideShow.value = 'slide-left'
        } else {
          responsiveNavAllSlideShow.value = 'slide-right'
          responsiveNavAllSlideHide.value = 'slide-left'
        }
      }, 250)
    }

    const navigateMobileMenu = (navigate) => {
      responsiveNavAll.value = true
      secondDialog.value = navigate
    }

    const suppliesFormControl = (logDetails) => {
      responsiveNavAll.value = false
      responsiveNav.value = false
      logDetails == null ? (counterStore.showDialog = true) : router.push('/donateSuppliesForm')
    }

    const checkIfClickedOutsideFavorites = (event) => {
      if (myFavorites && !myFavorites.contains(event.target)) {
        rightDrawerFavorites.value = false // Hide the div when a click is detected outside of it
      }
    }
    const checkIfClickedOutsideNotification = (event) => {
      if (myNotification && !myNotification.contains(event.target)) {
        rightDrawerNotification.value = false // Hide the div when a click is detected outside of it
      }
    }
    const checkIfClickedOutsideSettings = (event) => {
      if (mySettings && !mySettings.contains(event.target)) {
        menu.value = false // Hide the div when a click is detected outside of it
      }
    }

    const notifData = ref([])
    const showNotifFn = async () => {
      rightDrawerNotification.value = !rightDrawerNotification.value
      notifData.value = await getNotif([store.userData.user_id, '-1', '-3'])
      console.log(notifData.value)
    }

    watch(
      () => [
        counterStore.notif,
        rightDrawerFavorites.value,
        rightDrawerNotification.value,
        menu.value,
      ],
      ([newDrawer, newDrawerNotif, newMenu]) => {
        myFavorites = document.querySelector('#favorites-button')
        myNotification = document.querySelector('#notification-button')
        mySettings = document.querySelector('#profile-settings')
        if (newDrawer == true) {
          document.addEventListener('click', checkIfClickedOutsideFavorites)
        } else {
          document.removeEventListener('click', checkIfClickedOutsideFavorites)
        }
        if (newDrawerNotif == true) {
          document.addEventListener('click', checkIfClickedOutsideNotification)
        } else {
          document.removeEventListener('click', checkIfClickedOutsideNotification)
        }
        if (newMenu == true) {
          document.addEventListener('click', checkIfClickedOutsideSettings)
        } else {
          document.removeEventListener('click', checkIfClickedOutsideSettings)
        }
      },
    )

    const favoriteList = ref([])
    const fetchFavoriteFn = async () => {
      if (Object.keys(store.userData).length !== 0) {
        rightDrawerFavorites.value = !rightDrawerFavorites.value
        favoriteList.value = (await getFavorites(store.userData.user_id)) ?? []
        console.log(favoriteList.value)
      }
    }
    onMounted(async () => {
      if (Object.keys(store.userData).length !== 0) {
        // logInDetails.value == null ? '' : getNotification(0)
      }
      // window.addEventListener('resize', handleResize)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', checkIfClickedOutsideFavorites)
      document.removeEventListener('click', checkIfClickedOutsideNotification)
    })

    return {
      updateViewNotifFn,
      notifData,
      showNotifFn,
      rightDrawerNotification,
      encodeAnimalId,
      fetchFavoriteFn,
      favoriteList,
      drawerLeft,
      getImageLink,
      store,
      secondDialog,
      navigateMobileMenu,
      items,
      onLoad(index, done) {
        setTimeout(() => {
          getNotification(lastObjectNotif)
          if (notifData.value.length == 0) {
            done(true)
          }
        }, 2000)
      },
      showDropDown,
      lastObjectNotif,
      timeAgo,
      showLikeAnimal,
      suppliesFormControl,
      responsiveNavAll,
      responsiveNavAllSlideHide,
      responsiveNavAllSlideShow,
      responsiveNav,
      numberNotif,
      // readNotif,
      viewNotification,
      notifCount,
      counterStore,
      getNotification,
      notificationShow,
      likeShow,
      rightDrawerFavorites,
      likesData,
      logOuts,
      fundRaiser,
      rescueReport,
      ourPetsMenu,
      contactUs,
      viewSpecificAnimal,
      drawer: ref(false),
      miniState: ref(true),
      menu,
      loginModal,
      headerColor,
      goToContactUs,
    }
  },
})
