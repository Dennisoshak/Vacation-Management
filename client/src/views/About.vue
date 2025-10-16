<template>
  <div class="container">
    <div class="card">
      <h1>About Vacation Management</h1>
      <p>
        This is a full-stack application built with modern technologies to help you manage
        vacation requests and time off efficiently.
      </p>
      
      <h2>Tech Stack</h2>
      <ul class="tech-list">
        <li><strong>Frontend:</strong> Vue 3 + Vite</li>
        <li><strong>Backend:</strong> Node.js + Express</li>
        <li><strong>Database:</strong> PostgreSQL with Knex.js</li>
      </ul>

      <h2>Features</h2>
      <ul class="feature-list">
        <li>Modern and responsive UI</li>
        <li>RESTful API architecture</li>
        <li>Database migrations and seeding</li>
        <li>Environment-based configuration</li>
        <li>Hot module replacement for development</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
h1 {
  color: #2d3748;
  margin-top: 0;
}

h2 {
  color: #4a5568;
  margin-top: 2rem;
}

.tech-list, .feature-list {
  line-height: 2;
  color: #718096;
}

.tech-list li {
  margin-bottom: 0.5rem;
}

.feature-list li {
  margin-bottom: 0.5rem;
}
</style>
