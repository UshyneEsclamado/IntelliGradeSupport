<template>
  <div class="announcements">
    <div class="card">
      <h2>Announcements & Updates</h2>
      <p class="subtitle">Stay informed about the latest IntelliGrade updates, features, and maintenance schedules.</p>

      <!-- Type Filter -->
      <div class="type-filter">
        <button
          v-for="type in announcementTypes"
          :key="type.value"
          :class="['filter-btn', { active: selectedType === type.value }]"
          @click="selectedType = type.value"
        >
          <component :is="type.icon" :size="18" />
          {{ type.label }}
        </button>
      </div>

      <!-- Announcements List -->
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="filteredAnnouncements.length === 0" class="no-results">
        <Bell :size="48" />
        <p>No announcements available at this time.</p>
      </div>
      <div v-else class="announcements-list">
        <div
          v-for="announcement in filteredAnnouncements"
          :key="announcement.id"
          class="announcement-item"
        >
          <div class="announcement-header">
            <div class="header-left">
              <component
                :is="getTypeIcon(announcement.announcement_type)"
                :size="24"
                :class="['type-icon', announcement.announcement_type]"
              />
              <div>
                <h3>{{ announcement.title }}</h3>
                <span class="date">{{ formatDate(announcement.published_at) }}</span>
              </div>
            </div>
            <span :class="['type-badge', announcement.announcement_type]">
              {{ getTypeLabel(announcement.announcement_type) }}
            </span>
          </div>
          <p class="announcement-content">{{ announcement.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell, Megaphone, Wrench, Bug, Sparkles } from 'lucide-vue-next'
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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.announcements h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 24px;
}

.type-filter {
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

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
}

.announcement-item:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.type-icon {
  padding: 8px;
  border-radius: 8px;
  flex-shrink: 0;
}

.type-icon.update {
  background-color: #E3F2FD;
  color: #1976D2;
}

.type-icon.feature {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.type-icon.bug_fix {
  background-color: #FFF3E0;
  color: #F57C00;
}

.type-icon.maintenance {
  background-color: #FFEBEE;
  color: #C62828;
}

.announcement-header h3 {
  color: var(--text-dark);
  font-size: 18px;
  margin: 0 0 4px 0;
}

.date {
  color: var(--text-light);
  font-size: 13px;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.type-badge.update {
  background-color: #E3F2FD;
  color: #1976D2;
}

.type-badge.feature {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.type-badge.bug_fix {
  background-color: #FFF3E0;
  color: #F57C00;
}

.type-badge.maintenance {
  background-color: #FFEBEE;
  color: #C62828;
}

.announcement-content {
  color: var(--text-dark);
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

@media (max-width: 768px) {
  .announcement-header {
    flex-direction: column;
    gap: 12px;
  }

  .type-badge {
    align-self: flex-start;
  }
}
</style>