const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/DashBoard.vue') },
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
    ],
  },
  // {
  //   path: '/public',
  //   component: () => import('../layouts/ManagementLayout.vue'),

  //   children: [
  //     {
  //       path: '',
  //       component: () => import('src/pages/management/managementDashboard.vue'),
  //     },
  //     {
  //       path: '/volunteers',
  //       component: () => import('pages/manageVolunteersAccount.vue'),
  //       // beforeEnter: (to, from, next) => {
  //       //   if (logInDetails.value == null || logInDetails.value == undefined) {
  //       //     next('/404 + not + found')
  //       //   } else {
  //       //     if (logInDetails.value[0].account_identifier !== 'publicUser') {
  //       //       if (to.path === '/volunteers') {
  //       //         next(true)
  //       //       }
  //       //     } else {
  //       //       next('/404 + not + found')
  //       //     }
  //       //   }
  //       // },
  //     },
  //     {
  //       path: '/manage-records',
  //       component: () => import('pages/manageRecords.vue'),
  //     },
  //     {
  //       path: '/rehomedpets',
  //       component: () => import('src/pages/managementRecords/rehomedPets.vue'),
  //     },
  //     {
  //       path: '/rescuedStrayAnimals',
  //       component: () => import('src/pages/managementRecords/rescuedStrayAnimals.vue'),
  //     },
  //     {
  //       path: '/deceasedAnimals',
  //       component: () => import('src/pages/managementRecords/deceasedAnimals.vue'),
  //     },
  //     {
  //       path: '/surrenderedAnimals',
  //       component: () => import('src/pages/managementRecords/surrenderedAnimals.vue'),
  //     },
  //     {
  //       path: '/kindDonations',
  //       component: () => import('src/pages/managementRecords/kindDonations.vue'),
  //     },
  //     {
  //       path: '/donationTracker',
  //       component: () => import('src/pages/managementRecords/donationTracker.vue'),
  //     },
  //     {
  //       path: '/petfoodInventory',
  //       component: () => import('pages/managementInventory/petFood.vue'),
  //     },
  //     {
  //       path: '/medicineInventory',
  //       component: () => import('src/pages/managementInventory/medicineInventory.vue'),
  //     },
  //     {
  //       path: '/vaccineInventory',
  //       component: () => import('src/pages/vaccineInventory.vue'),
  //     },
  //     {
  //       path: '/vitaminInventory',
  //       component: () => import('src/pages/vitaminInventory.vue'),
  //     },
  //     {
  //       path: '/funds-expense',
  //       component: () => import('pages/Budget-Financial/Funds-Expense.vue'),
  //     },
  //     {
  //       path: '/budget-allocation',
  //       component: () => import('pages/Budget-Allocation/BudgetAllocation.vue'),
  //     },
  //     {
  //       path: '/petInformation-Manage',
  //       component: () => import('pages/petInformationManagementNewDesign.vue'),
  //     },
  //     {
  //       path: '/animalViewPage-Manage',
  //       component: () => import('pages/animalViewPageManagement.vue'),
  //     },
  //     {
  //       path: '/rescueReportsManagement',
  //       component: () => import('pages/rescueReportsManagement.vue'),
  //     },
  //     {
  //       path: '/announcementPageManagement',
  //       component: () => import('pages/announcementPageManagement.vue'),
  //     },
  //     {
  //       path: '/listOfPetFoods',
  //       component: () => import('pages/listOfPetFoods.vue'),
  //     },
  //     {
  //       path: '/listOfMedicine',
  //       component: () => import('pages/listOfMedicine.vue'),
  //     },
  //     {
  //       path: '/medicineGroups',
  //       component: () => import('pages/medicineGroups.vue'),
  //     },
  //     {
  //       path: '/vaccineGroups',
  //       component: () => import('pages/vaccineGroups.vue'),
  //     },
  //     {
  //       path: '/vitaminGroups',
  //       component: () => import('pages/vitaminGroups.vue'),
  //     },
  //     {
  //       path: '/listOfVaccines',
  //       component: () => import('pages/listOfVaccines.vue'),
  //     },
  //     {
  //       path: '/listOfVitamins',
  //       component: () => import('pages/listOfVitamins.vue'),
  //     },
  //     {
  //       path: '/manageActivitiesAndEvents',
  //       component: () => import('pages/activitiesAndEventsManagementNewDesign.vue'),
  //     },
  //     {
  //       path: '/budgetManagement',
  //       component: () => import('pages/budgetManagement.vue'),
  //     },
  //     {
  //       path: '/animalSurrenderForm',
  //       component: () => import('pages/animalSurrenderForm.vue'),
  //     },
  //     {
  //       path: '/pendingApplication',
  //       component: () => import('pages/pendingApplication.vue'),
  //     },
  //     {
  //       path: '/activitiesAndEventsManagement',
  //       component: () => import('pages/activitiesAndEventsViewPageManagement.vue'),
  //     },
  //     {
  //       path: '/editProfileManagement',
  //       component: () => import('pages/editProfile.vue'),
  //     },
  //     {
  //       path: '/allForms',
  //       component: () => import('pages/allForms.vue'),
  //     },
  //     {
  //       path: '/shelterWishlistManagement',
  //       component: () => import('pages/shelterWishlistManagement.vue'),
  //     },
  //     // {
  //     //   path: "/inventory/medicine/",
  //     //   name: "medicine",
  //     //   component: () => import("pages/managementInventory/medicineInventory.vue"),
  //     // },
  //     {
  //       path: '/userSettingsManagement',
  //       component: () => import('pages/userSetting.vue'),
  //     },
  //   ],
  // },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
