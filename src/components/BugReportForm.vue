<template>
  <div class="bug-report-form">
    <div class="card">
      <h2>Report a Bug</h2>
      <p class="subtitle">Help us fix issues by reporting bugs you encounter.</p>

      <div v-if="showSuccess" class="success-message">
        <CheckCircle :size="20" />
        <span>Bug report submitted successfully! We'll investigate this issue.</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="page-url">Page/Feature Where Bug Occurred *</label>
          <input
            id="page-url"
            v-model="form.pageUrl"
            type="text"
            placeholder="e.g., Dashboard, Quiz Creation, Results Page"
            required
          />
        </div>

        <div class="input-group">
          <label for="bug-description">Bug Description *</label>
          <textarea
            id="bug-description"
            v-model="form.description"
            placeholder="Describe the bug in detail. What happened? What were you trying to do?"
            required
          ></textarea>
        </div>

        <div class="input-group">
          <label for="screenshot">Screenshot (Optional)</label>
          <div class="file-upload">
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              ref="fileInput"
            />
            <button type="button" class="btn btn-secondary" @click="$refs.fileInput.click()">
              <Upload :size="18" />
              Choose File
            </button>
            <span v-if="screenshot" class="file-name">{{ screenshot.name }}</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <Bug :size="18" />
          {{ loading ? 'Submitting...' : 'Submit Bug Report' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bug, Upload, CheckCircle } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const form = ref({
  pageUrl: '',
  description: ''
})

const screenshot = ref(null)
const loading = ref(false)
const showSuccess = ref(false)
const fileInput = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    screenshot.value = file
  }
}

const handleSubmit = async () => {
  loading.value = true
  showSuccess.value = false

  try {
    const { data: { user } } = await supabase.auth.getUser()

    let screenshotUrl = null

    // Upload screenshot if exists
    if (screenshot.value) {
      const fileName = `${Date.now()}_${screenshot.value.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('support-screenshots')
        .upload(`${user?.id || 'anonymous'}/${fileName}`, screenshot.value)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('support-screenshots')
        .getPublicUrl(data.path)

      screenshotUrl = urlData.publicUrl
    }

    // Insert bug report
    const { error } = await supabase
      .from('support_tickets')
      .insert([
        {
          user_id: user?.id || null,
          ticket_type: 'bug_report',
          subject: `Bug: ${form.value.pageUrl}`,
          message: form.value.description,
          page_url: form.value.pageUrl,
          screenshot_url: screenshotUrl,
          status: 'open',
          priority: 'high'
        }
      ])

    if (error) throw error

    // Reset form
    form.value = {
      pageUrl: '',
      description: ''
    }
    screenshot.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    showSuccess.value = true

    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error submitting bug report:', error)
    alert('Failed to submit bug report. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bug-report-form h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 24px;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-upload input[type="file"] {
  display: none;
}

.file-name {
  color: var(--text-light);
  font-size: 14px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>