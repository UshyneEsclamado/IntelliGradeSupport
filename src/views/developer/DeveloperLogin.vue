<template>
  <div class="developer-login">
    <div class="container">
      <!-- Background Decorations -->
      <div class="background-decoration">
        <div class="decoration-circle-1"></div>
        <div class="decoration-circle-2"></div>
        <div class="decoration-circle-3"></div>
      </div>

      <!-- Main Login Card -->
      <div class="login-card">
        <!-- Header Section -->
        <div class="login-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div class="logo-badge">
              <span class="badge-icon">🔧</span>
              Developer Access
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p class="subtitle">Sign in to IntelliGrade Developer Portal</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email Input -->
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                v-model="email"
                type="email"
                required
                class="form-input"
                placeholder="developer@intelligrade.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input"
                placeholder="Enter your password"
              />
              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <svg
                  v-if="!showPassword"
                  class="toggle-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  class="toggle-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Options Row -->
          <div class="form-options">
            <label class="checkbox-container">
              <input v-model="rememberMe" type="checkbox" class="checkbox-input" />
              <span class="checkbox-checkmark"></span>
              <span class="checkbox-label">Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p>{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="submit-button"
            :class="{ loading: loading }"
          >
            <svg v-if="loading" class="loading-spinner" viewBox="0 0 24 24">
              <circle
                class="spinner-circle"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{{ loading ? 'Signing in...' : 'Sign In to Portal' }}</span>
          </button>
        </form>

        <!-- Security Notice -->
        <div class="security-notice">
          <div class="notice-icon">🔒</div>
          <div class="notice-content">
            <p class="notice-title">Secure Developer Area</p>
            <p class="notice-text">All access is monitored and logged for security purposes</p>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="help-section">
        <p class="help-text">Need developer access?</p>
        <a href="#" class="help-link">Contact System Administrator</a>
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
          password: password.value,
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
          user_agent: navigator.userAgent,
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
            user_agent: navigator.userAgent,
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
      handleLogin,
    }
  },
}
</script>

<style scoped>
* {
  --primary-bg: #3d8d7a;
  --primary-btn: #b3d8a8;
  --primary-text: #fbffe4;
  --accent: #a3d1c6;
  --dark-text: #1a1a1a;
  --light-bg: #f8f9f7;
  --border-color: #e0e0e0;
  --error-color: #dc2626;
  --success-color: #059669;
}

.developer-login {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 480px;
  width: 100%;
  position: relative;
  z-index: 10;
}

/* Background Decorations */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle-1 {
  position: absolute;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1), rgba(163, 209, 198, 0.1));
  border-radius: 50%;
  top: -200px;
  left: -200px;
  animation: float 20s ease-in-out infinite;
}

.decoration-circle-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(179, 216, 168, 0.08), rgba(163, 209, 198, 0.08));
  border-radius: 50%;
  bottom: -150px;
  right: -150px;
  animation: float 15s ease-in-out infinite reverse;
}

.decoration-circle-3 {
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(251, 255, 228, 0.15), rgba(179, 216, 168, 0.1));
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.15;
  }
}

/* Main Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow:
    0 20px 60px rgba(61, 141, 122, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-bg) 0%, var(--accent) 100%);
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.25);
}

.logo-icon .icon {
  width: 32px;
  height: 32px;
  color: var(--primary-text);
  stroke-width: 2.5;
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(61, 141, 122, 0.1);
  color: var(--primary-bg);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid rgba(61, 141, 122, 0.2);
}

.badge-icon {
  font-size: 16px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--dark-text);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

/* Login Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--primary-bg);
  z-index: 2;
  stroke-width: 2;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  color: var(--dark-text);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-bg);
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
  background: white;
}

.form-input::placeholder {
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
  padding: 4px;
  z-index: 2;
}

.password-toggle:hover {
  color: var(--primary-bg);
}

.toggle-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-input:checked {
  background: var(--primary-bg);
  border-color: var(--primary-bg);
}

.checkbox-input:checked::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 14px;
  color: var(--dark-text);
  user-select: none;
}

.forgot-link {
  font-size: 14px;
  color: var(--primary-bg);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(220, 38, 38, 0.1);
  color: var(--error-color);
  padding: 16px;
  border-radius: 12px;
  border: 2px solid rgba(220, 38, 38, 0.2);
  font-size: 14px;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 2;
}

.error-message p {
  margin: 0;
  font-weight: 500;
}

/* Submit Button */
.submit-button {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  color: var(--primary-text);
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Security Notice */
.security-notice {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(61, 141, 122, 0.05);
  padding: 16px;
  border-radius: 12px;
}

.notice-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-text);
  margin: 0 0 4px 0;
}

.notice-text {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* Help Section */
.help-section {
  margin-top: 32px;
  text-align: center;
}

.help-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.help-link {
  font-size: 14px;
  color: var(--primary-bg);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.help-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .developer-login {
    padding: 20px 16px;
  }

  .container {
    max-width: 100%;
  }

  .login-card {
    padding: 32px 24px;
    border-radius: 20px;
  }

  .login-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 15px;
  }

  .logo-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .logo-icon .icon {
    width: 28px;
    height: 28px;
  }

  .form-input {
    padding: 14px 14px 14px 44px;
    font-size: 15px;
  }

  .submit-button {
    padding: 14px 20px;
    font-size: 15px;
  }

  .decoration-circle-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    left: -150px;
  }

  .decoration-circle-2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    right: -100px;
  }
}

@media (max-width: 480px) {
  .developer-login {
    padding: 16px 12px;
  }

  .login-card {
    padding: 24px 20px;
    border-radius: 16px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .security-notice {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>
