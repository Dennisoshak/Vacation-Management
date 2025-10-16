<template>
  <div :class="styles.listContainer">
    <div :class="styles.header">
      <h2>Vacation Requests</h2>
      <div :class="styles.filters">
        <select v-model="statusFilter" :class="styles.filterSelect">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <div v-if="loading" :class="[styles.alert, styles.alertInfo]">
      Loading vacation requests...
    </div>

    <div v-else-if="error" :class="[styles.alert, styles.alertError]">
      {{ error }}
    </div>

    <div v-else-if="filteredVacations.length === 0" :class="[styles.alert, styles.alertInfo]">
      No vacation requests found.
    </div>

    <div v-else :class="styles.vacationGrid">
      <div
        v-for="vacation in filteredVacations"
        :key="vacation.id"
        :class="styles.vacationCard"
      >
        <div :class="styles.cardHeader">
          <h3>{{ vacation.employee_name }}</h3>
          <span :class="[styles.badge, styles[`badge${capitalize(vacation.status)}`]]">
            {{ vacation.status }}
          </span>
        </div>

        <div :class="styles.cardBody">
          <div :class="styles.infoRow">
            <span :class="styles.label">Email:</span>
            <span>{{ vacation.employee_email }}</span>
          </div>

          <div :class="styles.infoRow">
            <span :class="styles.label">Start Date:</span>
            <span>{{ formatDate(vacation.start_date) }}</span>
          </div>

          <div :class="styles.infoRow">
            <span :class="styles.label">End Date:</span>
            <span>{{ formatDate(vacation.end_date) }}</span>
          </div>

          <div v-if="vacation.rejection_comment" :class="styles.notes">
            <span :class="styles.label">Rejection Reason:</span>
            <p>{{ vacation.rejection_comment }}</p>
          </div>
        </div>

        <div v-if="showActions && vacation.status === 'pending'" :class="styles.cardActions">
          <button
            @click="$emit('approve', vacation.id)"
            :class="[styles.btn, styles.btnSuccess]"
          >
            Approve
          </button>
          <button
            @click="showRejectForm(vacation.id)"
            :class="[styles.btn, styles.btnDanger]"
          >
            Reject
          </button>
        </div>

        <div v-if="showActions && rejectingId === vacation.id" :class="styles.rejectForm">
          <textarea
            v-model="rejectComment"
            :class="styles.commentInput"
            placeholder="Provide a reason for rejection..."
            rows="3"
          ></textarea>
          <div :class="styles.rejectActions">
            <button
              @click="confirmReject(vacation.id)"
              :class="[styles.btn, styles.btnDanger]"
            >
              Confirm Reject
            </button>
            <button
              @click="cancelReject"
              :class="[styles.btn, styles.btnSecondary]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import styles from './VacationList.module.scss'

export default {
  name: 'VacationList',
  props: {
    showActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['approve', 'reject'],
  setup(props, { emit }) {
    const vacations = ref([])
    const loading = ref(false)
    const error = ref(null)
    const statusFilter = ref('all')
    const rejectingId = ref(null)
    const rejectComment = ref('')

    const filteredVacations = computed(() => {
      if (statusFilter.value === 'all') {
        return vacations.value
      }
      return vacations.value.filter(v => v.status === statusFilter.value)
    })

    const fetchVacations = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await axios.get('/api/vacations')
        vacations.value = response.data
      } catch (err) {
        error.value = 'Failed to load vacation requests.'
        console.error('Error fetching vacations:', err)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const showRejectForm = (id) => {
      rejectingId.value = id
      rejectComment.value = ''
    }

    const cancelReject = () => {
      rejectingId.value = null
      rejectComment.value = ''
    }

    const confirmReject = (id) => {
      emit('reject', { id, comment: rejectComment.value })
      rejectingId.value = null
      rejectComment.value = ''
    }

    onMounted(() => {
      fetchVacations()
    })

    return {
      vacations,
      loading,
      error,
      statusFilter,
      filteredVacations,
      rejectingId,
      rejectComment,
      formatDate,
      capitalize,
      fetchVacations,
      showRejectForm,
      cancelReject,
      confirmReject,
      styles
    }
  }
}
</script>
