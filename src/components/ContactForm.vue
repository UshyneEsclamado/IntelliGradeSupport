<template>
  <div class="contact-form-wrapper">
    <div class="form-header">
      <div class="header-content">
        <Send :size="32" class="header-icon" />
        <div>
          <h2>Get in Touch</h2>
          <p class="header-subtitle">We're here to help. Send us a message and we'll respond within 24-48 hours.</p>
        </div>
      </div>
    </div>

    <div class="form-container">
      <div v-if="showSuccess" class="success-message">
        <div class="success-content">
          <CheckCircle :size="24" class="success-icon" />
          <div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
          </div>
        </div>
        <button class="close-btn" @click="showSuccess = false">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="contact-form">
        <!-- Name and Email Row -->
        <div class="form-row">
          <div class="input-group">
            <label for="name">
              <span class="label-text">Full Name</span>
              <span class="required">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              class="form-input"
              required
            />
            <div class="input-underline"></div>
          </div>

          <div class="input-group">
            <label for="email">
              <span class="label-text">Email Address</span>
              <span class="required">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              class="form-input"
              required
            />
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- Subject -->
        <div class="input-group">
          <label for="subject">
            <span class="label-text">Subject</span>
            <span class="required">*</span>
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="What is this about?"
            class="form-input"
            required
          />
          <div class="input-underline"></div>
        </div>

        <!-- Message -->
        <div class="input-group full-width">
          <label for="message">
            <span class="label-text">Message</span>
            <span class="required">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Please describe your issue or question in detail. The more information you provide, the better we can assist you."
            class="form-textarea"
            required
          ></textarea>
          <div class="input-underline"></div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <Send :size="18" />
            <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
          </button>
          <p class="form-note">We'll get back to you as soon as possible</p>
        </div>
      </form>

      <!-- Contact Information -->
      <div class="contact-info-section">
        <h3 class="info-title">Other Ways to Reach Us</h3>
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon email-icon">📧</div>
            <div class="info-content">
              <h4>Email</h4>
              <p>support@intelligrade.com</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon chat-icon">💬</div>
            <div class="info-content">
              <h4>Live Chat</h4>
              <p>Available 9 AM - 6 PM EST</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon phone-icon">📱</div>
            <div class="info-content">
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
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

    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    showSuccess.value = true

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
* {
  --primary-bg: #3D8D7A;
  --primary-btn: #B3D8A8;
  --primary-text: #FBFFE4;
  --accent: #A3D1C6;
  --dark-text: #1a1a1a;
  --light-bg: #f8f9f7;
  --border-color: #e0e0e0;
  --success-color: #10b981;
}

.contact-form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Section */
.form-header {
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  border-radius: 20px 20px 0 0;
  padding: 40px;
  color: var(--primary-text);
  box-shadow: 0 10px 30px rgba(61, 141, 122, 0.2);
}

.header-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.header-icon {
  flex-shrink: 0;
  color: var(--primary-text);
  opacity: 0.9;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 15px;
  margin: 0;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 0 0 20px 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  border-top: none;
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 2px solid var(--success-color);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 32px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.success-icon {
  color: var(--success-color);
  flex-shrink: 0;
}

.success-message h3 {
  margin: 0 0 2px 0;
  color: var(--success-color);
  font-size: 15px;
  font-weight: 700;
}

.success-message p {
  margin: 0;
  color: #059669;
  font-size: 13px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--success-color);
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Contact Form */
.contact-form {
  margin-bottom: 40px;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* Input Groups */
.input-group {
  position: relative;
  margin-bottom: 32px;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 14px;
}

.label-text {
  color: var(--dark-text);
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-input,
.form-textarea {
  width: 100%;
  background: var(--light-bg);
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--dark-text);
  font-family: inherit;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
}

.form-input:focus,
.form-textarea:focus {
  background: white;
  border-color: var(--primary-bg);
}

.form-textarea {
  resize: vertical;
  min-height: 140px;
  max-height: 300px;
  line-height: 1.6;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--primary-bg);
  width: 0;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.form-input:focus ~ .input-underline,
.form-textarea:focus ~ .input-underline {
  width: 100%;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
}

.btn-primary {
  background: var(--primary-bg);
  color: var(--primary-text);
  box-shadow: 0 4px 15px rgba(61, 141, 122, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(61, 141, 122, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-note {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}

/* Contact Info Section */
.contact-info-section {
  border-top: 2px solid var(--border-color);
  padding-top: 40px;
  margin-top: 40px;
}

.info-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 20px 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--light-bg);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: var(--primary-bg);
  background: white;
}

.info-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 4px 0;
  color: var(--dark-text);
  font-size: 14px;
  font-weight: 700;
}

.info-content p {
  margin: 0;
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .form-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .form-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .form-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .form-actions {
    margin-top: 24px;
  }
}

@media (max-width: 480px) {
  .form-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .form-header h2 {
    font-size: 22px;
  }

  .form-header svg {
    width: 28px;
    height: 28px;
  }

  .form-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .input-group {
    margin-bottom: 24px;
  }

  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .form-textarea {
    min-height: 120px;
  }
}
</style>