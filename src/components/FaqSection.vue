<template>
  <div class="faq-section">
    <div class="card">
      <h2>Frequently Asked Questions</h2>
      <p class="subtitle">Find quick answers to common questions about IntelliGrade.</p>

      <!-- Category Filter -->
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

      <!-- FAQ Items -->
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="filteredFaqs.length === 0" class="no-results">
        <HelpCircle :size="48" />
        <p>No FAQs found matching your search.</p>
      </div>
      <div v-else class="faq-list">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="faq.id"
          class="faq-item"
        >
          <button
            class="faq-question"
            @click="toggleFaq(index)"
          >
            <span>{{ faq.question }}</span>
            <ChevronDown
              :size="20"
              :class="['chevron', { rotated: openFaqIndex === index }]"
            />
          </button>
          <div v-if="openFaqIndex === index" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
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
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFaqs()
})
</script>

<style scoped>
.faq-section h2 {
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
  padding: 8px 16px;
  border: 2px solid var(--border);
  background: white;
  border-radius: 20px;
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 2px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.faq-question {
  width: 100%;
  padding: 16px;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: var(--text-dark);
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: var(--light);
}

.chevron {
  transition: transform 0.3s ease;
  color: var(--primary);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 16px;
  background-color: var(--light);
  color: var(--text-dark);
  line-height: 1.6;
  animation: slideDown 0.3s ease;
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

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.no-results svg {
  color: var(--accent);
  margin-bottom: 16px;
}
</style>