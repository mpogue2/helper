
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', redirect: '/rand' },
      { path: 'rand', component: () => import('pages/Index.vue') },
      { path: 'seq', component: () => import('pages/Index2.vue') },
      { path: 'sing', component: () => import('pages/Index3.vue') },
      { path: 'check', component: () => import('pages/Checklist.vue') }
      // { path: 'rand', component: () => import('pages/Index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
