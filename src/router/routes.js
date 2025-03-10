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
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
