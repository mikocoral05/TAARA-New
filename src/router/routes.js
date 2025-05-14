import { logInDetails } from 'src/composable/taaraComposable'
const routes = [
  {
    path: '/management/',
    component: () => import('layouts/MainLayout.vue'),
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
        name: 'invetory',
        path: 'invetory',
        component: () => import('src/pages/InventorySection.vue'),
      },
      { name: 'pets', path: 'pets', component: () => import('src/pages/PetInfo.vue') },
      {
        name: 'user-login',
        path: 'user-login',
        component: () => import('src/pages/UserLogin.vue'),
      },
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
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PublicView.vue') },

      { path: 'home', component: () => import('pages/PublicView.vue') },
      {
        path: 'login',
        component: () => import('pages/LogIn.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/login') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/login') {
                next('/404 + not + found')
              }
            }
          }
        },
      },

      {
        path: 'experimentPage',
        component: () => import('pages/experimentPage.vue'),
      },
      {
        path: 'register',
        component: () => import('pages/accountRegistration.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/register') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/register') {
                next('/404 + not + found')
              }
            }
          }
        },
      },
      {
        path: 'reportAndRescue',
        component: () => import('pages/reportAndRescue.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/reportAndRescue") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/reportAndRescue") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },
      {
        path: 'pet-care',
        component: () => import('src/pages/petCare.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/aboutDogCare") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/aboutDogCare") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },

      {
        path: 'pet-adoption-form',
        component: () => import('pages/petAdoptionForm.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/pet-adoption-form') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/pet-adoption-form') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'taara-faqs',
        component: () => import('src/pages/taaraFaqs.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/taara-faqs') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/taara-faqs') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'privacyPolicy',
        component: () => import('src/pages/privacyPolicy.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/privacyPolicy') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/privacyPolicy') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'termsAndConditions',
        component: () => import('src/pages/termsAndConditions.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/termsAndConditions') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/termsAndConditions') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'account-settings',
        component: () => import('src/pages/accountSettings.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/account-settings') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/account-settings') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'about-us',
        component: () => import('src/pages/aboutUs.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/about-us') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/about-us') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'taara-charts',
        component: () => import('src/pages/taaraCharts.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/taara-charts') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/taara-charts') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'totalOfRescue',
        component: () => import('src/pages/totalOfRescue.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/totalOfRescue') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/totalOfRescue') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'totalOfAdoption',
        component: () => import('src/pages/totalOfAdoption.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/totalOfAdoption') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/totalOfAdoption') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'totalOfDonations',
        component: () => import('src/pages/totalOfDonations.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/totalOfDonations') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/totalOfDonations') {
                next(true)
              }
            }
          }
        },
      },

      {
        path: 'volunteer-form',
        component: () => import('src/pages/volunteerForm.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/volunteer-form") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/volunteer-form") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },
      {
        path: 'pet-transfer',
        component: () => import('src/pages/petTransfer.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/pet-transfer") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/pet-transfer") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },
      {
        path: 'donation-channel',
        component: () => import('src/pages/donationChannel.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/donation-channel') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/donation-channel') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'pet-list',
        component: () => import('src/pages/petInformation.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/pet-list') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/pet-list') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'view-specific-animal',
        component: () => import('src/pages/animalViewPage.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/view-specific-animal') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/view-specific-animal') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'announcementsPage',
        name: 'announcementsPage',
        component: () => import('src/pages/announcementsPage.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/announcementsPage') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/announcementsPage') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'rescue-reports',
        name: 'rescue-reports',
        component: () => import('src/pages/rescueReports.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/rescue-reports') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/rescue-reports') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'donateSuppliesForm',
        component: () => import('src/pages/donateSuppliesForm.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/donateSuppliesForm") {
        //       next("/404 + not + found");
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/donateSuppliesForm") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },
      {
        path: 'userSettings',
        component: () => import('src/pages/userSetting.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/userSettings') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/userSettings') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'editProfile',
        component: () => import('src/pages/editProfile.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/editProfile") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/editProfile") {
        //         next(true);
        //       }
        //     }
        //   }
        // },
      },
      // {
      //   path: "loginModal",
      //   component: () => import("../components//loginModal.vue"),
      //   beforeEnter: (to, from, next) => {
      //     if (logInDetails.value == null || logInDetails.value == undefined) {
      //       if (to.path === "/loginModal") {
      //         next(true);
      //       }
      //     } else {
      //       if (logInDetails.value[0].account_identifier !== "publicUser") {
      //         next("/404 + not + found");
      //       } else {
      //         if (to.path === "/loginModal") {
      //           next("/404 + not + found");
      //         }
      //       }
      //     }
      //   },
      // },
      {
        path: 'imageUpload',
        component: () => import('src/pages/imageUpload.vue'),
        // beforeEnter: (to, from, next) => {
        //   if (logInDetails.value == null || logInDetails.value == undefined) {
        //     if (to.path === "/imageUpload") {
        //       next(true);
        //     }
        //   } else {
        //     if (logInDetails.value[0].account_identifier !== "publicUser") {
        //       next("/404 + not + found");
        //     } else {
        //       if (to.path === "/imageUpload") {
        //         next("/404 + not + found");
        //       }
        //     }
        //   }
        // },
      },
      {
        path: 'activitiesAndEvents',
        component: () => import('src/pages/activitiesAndEvents.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/activitiesAndEvents') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/activitiesAndEvents') {
                next(true)
              }
            }
          }
        },
      },
      {
        path: 'activitiesAndEventsViewEvent',
        component: () => import('src/pages/activitiesAndEventsViewPage.vue'),
        beforeEnter: (to, from, next) => {
          if (logInDetails.value == null || logInDetails.value == undefined) {
            if (to.path === '/activitiesAndEventsViewEvent') {
              next(true)
            }
          } else {
            if (logInDetails.value[0].account_identifier !== 'publicUser') {
              next('/404 + not + found')
            } else {
              if (to.path === '/activitiesAndEventsViewEvent') {
                next(true)
              }
            }
          }
        },
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
