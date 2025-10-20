<template>
  <div class="faq-wrapper">
    <div class="faq-header">
      <div class="header-content">
        <HelpCircle :size="32" class="header-icon" />
        <div>
          <h2>Frequently Asked Questions</h2>
          <p class="header-subtitle">Find quick answers to common questions about IntelliGrade and how to use it effectively.</p>
        </div>
      </div>
    </div>

    <div class="faq-container">
      <!-- Category Filter -->
      <div v-if="categories.length > 1" class="filter-section">
        <h3 class="filter-title">Filter by Category</h3>
        <div class="category-filter">
          <button
            v-for="category in categories"
            :key="category"
            :class="['filter-btn', { active: selectedCategory === category }]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading frequently asked questions...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFaqs.length === 0" class="empty-state">
        <HelpCircle :size="48" class="empty-icon" />
        <h3>No FAQs Found</h3>
        <p>No frequently asked questions match your search or selected category.</p>
      </div>

      <!-- FAQ Items -->
      <div v-else class="faq-list">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="faq.id"
          :class="['faq-item', { open: openFaqIndex === index }]"
        >
          <button
            class="faq-question"
            @click="toggleFaq(index)"
            :aria-expanded="openFaqIndex === index"
          >
            <div class="question-content">
              <span class="question-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="question-text">{{ faq.question }}</span>
            </div>
            <ChevronDown
              :size="20"
              :class="['chevron', { rotated: openFaqIndex === index }]"
            />
          </button>
          <Transition name="slideDown">
            <div v-if="openFaqIndex === index" class="faq-answer">
              <p>{{ faq.answer }}</p>
              <div v-if="faq.metadata && faq.metadata.tags" class="answer-tags">
                <span v-for="tag in faq.metadata.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- FAQ Stats -->
      <div v-if="!loading && filteredFaqs.length > 0" class="faq-stats">
        <p class="stats-text">
          Showing <strong>{{ filteredFaqs.length }}</strong> of <strong>{{ faqs.length }}</strong> frequently asked questions
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { HelpCircle, ChevronDown } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const faqs = ref([])
const loading = ref(true)
const openFaqIndex = ref(null)
const selectedCategory = ref('All')
const categories = ref(['All'])

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const filteredFaqs = computed(() => {
  let filtered = faqs.value

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search query
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

const fetchFaqs = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    faqs.value = data || []

    // Extract unique categories
    const uniqueCategories = [...new Set(data.map(faq => faq.category))]
    categories.value = ['All', ...uniqueCategories]

  } catch (error) {
    console.error('Error fetching FAQs:', error)
    faqs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFaqs()
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

.faq-wrapper {
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
.faq-header {
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

.faq-header h2 {
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
.faq-container {
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
  padding: 10px 18px;
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

/* FAQ List */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.faq-item:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.1);
}

.faq-item.open {
  border-color: var(--primary-bg);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.12);
}

.faq-question {
  width: 100%;
  padding: 20px 24px;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  color: var(--dark-text);
  transition: background-color 0.2s ease;
  font-family: inherit;
  gap: 16px;
}

.faq-question:hover {
  background-color: var(--light-bg);
}

.question-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  color: var(--primary-text);
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  line-height: 1.4;
}

.chevron {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--primary-bg);
  flex-shrink: 0;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* FAQ Answer */
.faq-answer {
  padding: 24px;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.03) 0%, rgba(179, 216, 168, 0.03) 100%);
  border-top: 1px solid var(--border-color);
  color: var(--dark-text);
  line-height: 1.8;
}

.faq-answer p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.faq-answer p:last-of-type {
  margin-bottom: 0;
}

.answer-tags {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  background: white;
  border: 1px solid var(--border-color);
  color: var(--primary-bg);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Transitions */
.slideDown-enter-active,
.slideDown-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slideDown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slideDown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* FAQ Stats */
.faq-stats {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--border-color);
  text-align: center;
}

.stats-text {
  color: #999;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

.stats-text strong {
  color: var(--primary-bg);
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .faq-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .faq-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .faq-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .faq-question {
    padding: 16px 20px;
  }

  .question-number {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .faq-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .faq-header h2 {
    font-size: 22px;
  }

  .faq-header svg {
    width: 28px;
    height: 28px;
  }

  .faq-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .filter-btn {
    flex: 1;
    min-width: 70px;
    padding: 8px 12px;
    font-size: 12px;
  }

  .faq-question {
    padding: 14px 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .question-content {
    width: 100%;
  }

  .chevron {
    margin-left: auto;
  }

  .faq-answer {
    padding: 16px;
  }

  .answer-tags {
    margin-top: 12px;
    padding-top: 12px;
  }
}
</style>