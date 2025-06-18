import { globalStore } from 'src/stores/global-store'

const routes = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/UserLogin.vue'),
      },
      {
        name: 'user-login',
        path: 'user-login',
        component: () => import('src/pages/UserLogin.vue'),
      },
    ],
  },
  {
    path: '/management/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const store = globalStore()
      if ([3, 2].includes(store.userData?.user_type)) {
        next() // ✅ Proceed to layout
      } else {
        next('/404+not+found') // 🚫 Block access
      }
    },
    children: [
      {
        path: '',
        component: () => import('src/pages/DashBoard.vue'),
      },

      {
        name: 'volunteer',
        path: 'volunteer',
        component: () => import('src/pages/VolunteerSection.vue'),
      },
      {
        name: 'wishlist',
        path: 'wishlist',
        component: () => import('src/pages/WishlistManagement.vue'),
      },
      {
        name: 'profile',
        path: 'profile',
        component: () => import('src/pages/EditProfileManagement.vue'),
      },
      {
        name: 'pet-transfer-request',
        path: 'pet-transfer-request',
        component: () => import('src/pages/PetTransferManagement.vue'),
      },
      {
        name: 'invetory',
        path: 'invetory',
        component: () => import('src/pages/InventorySection.vue'),
      },
      { name: 'pets', path: 'pets', component: () => import('src/pages/PetInfo.vue') },

      {
        name: 'user-registration',
        path: 'user-registration',
        component: () => import('src/pages/UserRegistration.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('src/pages/AuthorizationSection.vue'),
      },
      {
        name: 'animal-schedule',
        path: 'animal-schedule',
        component: () => import('src/pages/AnimaleSchedule.vue'),
      },
      {
        name: 'budget-and-expenses',
        path: 'budget-and-expenses',
        component: () => import('src/pages/BudgetAndExpenses.vue'),
      },
      {
        name: 'rescue-report',
        path: 'rescue-report',
        component: () => import('src/pages/RescueReport.vue'),
      },
      {
        name: 'analytic-report',
        path: 'analytic-report',
        component: () => import('src/pages/AnalyticReport.vue'),
      },
      {
        name: 'donation',
        path: 'donation',
        component: () => import('src/pages/DonationPage.vue'),
      },
      {
        name: 'pending-application',
        path: 'pending-application',
        component: () => import('src/pages/PendingApplication.vue'),
      },
      {
        name: 'activities-and-events',
        path: 'activities-and-events',
        component: () => import('src/pages/ActivitiesAndEvents.vue'),
      },
      {
        name: 'announcement',
        path: 'announcement',
        component: () => import('src/pages/AnnouncementPage.vue'),
      },
      {
        name: 'logs',
        path: 'logs',
        component: () => import('src/pages/LogsSection.vue'),
      },
    ],
  },
  {
    path: '/public/',
    component: () => import('layouts/PublicMainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PublicView.vue') },

      { path: 'home', component: () => import('pages/PublicView.vue') },
      {
        path: 'experimentPage',
        component: () => import('src/pages/ExperimentPage.vue'),
      },

      {
        path: 'report-and-rescue',
        component: () => import('src/pages/ReportAndRescue.vue'),
      },
      {
        path: 'pet-care',
        component: () => import('src/pages/PetCare.vue'),
      },

      {
        path: 'pet-adoption-form',
        component: () => import('src/pages/PetAdoptionForm.vue'),
      },
      {
        path: 'taara-faqs',
        component: () => import('src/pages/TaaraFaqs.vue'),
      },
      {
        path: 'privacyPolicy',
        component: () => import('src/pages/PrivacyPolicy.vue'),
      },
      {
        path: 'termsAndConditions',
        component: () => import('src/pages/TermsAndConditions.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('src/pages/AccountSettings.vue'),
      },
      {
        path: 'about-us',
        component: () => import('src/pages/AboutUs.vue'),
      },
      {
        path: 'taara-charts',
        component: () => import('src/pages/TaaraCharts.vue'),
      },
      {
        path: 'totalOfRescue',
        component: () => import('src/pages/TotalOfRescue.vue'),
      },
      {
        path: 'totalOfAdoption',
        component: () => import('src/pages/TotalOfAdoption.vue'),
      },
      {
        path: 'totalOfDonations',
        component: () => import('src/pages/TotalOfDonations.vue'),
      },

      {
        path: 'volunteer-form',
        component: () => import('src/pages/VolunteerForm.vue'),
      },
      {
        path: 'pet-transfer',
        component: () => import('src/pages/PetTransfer.vue'),
      },
      {
        path: 'donation-channel',
        component: () => import('src/pages/DonationChannel.vue'),
      },
      {
        path: 'pet-list',
        component: () => import('src/pages/PetInformation.vue'),
      },
      {
        path: 'view-specific-animal',
        component: () => import('src/pages/AnimalViewPage.vue'),
      },
      {
        path: 'announcementsPage',
        name: 'announcementsPage',
        component: () => import('src/pages/AnnouncementsPagePublic.vue'),
      },
      {
        path: 'rescue-reports',
        name: 'rescue-reports',
        component: () => import('src/pages/RescueReports.vue'),
      },
      {
        path: 'donateSuppliesForm',
        component: () => import('src/pages/DonateSuppliesForm.vue'),
      },
      {
        path: 'userSettings',
        component: () => import('src/pages/UserSetting.vue'),
      },
      {
        path: 'editProfile',
        component: () => import('src/pages/EditProfile.vue'),
      },

      {
        path: 'imageUpload',
        component: () => import('src/pages/ImageUpload.vue'),
      },
      {
        path: 'activitiesAndEvents',
        component: () => import('src/pages/ActivitiesAndEventsPublic.vue'),
      },
      {
        path: 'activitiesAndEventsViewEvent',
        component: () => import('src/pages/ActivitiesAndEventsViewPage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove itcc
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
