<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <h1>Manage Vacation Requests</h1>
      <p :class="styles.subtitle">
        Review and approve or reject vacation requests from your team
      </p>
    </div>

    <div v-if="!currentUser" :class="[styles.alert, styles.alertInfo]">
      Please select a user from the top navigation bar.
    </div>

    <div v-else-if="!isValidator" :class="[styles.alert, styles.alertError]">
      Only validators can manage vacation requests. The selected user "{{ currentUser.name }}" is a {{ currentUser.role }}.
    </div>

    <div v-if="isValidator" :class="styles.stats">
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

    <div v-if="isValidator && message" :class="[styles.alert, styles[`alert${message.type}`]]">
      {{ message.text }}
    </div>
    <div :class="styles.listSection">
    <h2>Vacation Requests</h2>
    <VacationList
      v-if="isValidator"
      ref="vacationListRef"
      :show-actions="true"
      @approve="handleApprove"
      @reject="handleReject"
    />
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
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
    const currentUser = inject('currentUser', ref(null))
    
    const isValidator = computed(() => {
      return currentUser.value?.role === 'validator'
    })

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
        await axios.patch(`/api/vacations/${id}/approve`)
        showMessage('Vacation request approved successfully!', 'Success')
        vacationListRef.value.fetchVacations()
      } catch (error) {
        showMessage('Failed to approve request. Please try again.', 'Error')
        console.error('Error approving vacation:', error)
      }
    }

    const handleReject = async ({ id, comment }) => {
      try {
        await axios.patch(`/api/vacations/${id}/reject`, { 
          comments: comment 
        })
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
      currentUser,
      isValidator,
      stats,
      handleApprove,
      handleReject,
      styles
    }
  }
}
</script>
