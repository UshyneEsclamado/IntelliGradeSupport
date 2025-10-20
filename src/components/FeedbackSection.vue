<template>
  <div class="feedback-wrapper">
    <div class="feedback-header">
      <div class="header-content">
        <MessageSquare :size="32" class="header-icon" />
        <div>
          <h2>Share Your Feedback</h2>
          <p class="header-subtitle">Help us improve IntelliGrade with your valuable insights and suggestions.</p>
        </div>
      </div>
    </div>

    <div class="feedback-container">
      <div v-if="showSuccess" class="success-message">
        <div class="success-content">
          <CheckCircle :size="24" class="success-icon" />
          <div>
            <h3>Feedback Received!</h3>
            <p>Thank you for helping us improve IntelliGrade.</p>
          </div>
        </div>
        <button class="close-btn" @click="showSuccess = false">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="feedback-form">
        <!-- Rating Section -->
        <div class="rating-section">
          <div class="rating-header">
            <label>How would you rate your experience? *</label>
            <span class="rating-value" v-if="rating > 0">{{ rating }}/5</span>
          </div>
          <div class="star-rating">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              :class="['star-btn', { active: star <= rating }]"
              :aria-label="`Rate ${star} stars`"
            >
              <Star
                :size="40"
                :fill="star <= rating ? '#B3D8A8' : 'none'"
                :stroke="star <= rating ? '#3D8D7A' : '#D1D5DB'"
                :stroke-width="1.5"
              />
            </button>
          </div>
          <div class="rating-labels">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <!-- Feedback Message -->
        <div class="input-group">
          <label for="feedback-message">
            <span class="label-text">Tell Us More</span>
            <span class="required">*</span>
          </label>
          <textarea
            id="feedback-message"
            v-model="form.message"
            placeholder="Share your thoughts, suggestions, or concerns. What can we do better?"
            class="feedback-textarea"
            required
          ></textarea>
          <div class="char-count">{{ form.message.length }}/500</div>
        </div>

        <!-- Feedback Type -->
        <div class="feedback-type">
          <label class="type-label">Feedback Type *</label>
          <div class="type-options">
            <button
              v-for="type in feedbackTypes"
              :key="type"
              type="button"
              :class="['type-btn', { active: form.type === type }]"
              @click="form.type = type"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Anonymous Option -->
        <div class="checkbox-group">
          <input
            id="anonymous"
            v-model="form.isAnonymous"
            type="checkbox"
            class="checkbox-input"
          />
          <label for="anonymous" class="checkbox-label">
            <span class="checkmark"></span>
            Submit anonymously
          </label>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || rating === 0">
            <MessageSquare :size="18" />
            <span>{{ loading ? 'Submitting...' : 'Submit Feedback' }}</span>
          </button>
          <button type="reset" class="btn btn-secondary" @click="resetForm">
            Clear Form
          </button>
        </div>

        <p class="form-note">Your feedback helps us create a better experience for everyone.</p>
      </form>

      <!-- Stats Section -->
      <div v-if="stats" class="stats-section">
        <h3>Community Feedback</h3>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-number">{{ stats.averageRating }}★</div>
            <div class="stat-label">Average Rating</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalFeedback }}</div>
            <div class="stat-label">Feedback Received</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.satisfiedPercentage }}%</div>
            <div class="stat-label">Satisfied Users (4★+)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessageSquare, Star, CheckCircle } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const form = ref({
  message: '',
  isAnonymous: false,
  type: 'Suggestion'
})

const rating = ref(0)
const loading = ref(false)
const showSuccess = ref(false)
const stats = ref(null)

const feedbackTypes = ['Suggestion', 'Bug Report', 'Feature Request', 'General Feedback']

const fetchStats = async () => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating')

    if (error) throw error

    if (data && data.length > 0) {
      const totalRating = data.reduce((sum, item) => sum + item.rating, 0)
      const averageRating = (totalRating / data.length).toFixed(1)
      const satisfiedCount = data.filter(item => item.rating >= 4).length
      const satisfiedPercentage = Math.round((satisfiedCount / data.length) * 100)

      stats.value = {
        averageRating,
        totalFeedback: data.length,
        satisfiedPercentage
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})

const resetForm = () => {
  form.value = {
    message: '',
    isAnonymous: false,
    type: 'Suggestion'
  }
  rating.value = 0
}

const handleSubmit = async () => {
  if (rating.value === 0) {
    alert('Please select a rating')
    return
  }

  loading.value = true
  showSuccess.value = false

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: form.value.isAnonymous ? null : (user?.id || null),
          rating: rating.value,
          message: form.value.message,
          feedback_type: form.value.type,
          is_anonymous: form.value.isAnonymous
        }
      ])

    if (error) throw error

    resetForm()
    showSuccess.value = true

    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error submitting feedback:', error)
    alert('Failed to submit feedback. Please try again.')
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

.feedback-wrapper {
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
.feedback-header {
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

.feedback-header h2 {
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

/* Feedback Container */
.feedback-container {
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

/* Feedback Form */
.feedback-form {
  margin-bottom: 40px;
}

/* Rating Section */
.rating-section {
  margin-bottom: 32px;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rating-header label {
  margin: 0;
  font-weight: 700;
  font-size: 15px;
  color: var(--dark-text);
}

.rating-value {
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.star-rating {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  justify-content: center;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 8px;
}

.star-btn:hover {
  transform: scale(1.15);
  background: rgba(179, 216, 168, 0.2);
}

.star-btn.active svg {
  filter: drop-shadow(0 4px 8px rgba(61, 141, 122, 0.3));
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

/* Input Group */
.input-group {
  position: relative;
  margin-bottom: 32px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 14px;
}

.label-text {
  color: var(--dark-text);
}

.required {
  color: #ef4444;
}

.feedback-textarea {
  width: 100%;
  background: var(--light-bg);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--dark-text);
  font-family: inherit;
  resize: vertical;
  min-height: 140px;
  max-height: 300px;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.feedback-textarea:focus {
  outline: none;
  background: white;
  border-color: var(--primary-bg);
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.feedback-textarea::placeholder {
  color: #999;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

/* Feedback Type */
.feedback-type {
  margin-bottom: 32px;
}

.type-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 14px;
  color: var(--dark-text);
}

.type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.type-btn {
  padding: 12px 16px;
  background: var(--light-bg);
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--dark-text);
  font-family: inherit;
}

.type-btn:hover {
  border-color: var(--primary-bg);
  background: white;
}

.type-btn.active {
  background: var(--primary-bg);
  color: var(--primary-text);
  border-color: var(--primary-bg);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark-text);
  margin: 0;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-input:checked ~ .checkbox-label .checkmark {
  background: var(--primary-bg);
  border-color: var(--primary-bg);
}

.checkbox-input:checked ~ .checkbox-label .checkmark::after {
  content: '✓';
  color: var(--primary-text);
  font-size: 12px;
  font-weight: 700;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(61, 141, 122, 0.4);
}

.btn-secondary {
  background: var(--light-bg);
  color: var(--dark-text);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-bg);
  background: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-note {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}

/* Stats Section */
.stats-section {
  border-top: 2px solid var(--border-color);
  padding-top: 32px;
}

.stats-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 20px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05) 0%, rgba(163, 209, 198, 0.05) 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--primary-bg);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1) 0%, rgba(163, 209, 198, 0.1) 100%);
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary-bg);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #666;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .feedback-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .feedback-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .feedback-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .type-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary {
    flex: unset;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .feedback-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .feedback-header h2 {
    font-size: 22px;
  }

  .feedback-header svg {
    width: 28px;
    height: 28px;
  }

  .feedback-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .star-rating {
    gap: 8px;
  }

  .star-btn svg {
    width: 32px;
    height: 32px;
  }

  .type-options {
    grid-template-columns: 1fr;
  }

  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .feedback-textarea {
    min-height: 120px;
  }
}
</style>