<template>
  <div class="developer-dashboard">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-header">
          <div class="hero-icon">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <div class="hero-text">
            <div class="hero-badge">
              <span class="badge-icon">👨‍💻</span>
              Developer Portal
            </div>
            <h1>Welcome back, {{ developerName }}</h1>
            <p class="hero-subtitle">Manage and resolve support tickets efficiently</p>
          </div>
        </div>

        <div class="hero-actions">
          <button class="notification-btn" title="Notifications">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span v-if="stats.unassigned_tickets > 0" class="notification-badge">{{
              stats.unassigned_tickets
            }}</span>
          </button>
          <button @click="handleLogout" class="logout-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div class="hero-decoration">
        <div class="decoration-circle-1"></div>
        <div class="decoration-circle-2"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Stats Cards -->
      <div class="stats-section">
        <h2 class="section-title">Overview</h2>
        <div class="stats-cards">
          <!-- Total Tickets -->
          <div class="stat-card" style="--card-color: #3d8d7a">
            <div class="card-header">
              <div class="card-icon-wrapper">
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span class="card-number">{{ stats.total_tickets || 0 }}</span>
            </div>
            <h3>Total Tickets</h3>
            <p class="card-meta">{{ stats.tickets_today || 0 }} created today</p>
          </div>

          <!-- Open Tickets -->
          <div class="stat-card" style="--card-color: #f59e0b">
            <div class="card-header">
              <div class="card-icon-wrapper">
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span class="card-number">{{ stats.open_tickets || 0 }}</span>
            </div>
            <h3>Open</h3>
            <p class="card-meta">{{ stats.urgent_tickets || 0 }} urgent tickets</p>
          </div>

          <!-- In Progress -->
          <div class="stat-card" style="--card-color: #a3d1c6">
            <div class="card-header">
              <div class="card-icon-wrapper">
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span class="card-number">{{ stats.in_progress_tickets || 0 }}</span>
            </div>
            <h3>In Progress</h3>
            <p class="card-meta">{{ stats.unassigned_tickets || 0 }} unassigned</p>
          </div>

          <!-- Resolved -->
          <div class="stat-card" style="--card-color: #b3d8a8">
            <div class="card-header">
              <div class="card-icon-wrapper">
                <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span class="card-number">{{ stats.resolved_tickets || 0 }}</span>
            </div>
            <h3>Resolved</h3>
            <p class="card-meta">
              Avg:
              {{
                stats.avg_resolution_time_hours ? stats.avg_resolution_time_hours.toFixed(1) : 0
              }}h
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs & Filters Section -->
      <div class="tabs-section">
        <h2 class="section-title">Tickets</h2>

        <!-- Tabs -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
          >
            <span class="tab-label">{{ tab.name }}</span>
            <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
          </button>
        </div>

        <!-- Search & Filters -->
        <div class="filters-section">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tickets by number, subject, or user..."
              class="search-input"
            />
          </div>

          <div class="filter-controls">
            <select v-model="filterPriority" class="filter-select">
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select v-model="filterCategory" class="filter-select">
              <option value="">All Categories</option>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="technical_issue">Technical Issue</option>
              <option value="account_issue">Account Issue</option>
              <option value="question">Question</option>
              <option value="other">Other</option>
            </select>

            <button @click="fetchTickets" class="refresh-btn">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Tickets List -->
      <div class="tickets-section">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading tickets...</p>
        </div>

        <div v-else-if="filteredTickets.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p>No tickets found</p>
        </div>

        <div v-else class="tickets-list">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            @click="openTicketDetails(ticket)"
            class="ticket-card"
          >
            <div class="ticket-header">
              <div class="ticket-badges">
                <span class="ticket-number">{{ ticket.ticket_number }}</span>
                <span :class="['badge', 'badge-' + ticket.priority]">
                  {{ ticket.priority }}
                </span>
                <span class="badge badge-category">
                  {{ formatCategory(ticket.category) }}
                </span>
                <span :class="['badge', 'badge-status-' + ticket.status]">
                  {{ formatStatus(ticket.status) }}
                </span>
              </div>

              <div v-if="ticket.assigned_developer_name" class="assigned-dev">
                <div class="dev-avatar">
                  {{ ticket.assigned_developer_name.charAt(0) }}
                </div>
                <div class="dev-info">
                  <p class="dev-name">{{ ticket.assigned_developer_name }}</p>
                  <p class="dev-label">Assigned</p>
                </div>
              </div>
              <button v-else class="assign-btn">Assign</button>
            </div>

            <h3 class="ticket-subject">{{ ticket.subject }}</h3>
            <p class="ticket-description">{{ ticket.description }}</p>

            <div class="ticket-meta">
              <span class="meta-item">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ ticket.user_name }}
              </span>
              <span class="meta-item">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatRelativeTime(ticket.created_at) }}
              </span>
              <span v-if="ticket.comment_count > 0" class="meta-item">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {{ ticket.comment_count }} comments
              </span>
            </div>

            <div class="ticket-arrow">→</div>
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
import TicketDetailsModal from '../../components/TicketDetailsModal.vue'

export default {
  name: 'DeveloperDashboard',
  components: {
    TicketDetailsModal,
  },
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
      { id: 'resolved', name: 'Resolved', count: stats.value.resolved_tickets },
    ])

    const filteredTickets = computed(() => {
      let filtered = tickets.value

      // Filter by tab
      if (activeTab.value !== 'all') {
        const statusMap = {
          open: 'open',
          in_progress: 'in_progress',
          waiting: 'waiting_response',
          resolved: 'resolved',
        }
        filtered = filtered.filter((t) => t.status === statusMap[activeTab.value])
      }

      // Filter by search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.ticket_number.toLowerCase().includes(query) ||
            t.subject.toLowerCase().includes(query) ||
            t.user_name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query),
        )
      }

      // Filter by priority
      if (filterPriority.value) {
        filtered = filtered.filter((t) => t.priority === filterPriority.value)
      }

      // Filter by category
      if (filterCategory.value) {
        filtered = filtered.filter((t) => t.category === filterCategory.value)
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
        low: 'bg-green-100 text-green-800',
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
        closed: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const formatCategory = (category) => {
      return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    const formatStatus = (status) => {
      return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
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
      formatRelativeTime,
    }
  },
}
</script>

<style scoped>
* {
  --primary-bg: #3d8d7a;
  --primary-btn: #b3d8a8;
  --primary-text: #fbffe4;
  --accent: #a3d1c6;
  --dark-text: #1a1a1a;
  --light-bg: #f8f9f7;
  --border-color: #e0e0e0;
}

.developer-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
  padding-bottom: 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  padding: 40px 20px;
  color: var(--primary-text);
  box-shadow: 0 4px 20px rgba(61, 141, 122, 0.2);
  margin-bottom: 40px;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 228, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.hero-icon .icon {
  width: 32px;
  height: 32px;
  color: var(--primary-text);
}

.hero-text h1 {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 228, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 16px;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.95;
  margin: 0;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.notification-btn,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 228, 0.15);
  border: 2px solid rgba(255, 255, 228, 0.3);
  border-radius: 12px;
  color: var(--primary-text);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
}

.notification-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 228, 0.25);
  transform: translateY(-2px);
}

.notification-btn .icon,
.logout-btn .icon {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
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

/* Section Title */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

/* Stats Cards */
.stats-section {
  margin-bottom: 40px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.stat-card {
  position: relative;
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--card-color);
}

.stat-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 24px;
  height: 24px;
  color: var(--card-color);
}

.stat-card .card-number {
  font-size: 32px;
  font-weight: 800;
  color: var(--card-color);
  line-height: 1;
}

.stat-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 8px 0;
}

.card-meta {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Tabs Section */
.tabs-section {
  margin-bottom: 32px;
}

.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
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

.tab-badge {
  background: rgba(255, 255, 228, 0.3);
  color: var(--primary-text);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.tab:not(.active) .tab-badge {
  background: var(--border-color);
  color: #666;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 2px solid var(--border-color);
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--light-bg);
  padding: 14px 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.search-box:focus-within {
  border-color: var(--primary-bg);
  background: white;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-bg);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--dark-text);
  background: transparent;
  font-family: inherit;
}

.search-input::placeholder {
  color: #999;
}

.filter-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 150px;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: white;
  color: var(--dark-text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.filter-select:hover,
.filter-select:focus {
  border-color: var(--primary-bg);
  outline: none;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary-bg);
  color: var(--primary-text);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.refresh-btn:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.refresh-btn .icon {
  width: 18px;
  height: 18px;
}

/* Tickets Section */
.tickets-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 2px solid var(--border-color);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-bg);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin: 0 auto 16px;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-card {
  position: relative;
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.ticket-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-bg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ticket-card:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
  transform: translateY(-2px);
}

.ticket-card:hover::before {
  opacity: 1;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ticket-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.ticket-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-bg);
  background: rgba(61, 141, 122, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-urgent {
  background: #fee2e2;
  color: #991b1b;
}

.badge-high {
  background: #ffedd5;
  color: #9a3412;
}

.badge-medium {
  background: #fef3c7;
  color: #92400e;
}

.badge-low {
  background: #d1fae5;
  color: #065f46;
}

.badge-category {
  background: #dbeafe;
  color: #1e40af;
}

.badge-status-open {
  background: #ffedd5;
  color: #9a3412;
}

.badge-status-in_progress {
  background: #e0e7ff;
  color: #3730a3;
}

.badge-status-waiting_response {
  background: #fef3c7;
  color: #92400e;
}

.badge-status-resolved {
  background: #d1fae5;
  color: #065f46;
}

.badge-status-closed {
  background: #f3f4f6;
  color: #374151;
}

.assigned-dev {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dev-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary-bg);
  color: var(--primary-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.dev-info {
  text-align: left;
}

.dev-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--dark-text);
  margin: 0;
}

.dev-label {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.assign-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid var(--primary-bg);
  color: var(--primary-bg);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.assign-btn:hover {
  background: var(--primary-bg);
  color: var(--primary-text);
}

.ticket-subject {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.ticket-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.meta-icon {
  width: 16px;
  height: 16px;
  color: var(--primary-bg);
}

.ticket-arrow {
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-size: 24px;
  color: var(--primary-bg);
  font-weight: 700;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.ticket-card:hover .ticket-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .hero-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 28px;
  }

  .hero-icon {
    width: 50px;
    height: 50px;
  }

  .hero-icon .icon {
    width: 26px;
    height: 26px;
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

  .filter-controls {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .tickets-section {
    padding: 20px;
  }

  .ticket-card {
    padding: 20px;
  }

  .ticket-header {
    flex-direction: column;
    gap: 12px;
  }

  .assigned-dev {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .developer-dashboard {
    padding-bottom: 40px;
  }

  .hero-section {
    padding: 24px 16px;
  }

  .hero-header {
    flex-direction: column;
    gap: 12px;
  }

  .hero-text h1 {
    font-size: 24px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
    justify-content: space-between;
  }

  .ticket-badges {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
