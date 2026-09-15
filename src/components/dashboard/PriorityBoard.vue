<template>
  <div class="priority-board-section">
    <!-- Header matching Figma -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <div>
        <h3 class="section-title mb-1">Quadro de Prioridades</h3>
        <p class="section-subtitle mb-0">Ordenação inteligente baseada em urgência e prazo.</p>
      </div>

      <!-- Filter Pills matching Figma: Todas, Alta, Média, Baixa -->
      <div class="filter-pills-wrap d-flex align-items-center gap-1">
        <button 
          v-for="filter in filterOptions" 
          :key="filter.value"
          class="btn-filter-pill"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Skeleton Loading Rows -->
    <div v-if="isLoading" class="d-flex flex-column gap-3">
      <div v-for="n in 3" :key="n" class="priority-card-item p-3 p-sm-3.5 d-flex align-items-center gap-3">
        <div class="skeleton-shimmer skeleton-checkbox"></div>
        <div class="min-w-0 flex-grow-1">
          <div class="d-flex align-items-center gap-2 mb-2">
            <div class="skeleton-shimmer skeleton-pill"></div>
            <div class="skeleton-shimmer skeleton-pill-sm"></div>
          </div>
          <div class="skeleton-shimmer skeleton-row-title mb-2"></div>
          <div class="skeleton-shimmer skeleton-row-subtitle"></div>
        </div>
      </div>
    </div>

    <!-- Priority Cards List matching Figma -->
    <div v-else-if="filteredActivities.length > 0" class="d-flex flex-column gap-3">
      <div 
        v-for="item in filteredActivities" 
        :key="item.id" 
        class="priority-card-item p-3 p-sm-3.5 d-flex align-items-center gap-3"
        :class="{ 'is-completed': item.status === 'concluida' }"
      >
        <!-- Custom Rounded Checkbox -->
        <button 
          class="custom-checkbox-btn"
          :class="{ checked: item.status === 'concluida' }"
          :title="item.status === 'concluida' ? 'Reabrir atividade' : 'Marcar como concluída'"
          @click="toggleStatus(item)"
        >
          <i v-if="item.status === 'concluida'" class="bi bi-check-lg"></i>
        </button>

        <!-- Content Body -->
        <div class="min-w-0 flex-grow-1">
          <!-- Tags Row: Discipline + Priority/Status -->
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <!-- Discipline Tag (only shown if not completed or as secondary) -->
            <span 
              v-if="item.status !== 'concluida'"
              class="tag-discipline"
              :class="getDisciplineTagClass(item)"
              :style="getCustomDisciplineStyle(item)"
            >
              {{ item.parentName }}
            </span>

            <!-- Status / Priority Tag -->
            <span 
              v-if="item.status === 'concluida'"
              class="tag-status tag-completed"
            >
              Concluído
            </span>
            <span 
              v-else
              class="tag-status"
              :class="'tag-priority-' + item.priority"
            >
              {{ getPriorityLabel(item.priority) }}
            </span>
          </div>

          <!-- Activity Title -->
          <h4 
            class="activity-title mb-1 text-truncate"
            :class="{ 'completed-text': item.status === 'concluida' }"
            :title="item.name"
          >
            {{ item.name }}
          </h4>

          <!-- Subtitle: Prazo info (apenas para não concluídas) -->
          <div v-if="item.status !== 'concluida'" class="activity-subtitle d-flex align-items-center text-muted small">
            <i class="bi bi-calendar3 icon-calendar me-2"></i>
            <span>Prazo: {{ formatPrazo(item.dueDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="priority-card-item p-4 text-center text-muted">
      <i class="bi bi-check2-circle text-primary fs-2 mb-2 d-block"></i>
      <h6 class="fw-bold mb-1 text-dark">Nenhuma atividade nesta categoria!</h6>
      <p class="small mb-0">Todas as atividades deste filtro foram concluídas ou não foram criadas ainda.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { parseDate } from '../../utils/dateUtils'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['status-change'])

const selectedFilter = ref('todas')

const filterOptions = [
  { label: 'Todas', value: 'todas' },
  { label: 'Alta', value: 'alta' },
  { label: 'Média', value: 'media' },
  { label: 'Baixa', value: 'baixa' }
]

const filteredActivities = computed(() => {
  if (selectedFilter.value === 'todas') {
    return props.activities
  }
  return props.activities.filter(a => a.priority === selectedFilter.value)
})

function getPriorityLabel(priority) {
  if (priority === 'alta') return 'Alta Prioridade'
  if (priority === 'media') return 'Média Prioridade'
  if (priority === 'baixa') return 'Baixa Prioridade'
  return 'Prioridade'
}

function getDisciplineTagClass(item) {
  const name = (item.parentName || '').toLowerCase()
  if (name.includes('banco') || name.includes('ia') || name.includes('inteligência')) {
    return 'tag-lime'
  }
  return 'tag-purple'
}

function getCustomDisciplineStyle(item) {
  if (item.parentColor && item.parentColor !== '#A184E5' && item.parentColor !== '#8366C5') {
    return {
      backgroundColor: `${item.parentColor}18`,
      color: item.parentColor
    }
  }
  return {}
}

function formatPrazo(dateStr) {
  if (!dateStr) return 'Sem prazo definido'
  const date = parseDate(dateStr)
  if (!date || isNaN(date.getTime())) return dateStr

  const day = String(date.getDate()).padStart(2, '0')
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const monthName = months[date.getMonth()]

  return `${day} de ${monthName}`
}

function toggleStatus(item) {
  const nextStatus = item.status === 'concluida' ? 'a_fazer' : 'concluida'
  emit('status-change', { id: item.id, status: nextStatus })
}
</script>

<style scoped>
.priority-board-section {
  width: 100%;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
}

.filter-pills-wrap {
  background: #FFFFFF;
  border-radius: var(--border-radius-pill);
  padding: 4px;
  border: 1px solid var(--color-border);
}

.btn-filter-pill {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  padding: 5px 16px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filter-pill:hover {
  color: var(--color-text-primary);
}

.btn-filter-pill.active {
  background-color: #6D48C5;
  color: #FFFFFF;
  font-weight: 700;
}

.priority-card-item {
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.priority-card-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

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

.tag-discipline {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: var(--border-radius-pill);
}

.tag-purple {
  background-color: #ECE8FA;
  color: #6D48C5;
}

.tag-lime {
  background-color: #EBF3CE;
  color: #55600c;
}

.tag-status {
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
  background-color: #FEF3C7;
  color: #D97706;
}

.tag-priority-baixa {
  background-color: #ECE8FA;
  color: #6D48C5;
}

.tag-completed {
  background-color: #EBF3CE;
  color: #55600c;
}

.activity-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.35;
}

.completed-text {
  text-decoration: line-through;
  color: #9CA3AF !important;
}

.activity-subtitle {
  font-size: 0.84rem;
  color: var(--color-text-muted);
}

.icon-calendar {
  font-size: 0.86rem;
}

.skeleton-checkbox {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-pill {
  width: 90px;
  height: 20px;
  border-radius: var(--border-radius-pill);
}

.skeleton-pill-sm {
  width: 100px;
  height: 20px;
  border-radius: var(--border-radius-pill);
}

.skeleton-row-title {
  height: 20px;
  width: 55%;
  border-radius: 4px;
}

.skeleton-row-subtitle {
  height: 14px;
  width: 140px;
  border-radius: 4px;
}
</style>
