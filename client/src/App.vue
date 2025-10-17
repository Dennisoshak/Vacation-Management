<template>
  <div :class="styles.app">
    <nav :class="styles.navbar">
      <div :class="styles.container">
        <h1 :class="styles.logo">Vacation Management</h1>
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
import styles from './App.module.scss'

export default {
  name: 'App',
  setup() {
    return {
      styles
    }
  }
}
</script>
