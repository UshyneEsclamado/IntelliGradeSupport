<template>
  <div class="support-home">
    <div class="container">
      <!-- Hero/Intro Section -->
      <div class="hero-section">
        <h1>IntelliGrade Help & Support</h1>
        <p class="hero-subtitle">Welcome to IntelliGrade Support Center. We're here to help you get the most out of your automated grading experience.</p>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <Search :size="20" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-cards">
        <div class="stat-card">
          <HelpCircle :size="32" class="stat-icon" />
          <h3>FAQs</h3>
          <p>Find quick answers</p>
        </div>
        <div class="stat-card">
          <Send :size="32" class="stat-icon" />
          <h3>Contact Us</h3>
          <p>Get in touch</p>
        </div>
        <div class="stat-card">
          <BookOpen :size="32" class="stat-icon" />
          <h3>User Guides</h3>
          <p>Learn step-by-step</p>
        </div>
        <div class="stat-card">
          <Bell :size="32" class="stat-icon" />
          <h3>Announcements</h3>
          <p>Stay updated</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="20" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <ContactForm v-if="activeTab === 'contact'" />
        <FaqSection v-else-if="activeTab === 'faq'" :search-query="searchQuery" />
        <FeedbackSection v-else-if="activeTab === 'feedback'" />
        <BugReportForm v-else-if="activeTab === 'bug'" />
        <UserGuides v-else-if="activeTab === 'guides'" />
        <Announcements v-else-if="activeTab === 'announcements'" />
        <DeveloperInfo v-else-if="activeTab === 'developers'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Send, HelpCircle, MessageSquare, Bug, BookOpen, Bell, Users } from 'lucide-vue-next'
import ContactForm from '../components/ContactForm.vue'
import FaqSection from '../components/FaqSection.vue'
import FeedbackSection from '../components/FeedbackSection.vue'
import BugReportForm from '../components/BugReportForm.vue'
import UserGuides from '../components/UserGuides.vue'
import Announcements from '../components/Announcements.vue'
import DeveloperInfo from '../components/DeveloperInfo.vue'

const activeTab = ref('contact')
const searchQuery = ref('')

const tabs = [
  { id: 'contact', label: 'Contact Us', icon: Send },
  { id: 'faq', label: 'FAQs', icon: HelpCircle },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'bug', label: 'Report Bug', icon: Bug },
  { id: 'guides', label: 'User Guides', icon: BookOpen },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'developers', label: 'Developers', icon: Users }
]
</script>

<style scoped>
.support-home {
  padding-bottom: 40px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  border-radius: 16px;
  color: white;
}

.hero-section h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid var(--border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
  transform: translateY(-4px);
}

.stat-icon {
  color: var(--primary);
  margin-bottom: 12px;
}

.stat-card h3 {
  font-size: 18px;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.stat-card p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--border);
  transition: border-color 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--primary);
}

.search-box svg {
  color: var(--text-light);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--text-dark);
}

.search-input::placeholder {
  color: var(--text-light);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark);
  transition: all 0.3s ease;
}

.tab:hover {
  border-color: var(--primary);
  background-color: var(--light);
}

.tab.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.tab.active svg {
  color: white;
}

/* Content Area */
.content-area {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .tabs {
    gap: 8px;
  }
  
  .tab {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>