<template>
  <div :class="styles.formContainer">
    <h2>Request Vacation</h2>
    
    <div v-if="isValidator" :class="[styles.alert, styles.alertInfo]">
      Validators cannot submit vacation requests. Please select a requester user to submit a request on their behalf.
    </div>
    
    <form v-if="!isValidator" @submit.prevent="handleSubmit" :class="styles.form">
      <div :class="styles.formGroup">
        <label for="userName">User *</label>
        <input
          id="userName"
          type="text"
          :value="currentUser?.name || 'No user selected'"
          readonly
          :class="styles.readonlyInput"
        />
      </div>

      <div :class="styles.formRow">
        <div :class="styles.formGroup">
          <label for="startDate">Start Date *</label>
          <input
            id="startDate"
            v-model="formData.start_date"
            type="date"
            required
            :min="minDate"
          />
        </div>

        <div :class="styles.formGroup">
          <label for="endDate">End Date *</label>
          <input
            id="endDate"
            v-model="formData.end_date"
            type="date"
            required
            :min="formData.start_date || minDate"
          />
        </div>
      </div>

      <div :class="styles.formGroup">
        <label for="reason">Reason (Optional)</label>
        <textarea
          id="reason"
          v-model="formData.reason"
          rows="3"
          placeholder="Reason for vacation request..."
        ></textarea>
      </div>

      <div v-if="error" :class="[styles.alert, styles.alertError]">
        {{ error }}
      </div>

      <div v-if="success" :class="[styles.alert, styles.alertSuccess]">
        {{ success }}
      </div>

      <div :class="styles.formActions">
        <button type="submit" :class="[styles.btn, styles.btnPrimary]" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Submit Request' }}
        </button>
        <button type="button" :class="[styles.btn, styles.btnSecondary]" @click="resetForm">
          Clear Form
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject, watch } from 'vue'
import axios from 'axios'
import styles from './VacationRequestForm.module.scss'

export default {
  name: 'VacationRequestForm',
  emits: ['submitted'],
  setup(props, { emit }) {
    const currentUserId = inject('currentUserId', ref(null))
    const currentUser = inject('currentUser', ref(null))
    
    const formData = ref({
      start_date: '',
      end_date: '',
      reason: ''
    })

    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)
    
    const isValidator = computed(() => {
      return currentUser.value?.role === 'validator'
    })

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const resetForm = () => {
      formData.value = {
        start_date: '',
        end_date: '',
        reason: ''
      }
      error.value = null
      success.value = null
    }

    const handleSubmit = async () => {
      if (!currentUserId.value) {
        error.value = 'Please select a user from the header first.'
        return
      }

      loading.value = true
      error.value = null
      success.value = null

      try {
        // Include user_id from the selected user in header
        const requestData = {
          ...formData.value,
          user_id: currentUserId.value
        }
        
        await axios.post('/api/vacations', requestData)
        success.value = 'Vacation request submitted successfully!'
        
        // Emit event to notify parent component
        emit('submitted')
        
        setTimeout(() => {
          resetForm()
        }, 2000)
      } catch (err) {
        error.value = 'Failed to submit request. Please try again.'
        console.error('Error submitting vacation request:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      currentUser,
      loading,
      error,
      success,
      isValidator,
      minDate,
      handleSubmit,
      resetForm,
      styles
    }
  }
}
</script>
