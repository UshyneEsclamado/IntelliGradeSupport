<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block w-full max-w-5xl my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl"
        >
          <div class="flex items-center space-x-4">
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ ticketData.subject }}</h2>
              <p class="text-sm text-gray-500 font-mono">{{ ticketData.ticket_number }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span
              :class="getPriorityClass(ticketData.priority)"
              class="px-3 py-1 text-xs font-medium rounded-full"
            >
              {{ ticketData.priority }}
            </span>
            <span
              :class="getStatusClass(ticketData.status)"
              class="px-3 py-1 text-xs font-medium rounded-full"
            >
              {{ formatStatus(ticketData.status) }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex h-[calc(100vh-200px)]">
          <!-- Main Content Area -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Ticket Description -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <div class="bg-gray-50 rounded-lg p-4 text-gray-700">
                {{ ticketData.description }}
              </div>
            </div>

            <!-- Bug Report Details (if applicable) -->
            <div v-if="ticketData.category === 'bug' && ticketData.steps_to_reproduce" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Bug Details</h3>
              <div class="space-y-3">
                <div
                  v-if="ticketData.steps_to_reproduce"
                  class="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p class="text-xs font-semibold text-red-900 mb-2">Steps to Reproduce:</p>
                  <p class="text-sm text-gray-700">{{ ticketData.steps_to_reproduce }}</p>
                </div>
                <div
                  v-if="ticketData.expected_behavior"
                  class="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <p class="text-xs font-semibold text-blue-900 mb-2">Expected Behavior:</p>
                  <p class="text-sm text-gray-700">{{ ticketData.expected_behavior }}</p>
                </div>
                <div
                  v-if="ticketData.actual_behavior"
                  class="bg-orange-50 border border-orange-200 rounded-lg p-4"
                >
                  <p class="text-xs font-semibold text-orange-900 mb-2">Actual Behavior:</p>
                  <p class="text-sm text-gray-700">{{ ticketData.actual_behavior }}</p>
                </div>
                <div v-if="ticketData.error_message" class="bg-gray-900 rounded-lg p-4">
                  <p class="text-xs font-semibold text-gray-300 mb-2">Error Message:</p>
                  <pre class="text-xs text-red-400 overflow-x-auto">{{
                    ticketData.error_message
                  }}</pre>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div
              v-if="ticketData.browser_info || ticketData.device_info || ticketData.page_url"
              class="mb-6"
            >
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Technical Information</h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div v-if="ticketData.browser_info">
                  <span class="font-medium text-gray-700">Browser:</span>
                  <span class="text-gray-600 ml-2">{{ ticketData.browser_info }}</span>
                </div>
                <div v-if="ticketData.device_info">
                  <span class="font-medium text-gray-700">Device:</span>
                  <span class="text-gray-600 ml-2">{{ ticketData.device_info }}</span>
                </div>
                <div v-if="ticketData.page_url">
                  <span class="font-medium text-gray-700">Page URL:</span>
                  <a
                    :href="ticketData.page_url"
                    target="_blank"
                    class="text-purple-600 hover:text-purple-700 ml-2 break-all"
                  >
                    {{ ticketData.page_url }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Comments & Activity</h3>

              <!-- Comments List -->
              <div class="space-y-4 mb-4">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  :class="[
                    'border rounded-lg p-4',
                    comment.is_internal
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-white border-gray-200',
                  ]"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <div
                        :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                          comment.commenter_type === 'developer'
                            ? 'bg-purple-600 text-white'
                            : 'bg-blue-600 text-white',
                        ]"
                      >
                        {{ comment.commenter_name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ comment.commenter_name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatDateTime(comment.created_at) }}
                        </p>
                      </div>
                      <span
                        v-if="comment.is_internal"
                        class="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full"
                      >
                        Internal Note
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    {{ comment.comment_text }}
                  </p>
                </div>

                <div v-if="comments.length === 0" class="text-center py-8 text-gray-500">
                  No comments yet
                </div>
              </div>

              <!-- Add Comment Form -->
              <div class="bg-gray-50 rounded-lg p-4">
                <textarea
                  v-model="newComment"
                  rows="3"
                  placeholder="Add a comment or internal note..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                ></textarea>
                <div class="flex items-center justify-between mt-3">
                  <label class="flex items-center">
                    <input
                      v-model="isInternalNote"
                      type="checkbox"
                      class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >Internal note (not visible to user)</span
                    >
                  </label>
                  <button
                    @click="addComment"
                    :disabled="!newComment.trim() || submitting"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {{ submitting ? 'Posting...' : 'Post Comment' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Activity Log -->
            <div v-if="activityLog.length > 0">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Activity History</h3>
              <div class="space-y-2">
                <div
                  v-for="activity in activityLog"
                  :key="activity.id"
                  class="flex items-start space-x-3 text-sm"
                >
                  <svg
                    class="w-4 h-4 text-gray-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div class="flex-1">
                    <p class="text-gray-700">
                      <span class="font-medium">{{ activity.performed_by_name }}</span>
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(activity.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <!-- Status Management -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Status</h3>
              <select
                v-model="selectedStatus"
                @change="updateStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_response">Waiting Response</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <!-- Priority Management -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Priority</h3>
              <select
                v-model="selectedPriority"
                @change="updatePriority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <!-- Assignment -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Assigned To</h3>
              <select
                v-model="selectedDeveloper"
                @change="assignTicket"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                <option v-for="dev in developers" :key="dev.id" :value="dev.profile_id">
                  {{ dev.full_name }}
                </option>
              </select>
            </div>

            <!-- User Information -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Reported By</h3>
              <div class="bg-white rounded-lg p-3 border border-gray-200">
                <div class="flex items-center space-x-3 mb-2">
                  <div
                    class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium"
                  >
                    {{ ticketData.user_name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ ticketData.user_name }}</p>
                    <p class="text-xs text-gray-500">{{ ticketData.user_email }}</p>
                  </div>
                </div>
                <span
                  :class="[
                    'inline-block px-2 py-1 text-xs rounded-full',
                    ticketData.user_type === 'student'
                      ? 'bg-green-100 text-green-800'
                      : ticketData.user_type === 'teacher'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ ticketData.user_type }}
                </span>
              </div>
            </div>

            <!-- Metadata -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Details</h3>
              <div class="bg-white rounded-lg p-3 border border-gray-200 space-y-2 text-sm">
                <div>
                  <span class="text-gray-600">Category:</span>
                  <span class="ml-2 font-medium text-gray-900">{{
                    formatCategory(ticketData.category)
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-600">Created:</span>
                  <span class="ml-2 font-medium text-gray-900">{{
                    formatDateTime(ticketData.created_at)
                  }}</span>
                </div>
                <div v-if="ticketData.updated_at !== ticketData.created_at">
                  <span class="text-gray-600">Updated:</span>
                  <span class="ml-2 font-medium text-gray-900">{{
                    formatDateTime(ticketData.updated_at)
                  }}</span>
                </div>
                <div v-if="ticketData.resolved_at">
                  <span class="text-gray-600">Resolved:</span>
                  <span class="ml-2 font-medium text-gray-900">{{
                    formatDateTime(ticketData.resolved_at)
                  }}</span>
                </div>
                <div v-if="ticketData.hours_open">
                  <span class="text-gray-600">Open for:</span>
                  <span class="ml-2 font-medium text-gray-900"
                    >{{ Math.floor(ticketData.hours_open) }}h</span
                  >
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-2">
              <button
                v-if="ticketData.status !== 'resolved'"
                @click="quickResolve"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                Mark as Resolved
              </button>
              <button
                v-if="ticketData.status === 'open'"
                @click="quickStart"
                class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                Start Working
              </button>
              <button
                @click="refreshTicket"
                class="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'

export default {
  name: 'TicketDetailsModal',
  props: {
    ticket: {
      type: Object,
      required: true,
    },
  },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const ticketData = ref({ ...props.ticket })
    const comments = ref([])
    const activityLog = ref([])
    const developers = ref([])

    const newComment = ref('')
    const isInternalNote = ref(false)
    const submitting = ref(false)

    const selectedStatus = ref(props.ticket.status)
    const selectedPriority = ref(props.ticket.priority)
    const selectedDeveloper = ref(props.ticket.assigned_to || '')

    const developerName = ref(localStorage.getItem('developer_name'))
    const developerProfileId = ref(localStorage.getItem('developer_profile_id'))

    const fetchTicketDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('ticket_details_view')
          .select('*')
          .eq('id', props.ticket.id)
          .single()

        if (error) throw error

        ticketData.value = data
        comments.value = data.comments || []
        activityLog.value = data.activity_log || []
      } catch (error) {
        console.error('Error fetching ticket details:', error)
      }
    }

    const fetchDevelopers = async () => {
      try {
        const { data, error } = await supabase
          .from('developers')
          .select('id, profile_id, full_name, email')
          .eq('is_active', true)

        if (error) throw error
        developers.value = data || []
      } catch (error) {
        console.error('Error fetching developers:', error)
      }
    }

    const addComment = async () => {
      if (!newComment.value.trim()) return

      submitting.value = true
      try {
        const { data, error } = await supabase.rpc('add_ticket_comment', {
          p_ticket_id: ticketData.value.id,
          p_commenter_id: developerProfileId.value,
          p_commenter_name: developerName.value,
          p_commenter_type: 'developer',
          p_comment_text: newComment.value,
          p_is_internal: isInternalNote.value,
        })

        if (error) throw error

        // Refresh comments
        await fetchTicketDetails()
        newComment.value = ''
        isInternalNote.value = false
      } catch (error) {
        console.error('Error adding comment:', error)
        alert('Failed to add comment')
      } finally {
        submitting.value = false
      }
    }

    const updateStatus = async () => {
      try {
        const { error } = await supabase.rpc('update_ticket_status', {
          p_ticket_id: ticketData.value.id,
          p_new_status: selectedStatus.value,
          p_updated_by_id: developerProfileId.value,
          p_updated_by_name: developerName.value,
        })

        if (error) throw error

        await fetchTicketDetails()
        emit('refresh')
      } catch (error) {
        console.error('Error updating status:', error)
        alert('Failed to update status')
      }
    }

    const updatePriority = async () => {
      try {
        const { error } = await supabase
          .from('support_tickets')
          .update({
            priority: selectedPriority.value,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ticketData.value.id)

        if (error) throw error

        // Log activity
        await supabase.from('ticket_activity_log').insert({
          ticket_id: ticketData.value.id,
          activity_type: 'priority_changed',
          performed_by: developerProfileId.value,
          performed_by_name: developerName.value,
          old_value: ticketData.value.priority,
          new_value: selectedPriority.value,
          description: `Priority changed from ${ticketData.value.priority} to ${selectedPriority.value}`,
        })

        await fetchTicketDetails()
        emit('refresh')
      } catch (error) {
        console.error('Error updating priority:', error)
        alert('Failed to update priority')
      }
    }

    const assignTicket = async () => {
      try {
        const { error } = await supabase.rpc('assign_ticket', {
          p_ticket_id: ticketData.value.id,
          p_developer_profile_id: selectedDeveloper.value || null,
          p_assigned_by_name: developerName.value,
        })

        if (error) throw error

        await fetchTicketDetails()
        emit('refresh')
      } catch (error) {
        console.error('Error assigning ticket:', error)
        alert('Failed to assign ticket')
      }
    }

    const quickResolve = async () => {
      selectedStatus.value = 'resolved'
      await updateStatus()
    }

    const quickStart = async () => {
      selectedStatus.value = 'in_progress'
      if (!selectedDeveloper.value) {
        selectedDeveloper.value = developerProfileId.value
        await assignTicket()
      }
      await updateStatus()
    }

    const refreshTicket = async () => {
      await fetchTicketDetails()
      emit('refresh')
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

    const formatStatus = (status) => {
      return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    const formatCategory = (category) => {
      return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    const formatDateTime = (timestamp) => {
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    onMounted(() => {
      fetchTicketDetails()
      fetchDevelopers()
    })

    watch(
      () => props.ticket,
      (newTicket) => {
        ticketData.value = { ...newTicket }
        selectedStatus.value = newTicket.status
        selectedPriority.value = newTicket.priority
        selectedDeveloper.value = newTicket.assigned_to || ''
        fetchTicketDetails()
      },
    )

    return {
      ticketData,
      comments,
      activityLog,
      developers,
      newComment,
      isInternalNote,
      submitting,
      selectedStatus,
      selectedPriority,
      selectedDeveloper,
      addComment,
      updateStatus,
      updatePriority,
      assignTicket,
      quickResolve,
      quickStart,
      refreshTicket,
      getPriorityClass,
      getStatusClass,
      formatStatus,
      formatCategory,
      formatDateTime,
    }
  },
}
</script>
