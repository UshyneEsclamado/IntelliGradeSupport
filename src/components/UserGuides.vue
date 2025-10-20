<template>
  <div class="user-guides-wrapper">
    <div class="guides-header">
      <div class="header-content">
        <BookOpen :size="32" class="header-icon" />
        <div>
          <h2>User Guides & Tutorials</h2>
          <p class="header-subtitle">Step-by-step instructions to help you master IntelliGrade and make the most of every feature.</p>
        </div>
      </div>
    </div>

    <div class="guides-container">
      <!-- Category Filter -->
      <div class="filter-section">
        <h3 class="filter-title">Browse by Category</h3>
        <div class="category-filter">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="['filter-btn', { active: selectedCategory === category.value }]"
            @click="selectedCategory = category.value"
            :aria-label="`View ${category.label}`"
          >
            <component :is="category.icon" :size="18" />
            <span>{{ category.label }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading guides...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredGuides.length === 0" class="empty-state">
        <BookOpen :size="48" class="empty-icon" />
        <h3>No Guides Available</h3>
        <p>No guides found for this category. Check back soon!</p>
      </div>

      <!-- Guides Grid -->
      <div v-else class="guides-grid">
        <div
          v-for="guide in filteredGuides"
          :key="guide.id"
          class="guide-card"
          @click="openGuide(guide)"
        >
          <div class="card-badge">
            <span :class="['category-badge', guide.category]">
              {{ getCategoryLabel(guide.category) }}
            </span>
            <span v-if="guide.difficulty" :class="['difficulty-badge', guide.difficulty]">
              {{ guide.difficulty }}
            </span>
          </div>

          <div class="card-content">
            <h3 class="guide-title">{{ guide.title }}</h3>
            <p class="guide-preview">{{ getPreview(guide.content) }}</p>
          </div>

          <div class="card-footer">
            <div class="guide-meta">
              <span v-if="guide.reading_time" class="meta-item">
                <Clock :size="14" />
                {{ guide.reading_time }} min
              </span>
              <span class="meta-item">
                <ChevronRight :size="14" />
                Read
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <Teleport to="body">
      <div v-if="selectedGuide" class="modal-overlay" @click="closeGuide">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-badges">
              <span :class="['category-badge', selectedGuide.category]">
                {{ getCategoryLabel(selectedGuide.category) }}
              </span>
              <span v-if="selectedGuide.difficulty" :class="['difficulty-badge', selectedGuide.difficulty]">
                {{ selectedGuide.difficulty }}
              </span>
            </div>
            <button class="close-btn" @click="closeGuide" aria-label="Close guide">
              <X :size="24" />
            </button>
          </div>

          <h2 class="modal-title">{{ selectedGuide.title }}</h2>

          <div class="modal-meta">
            <span v-if="selectedGuide.reading_time" class="meta-item">
              <Clock :size="16" />
              {{ selectedGuide.reading_time }} minutes read
            </span>
            <span v-if="selectedGuide.updated_at" class="meta-item">
              <Calendar :size="16" />
              Updated {{ formatDate(selectedGuide.updated_at) }}
            </span>
          </div>

          <div class="guide-content">
            <p v-if="selectedGuide.introduction" class="introduction">
              {{ selectedGuide.introduction }}
            </p>

            <!-- Formatted Content -->
            <div class="content-body" v-html="formatContent(selectedGuide.content)"></div>

            <!-- Video Tutorial -->
            <div v-if="selectedGuide.video_url" class="video-section">
              <h3>Video Tutorial</h3>
              <div class="video-container">
                <iframe
                  :src="selectedGuide.video_url"
                  frameborder="0"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <!-- Tips Section -->
            <div v-if="selectedGuide.tips" class="tips-section">
              <h3>💡 Quick Tips</h3>
              <ul class="tips-list">
                <li v-for="(tip, index) in selectedGuide.tips" :key="index">
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeGuide">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BookOpen, GraduationCap, Users, X, Clock, ChevronRight, Calendar } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const guides = ref([])
const loading = ref(true)
const selectedCategory = ref('all')
const selectedGuide = ref(null)

const categories = [
  { value: 'all', label: 'All Guides', icon: BookOpen },
  { value: 'teacher', label: 'For Teachers', icon: GraduationCap },
  { value: 'student', label: 'For Students', icon: Users },
  { value: 'general', label: 'General', icon: BookOpen }
]

const filteredGuides = computed(() => {
  if (selectedCategory.value === 'all') {
    return guides.value
  }
  return guides.value.filter(guide => guide.category === selectedCategory.value)
})

const getCategoryLabel = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : category
}

const getPreview = (content) => {
  const text = content.replace(/<[^>]*>/g, '')
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const formatContent = (content) => {
  if (!content) return ''
  
  // Split by double line breaks and wrap in paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  return paragraphs
    .map(para => {
      // Preserve line breaks within paragraphs
      const formatted = para.split('\n').join('<br>')
      return `<p>${formatted}</p>`
    })
    .join('')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openGuide = (guide) => {
  selectedGuide.value = guide
  document.body.style.overflow = 'hidden'
}

const closeGuide = () => {
  selectedGuide.value = null
  document.body.style.overflow = 'auto'
}

const fetchGuides = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('user_guides')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    guides.value = data || []

  } catch (error) {
    console.error('Error fetching user guides:', error)
    guides.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGuides()
})
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
}

.user-guides-wrapper {
  max-width: 1000px;
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
.guides-header {
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

.guides-header h2 {
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

/* Container */
.guides-container {
  background: white;
  border-radius: 0 0 20px 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  border-top: none;
}

/* Filter Section */
.filter-section {
  margin-bottom: 32px;
}

.filter-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--dark-text);
  font-family: inherit;
}

.filter-btn:hover {
  border-color: var(--primary-bg);
  background: var(--light-bg);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--primary-bg);
  color: var(--primary-text);
  border-color: var(--primary-bg);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.filter-btn.active svg {
  color: var(--primary-text);
}

.filter-btn svg {
  color: var(--primary-bg);
  transition: color 0.3s ease;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-bg);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  text-align: center;
}

.empty-icon {
  color: var(--border-color);
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0;
  color: var(--dark-text);
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

/* Guides Grid */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.guide-card {
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.guide-card:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 12px 40px rgba(61, 141, 122, 0.15);
  transform: translateY(-8px);
}

.card-badge {
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.category-badge.teacher {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976D2;
}

.category-badge.student {
  background-color: rgba(123, 31, 162, 0.1);
  color: #7B1FA2;
}

.category-badge.general {
  background-color: rgba(56, 142, 60, 0.1);
  color: #388E3C;
}

.difficulty-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.difficulty-badge.beginner {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.difficulty-badge.intermediate {
  background-color: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.difficulty-badge.advanced {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.card-content {
  flex: 1;
  padding: 20px;
}

.guide-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 12px 0;
  letter-spacing: -0.3px;
  line-height: 1.4;
}

.guide-preview {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding: 12px 20px;
}

.guide-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-btn:hover {
  color: var(--primary-bg);
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--dark-text);
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.modal-meta {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.guide-content {
  margin-bottom: 24px;
}

.introduction {
  font-size: 15px;
  color: var(--dark-text);
  line-height: 1.8;
  padding: 16px;
  background: var(--light-bg);
  border-radius: 12px;
  border-left: 4px solid var(--primary-bg);
  margin: 0 0 24px 0;
}

.content-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--dark-text);
}

.content-body p {
  margin: 0 0 16px 0;
}

.video-section {
  margin: 32px 0;
}

.video-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 16px 0;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--light-bg);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.tips-section {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05) 0%, rgba(179, 216, 168, 0.05) 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
}

.tips-section h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 12px 0;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.tips-list li {
  font-size: 13px;
  color: var(--dark-text);
  line-height: 1.6;
  margin-bottom: 8px;
  position: relative;
  padding-left: 12px;
}

.tips-list li:before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary-bg);
  font-weight: 700;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
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

/* Responsive */
@media (max-width: 768px) {
  .guides-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .guides-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .guides-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .guides-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
    max-height: 95vh;
  }

  .modal-title {
    font-size: 22px;
  }

  .video-container {
    padding-bottom: 56.25%;
  }
}

@media (max-width: 480px) {
  .guides-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .guides-header h2 {
    font-size: 22px;
  }

  .guides-header svg {
    width: 28px;
    height: 28px;
  }

  .guides-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .filter-btn {
    flex: 1;
    min-width: 70px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .guides-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 16px;
    border-radius: 16px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-header {
    flex-direction: column;
  }

  .close-btn {
    align-self: flex-end;
  }
}
</style>