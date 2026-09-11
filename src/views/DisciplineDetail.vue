<template>
  <div v-if="discipline" class="discipline-detail-view pb-5">
    <!-- Breadcrumb & Back -->
    <div class="mb-3">
      <router-link to="/disciplinas" class="text-decoration-none text-muted small fw-semibold d-inline-flex align-items-center gap-1">
        <i class="bi bi-arrow-left"></i>
        <span>Voltar para Minhas Disciplinas</span>
      </router-link>
    </div>

    <!-- Header Card -->
    <div class="study-card discipline-header-card p-4 p-md-5 mb-4">
      <div class="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-4">
        <!-- Main details -->
        <div class="d-flex align-items-start gap-3 min-w-0 flex-grow-1">
          <div class="detail-icon-circle" :style="{ backgroundColor: getSoftBg(discipline.themeColor) }">
            <i class="bi bi-book-half" :style="{ color: discipline.themeColor || '#A184E5' }"></i>
          </div>

          <div class="min-w-0 flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold small">
                {{ discipline.course || 'Graduação' }}
              </span>
              <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fw-bold small">
                <i class="bi bi-clock me-1"></i>{{ discipline.workload }} horas
              </span>
              <span v-if="riskCount > 0" class="badge-risk">
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ riskCount }} na Zona de Risco
              </span>
            </div>

            <h2 class="discipline-header-title mb-2 text-primary fw-extrabold">
              {{ discipline.name }}
            </h2>

            <div class="d-flex flex-wrap align-items-center gap-3 text-muted mb-3">
              <div>
                <i class="bi bi-person-workspace text-primary me-1"></i>
                Professor: <strong>{{ discipline.professor }}</strong>
              </div>
            </div>

            <p v-if="discipline.description" class="text-muted mb-0 max-w-2xl">
              {{ discipline.description }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <button 
            class="btn-study-outline py-2 px-3" 
            @click="$router.push(`/disciplinas/${discipline.id}/editar`)"
            title="Editar dados da matéria"
          >
            <i class="bi bi-pencil me-1"></i>
            <span>Editar</span>
          </button>
          <button 
            class="btn-study-outline text-danger py-2 px-3" 
            @click="confirmDelete"
            title="Excluir disciplina"
          >
            <i class="bi bi-trash3 me-1"></i>
            <span>Excluir</span>
          </button>
          <button 
            class="btn-study-accent py-2 px-3" 
            @click="openAddActivityModal"
          >
            <i class="bi bi-plus-lg me-1"></i>
            <span>Nova Atividade</span>
          </button>
        </div>
      </div>

      <!-- Discipline Stats and Progress -->
      <div class="row g-3 mt-4 pt-4 border-top-subtle">
        <div class="col-sm-4">
          <div class="stat-mini-box p-3 rounded-3">
            <span class="small text-muted fw-bold text-uppercase">Progresso Geral</span>
            <div class="d-flex align-items-center justify-content-between mt-1 mb-2">
              <span class="fs-4 fw-extrabold text-primary">{{ progressPercent }}%</span>
              <span class="small text-muted">{{ completedCount }} de {{ activities.length }} entregues</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="stat-mini-box p-3 rounded-3">
            <span class="small text-muted fw-bold text-uppercase">Pendências</span>
            <div class="fs-4 fw-extrabold text-warning mt-1">{{ pendingCount }}</div>
            <small class="text-muted">A fazer ou em andamento</small>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="stat-mini-box p-3 rounded-3" :class="{ 'border-risk': riskCount > 0 }">
            <span class="small text-danger fw-bold text-uppercase">Zona de Risco (≤ 3 dias)</span>
            <div class="fs-4 fw-extrabold text-risk mt-1">{{ riskCount }}</div>
            <small class="text-muted">Prazos urgentes não concluídos</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Title & Filters -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h3 class="text-primary mb-0">Atividades e Entregas</h3>
        <small class="text-muted">Gerencie provas, trabalhos, seminários e revisões</small>
      </div>
      <button class="btn-study-accent d-md-none" @click="openAddActivityModal">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <!-- TaskFilters.vue (por prioridade, situação, categoria e busca) -->
    <TaskFilters 
      v-model="filters" 
      :total-count="filteredActivities.length" 
    />

    <!-- TaskList.vue + TaskCard.vue -->
    <TaskList
      :activities="filteredActivities"
      :parent-name="discipline.name"
      :parent-color="discipline.themeColor"
      empty-title="Nenhuma atividade encontrada nesta disciplina"
      empty-description="Clique no botão abaixo para agendar a primeira prova ou trabalho desta matéria."
      @edit="openEditActivityModal"
      @delete="handleDeleteActivity"
      @status-change="handleStatusChange"
      @add="openAddActivityModal"
    />

    <!-- Floating Action Button -->
    <FloatingActionButton 
      @create-discipline="$router.push('/disciplinas/nova')"
      @create-activity="openAddActivityModal"
    />

    <!-- Shared Task Modal -->
    <TaskFormModal
      :is-open="isTaskModalOpen"
      :activity-to-edit="activityToEdit"
      parent-type="discipline"
      :parent-id="discipline.id"
      :parent-name="discipline.name"
      @close="isTaskModalOpen = false"
      @saved="handleActivitySaved"
    />
  </div>

  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando disciplina...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskFilters from '../components/shared/TaskFilters.vue'
import TaskList from '../components/shared/TaskList.vue'
import TaskFormModal from '../components/shared/TaskFormModal.vue'
import FloatingActionButton from '../components/shared/FloatingActionButton.vue'
import {
  getDisciplineById,
  deleteDiscipline,
  getActivitiesByParent,
  saveActivity,
  deleteActivity,
  updateActivityStatus
} from '../services/storage'
import { isRiskZone } from '../utils/dateUtils'

const route = useRoute()
const router = useRouter()

const discipline = ref(null)
const activities = ref([])

const isTaskModalOpen = ref(false)
const activityToEdit = ref(null)

const filters = ref({
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  onlyRisk: false
})

function loadData() {
  const discId = route.params.id
  const d = getDisciplineById(discId)
  if (!d) {
    router.push('/disciplinas')
    return
  }
  discipline.value = d
  activities.value = getActivitiesByParent('discipline', discId)
}

onMounted(() => {
  loadData()
})

const completedCount = computed(() => {
  return activities.value.filter(a => a.status === 'concluida').length
})

const pendingCount = computed(() => {
  return activities.value.filter(a => a.status === 'a_fazer' || a.status === 'em_andamento').length
})

const riskCount = computed(() => {
  return activities.value.filter(a => isRiskZone(a)).length
})

const progressPercent = computed(() => {
  if (activities.value.length === 0) return 0
  return Math.round((completedCount.value / activities.value.length) * 100)
})

const filteredActivities = computed(() => {
  let list = [...activities.value]

  // Search filter
  if (filters.value.search.trim()) {
    const q = filters.value.search.toLowerCase().trim()
    list = list.filter(a => 
      a.name.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q))
    )
  }

  // Status filter
  if (filters.value.status !== 'all') {
    list = list.filter(a => a.status === filters.value.status)
  }

  // Priority filter
  if (filters.value.priority !== 'all') {
    list = list.filter(a => a.priority === filters.value.priority)
  }

  // Category filter
  if (filters.value.category !== 'all') {
    list = list.filter(a => a.category === filters.value.category)
  }

  // Risk zone filter
  if (filters.value.onlyRisk) {
    list = list.filter(a => isRiskZone(a))
  }

  // Sort by date ascending (closest first)
  list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return list
})

function confirmDelete() {
  if (confirm(`Deseja realmente excluir a disciplina "${discipline.value.name}" e todas as suas atividades?`)) {
    deleteDiscipline(discipline.value.id)
    router.push('/disciplinas')
  }
}

function openAddActivityModal() {
  activityToEdit.value = null
  isTaskModalOpen.value = true
}

function openEditActivityModal(activity) {
  activityToEdit.value = activity
  isTaskModalOpen.value = true
}

function handleActivitySaved(activityData) {
  saveActivity(activityData)
  loadData()
}

function handleDeleteActivity(id) {
  if (confirm('Tem certeza que deseja remover esta atividade?')) {
    deleteActivity(id)
    loadData()
  }
}

function handleStatusChange({ id, status }) {
  updateActivityStatus(id, status)
  loadData()
}

function getSoftBg(color) {
  if (color === '#C2D039') return 'rgba(194, 208, 57, 0.16)'
  if (color === '#A184E5') return 'rgba(161, 132, 229, 0.16)'
  return 'rgba(245, 244, 227, 0.9)'
}
</script>

<style scoped>
.fw-extrabold {
  font-weight: 800;
}

.discipline-header-card {
  background-color: var(--color-card-bg);
  border-radius: var(--border-radius-card);
}

.detail-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.discipline-header-title {
  font-size: 1.8rem;
  line-height: 1.2;
}

.stat-mini-box {
  background-color: #fff;
  border: 1px solid var(--color-border);
}

.progress-bar-wrap {
  height: 8px;
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

.border-top-subtle {
  border-top: 1px solid var(--color-border-subtle);
}

.text-risk {
  color: var(--color-risk);
}

.max-w-2xl {
  max-width: 680px;
}
</style>
