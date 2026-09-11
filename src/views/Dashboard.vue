<template>
  <div class="dashboard-view pb-5">
    <!-- Top Header: Greeting -->
    <div class="d-flex align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h2 class="mb-1 text-primary fw-extrabold">Olá, Estudante!</h2>
        <p class="text-muted mb-0">Confira seus prazos e prioridades acadêmicas.</p>
      </div>
        <FloatingActionButton 
        @create-discipline="$router.push('/disciplinas/nova')"
        @create-activity="openNewActivityModal"
      />
    </div>

    <!-- 1. Stats Insights Panel -->
    <StatsPanel :stats="stats" />

    <!-- 2. Row: Quadro de Prioridades & Prazos Iminentes -->
    <div class="row g-4 mb-4">
      <div class="col-xl-7">
        <PriorityBoard 
          :activities="priorityActivities" 
          @status-change="handleStatusChange" 
        />
      </div>
      <div class="col-xl-5">
        <UrgentDeadlines 
          :activities="urgentActivities" 
          @status-change="handleStatusChange" 
        />
      </div>
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
import EmptyState from '../components/ui/EmptyState.vue'
import FloatingActionButton from '../components/shared/FloatingActionButton.vue'
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
  urgentActivities.value = getUrgentActivities(6)
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

function getSoftBg(color) {
  if (color === '#C2D039') return 'rgba(194, 208, 57, 0.16)'
  if (color === '#A184E5') return 'rgba(161, 132, 229, 0.16)'
  return 'rgba(245, 244, 227, 0.9)'
}

function getCourseIcon(illustration) {
  const map = {
    desktop: 'bi bi-display',
    cpu: 'bi bi-cpu-fill',
    'code-square': 'bi bi-code-slash'
  }
  return map[illustration] || 'bi bi-laptop'
}
</script>

<style scoped>
.fw-extrabold {
  font-weight: 800;
}

.btn-notification-bell {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #513490;
  font-size: 1.15rem;
  position: relative;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.btn-notification-bell:hover {
  background-color: var(--color-primary-light);
  transform: translateY(-2px);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: var(--color-risk);
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.68rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.course-mockup-card {
  background-color: var(--color-card-bg);
  border-radius: var(--border-radius-card);
  transition: all 0.25s ease;
}

.course-mockup-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(161, 132, 229, 0.4);
}

.course-illustration-wrap {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.course-title {
  font-size: 1.22rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.course-desc {
  font-size: 0.88rem;
  line-height: 1.4;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge-pending-pill {
  font-size: 0.74rem;
  font-weight: 700;
  background-color: #FEF9EB;
  color: #D97706;
  padding: 0.25rem 0.65rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid rgba(217, 119, 6, 0.2);
}

.progress-bar-wrap {
  width: 100px;
  height: 6px;
  background-color: var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 10px;
  transition: width 0.4s ease;
}
</style>
