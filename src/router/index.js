import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DisciplineList from '../views/DisciplineList.vue'
import DisciplineForm from '../views/DisciplineForm.vue'
import DisciplineDetail from '../views/DisciplineDetail.vue'

const routes = [
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

export default router
