<template>
  <div :class="styles.formContainer">
    <h2>Request Vacation</h2>
    
    <form @submit.prevent="handleSubmit" :class="styles.form">
      <div :class="styles.formGroup">
        <label for="userId">Select User *</label>
        <select
          id="userId"
          v-model="formData.user_id"
          required
        >
          <option value="">-- Select a user --</option>
          <option v-for="user in requesters" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
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
    
    const formData = ref({
      user_id: '',
      start_date: '',
      end_date: '',
      reason: ''
    })

    const requesters = ref([])
    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)
    
    // Watch for current user changes and pre-select
    watch(currentUserId, (newId) => {
      if (newId && !formData.value.user_id) {
        formData.value.user_id = newId
      }
    }, { immediate: true })

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const fetchRequesters = async () => {
      try {
        const response = await axios.get('/api/users')
        requesters.value = response.data
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    const resetForm = () => {
      formData.value = {
        user_id: '',
        start_date: '',
        end_date: '',
        reason: ''
      }
      error.value = null
      success.value = null
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = null
      success.value = null

      try {
        await axios.post('/api/vacations', formData.value)
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

    onMounted(() => {
      fetchRequesters()
    })

    return {
      formData,
      requesters,
      loading,
      error,
      success,
      minDate,
      handleSubmit,
      resetForm,
      styles
    }
  }
}
</script>
