<template>
  <div class="disciplines-view pb-5">
    <!-- Header -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h2 class="mb-1 text-primary fw-extrabold">Minhas Disciplinas</h2>
        <p class="text-muted mb-0">Gerencie todas as matérias cadastradas, acompanhe entregas e adicione novas tarefas.</p>
      </div>

      <router-link to="/disciplinas/nova" class="btn-study-accent">
        <i class="bi bi-plus-lg"></i>
        <span>Nova Disciplina</span>
      </router-link>
    </div>

    <!-- Filters and Search Bar -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <!-- Search Input -->
      <div class="search-box-wrapper flex-grow-1" style="max-width: 380px;">
        <i class="bi bi-search search-icon"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control form-control-search" 
          placeholder="Buscar disciplina por nome, professor ou curso..."
        />
        <button v-if="searchQuery" class="btn-clear-search" @click="searchQuery = ''">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- Sort Filter Pills (Spec 4.3: mais pendências / mais atividades) -->
      <div class="filter-bar mb-0">
        <span class="filter-label">
          <i class="bi bi-sort-down me-1 text-primary"></i>Ordenar por:
        </span>
        <button 
          class="filter-pill" 
          :class="{ active: sortBy === 'pending' }" 
          @click="sortBy = 'pending'"
        >
          <i class="bi bi-exclamation-circle me-1"></i>
          <span>Mais Pendências</span>
        </button>
        <button 
          class="filter-pill" 
          :class="{ active: sortBy === 'total' }" 
          @click="sortBy = 'total'"
        >
          <i class="bi bi-collection me-1"></i>
          <span>Mais Atividades</span>
        </button>
        <button 
          class="filter-pill" 
          :class="{ active: sortBy === 'name' }" 
          @click="sortBy = 'name'"
        >
          <i class="bi bi-alphabet me-1"></i>
          <span>Nome (A-Z)</span>
        </button>
      </div>
    </div>

    <!-- Disciplines Grid / List -->
    <div v-if="filteredDisciplines.length > 0" class="row g-4">
      <div 
        v-for="disc in filteredDisciplines" 
        :key="disc.id" 
        class="col-12"
      >
        <div class="study-card discipline-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <!-- Main Content Info -->
          <div class="d-flex align-items-start gap-3 flex-grow-1 min-w-0">
            <div class="discipline-icon-box" :style="{ backgroundColor: getSoftBg(disc.themeColor) }">
              <i :class="getCourseIcon(disc.illustration)" :style="{ color: disc.themeColor || '#A184E5' }"></i>
            </div>

            <div class="min-w-0 flex-grow-1">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 fw-bold small">
                  {{ disc.course || 'Sem Curso Definido' }}
                </span>
                <span class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 fw-bold small">
                  <i class="bi bi-clock me-1"></i>{{ disc.workload }} horas
                </span>
                <span v-if="disc.pendingActivities > 0" class="badge-pending-pill">
                  <i class="bi bi-hourglass-split me-1"></i>{{ disc.pendingActivities }} pendência{{ disc.pendingActivities > 1 ? 's' : '' }}
                </span>
                <span v-else class="badge bg-success-subtle text-success rounded-pill px-2 py-1 fw-bold small">
                  <i class="bi bi-check-circle-fill me-1"></i>Sem pendências
                </span>
              </div>

              <h4 class="discipline-title mb-1">
                <router-link :to="'/disciplinas/' + disc.id" class="text-decoration-none">
                  {{ disc.name }}
                </router-link>
              </h4>

              <div class="discipline-prof mb-2 text-muted">
                <i class="bi bi-person-badge me-1 text-primary"></i>
                <span>Professor: <strong>{{ disc.professor }}</strong></span>
              </div>

              <p v-if="disc.description" class="discipline-desc text-muted mb-2 text-truncate-2">
                {{ disc.description }}
              </p>

              <!-- Progress bar -->
              <div class="d-flex align-items-center gap-3">
                <div class="progress-bar-wrap flex-grow-1" style="max-width: 220px;">
                  <div class="progress-bar-fill" :style="{ width: disc.progressPercent + '%' }"></div>
                </div>
                <span class="small text-muted fw-semibold">
                  {{ disc.completedActivities }} de {{ disc.totalActivities }} atividades concluídas ({{ disc.progressPercent }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- Actions Column: Edit, Delete, and Arrow navigation -->
          <div class="d-flex align-items-center justify-content-end gap-2 flex-shrink-0 pt-2 pt-md-0 border-top-mobile">
            <button 
              class="btn-icon-action" 
              title="Editar Disciplina" 
              @click="$router.push(`/disciplinas/${disc.id}/editar`)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="btn-icon-action text-danger-subtle" 
              title="Excluir Disciplina" 
              @click="confirmDelete(disc)"
            >
              <i class="bi bi-trash3"></i>
            </button>
            <router-link 
              :to="'/disciplinas/' + disc.id" 
              class="btn-circle-action ms-2" 
              :title="'Ver atividades de ' + disc.name"
            >
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State (Spec 4.3: Estado vazio -> botão central de cadastro) -->
    <EmptyState
      v-else-if="disciplines.length === 0"
      icon="bi bi-folder-plus"
      title="Nenhuma disciplina cadastrada"
      description="Comece organizando seu semestre letivo adicionando sua primeira disciplina com professor e carga horária."
      action-label="Cadastrar Primeira Disciplina"
      @action="$router.push('/disciplinas/nova')"
    />

    <!-- No search results -->
    <div v-else class="text-center py-5">
      <i class="bi bi-search fs-1 text-muted d-block mb-3"></i>
      <h5>Nenhuma disciplina corresponde à sua busca</h5>
      <p class="text-muted">Tente buscar com outro termo ou limpe o campo de busca.</p>
      <button class="btn-study-outline" @click="searchQuery = ''">
        Limpar busca
      </button>
    </div>

    <!-- Floating Action Button (Spec 4.3: Estado com dados -> botão flutuante FAB) -->
    <FloatingActionButton 
      v-if="disciplines.length > 0"
      @create-discipline="$router.push('/disciplinas/nova')"
      @create-activity="openActivityModal"
    />

    <!-- Modal for new activity -->
    <TaskFormModal
      :is-open="isActivityModalOpen"
      @close="isActivityModalOpen = false"
      @saved="handleActivitySaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmptyState from '../components/ui/EmptyState.vue'
import FloatingActionButton from '../components/shared/FloatingActionButton.vue'
import TaskFormModal from '../components/shared/TaskFormModal.vue'
import {
  getDisciplinesWithMetrics,
  deleteDiscipline,
  saveActivity
} from '../services/storage'

const disciplines = ref([])
const searchQuery = ref('')
const sortBy = ref('pending') // 'pending' | 'total' | 'name'

const isActivityModalOpen = ref(false)

function loadData() {
  disciplines.value = getDisciplinesWithMetrics()
}

onMounted(() => {
  loadData()
})

const filteredDisciplines = computed(() => {
  let list = [...disciplines.value]

  // Filter search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) ||
      (d.professor && d.professor.toLowerCase().includes(q)) ||
      (d.course && d.course.toLowerCase().includes(q))
    )
  }

  // Sort
  if (sortBy.value === 'pending') {
    list.sort((a, b) => b.pendingActivities - a.pendingActivities)
  } else if (sortBy.value === 'total') {
    list.sort((a, b) => b.totalActivities - a.totalActivities)
  } else if (sortBy.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
})

function confirmDelete(disc) {
  if (confirm(`Tem certeza que deseja excluir a disciplina "${disc.name}" e todas as suas atividades vinculadas?`)) {
    deleteDiscipline(disc.id)
    loadData()
  }
}

function openActivityModal() {
  isActivityModalOpen.value = true
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
  return map[illustration] || 'bi bi-journal-bookmark'
}
</script>

<style scoped>
.fw-extrabold {
  font-weight: 800;
}

.discipline-card {
  background-color: var(--color-card-bg);
  border-radius: var(--border-radius-card);
  transition: all 0.22s ease;
}

.discipline-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(161, 132, 229, 0.4);
}

.discipline-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.discipline-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.discipline-title a {
  color: var(--color-text-primary);
}
.discipline-title a:hover {
  color: var(--color-primary);
}

.discipline-prof {
  font-size: 0.9rem;
}

.discipline-desc {
  font-size: 0.86rem;
  line-height: 1.4;
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

.search-box-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #513490;
  font-size: 0.95rem;
}

.form-control-search {
  padding-left: 38px !important;
  padding-right: 32px !important;
  border-radius: var(--border-radius-pill) !important;
  background-color: var(--color-card-bg) !important;
  border: 1px solid var(--color-border) !important;
}

.btn-clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1.1rem;
}

.btn-icon-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon-action:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-icon-action.text-danger-subtle:hover {
  background-color: #FEEEEE;
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .border-top-mobile {
    border-top: 1px solid var(--color-border-subtle);
    padding-top: 0.75rem;
  }
}
</style>
