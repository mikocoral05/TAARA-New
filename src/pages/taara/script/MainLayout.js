import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import loginModal from 'src/components/loginModal.vue'
import reportAnnouncementDialog from 'src/components/reportAnnouncementDialog.vue'
import {
  logInDetails,
  notifCount,
  likesData,
  viewSpecificAnimal,
  lastObjectNotif,
  items,
  getNotification,
  notifData,
} from 'src/composable/taaraComposable.js'
import { getImageLink, timeAgo } from 'src/composable/simpleComposable'
import { useCounterStore } from 'src/stores/example-store'
import { useQuasar } from 'quasar'
import { globalStore } from 'src/stores/global-store'
export default defineComponent({
  name: 'MainLayout',

  components: {
    loginModal,
    reportAnnouncementDialog,
  },

  setup() {
    const store = globalStore()
    notifCount.value = JSON.parse(localStorage.getItem('count'))
    logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))

    const counterStore = useCounterStore()
    const router = useRouter()
    const route = useRoute()
    const rightDrawerNotification = ref(false)
    let headerColor = ref('white')
    let secondDialog = ref()
    const $q = useQuasar()
    let fundRaiser = ref(false)
    let rescueReport = ref(false)
    let ourPetsMenu = ref(false)
    let contactUs = ref(false)
    let responsiveNav = ref(false)
    let responsiveNavAll = ref(false)
    let myFavorites
    let myNotification
    let mySettings
    let rightDrawerFavorites = ref(false)
    let menu = ref(false)
    let responsiveNavAllSlideHide = ref('slide-left')
    let responsiveNavAllSlideShow = ref('slide-left')
    let resizeTimeout = null

    let showDropDown = (payload) => {
      ourPetsMenu.value = payload == 1
      fundRaiser.value = payload == 2
      rescueReport.value = payload == 3
      contactUs.value = payload == 4
    }

    let logOuts = () => {
      $q.loading.show({
        message: 'Logging Out. Please wait...',
      })
      setTimeout(() => {
        sessionStorage.clear()
        router.replace('/user-login')
        store.reset()
        $q.loading.hide()
      }, 2000)
    }
    let goToContactUs = () => {
      if (route.fullPath == '/public/home') {
        counterStore.incrementFooter()
      } else {
        router.push('/public/home')
        setTimeout(() => {
          counterStore.incrementFooter()
        }, 500)
      }
    }
    let likeShow = () => {
      // logInDetails.value == null ? '' : getLikes(logInDetails.value[0].user_id)
      rightDrawerFavorites.value = !rightDrawerFavorites.value
      console.log(rightDrawerFavorites.value)
      rightDrawerNotification.value = false
    }
    let showLikeAnimal = (payload) => {
      localStorage.setItem('specificAnimalId', JSON.stringify(payload))
      viewSpecificAnimal(payload)
      rightDrawerFavorites.value = false
    }
    // const thirtyDaysAgo = new Date()
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    // const givenDate = logInDetails.value == null ? '' : logInDetails.value[0].date_created
    // const dates = new Date(givenDate)
    // dates.setDate(dates.getDate() + 30)

    const numberNotif = ref([])
    let notificationShow = () => {
      rightDrawerNotification.value = !rightDrawerNotification.value
    }
    let viewNotification = (payload, notif_id) => {
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
    // let readNotif = (pay, user_id, notif) => {
    //   for (var i = 0; i < pay.length; i++) {
    //     v.value.push(pay[i])
    //   }
    //   v.value.push(user_id)
    //   notifUpdate(v.value.join(','), notif)
    //   notifCount.value = JSON.parse(localStorage.getItem('count') - 1)
    // }

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
    let navigateMobileMenu = (navigate) => {
      responsiveNavAll.value = true
      secondDialog.value = navigate
    }

    let suppliesFormControl = (logDetails) => {
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

    onMounted(() => {
      // window.addEventListener('resize', handleResize)
      // logInDetails.value == null ? '' : getNotification(0)
      // logInDetails.value == null ? '' : getLikes(logInDetails.value[0].user_id)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', checkIfClickedOutsideFavorites)
      document.removeEventListener('click', checkIfClickedOutsideNotification)
    })

    return {
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
      notifData,
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
      logInDetails,
      rightDrawerNotification,
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
