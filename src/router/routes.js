const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/DashBoard.vue') },
      { path: 'volunteer', component: () => import('src/pages/VolunteerSection.vue') },
      { path: 'invetory', component: () => import('src/pages/InventorySection.vue') },
      { path: 'pets', component: () => import('src/pages/PetInfo.vue') },
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
