<template>
  <div class="announcements-wrapper">
    <div class="announcements-header">
      <div class="header-content">
        <Bell :size="32" class="header-icon" />
        <div>
          <h2>Announcements & Updates</h2>
          <p class="header-subtitle">Stay informed about the latest IntelliGrade updates, features, and maintenance schedules.</p>
        </div>
      </div>
    </div>

    <div class="announcements-container">
      <!-- Type Filter -->
      <div class="filter-section">
        <h3 class="filter-title">Filter by Type</h3>
        <div class="type-filter">
          <button
            v-for="type in announcementTypes"
            :key="type.value"
            :class="['filter-btn', { active: selectedType === type.value }]"
            @click="selectedType = type.value"
            :aria-label="`Filter by ${type.label}`"
          >
            <component :is="type.icon" :size="18" />
            <span>{{ type.label }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading announcements...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAnnouncements.length === 0" class="empty-state">
        <Bell :size="48" class="empty-icon" />
        <h3>No Announcements</h3>
        <p>No announcements of this type at the moment. Check back soon!</p>
      </div>

      <!-- Announcements List -->
      <div v-else class="announcements-list">
        <div
          v-for="announcement in filteredAnnouncements"
          :key="announcement.id"
          :class="['announcement-item', announcement.announcement_type]"
        >
          <div class="announcement-left">
            <div class="type-icon-wrapper">
              <component
                :is="getTypeIcon(announcement.announcement_type)"
                :size="24"
                :class="['type-icon', announcement.announcement_type]"
              />
            </div>
          </div>

          <div class="announcement-content-wrapper">
            <div class="announcement-header">
              <div class="header-info">
                <h3 class="announcement-title">{{ announcement.title }}</h3>
                <span class="announcement-date">
                  <Clock :size="14" />
                  {{ formatDate(announcement.published_at) }}
                </span>
              </div>
              <span :class="['type-badge', announcement.announcement_type]">
                {{ getTypeLabel(announcement.announcement_type) }}
              </span>
            </div>

            <p class="announcement-text">{{ announcement.content }}</p>

            <div v-if="announcement.metadata" class="announcement-meta">
              <div v-if="announcement.metadata.impact" class="meta-item">
                <span class="meta-label">Impact:</span>
                <span class="meta-value">{{ announcement.metadata.impact }}</span>
              </div>
              <div v-if="announcement.metadata.duration" class="meta-item">
                <span class="meta-label">Duration:</span>
                <span class="meta-value">{{ announcement.metadata.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell, Megaphone, Wrench, Bug, Sparkles, Clock } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const announcements = ref([])
const loading = ref(true)
const selectedType = ref('all')

const announcementTypes = [
  { value: 'all', label: 'All', icon: Bell },
  { value: 'update', label: 'Updates', icon: Megaphone },
  { value: 'feature', label: 'New Features', icon: Sparkles },
  { value: 'bug_fix', label: 'Bug Fixes', icon: Bug },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench }
]

const filteredAnnouncements = computed(() => {
  if (selectedType.value === 'all') {
    return announcements.value
  }
  return announcements.value.filter(a => a.announcement_type === selectedType.value)
})

const getTypeIcon = (type) => {
  const typeObj = announcementTypes.find(t => t.value === type)
  return typeObj ? typeObj.icon : Bell
}

const getTypeLabel = (type) => {
  const typeObj = announcementTypes.find(t => t.value === type)
  return typeObj ? typeObj.label : type
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchAnnouncements = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) throw error

    announcements.value = data || []

  } catch (error) {
    console.error('Error fetching announcements:', error)
    announcements.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnnouncements()
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

.announcements-wrapper {
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
.announcements-header {
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

.announcements-header h2 {
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
.announcements-container {
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

.type-filter {
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

/* Announcements List */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  display: flex;
  gap: 16px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-left: 4px solid var(--primary-bg);
}

.announcement-item:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.12);
  transform: translateY(-2px);
}

.announcement-item.update {
  border-left-color: #1976D2;
}

.announcement-item.feature {
  border-left-color: #7B1FA2;
}

.announcement-item.bug_fix {
  border-left-color: #F57C00;
}

.announcement-item.maintenance {
  border-left-color: #C62828;
}

.announcement-left {
  flex-shrink: 0;
}

.type-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-icon {
  flex-shrink: 0;
}

.type-icon.update {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976D2;
}

.type-icon.feature {
  background-color: rgba(123, 31, 162, 0.1);
  color: #7B1FA2;
}

.type-icon.bug_fix {
  background-color: rgba(245, 124, 0, 0.1);
  color: #F57C00;
}

.type-icon.maintenance {
  background-color: rgba(198, 40, 40, 0.1);
  color: #C62828;
}

.announcement-content-wrapper {
  flex: 1;
  min-width: 0;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.header-info {
  flex: 1;
}

.announcement-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.announcement-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.type-badge {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.type-badge.update {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976D2;
}

.type-badge.feature {
  background-color: rgba(123, 31, 162, 0.1);
  color: #7B1FA2;
}

.type-badge.bug_fix {
  background-color: rgba(245, 124, 0, 0.1);
  color: #F57C00;
}

.type-badge.maintenance {
  background-color: rgba(198, 40, 40, 0.1);
  color: #C62828;
}

.announcement-text {
  color: var(--dark-text);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

/* Metadata */
.announcement-meta {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  margin-top: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.meta-label {
  font-weight: 700;
  color: #999;
}

.meta-value {
  color: var(--primary-bg);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .announcements-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .announcements-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .announcements-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .announcement-item {
    flex-direction: column;
  }

  .announcement-header {
    flex-direction: column;
  }

  .type-badge {
    align-self: flex-start;
  }

  .announcement-meta {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .announcements-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .announcements-header h2 {
    font-size: 22px;
  }

  .announcements-header svg {
    width: 28px;
    height: 28px;
  }

  .announcements-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .filter-btn {
    flex: 1;
    min-width: 80px;
  }

  .announcement-item {
    gap: 12px;
    padding: 16px;
  }

  .announcement-title {
    font-size: 15px;
  }

  .announcement-text {
    font-size: 13px;
  }
}
</style>