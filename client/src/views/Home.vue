<template>
  <div class="container">
    <div class="hero">
      <h1>Welcome to Vacation Management</h1>
      <p class="subtitle">Manage your vacations efficiently with our modern platform</p>
    </div>

    <div class="card">
      <h2>API Status</h2>
      <div v-if="loading" class="alert alert-info">
        Loading...
      </div>
      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>
      <div v-else-if="apiData" class="alert alert-success">
        {{ apiData.message }}
      </div>
      <button @click="fetchData" class="btn btn-primary">
        Test API Connection
      </button>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>📅 Easy Scheduling</h3>
        <p>Plan and schedule your vacations with an intuitive interface</p>
      </div>
      <div class="feature-card">
        <h3>👥 Team Management</h3>
        <p>Coordinate time off with your team members</p>
      </div>
      <div class="feature-card">
        <h3>📊 Analytics</h3>
        <p>Track vacation usage and remaining days</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'Home',
  setup() {
    const apiData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await axios.get('/api/health')
        apiData.value = response.data
      } catch (err) {
        error.value = 'Failed to connect to API: ' + err.message
      } finally {
        loading.value = false
      }
    }

    return {
      apiData,
      loading,
      error,
      fetchData
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.25rem;
  color: #718096;
  margin: 0;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.feature-card h3 {
  margin-top: 0;
  color: #2d3748;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}
</style>
