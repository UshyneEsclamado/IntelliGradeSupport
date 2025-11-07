<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Developer Portal</h1>
        <p class="text-gray-400">IntelliGrade Support System</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="developer@intelligrade.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span class="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <a href="#" class="text-sm text-purple-400 hover:text-purple-300 transition">
              Forgot password?
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p class="text-sm text-red-200">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Developer Note -->
        <div class="mt-6 pt-6 border-t border-white/10">
          <p class="text-xs text-gray-400 text-center">
            🔒 This is a secure developer-only area. All access is monitored and logged.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-400">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'

export default {
  name: 'DeveloperLogin',
  setup() {
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      error.value = ''
      loading.value = true

      try {
        // 1. Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (authError) throw authError

        // 2. Check if user is a developer
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, email, full_name')
          .eq('auth_user_id', authData.user.id)
          .single()

        if (profileError) throw profileError

        // 3. Verify developer access
        const { data: developer, error: devError } = await supabase
          .from('developers')
          .select('*')
          .eq('profile_id', profile.id)
          .eq('is_active', true)
          .single()

        if (devError || !developer) {
          throw new Error('Access denied. Developer account not found or inactive.')
        }

        // 4. Store session info
        localStorage.setItem('developer_id', developer.id)
        localStorage.setItem('developer_name', developer.full_name)
        localStorage.setItem('developer_role', developer.role)
        localStorage.setItem('developer_profile_id', profile.id)

        // 5. Log the login
        await supabase.from('login_attempts').insert({
          profile_id: profile.id,
          success: true,
          ip_address: 'N/A', // You can capture this from your backend
          user_agent: navigator.userAgent
        })

        // 6. Redirect to dashboard
        router.push('/developer/dashboard')

      } catch (err) {
        console.error('Login error:', err)
        error.value = err.message || 'Invalid credentials or access denied'
        
        // Log failed attempt if we have auth data
        if (authData?.user) {
          await supabase.from('login_attempts').insert({
            profile_id: null,
            success: false,
            failure_reason: err.message,
            ip_address: 'N/A',
            user_agent: navigator.userAgent
          })
        }
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      loading,
      error,
      handleLogin
    }
  }
}
</script>