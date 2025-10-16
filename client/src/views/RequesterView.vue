<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <h1>Request Vacation Time</h1>
      <p :class="styles.subtitle">
        Submit your vacation request and track its status
      </p>
    </div>

    <div :class="styles.content">
      <div :class="styles.formSection">
        <VacationRequestForm />
      </div>

      <div :class="styles.listSection">
        <h2>My Vacation Requests</h2>
        <VacationList :show-actions="false" />
      </div>
    </div>
  </div>
</template>

<script>
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
    return {
      styles
    }
  }
}
</script>
