<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <h1>Request Vacation Time</h1>
      <p :class="styles.subtitle">
        Submit your vacation request and track its status
      </p>
    </div>

    <div v-if="!currentUser" :class="styles.alert">
      Please select a user from the top navigation bar to continue.
    </div>

    <div v-else :class="styles.content">
      <div :class="styles.formSection">
        <VacationRequestForm @submitted="handleFormSubmit" />
      </div>

      <div :class="styles.listSection">
        <h2>{{ currentUser.role === 'requester' ? 'My Vacation Requests' : 'All Vacation Requests' }}</h2>
        <VacationList ref="vacationListRef" :show-actions="false" />
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import VacationRequestForm from '../components/VacationRequestForm.vue'
import VacationList from '../components/VacationList.vue'
import styles from './RequesterView.module.scss'

export default {
  name: 'RequesterView',
  components: {
    VacationRequestForm,
    VacationList
  },
  setup() {
    const currentUser = inject('currentUser', ref(null))
    const vacationListRef = ref(null)
    
    const handleFormSubmit = () => {
      // Refresh the vacation list after form submission
      if (vacationListRef.value) {
        vacationListRef.value.fetchVacations()
      }
    }
    
    return {
      currentUser,
      vacationListRef,
      handleFormSubmit,
      styles
    }
  }
}
</script>
