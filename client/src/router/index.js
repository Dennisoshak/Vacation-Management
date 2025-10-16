import { createRouter, createWebHistory } from 'vue-router'
import RequesterView from '../views/RequesterView.vue'
import ValidatorView from '../views/ValidatorView.vue'

const routes = [
  {
    path: '/',
    name: 'Request',
    component: RequesterView
  },
  {
    path: '/validate',
    name: 'Validate',
    component: ValidatorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
