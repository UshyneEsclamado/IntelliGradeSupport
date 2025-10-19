<template>
  <div class="feedback-section">
    <div class="card">
      <h2>Share Your Feedback</h2>
      <p class="subtitle">Help us improve IntelliGrade by sharing your thoughts and suggestions.</p>

      <div v-if="showSuccess" class="success-message">
        <CheckCircle :size="20" />
        <span>Thank you for your feedback! We appreciate your input.</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Rating Section -->
        <div class="input-group">
          <label>Rate your experience *</label>
          <div class="star-rating">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="star-btn"
            >
              <Star
                :size="32"
                :fill="star <= rating ? '#FFD700' : 'none'"
                :stroke="star <= rating ? '#FFD700' : '#D1D5DB'"
              />
            </button>
          </div>
        </div>

        <!-- Feedback Message -->
        <div class="input-group">
          <label for="feedback-message">Your Feedback *</label>
          <textarea
            id="feedback-message"
            v-model="form.message"
            placeholder="Tell us what you think about IntelliGrade..."
            required
          ></textarea>
        </div>

        <!-- Anonymous Option -->
        <div class="checkbox-group">
          <input
            id="anonymous"
            v-model="form.isAnonymous"
            type="checkbox"
          />
          <label for="anonymous">Submit anonymously</label>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading || rating === 0">
          <MessageSquare :size="18" />
          {{ loading ? 'Submitting...' : 'Submit Feedback' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, Star, CheckCircle } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const form = ref({
  message: '',
  isAnonymous: false
})

const rating = ref(0)
const loading = ref(false)
const showSuccess = ref(false)

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
          is_anonymous: form.value.isAnonymous
        }
      ])

    if (error) throw error

    // Reset form
    form.value = {
      message: '',
      isAnonymous: false
    }
    rating.value = 0

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
.feedback-section h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 24px;
}

.star-rating {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}

.star-btn:hover {
  transform: scale(1.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
  color: var(--text-dark);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>