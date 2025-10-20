<template>
  <div class="support-home">
    <div class="container">
      <!-- Hero/Intro Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">✨</span>
            Help & Support Center
          </div>
          <h1>Welcome to IntelliGrade Support</h1>
          <p class="hero-subtitle">Your comprehensive resource for getting the most out of IntelliGrade</p>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle-1"></div>
          <div class="decoration-circle-2"></div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <Search :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="quick-access-section">
        <h2 class="section-title">Quick Access</h2>
        <div class="access-cards">
          <div 
            v-for="card in quickAccessCards" 
            :key="card.id"
            class="access-card"
            :style="{ '--card-color': card.color }"
            @click="activeTab = card.tabId"
          >
            <div class="card-header">
              <component :is="card.icon" :size="28" class="card-icon" />
              <span class="card-number">{{ card.id }}</span>
            </div>
            <h3>{{ card.label }}</h3>
            <p>{{ card.description }}</p>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-section">
        <h2 class="section-title">Explore Topics</h2>
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" :size="18" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-section">
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

const quickAccessCards = [
  { 
    id: '01', 
    tabId: 'faq', 
    label: 'FAQs', 
    description: 'Find quick answers to common questions',
    icon: HelpCircle,
    color: '#B3D8A8'
  },
  { 
    id: '02', 
    tabId: 'contact', 
    label: 'Contact Us', 
    description: 'Reach out to our support team',
    icon: Send,
    color: '#A3D1C6'
  },
  { 
    id: '03', 
    tabId: 'guides', 
    label: 'User Guides', 
    description: 'Step-by-step learning resources',
    icon: BookOpen,
    color: '#B3D8A8'
  },
  { 
    id: '04', 
    tabId: 'announcements', 
    label: 'Announcements', 
    description: 'Stay updated with latest news',
    icon: Bell,
    color: '#A3D1C6'
  }
]

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
* {
  --primary-bg: #3D8D7A;
  --primary-btn: #B3D8A8;
  --primary-text: #FBFFE4;
  --accent: #A3D1C6;
  --dark-text: #1a1a1a;
  --light-bg: #f8f9f7;
  --border-color: #e0e0e0;
}

.support-home {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
  padding: 40px 20px;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  border-radius: 24px;
  padding: 60px 40px;
  margin-bottom: 48px;
  color: var(--primary-text);
  box-shadow: 0 20px 60px rgba(61, 141, 122, 0.25);
}

.hero-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle-1 {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 228, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -100px;
}

.decoration-circle-2 {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 228, 0.08);
  border-radius: 50%;
  bottom: -50px;
  left: -50px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 228, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 18px;
}

.hero-section h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.95;
  margin: 0;
  line-height: 1.6;
  font-weight: 300;
}

/* Search Section */
.search-section {
  margin-bottom: 48px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--primary-bg);
  box-shadow: 0 10px 40px rgba(61, 141, 122, 0.15);
}

.search-icon {
  color: var(--primary-bg);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--dark-text);
  background: transparent;
  font-family: inherit;
}

.search-input::placeholder {
  color: #999;
}

/* Section Titles */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

/* Quick Access Cards */
.quick-access-section {
  margin-bottom: 48px;
}

.access-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.access-card {
  position: relative;
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.access-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
}

.access-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--card-color);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-icon {
  color: var(--card-color);
}

.card-number {
  font-size: 12px;
  font-weight: 700;
  color: var(--card-color);
  background: rgba(61, 141, 122, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.access-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 8px 0;
}

.access-card p {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-arrow {
  display: inline-block;
  font-size: 24px;
  color: var(--card-color);
  font-weight: 700;
  transition: transform 0.3s ease;
}

.access-card:hover .card-arrow {
  transform: translateX(4px);
}

/* Tabs Section */
.tabs-section {
  margin-bottom: 40px;
}

.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-text);
  transition: all 0.3s ease;
  font-family: inherit;
}

.tab:hover {
  border-color: var(--primary-bg);
  background: var(--light-bg);
}

.tab.active {
  background: var(--primary-bg);
  color: var(--primary-text);
  border-color: var(--primary-bg);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.tab.active svg {
  color: var(--primary-text);
}

.tab svg {
  color: var(--primary-bg);
  transition: color 0.3s ease;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 2px solid var(--border-color);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .support-home {
    padding: 20px 16px;
  }

  .hero-section {
    padding: 40px 24px;
    margin-bottom: 32px;
  }

  .hero-section h1 {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .access-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .access-card {
    padding: 24px 16px;
  }

  .access-card h3 {
    font-size: 18px;
  }

  .content-section {
    padding: 24px;
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
  .hero-section h1 {
    font-size: 28px;
  }

  .section-title {
    font-size: 20px;
  }

  .access-cards {
    grid-template-columns: 1fr;
  }

  .access-card {
    padding: 20px 16px;
  }

  .access-card h3 {
    font-size: 16px;
  }

  .tab {
    flex: 1;
    min-width: 100px;
    justify-content: center;
  }

  .tabs {
    gap: 6px;
  }

  .content-section {
    padding: 16px;
    border-radius: 16px;
  }
}
</style>