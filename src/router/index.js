import { createRouter, createWebHistory } from 'vue-router'
import SupportHome from '../views/SupportHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SupportHome
    }
  ]
})

export default router