<template>
  <div class="contact-form">
    <div class="card">
      <h2>Contact Us</h2>
      <p class="subtitle">Have a question or need help? Send us a message and we'll get back to you soon.</p>

      <div v-if="showSuccess" class="success-message">
        <CheckCircle :size="20" />
        <span>Your message has been sent successfully! We'll respond within 24-48 hours.</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="name">Full Name *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">Email Address *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="subject">Subject *</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="Brief description of your concern"
            required
          />
        </div>

        <div class="input-group">
          <label for="message">Message *</label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Describe your issue or question in detail..."
            required
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <Send :size="18" />
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Send, CheckCircle } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const showSuccess = ref(false)

const handleSubmit = async () => {
  loading.value = true
  showSuccess.value = false

  try {
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('support_tickets')
      .insert([
        {
          user_id: user?.id || null,
          ticket_type: 'contact',
          subject: form.value.subject,
          message: `Name: ${form.value.name}\nEmail: ${form.value.email}\n\n${form.value.message}`,
          status: 'open',
          priority: 'medium'
        }
      ])

    if (error) throw error

    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    showSuccess.value = true

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error submitting contact form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-form h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 24px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>