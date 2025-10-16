<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <h1>Manage Vacation Requests</h1>
      <p :class="styles.subtitle">
        Review and approve or reject vacation requests from your team
      </p>
    </div>

    <div :class="styles.stats">
      <div :class="styles.statCard">
        <div :class="styles.statValue">{{ stats.pending }}</div>
        <div :class="styles.statLabel">Pending</div>
      </div>
      <div :class="styles.statCard">
        <div :class="styles.statValue">{{ stats.approved }}</div>
        <div :class="styles.statLabel">Approved</div>
      </div>
      <div :class="styles.statCard">
        <div :class="styles.statValue">{{ stats.rejected }}</div>
        <div :class="styles.statLabel">Rejected</div>
      </div>
      <div :class="styles.statCard">
        <div :class="styles.statValue">{{ stats.total }}</div>
        <div :class="styles.statLabel">Total</div>
      </div>
    </div>

    <div v-if="message" :class="[styles.alert, styles[`alert${message.type}`]]">
      {{ message.text }}
    </div>

    <VacationList
      ref="vacationListRef"
      :show-actions="true"
      @approve="handleApprove"
      @reject="handleReject"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import VacationList from '../components/VacationList.vue'
import styles from './ValidatorView.module.scss'

export default {
  name: 'ValidatorView',
  components: {
    VacationList
  },
  setup() {
    const vacationListRef = ref(null)
    const message = ref(null)

    const stats = computed(() => {
      if (!vacationListRef.value?.vacations) {
        return { pending: 0, approved: 0, rejected: 0, total: 0 }
      }

      const vacations = vacationListRef.value.vacations
      return {
        pending: vacations.filter(v => v.status === 'pending').length,
        approved: vacations.filter(v => v.status === 'approved').length,
        rejected: vacations.filter(v => v.status === 'rejected').length,
        total: vacations.length
      }
    })

    const showMessage = (text, type) => {
      message.value = { text, type }
      setTimeout(() => {
        message.value = null
      }, 3000)
    }

    const handleApprove = async (id) => {
      try {
        await axios.put(`/api/vacations/${id}`, { status: 'approved' })
        showMessage('Vacation request approved successfully!', 'Success')
        vacationListRef.value.fetchVacations()
      } catch (error) {
        showMessage('Failed to approve request. Please try again.', 'Error')
        console.error('Error approving vacation:', error)
      }
    }

    const handleReject = async (id) => {
      try {
        await axios.put(`/api/vacations/${id}`, { status: 'rejected' })
        showMessage('Vacation request rejected.', 'Error')
        vacationListRef.value.fetchVacations()
      } catch (error) {
        showMessage('Failed to reject request. Please try again.', 'Error')
        console.error('Error rejecting vacation:', error)
      }
    }

    return {
      vacationListRef,
      message,
      stats,
      handleApprove,
      handleReject,
      styles
    }
  }
}
</script>
