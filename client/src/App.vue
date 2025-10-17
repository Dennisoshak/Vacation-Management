<template>
  <div :class="styles.app">
    <nav :class="styles.navbar">
      <div :class="styles.container">
        <h1 :class="styles.logo">Vacation Management</h1>
        <UserSelector v-model="currentUserId" @userChanged="handleUserChange" />
        <div :class="styles.navLinks">
          <router-link to="/">Request Vacation</router-link>
          <router-link to="/validate">Manage Requests</router-link>
        </div>
      </div>
    </nav>
    
    <main :class="styles.mainContent">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import UserSelector from './components/UserSelector.vue'
import styles from './App.module.scss'
import './styles/global.scss'

export default {
  components: {
    UserSelector
  },
  setup() {
    const currentUserId = ref(null)
    const currentUser = ref(null)

    const handleUserChange = (user) => {
      currentUser.value = user
      console.log('User changed:', user)
      console.log('Current user ID:', currentUserId.value)
    }

    // Provide user data to all child components
    provide('currentUser', currentUser)
    provide('currentUserId', currentUserId)

    return {
      currentUserId,
      handleUserChange,
      styles
    }
  }
}
</script>
