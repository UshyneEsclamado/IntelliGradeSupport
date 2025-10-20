<template>
  <div class="bug-report-wrapper">
    <div class="report-header">
      <div class="header-content">
        <Bug :size="32" class="header-icon" />
        <div>
          <h2>Report a Bug</h2>
          <p class="header-subtitle">Found an issue? Help us improve by reporting it with as much detail as possible.</p>
        </div>
      </div>
    </div>

    <div class="report-container">
      <div v-if="showSuccess" class="success-message">
        <div class="success-content">
          <CheckCircle :size="24" class="success-icon" />
          <div>
            <h3>Bug Report Submitted!</h3>
            <p>Our team will investigate this issue as soon as possible.</p>
          </div>
        </div>
        <button class="close-btn" @click="showSuccess = false">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="bug-form">
        <!-- Bug Severity -->
        <div class="severity-section">
          <label class="section-label">
            <span class="label-text">Bug Severity</span>
            <span class="required">*</span>
          </label>
          <div class="severity-options">
            <button
              v-for="sev in severities"
              :key="sev.value"
              type="button"
              :class="['severity-btn', { active: form.severity === sev.value }]"
              @click="form.severity = sev.value"
              :style="{ '--severity-color': sev.color }"
            >
              <span class="severity-dot"></span>
              {{ sev.label }}
            </button>
          </div>
        </div>

        <!-- Page/Feature -->
        <div class="input-group">
          <label for="page-url">
            <span class="label-text">Page or Feature</span>
            <span class="required">*</span>
          </label>
          <input
            id="page-url"
            v-model="form.pageUrl"
            type="text"
            placeholder="e.g., Dashboard, Quiz Creation, Results Page"
            class="form-input"
            required
          />
          <div class="input-underline"></div>
        </div>

        <!-- Bug Description -->
        <div class="input-group">
          <label for="bug-description">
            <span class="label-text">Bug Description</span>
            <span class="required">*</span>
          </label>
          <textarea
            id="bug-description"
            v-model="form.description"
            placeholder="Describe what happened and what you were trying to do. Include any error messages you saw."
            class="form-textarea"
            required
          ></textarea>
          <div class="input-underline"></div>
          <div class="char-count">{{ form.description.length }}/1000</div>
        </div>

        <!-- Steps to Reproduce -->
        <div class="input-group">
          <label for="steps">
            <span class="label-text">Steps to Reproduce (Optional)</span>
          </label>
          <textarea
            id="steps"
            v-model="form.steps"
            placeholder="1. Click on...&#10;2. Then...&#10;3. Then the bug occurs..."
            class="form-textarea"
          ></textarea>
          <div class="input-underline"></div>
        </div>

        <!-- Expected vs Actual -->
        <div class="form-row">
          <div class="input-group">
            <label for="expected">
              <span class="label-text">Expected Behavior</span>
            </label>
            <input
              id="expected"
              v-model="form.expectedBehavior"
              type="text"
              placeholder="What should happen?"
              class="form-input"
            />
            <div class="input-underline"></div>
          </div>

          <div class="input-group">
            <label for="actual">
              <span class="label-text">Actual Behavior</span>
            </label>
            <input
              id="actual"
              v-model="form.actualBehavior"
              type="text"
              placeholder="What actually happens?"
              class="form-input"
            />
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- Screenshot Upload -->
        <div class="upload-section">
          <label class="section-label">
            <span class="label-text">Screenshot or Video (Optional)</span>
          </label>
          <div class="file-upload">
            <input
              type="file"
              accept="image/*,video/*"
              @change="handleFileChange"
              ref="fileInput"
              class="file-input"
            />
            <div class="upload-area">
              <Upload :size="32" class="upload-icon" />
              <div class="upload-text">
                <p class="upload-title">Click to upload or drag and drop</p>
                <p class="upload-subtitle">PNG, JPG, GIF, MP4 up to 10MB</p>
              </div>
              <button type="button" class="btn btn-secondary" @click="$refs.fileInput.click()">
                Choose File
              </button>
            </div>
            <div v-if="screenshot" class="file-preview">
              <div class="preview-item">
                <div class="preview-icon">📎</div>
                <div class="preview-info">
                  <p class="preview-name">{{ screenshot.name }}</p>
                  <p class="preview-size">{{ (screenshot.size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
                <button type="button" class="remove-btn" @click="removeFile">✕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <Bug :size="18" />
            <span>{{ loading ? 'Submitting...' : 'Submit Bug Report' }}</span>
          </button>
          <button type="reset" class="btn btn-secondary" @click="resetForm">
            Clear Form
          </button>
        </div>

        <p class="form-note">Your detailed bug report helps us fix issues faster. Thank you!</p>
      </form>

      <!-- Quick Tips -->
      <div class="tips-section">
        <h3>Tips for Better Bug Reports</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">🎯</div>
            <h4>Be Specific</h4>
            <p>Include exact steps and what you expected to happen</p>
          </div>
          <div class="tip-card">
            <div class="tip-icon">📸</div>
            <h4>Add Screenshots</h4>
            <p>Visual proof helps us understand the issue better</p>
          </div>
          <div class="tip-card">
            <div class="tip-icon">ℹ️</div>
            <h4>Include Details</h4>
            <p>Browser, device, or any error messages you see</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bug, Upload, CheckCircle } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const form = ref({
  pageUrl: '',
  description: '',
  steps: '',
  expectedBehavior: '',
  actualBehavior: '',
  severity: 'medium'
})

const screenshot = ref(null)
const loading = ref(false)
const showSuccess = ref(false)
const fileInput = ref(null)

const severities = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' }
]

const resetForm = () => {
  form.value = {
    pageUrl: '',
    description: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    severity: 'medium'
  }
  screenshot.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    screenshot.value = file
  }
}

const removeFile = () => {
  screenshot.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
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
          steps_to_reproduce: form.value.steps,
          expected_behavior: form.value.expectedBehavior,
          actual_behavior: form.value.actualBehavior,
          bug_severity: form.value.severity,
          screenshot_url: screenshotUrl,
          status: 'open',
          priority: form.value.severity === 'high' ? 'high' : 'medium'
        }
      ])

    if (error) throw error

    resetForm()
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

.bug-report-wrapper {
  max-width: 900px;
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
.report-header {
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

.report-header h2 {
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

/* Report Container */
.report-container {
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

/* Bug Form */
.bug-form {
  margin-bottom: 40px;
}

/* Severity Section */
.severity-section {
  margin-bottom: 32px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 14px;
}

.label-text {
  color: var(--dark-text);
}

.required {
  color: #ef4444;
}

.severity-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.severity-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--light-bg);
  border: 2px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--dark-text);
  font-family: inherit;
}

.severity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--severity-color);
}

.severity-btn:hover {
  border-color: var(--severity-color);
  background: white;
}

.severity-btn.active {
  background: white;
  border-color: var(--severity-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  max-height: 250px;
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

.char-count {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* Upload Section */
.upload-section {
  margin-bottom: 32px;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-input {
  display: none;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--light-bg);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: var(--primary-bg);
  background: rgba(61, 141, 122, 0.02);
}

.upload-icon {
  color: var(--primary-bg);
  opacity: 0.7;
}

.upload-text {
  text-align: center;
}

.upload-title {
  margin: 0;
  font-weight: 700;
  color: var(--dark-text);
  font-size: 14px;
}

.upload-subtitle {
  margin: 4px 0 0 0;
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.file-preview {
  background: var(--light-bg);
  border-radius: 12px;
  padding: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.preview-icon {
  font-size: 24px;
}

.preview-info {
  flex: 1;
}

.preview-name {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--dark-text);
  word-break: break-word;
}

.preview-size {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #999;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.2);
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

/* Tips Section */
.tips-section {
  border-top: 2px solid var(--border-color);
  padding-top: 32px;
  margin-top: 32px;
}

.tips-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 20px 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tip-card {
  background: var(--light-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.tip-card:hover {
  border-color: var(--primary-bg);
  background: white;
}

.tip-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.tip-card h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--dark-text);
}

.tip-card p {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .report-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .report-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .report-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .severity-options {
    gap: 8px;
  }

  .severity-btn {
    flex: 1;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary {
    flex: unset;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .report-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .report-header h2 {
    font-size: 22px;
  }

  .report-header svg {
    width: 28px;
    height: 28px;
  }

  .report-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .severity-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .upload-area {
    padding: 24px 16px;
  }

  .form-textarea {
    min-height: 80px;
  }
}
</style>