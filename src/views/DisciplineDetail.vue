<template>
  <div class="discipline-detail-view pb-5">
    <!-- Breadcrumb matching Figma -->
    <div class="breadcrumb-bar mb-4">
      <router-link to="/disciplinas" class="breadcrumb-link">
        <i class="bi bi-arrow-left me-1"></i>
        Minhas Disciplinas
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span v-if="discipline" class="breadcrumb-current">{{ discipline.name }}</span>
      <span v-else class="skeleton-shimmer skeleton-breadcrumb"></span>
    </div>

    <!-- Top Header Card matching Figma -->
    <div class="header-card p-4 p-md-4.5 mb-4">
      <div v-if="discipline" class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <!-- Left: Title & Professor -->
        <div>
          <h1 class="discipline-title mb-2">{{ discipline.name }}</h1>
          <div class="discipline-professor d-flex align-items-center gap-2 text-muted">
            <i class="bi bi-person"></i>
            <span>Professor: <strong>{{ discipline.professor || 'Não informado' }}</strong></span>
          </div>
        </div>

        <!-- Right: Actions Buttons matching Figma -->
        <div class="d-flex align-items-center gap-2 flex-wrap flex-shrink-0">
          <button 
            class="btn-figma-accent" 
            @click="openAddActivityModal"
          >
            <i class="bi bi-plus-lg me-1"></i>
            Adicionar Atividade
          </button>

          <button 
            class="btn-figma-outline" 
            @click="$router.push(`/disciplinas/${discipline.id}/editar`)"
          >
            <i class="bi bi-pencil me-2"></i>
            Editar Disciplina
          </button>

          <button 
            class="btn-figma-icon-delete" 
            title="Excluir disciplina"
            @click="confirmDelete"
          >
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>

      <!-- Header Skeleton Fallback if cold navigation -->
      <div v-else class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <div class="skeleton-shimmer skeleton-title mb-2"></div>
          <div class="skeleton-shimmer skeleton-subtitle"></div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="skeleton-shimmer skeleton-btn"></div>
          <div class="skeleton-shimmer skeleton-btn"></div>
        </div>
      </div>
    </div>

    <!-- Filter Bar matching Figma -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <!-- Status Tabs matching Figma -->
      <div class="filter-tabs-wrap d-flex align-items-center gap-1.5 flex-wrap">
        <button 
          class="btn-tab-pill" 
          :class="{ active: selectedStatus === 'all' }"
          @click="selectedStatus = 'all'"
        >
          Todas <span class="count-badge">({{ activities.length }})</span>
        </button>
        <button 
          class="btn-tab-pill" 
          :class="{ active: selectedStatus === 'a_fazer' }"
          @click="selectedStatus = 'a_fazer'"
        >
          A Fazer <span class="count-badge">({{ countByStatus('a_fazer') }})</span>
        </button>
        <button 
          class="btn-tab-pill" 
          :class="{ active: selectedStatus === 'em_andamento' }"
          @click="selectedStatus = 'em_andamento'"
        >
          Em Andamento <span class="count-badge">({{ countByStatus('em_andamento') }})</span>
        </button>
        <button 
          class="btn-tab-pill" 
          :class="{ active: selectedStatus === 'concluida' }"
          @click="selectedStatus = 'concluida'"
        >
          Concluídas <span class="count-badge">({{ countByStatus('concluida') }})</span>
        </button>
      </div>

      <!-- Dropdown Selects matching Figma -->
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- Priority Filter -->
        <div class="dropdown-select-wrap">
          <select v-model="selectedPriority" class="form-select-pill">
            <option value="all">Prioridade: Todas</option>
            <option value="alta">Prioridade: Alta</option>
            <option value="media">Prioridade: Média</option>
            <option value="baixa">Prioridade: Baixa</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div class="dropdown-select-wrap">
          <select v-model="selectedCategory" class="form-select-pill">
            <option value="all">Categoria: Todas</option>
            <option value="trabalho_avaliativo">Trabalho Avaliativo</option>
            <option value="prova">Prova</option>
            <option value="atividade_pontual">Atividade Pontual</option>
            <option value="revisao">Revisão</option>
            <option value="seminario">Seminário</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Activities List matching Figma -->
    <div v-if="filteredActivities.length > 0" class="d-flex flex-column gap-3">
      <div 
        v-for="item in filteredActivities" 
        :key="item.id" 
        class="activity-card-item p-3.5 p-md-4 d-flex align-items-start gap-3"
        :class="getCardBorderClass(item)"
      >
        <!-- Custom Rounded Checkbox -->
        <button 
          class="custom-checkbox-btn mt-1" 
          :class="{ checked: item.status === 'concluida' }"
          :title="item.status === 'concluida' ? 'Reabrir atividade' : 'Concluir atividade'"
          @click="toggleItemStatus(item)"
        >
          <i v-if="item.status === 'concluida'" class="bi bi-check-lg"></i>
        </button>

        <!-- Content Body -->
        <div class="min-w-0 flex-grow-1">
          <!-- Tags Row -->
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <!-- Category Tag (Purple) -->
            <span class="tag-category-pill">
              {{ formatCategory(item.category) }}
            </span>

            <!-- Priority Tag -->
            <span 
              class="tag-priority-pill"
              :class="'tag-priority-' + item.priority"
            >
              {{ formatPriority(item.priority) }}
            </span>

            <!-- Status Tag -->
            <span 
              class="tag-status-pill"
              :class="item.status === 'concluida' ? 'tag-status-concluida' : 'tag-status-neutral'"
            >
              {{ formatStatus(item.status) }}
            </span>
          </div>

          <!-- Activity Title -->
          <h3 
            class="activity-name mb-2"
            :class="{ 'text-completed': item.status === 'concluida' }"
          >
            {{ item.name }}
          </h3>

          <!-- Prazo info (apenas para atividades não concluídas) -->
          <div v-if="item.status !== 'concluida'" class="activity-deadline">
            <span 
              v-if="isUrgent(item)" 
              class="badge-urgent-prazo"
            >
              <i class="bi bi-clock me-1"></i>
              Prazo: {{ formatDueDate(item.dueDate) }}
            </span>
            <span v-else class="text-muted small">
              <i class="bi bi-calendar3 me-1"></i>
              Prazo: {{ formatDueDate(item.dueDate) }}
            </span>
          </div>
        </div>

        <!-- Right: Actions (Edit & Delete) -->
        <div class="d-flex align-items-center gap-1.5 flex-shrink-0 ms-2">
          <button 
            class="btn-item-action" 
            title="Editar atividade"
            @click="openEditActivityModal(item)"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button 
            class="btn-item-action text-danger" 
            title="Excluir atividade"
            @click="handleDeleteActivity(item.id)"
          >
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton Loading Cards when fetching without existing activities -->
    <div v-else-if="loadingActivities" class="d-flex flex-column gap-3">
      <div v-for="n in 3" :key="n" class="skeleton-card-item p-3.5 p-md-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <div class="skeleton-shimmer skeleton-tag"></div>
          <div class="skeleton-shimmer skeleton-tag"></div>
        </div>
        <div class="skeleton-shimmer skeleton-title mb-2"></div>
        <div class="skeleton-shimmer skeleton-subtitle"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-card p-5 text-center">
      <i class="bi bi-folder-check fs-1 text-primary d-block mb-3"></i>
      <h5 class="fw-bold mb-1">Nenhuma atividade encontrada</h5>
      <p class="text-muted mb-4 small">Nenhuma atividade corresponde aos filtros selecionados.</p>
      <button v-if="discipline" class="btn-figma-accent px-4" @click="openAddActivityModal">
        <i class="bi bi-plus-lg me-1"></i>
        Cadastrar Atividade
      </button>
    </div>

    <!-- Shared Task Modal for Adding/Editing -->
    <TaskFormModal
      v-if="discipline"
      :is-open="isTaskModalOpen"
      :activity-to-edit="activityToEdit"
      parent-type="discipline"
      :parent-id="discipline.id"
      :parent-name="discipline.name"
      @close="isTaskModalOpen = false"
      @saved="handleActivitySaved"
    />

    <!-- Custom Confirmation Alert Modal -->
    <ConfirmModal
      :is-open="confirmModalConfig.isOpen"
      :title="confirmModalConfig.title"
      :message="confirmModalConfig.message"
      :confirm-text="confirmModalConfig.confirmText"
      :cancel-text="confirmModalConfig.cancelText"
      :type="confirmModalConfig.type"
      @confirm="onConfirmAction"
      @close="confirmModalConfig.isOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskFormModal from '../components/shared/TaskFormModal.vue'
import ConfirmModal from '../components/shared/ConfirmModal.vue'
import {
  getDisciplineById,
  getCachedDiscipline,
  deleteDiscipline,
  saveActivity,
  deleteActivity,
  updateActivityStatus
} from '../services/api'
import { parseDate, isRiskZone } from '../utils/dateUtils'

const route = useRoute()
const router = useRouter()

// Initialize immediately with cached data if available for 0ms transition
const initialCached = getCachedDiscipline(route.params.id)
const discipline = ref(initialCached)
const activities = ref(
  initialCached?.activities
    ? initialCached.activities.map(act => ({
        ...act,
        dueDate: act.dueDate ? (typeof act.dueDate === 'string' ? act.dueDate.split('T')[0] : new Date(act.dueDate).toISOString().split('T')[0]) : null,
        parentId: act.disciplineId || initialCached.id,
        parentName: initialCached.name,
        parentColor: initialCached.themeColor
      }))
    : []
)

const loadingActivities = ref(!initialCached || activities.value.length === 0)

const selectedStatus = ref('all')
const selectedPriority = ref('all')
const selectedCategory = ref('all')

const isTaskModalOpen = ref(false)
const activityToEdit = ref(null)

const confirmModalConfig = ref({
  isOpen: false,
  title: 'Confirmação',
  message: '',
  confirmText: 'Sim',
  cancelText: 'Não',
  type: 'danger',
  action: null
})

async function loadData() {
  const discId = route.params.id
  if (!discId) return
  
  if (activities.value.length === 0) {
    loadingActivities.value = true
  }

  try {
    const d = await getDisciplineById(discId)
    if (!d) {
      router.push('/disciplinas')
      return
    }
    discipline.value = d
    activities.value = (d.activities || []).map(act => ({
      ...act,
      dueDate: act.dueDate ? (typeof act.dueDate === 'string' ? act.dueDate.split('T')[0] : new Date(act.dueDate).toISOString().split('T')[0]) : null,
      parentId: act.disciplineId || d.id,
      parentName: d.name,
      parentColor: d.themeColor
    }))
  } catch (err) {
    console.error('Erro ao carregar dados da disciplina:', err)
  } finally {
    loadingActivities.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    const cached = getCachedDiscipline(newId)
    if (cached) {
      discipline.value = cached
      if (cached.activities) {
        activities.value = cached.activities.map(act => ({
          ...act,
          dueDate: act.dueDate ? (typeof act.dueDate === 'string' ? act.dueDate.split('T')[0] : new Date(act.dueDate).toISOString().split('T')[0]) : null,
          parentId: act.disciplineId || cached.id,
          parentName: cached.name,
          parentColor: cached.themeColor
        }))
      }
    }
    loadData()
  }
})

function countByStatus(status) {
  return activities.value.filter(a => a.status === status).length
}

const filteredActivities = computed(() => {
  let list = [...activities.value]

  // Status Filter
  if (selectedStatus.value !== 'all') {
    list = list.filter(a => a.status === selectedStatus.value)
  }

  // Priority Filter
  if (selectedPriority.value !== 'all') {
    list = list.filter(a => a.priority === selectedPriority.value)
  }

  // Category Filter
  if (selectedCategory.value !== 'all') {
    list = list.filter(a => a.category === selectedCategory.value)
  }

  return list
})

function isUrgent(item) {
  return isRiskZone(item)
}

function getCardBorderClass(item) {
  if (item.status === 'concluida') return 'card-border-green'
  if (item.status === 'em_andamento' || isRiskZone(item)) return 'card-border-orange'
  if (item.status === 'a_fazer') return 'card-border-purple'
  return 'card-border-neutral'
}

function formatCategory(category) {
  const map = {
    trabalho_avaliativo: 'Trabalho Avaliativo',
    prova: 'Prova',
    atividade_pontual: 'Atividade Pontual',
    revisao: 'Revisão',
    seminario: 'Seminário'
  }
  return map[category] || 'Atividade'
}

function formatPriority(priority) {
  if (priority === 'alta') return 'Alta Prioridade'
  if (priority === 'media') return 'Prioridade Média'
  if (priority === 'baixa') return 'Prioridade Baixa'
  return 'Prioridade'
}

function formatStatus(status) {
  if (status === 'concluida') return 'Concluída'
  if (status === 'em_andamento') return 'Em Andamento'
  if (status === 'a_fazer') return 'A Fazer'
  return status
}

function formatDueDate(dueDate) {
  if (!dueDate) return 'Sem data'
  const parts = dueDate.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dueDate
}

async function toggleItemStatus(item) {
  const previousStatus = item.status
  const newStatus = item.status === 'concluida' ? 'a_fazer' : 'concluida'
  
  // Optimistic UI update
  item.status = newStatus

  try {
    await updateActivityStatus(item.id, newStatus)
  } catch (err) {
    // Revert on error
    item.status = previousStatus
    console.error('Erro ao atualizar status da atividade:', err)
  }
}

function openAddActivityModal() {
  activityToEdit.value = null
  isTaskModalOpen.value = true
}

function openEditActivityModal(item) {
  activityToEdit.value = item
  isTaskModalOpen.value = true
}

async function handleActivitySaved(activityData) {
  await saveActivity(activityData)
  await loadData()
}

function handleDeleteActivity(id) {
  confirmModalConfig.value = {
    isOpen: true,
    title: 'Excluir Atividade',
    message: 'Tem certeza que deseja remover esta atividade?',
    confirmText: 'Sim',
    cancelText: 'Não',
    type: 'danger',
    action: async () => {
      // Optimistic delete from UI
      activities.value = activities.value.filter(a => a.id !== id)
      try {
        await deleteActivity(id)
      } catch (err) {
        console.error('Erro ao excluir atividade:', err)
        await loadData()
      }
    }
  }
}

function confirmDelete() {
  if (!discipline.value) return
  confirmModalConfig.value = {
    isOpen: true,
    title: 'Excluir Disciplina',
    message: `Deseja realmente excluir a disciplina "${discipline.value.name}" e todas as suas atividades?`,
    confirmText: 'Sim',
    cancelText: 'Não',
    type: 'danger',
    action: async () => {
      await deleteDiscipline(discipline.value.id)
      router.push('/disciplinas')
    }
  }
}

async function onConfirmAction() {
  if (confirmModalConfig.value.action) {
    await confirmModalConfig.value.action()
  }
}
</script>

<style scoped>
/* Breadcrumb */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.breadcrumb-link {
  color: #6D48C5;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #513490;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #9CA3AF;
}

.breadcrumb-current {
  color: var(--color-text-primary);
  font-weight: 700;
}

/* Header Card */
.header-card {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
}

.discipline-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #363636;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.discipline-professor {
  font-size: 0.92rem;
}

/* Action Buttons */
.btn-figma-accent {
  background-color: #C2D039;
  color: #363636;
  border: none;
  font-weight: 700;
  font-size: 0.88rem;
  border-radius: var(--border-radius-pill);
  padding: 0.65rem 1.35rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: all 0.2s ease;
}

.btn-figma-accent:hover {
  background-color: #AFC026;
  transform: translateY(-1px);
}

.btn-figma-outline {
  background-color: #FFFFFF;
  color: #363636;
  border: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: var(--border-radius-pill);
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: all 0.2s ease;
}

.btn-figma-outline:hover {
  background-color: #F4F4F5;
  border-color: #D4D4D8;
}

.btn-figma-icon-delete {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  color: #71717A;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-figma-icon-delete:hover {
  background-color: #FEE2E2;
  color: #DC2626;
  border-color: #FCA5A5;
}

/* Filter Tabs */
.filter-tabs-wrap {
  background-color: #FFFFFF;
  border-radius: var(--border-radius-pill);
  padding: 4px;
  border: 1px solid var(--color-border);
}

.btn-tab-pill {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-tab-pill:hover {
  color: var(--color-text-primary);
}

.btn-tab-pill.active {
  background-color: #6D48C5;
  color: #FFFFFF;
  font-weight: 700;
}

.btn-tab-pill.active .count-badge {
  color: rgba(255, 255, 255, 0.9);
}

.count-badge {
  font-size: 0.8rem;
  color: #71717A;
}

/* Dropdown Pill */
.dropdown-select-wrap {
  background-color: #FFFFFF;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--color-border);
  padding: 2px 8px;
}

.form-select-pill {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  border: none !important;
  background-color: transparent !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2352525B' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
  background-repeat: no-repeat !important;
  background-position: right 8px center !important;
  background-size: 11px 7px !important;
  font-size: 0.84rem !important;
  font-weight: 600 !important;
  color: var(--color-text-secondary) !important;
  padding: 6px 26px 6px 10px !important;
  cursor: pointer;
  outline: none;
}

/* Activity Card Item */
.activity-card-item {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.activity-card-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card-border-orange {
  border-left: 5px solid #F97316;
}

.card-border-purple {
  border-left: 5px solid #8366C5;
}

.card-border-green {
  border-left: 5px solid #84CC16;
}

.card-border-neutral {
  border-left: 5px solid #CBD5E1;
}

/* Custom Checkbox */
.custom-checkbox-btn {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid #D4D4D8;
  background: #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.custom-checkbox-btn:hover {
  border-color: #84CC16;
}

.custom-checkbox-btn.checked {
  background-color: #B5D43C;
  border-color: #B5D43C;
  color: #FFFFFF;
}

/* Tags */
.tag-category-pill {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: var(--border-radius-pill);
  background-color: #ECE8FA;
  color: #6D48C5;
}

.tag-priority-pill {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: var(--border-radius-pill);
}

.tag-priority-alta {
  background-color: #FEE2E2;
  color: #DC2626;
}

.tag-priority-media {
  background-color: #F4F4F5;
  color: #52525B;
}

.tag-priority-baixa {
  background-color: #F4F4F5;
  color: #71717A;
}

.tag-status-pill {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: var(--border-radius-pill);
}

.tag-status-neutral {
  background-color: #F4F4F5;
  color: #52525B;
}

.tag-status-concluida {
  background-color: #C2D039;
  color: #363636;
}

.activity-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #363636;
  line-height: 1.3;
}

.text-completed {
  text-decoration: line-through;
  color: #9CA3AF !important;
}

.badge-urgent-prazo {
  font-size: 0.78rem;
  font-weight: 700;
  background-color: #FEE2E2;
  color: #EA580C;
  padding: 0.28rem 0.75rem;
  border-radius: var(--border-radius-pill);
  display: inline-flex;
  align-items: center;
}

.btn-item-action {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #9CA3AF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-item-action:hover {
  background-color: #F4F4F5;
  color: #363636;
}

.btn-item-action.text-danger:hover {
  background-color: #FEE2E2;
  color: #DC2626;
}

.empty-state-card {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
}

/* Skeleton Loading Shimmers */
.skeleton-shimmer {
  background: linear-gradient(90deg, #EBE9E1 25%, #F5F4EE 50%, #EBE9E1 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-breadcrumb {
  display: inline-block;
  width: 140px;
  height: 18px;
}

.skeleton-title {
  height: 28px;
  width: 260px;
}

.skeleton-subtitle {
  height: 18px;
  width: 180px;
}

.skeleton-btn {
  height: 38px;
  width: 130px;
  border-radius: var(--border-radius-pill);
}

.skeleton-tag {
  height: 20px;
  width: 80px;
  border-radius: var(--border-radius-pill);
}

.skeleton-card-item {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
}
</style>
