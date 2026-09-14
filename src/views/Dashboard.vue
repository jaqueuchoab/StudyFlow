<template>
  <div class="dashboard-view pb-5">
    <!-- Top Header: Greeting matching Figma -->
    <div class="mb-4">
      <h1 class="greeting-title mb-1">Olá, {estudante}!</h1>
      <p class="greeting-subtitle mb-0">Veja suas prioridades acadêmicas e mantenha seus estudos em equilíbrio.</p>
    </div>

    <!-- Top Section: Stats (Left) + Zona de Risco (Right) -->
    <div class="row g-4 mb-5 align-items-stretch">
      <div class="col-lg-4 col-xl-4 d-flex">
        <StatsPanel :stats="stats" />
      </div>
      <div class="col-lg-8 col-xl-8 d-flex">
        <UrgentDeadlines 
          :activities="urgentActivities" 
          @status-change="handleStatusChange" 
        />
      </div>
    </div>

    <!-- Bottom Section: Quadro de Prioridades (Full Width) -->
    <div class="mb-4">
      <PriorityBoard 
        :activities="priorityActivities" 
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
  getDashboardStats,
  getDisciplinesWithMetrics,
  getPriorityBoardActivities,
  getUrgentActivities,
  updateActivityStatus,
  saveActivity
} from '../services/storage'

const stats = ref({})
const disciplines = ref([])
const priorityActivities = ref([])
const urgentActivities = ref([])

const isTaskModalOpen = ref(false)
const activityToEdit = ref(null)

function loadData() {
  stats.value = getDashboardStats()
  disciplines.value = getDisciplinesWithMetrics()
  priorityActivities.value = getPriorityBoardActivities()
  urgentActivities.value = getUrgentActivities(4)
}

onMounted(() => {
  loadData()
})

function handleStatusChange({ id, status }) {
  updateActivityStatus(id, status)
  loadData()
}

function openNewActivityModal() {
  activityToEdit.value = null
  isTaskModalOpen.value = true
}

function handleActivitySaved(activityData) {
  saveActivity(activityData)
  loadData()
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
