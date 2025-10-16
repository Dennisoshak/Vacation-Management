<template>
  <div :class="styles.formContainer">
    <h2>Request Vacation</h2>
    
    <form @submit.prevent="handleSubmit" :class="styles.form">
      <div :class="styles.formGroup">
        <label for="employeeName">Your Name *</label>
        <input
          id="employeeName"
          v-model="formData.employee_name"
          type="text"
          required
          placeholder="Enter your full name"
        />
      </div>

      <div :class="styles.formGroup">
        <label for="employeeEmail">Email *</label>
        <input
          id="employeeEmail"
          v-model="formData.employee_email"
          type="email"
          required
          placeholder="your.email@example.com"
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
        <label for="daysRequested">Days Requested *</label>
        <input
          id="daysRequested"
          v-model.number="formData.days_requested"
          type="number"
          required
          min="1"
          placeholder="Number of days"
        />
      </div>

      <div :class="styles.formGroup">
        <label for="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="4"
          placeholder="Add any additional information..."
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
import { ref, computed } from 'vue'
import axios from 'axios'
import styles from './VacationRequestForm.module.scss'

export default {
  name: 'VacationRequestForm',
  setup() {
    const formData = ref({
      employee_name: '',
      employee_email: '',
      start_date: '',
      end_date: '',
      days_requested: '',
      notes: ''
    })

    const loading = ref(false)
    const error = ref(null)
    const success = ref(null)

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const resetForm = () => {
      formData.value = {
        employee_name: '',
        employee_email: '',
        start_date: '',
        end_date: '',
        days_requested: '',
        notes: ''
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
