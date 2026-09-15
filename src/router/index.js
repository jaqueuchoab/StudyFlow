import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DisciplineList from '../views/DisciplineList.vue'
import DisciplineForm from '../views/DisciplineForm.vue'
import DisciplineDetail from '../views/DisciplineDetail.vue'
import Login from '../views/Login.vue'
import { getCurrentUser } from '../services/api'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/disciplinas',
    name: 'DisciplineList',
    component: DisciplineList
  },
  {
    path: '/disciplinas/nova',
    name: 'DisciplineCreate',
    component: DisciplineForm
  },
  {
    path: '/disciplinas/:id/editar',
    name: 'DisciplineEdit',
    component: DisciplineForm
  },
  {
    path: '/disciplinas/:id',
    name: 'DisciplineDetail',
    component: DisciplineDetail
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Simple navigation guard for email/password session
router.beforeEach((to, from, next) => {
  const user = getCurrentUser()
  if (!to.meta.public && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/')
  } else {
    next()
  }
})

export default router
