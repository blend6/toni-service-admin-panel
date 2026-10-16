import { createRouter, createWebHistory } from 'vue-router'
import { session, ready } from './composables/useAuth'
import AppLayout from './components/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('./views/Login.vue') },
    {
      path: '/',
      component: AppLayout,
      meta: { auth: true },
      children: [
        { path: '', component: () => import('./views/Home.vue') },
        { path: 'dergo', component: () => import('./views/Home.vue') },
        { path: 'files', component: () => import('./views/Files.vue') },
        { path: 'historia', component: () => import('./views/History.vue') }
      ]
    },
    { path: '/:rest(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  await ready
  if (to.meta.auth && !session.value) return '/login'
  if (to.path === '/login' && session.value) return '/'
})

export default router
