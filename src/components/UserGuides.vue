<template>
  <div class="user-guides">
    <div class="card">
      <h2>User Guides & Tutorials</h2>
      <p class="subtitle">Step-by-step instructions to help you get the most out of IntelliGrade.</p>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="['filter-btn', { active: selectedCategory === category.value }]"
          @click="selectedCategory = category.value"
        >
          <component :is="category.icon" :size="18" />
          {{ category.label }}
        </button>
      </div>

      <!-- Guides List -->
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="filteredGuides.length === 0" class="no-results">
        <BookOpen :size="48" />
        <p>No guides available for this category yet.</p>
      </div>
      <div v-else class="guides-list">
        <div
          v-for="guide in filteredGuides"
          :key="guide.id"
          class="guide-card"
        >
          <div class="guide-header">
            <h3>{{ guide.title }}</h3>
            <span :class="['category-badge', guide.category]">
              {{ getCategoryLabel(guide.category) }}
            </span>
          </div>
          <p class="guide-preview">{{ getPreview(guide.content) }}</p>
          <button class="btn btn-primary" @click="openGuide(guide)">
            <BookOpen :size="18" />
            Read Guide
          </button>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div v-if="selectedGuide" class="modal-overlay" @click="closeGuide">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeGuide">
          <X :size="24" />
        </button>
        <h2>{{ selectedGuide.title }}</h2>
        <span :class="['category-badge', selectedGuide.category]">
          {{ getCategoryLabel(selectedGuide.category) }}
        </span>
        <div class="guide-content" v-html="formatContent(selectedGuide.content)"></div>
        <div v-if="selectedGuide.video_url" class="video-container">
          <h3>Video Tutorial</h3>
          <iframe
            :src="selectedGuide.video_url"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BookOpen, GraduationCap, Users, X } from 'lucide-vue-next'
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
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const formatContent = (content) => {
  // Simple formatting: convert line breaks to paragraphs
  return content.split('\n\n').map(para => `<p>${para}</p>`).join('')
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
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGuides()
})
</script>

<style scoped>
.user-guides h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 24px;
}

.category-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid var(--border);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary);
}

.filter-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.filter-btn.active svg {
  color: white;
}

.guides-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.guide-card {
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
}

.guide-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.guide-header h3 {
  color: var(--primary);
  font-size: 18px;
  margin: 0;
  flex: 1;
}

.category-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.category-badge.teacher {
  background-color: #E3F2FD;
  color: #1976D2;
}

.category-badge.student {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.category-badge.general {
  background-color: #E8F5E9;
  color: #388E3C;
}

.guide-preview {
  color: var(--text-dark);
  margin-bottom: 16px;
  line-height: 1.6;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.no-results svg {
  color: var(--accent);
  margin-bottom: 16px;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--primary);
}

.modal-content h2 {
  color: var(--primary);
  margin-bottom: 16px;
}

.guide-content {
  margin-top: 24px;
  line-height: 1.8;
  color: var(--text-dark);
}

.guide-content p {
  margin-bottom: 16px;
}

.video-container {
  margin-top: 24px;
}

.video-container h3 {
  color: var(--primary);
  margin-bottom: 12px;
}

.video-container iframe {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .guides-list {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
  }

  .video-container iframe {
    height: 250px;
  }
}
</style>