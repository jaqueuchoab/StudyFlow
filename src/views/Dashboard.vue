<template>
  <div class="dashboard-view pb-5">
    <!-- Top Header: Greeting matching Figma -->
    <div class="mb-4">
      <h1 class="greeting-title mb-1">Olá, {{ currentUser?.name || 'Estudante' }}!</h1>
      <p class="greeting-subtitle mb-0">Veja suas prioridades acadêmicas e mantenha seus estudos em equilíbrio.</p>
    </div>

    <!-- Top Section: Stats (Left) + Zona de Risco (Right) -->
    <div class="row g-4 mb-5 align-items-stretch">
      <div class="col-lg-4 col-xl-4 d-flex">
        <StatsPanel :stats="stats" :is-loading="isLoading" />
      </div>
      <div class="col-lg-8 col-xl-8 d-flex">
        <UrgentDeadlines 
          :activities="urgentActivities" 
          :is-loading="isLoading"
          @status-change="handleStatusChange" 
        />
      </div>
    </div>

    <!-- Bottom Section: Quadro de Prioridades (Full Width) -->
    <div class="mb-4">
      <PriorityBoard 
        :activities="priorityActivities" 
        :is-loading="isLoading"
        @status-change="handleStatusChange" 
      />
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      :is-open="isTaskModalOpen"
      :activity-to-edit="activityToEdit"
      @close="isTaskModalOpen = false"
      @saved="handleActivitySaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatsPanel from '../components/dashboard/StatsPanel.vue'
import PriorityBoard from '../components/dashboard/PriorityBoard.vue'
import UrgentDeadlines from '../components/dashboard/UrgentDeadlines.vue'
import TaskFormModal from '../components/shared/TaskFormModal.vue'
import {
  getDashboardData,
  updateActivityStatus,
  saveActivity,
  getCurrentUser
} from '../services/api'

const currentUser = ref(null)
const isLoading = ref(true)
const stats = ref({})
const priorityActivities = ref([])
const urgentActivities = ref([])

const isTaskModalOpen = ref(false)
const activityToEdit = ref(null)

async function loadData() {
  try {
    currentUser.value = getCurrentUser()
    const data = await getDashboardData()
    stats.value = data.stats || {}
    urgentActivities.value = data.urgentActivities || []
    priorityActivities.value = data.priorityActivities || []
  } catch (err) {
    console.error('Erro ao carregar dados da dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

async function handleStatusChange({ id, status }) {
  await updateActivityStatus(id, status)
  await loadData()
}

function openNewActivityModal() {
  activityToEdit.value = null
  isTaskModalOpen.value = true
}

async function handleActivitySaved(activityData) {
  await saveActivity(activityData)
  await loadData()
}
</script>

<style scoped>
.greeting-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.greeting-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 400;
}
</style>
