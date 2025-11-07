<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Developer Portal</h1>
              <p class="text-xs text-gray-500">IntelliGrade Support System</p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span v-if="stats.unassigned_tickets > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Profile -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ developerName }}</p>
                <p class="text-xs text-gray-500">{{ developerRole }}</p>
              </div>
              <button @click="handleLogout" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Tickets -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Tickets</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_tickets || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ stats.tickets_today || 0 }} created today</p>
        </div>

        <!-- Open Tickets -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Open</p>
              <p class="text-3xl font-bold text-orange-600 mt-2">{{ stats.open_tickets || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ stats.urgent_tickets || 0 }} urgent</p>
        </div>

        <!-- In Progress -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-3xl font-bold text-purple-600 mt-2">{{ stats.in_progress_tickets || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ stats.unassigned_tickets || 0 }} unassigned</p>
        </div>

        <!-- Resolved -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Resolved</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.resolved_tickets || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Avg: {{ stats.avg_resolution_time_hours ? stats.avg_resolution_time_hours.toFixed(1) : 0 }}h</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition'
              ]"
            >
              {{ tab.name }}
              <span v-if="tab.count" :class="[
                activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600',
                'ml-2 py-0.5 px-2 rounded-full text-xs font-medium'
              ]">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Filters & Search -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tickets..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <!-- Filters -->
            <div class="flex items-center space-x-3">
              <select v-model="filterPriority" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select v-model="filterCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">All Categories</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="account_issue">Account Issue</option>
                <option value="question">Question</option>
                <option value="other">Other</option>
              </select>

              <button @click="fetchTickets" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Tickets List -->
        <div class="p-6">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p class="mt-4 text-gray-600">Loading tickets...</p>
          </div>

          <div v-else-if="filteredTickets.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p class="mt-4 text-gray-600">No tickets found</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              @click="openTicketDetails(ticket)"
              class="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition cursor-pointer"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Ticket Header -->
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="text-sm font-mono text-gray-500">{{ ticket.ticket_number }}</span>
                    <span :class="getPriorityClass(ticket.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ ticket.priority }}
                    </span>
                    <span :class="getCategoryClass(ticket.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ formatCategory(ticket.category) }}
                    </span>
                    <span :class="getStatusClass(ticket.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ formatStatus(ticket.status) }}
                    </span>
                  </div>

                  <!-- Subject -->
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ ticket.subject }}</h3>

                  <!-- Description Preview -->
                  <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ ticket.description }}</p>

                  <!-- Meta Info -->
                  <div class="flex items-center space-x-4 text-xs text-gray-500">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ ticket.user_name }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ formatRelativeTime(ticket.created_at) }}
                    </span>
                    <span v-if="ticket.comment_count > 0" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      {{ ticket.comment_count }} comments
                    </span>
                  </div>
                </div>

                <!-- Assigned To -->
                <div class="ml-4">
                  <div v-if="ticket.assigned_developer_name" class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {{ ticket.assigned_developer_name.charAt(0) }}
                    </div>
                    <div class="text-xs">
                      <p class="text-gray-900 font-medium">{{ ticket.assigned_developer_name }}</p>
                      <p class="text-gray-500">Assigned</p>
                    </div>
                  </div>
                  <button v-else class="px-3 py-1 text-xs text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Details Modal (placeholder for next component) -->
    <TicketDetailsModal
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="selectedTicket = null"
      @refresh="fetchTickets"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'

export default {
  name: 'DeveloperDashboard',
  setup() {
    const router = useRouter()
    
    const developerName = ref(localStorage.getItem('developer_name') || 'Developer')
    const developerRole = ref(localStorage.getItem('developer_role') || 'developer')
    const developerId = ref(localStorage.getItem('developer_id'))
    const developerProfileId = ref(localStorage.getItem('developer_profile_id'))

    const activeTab = ref('all')
    const searchQuery = ref('')
    const filterPriority = ref('')
    const filterCategory = ref('')
    const loading = ref(false)
    const tickets = ref([])
    const stats = ref({})
    const selectedTicket = ref(null)

    const tabs = computed(() => [
      { id: 'all', name: 'All Tickets', count: stats.value.total_tickets },
      { id: 'open', name: 'Open', count: stats.value.open_tickets },
      { id: 'in_progress', name: 'In Progress', count: stats.value.in_progress_tickets },
      { id: 'waiting', name: 'Waiting Response', count: stats.value.waiting_response_tickets },
      { id: 'resolved', name: 'Resolved', count: stats.value.resolved_tickets }
    ])

    const filteredTickets = computed(() => {
      let filtered = tickets.value

      // Filter by tab
      if (activeTab.value !== 'all') {
        const statusMap = {
          'open': 'open',
          'in_progress': 'in_progress',
          'waiting': 'waiting_response',
          'resolved': 'resolved'
        }
        filtered = filtered.filter(t => t.status === statusMap[activeTab.value])
      }

      // Filter by search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(t =>
          t.ticket_number.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          t.user_name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
        )
      }

      // Filter by priority
      if (filterPriority.value) {
        filtered = filtered.filter(t => t.priority === filterPriority.value)
      }

      // Filter by category
      if (filterCategory.value) {
        filtered = filtered.filter(t => t.category === filterCategory.value)
      }

      return filtered
    })

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('developer_dashboard_stats')
          .select('*')
          .single()

        if (error) throw error
        stats.value = data || {}
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    const fetchTickets = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('developer_tickets_view')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        tickets.value = data || []
      } catch (error) {
        console.error('Error fetching tickets:', error)
      } finally {
        loading.value = false
      }
    }

    const openTicketDetails = (ticket) => {
      selectedTicket.value = ticket
    }

    const handleLogout = async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('developer_id')
      localStorage.removeItem('developer_name')
      localStorage.removeItem('developer_role')
      localStorage.removeItem('developer_profile_id')
      router.push('/developer/login')
    }

    const getPriorityClass = (priority) => {
      const classes = {
        urgent: 'bg-red-100 text-red-800',
        high: 'bg-orange-100 text-orange-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800'
      }
      return classes[priority] || 'bg-gray-100 text-gray-800'
    }

    const getCategoryClass = (category) => {
      return 'bg-blue-100 text-blue-800'
    }

    const getStatusClass = (status) => {
      const classes = {
        open: 'bg-orange-100 text-orange-800',
        in_progress: 'bg-purple-100 text-purple-800',
        waiting_response: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const formatCategory = (category) => {
      return category.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }

    const formatStatus = (status) => {
      return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }

    const formatRelativeTime = (timestamp) => {
      const now = new Date()
      const time = new Date(timestamp)
      const diffInSeconds = Math.floor((now - time) / 1000)

      if (diffInSeconds < 60) return 'just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
      return time.toLocaleDateString()
    }

    onMounted(() => {
      fetchStats()
      fetchTickets()
    })

    return {
      developerName,
      developerRole,
      activeTab,
      searchQuery,
      filterPriority,
      filterCategory,
      loading,
      tickets,
      stats,
      selectedTicket,
      tabs,
      filteredTickets,
      fetchTickets,
      openTicketDetails,
      handleLogout,
      getPriorityClass,
      getCategoryClass,
      getStatusClass,
      formatCategory,
      formatStatus,
      formatRelativeTime
    }
  }
}
</script>