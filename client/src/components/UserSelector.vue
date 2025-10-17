<template>
  <div :class="styles.userSelector">
    <label for="currentUser">Current User:</label>
    <select
      id="currentUser"
      v-model="selectedUserId"
      @change="handleUserChange"
    >
      <option value="">-- Select a user --</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }} ({{ user.role }})
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import styles from './UserSelector.module.scss'

export default {
  name: 'UserSelector',
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['update:modelValue', 'userChanged'],
  setup(props, { emit }) {
    const users = ref([])
    const selectedUserId = ref(props.modelValue)

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users')
        users.value = response.data
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    const handleUserChange = () => {
      // Convert to number for consistency
      const userId = Number(selectedUserId.value)
      const selectedUser = users.value.find(u => u.id === userId)
      
      emit('update:modelValue', userId)
      emit('userChanged', selectedUser)
    }

    // Watch for prop changes
    watch(() => props.modelValue, (newValue) => {
      selectedUserId.value = newValue
    })

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      selectedUserId,
      handleUserChange,
      styles
    }
  }
}
</script>
