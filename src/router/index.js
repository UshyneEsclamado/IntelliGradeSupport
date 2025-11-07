import { createRouter, createWebHistory } from 'vue-router'
import SupportHome from '../views/SupportHome.vue'
import DeveloperLogin from '../views/developer/DeveloperLogin.vue'
import DeveloperDashboard from '../views/developer/DeveloperDashboard.vue'
import { supabase } from '../lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SupportHome
    },
    // Developer Portal Routes
    {
      path: '/developer/login',
      name: 'DeveloperLogin',
      component: DeveloperLogin,
      meta: { requiresGuest: true }
    },
    {
      path: '/developer/dashboard',
      name: 'DeveloperDashboard',
      component: DeveloperDashboard,
      meta: { requiresDeveloper: true }
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires developer authentication
  if (to.meta.requiresDeveloper) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return next('/developer/login')
    }

    // Verify user is a developer
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .single()

      const { data: developer } = await supabase
        .from('developers')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('is_active', true)
        .single()

      if (!developer) {
        return next('/developer/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      return next('/developer/login')
    }
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if developer
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        const { data: developer } = await supabase
          .from('developers')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('is_active', true)
          .single()

        if (developer) {
          return next('/developer/dashboard')
        }
      } catch (error) {
        // Not a developer, continue
      }
    }
  }

  next()
})

export default router