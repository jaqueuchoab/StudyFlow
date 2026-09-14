<template>
  <div :class="['study-card task-card p-3 p-md-4 mb-3', { 'task-completed': isCompleted, 'task-risk': isRisk }]">
    <div class="d-flex align-items-start gap-3">
      <!-- Status Toggle Button -->
      <button 
        class="btn-status-toggle mt-1" 
        :class="statusClass"
        :title="statusTooltip"
        @click="toggleStatus"
      >
        <i v-if="activity.status === 'concluida'" class="bi bi-check-lg"></i>
        <i v-else-if="activity.status === 'em_andamento'" class="bi bi-play-fill"></i>
        <i v-else class="bi bi-circle"></i>
      </button>

      <!-- Task Details -->
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
          <!-- Category Badge -->
          <CategoryBadge :category="activity.category" />

          <!-- Priority Badge -->
          <span :class="['badge-priority', priorityClass]">
            <i class="bi bi-flag-fill me-1"></i>
            {{ priorityLabel }}
          </span>

          <!-- Due Date & Risk Alert (only when not completed) -->
          <span v-if="isRisk && !isCompleted" class="badge-risk">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ riskLabel }}
          </span>
          <span v-else-if="activity.dueDate && !isCompleted" class="badge-due-date">
            <i class="bi bi-calendar-event me-1"></i>
            {{ formattedDate }}
          </span>

          <!-- Parent Context (if on dashboard) -->
          <span v-if="parentName" class="badge-parent ms-auto" :style="{ borderColor: parentColor, color: parentColor }">
            <i class="bi bi-book-half me-1"></i>
            {{ parentName }}
          </span>
        </div>

        <h5 :class="['task-title mb-1', { 'text-decoration-line-through text-muted': isCompleted }]">
          {{ activity.name }}
        </h5>

        <p v-if="activity.description" class="task-desc mb-2 text-muted">
          {{ activity.description }}
        </p>

        <!-- Status selector for quick choice -->
        <div class="d-flex align-items-center justify-content-between mt-2 pt-2 border-top-subtle">
          <div class="d-flex align-items-center gap-2">
            <span class="text-secondary small fw-semibold">Situação:</span>
            <select 
              class="form-select form-select-sm status-select py-1 px-2" 
              :value="activity.status" 
              @change="onSelectStatus($event.target.value)"
            >
              <option value="a_fazer">A Fazer</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>

          <!-- Actions: Edit & Delete -->
          <div class="d-flex align-items-center gap-2">
            <button 
              class="btn-icon-action" 
              title="Editar atividade" 
              @click="$emit('edit', activity)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="btn-icon-action text-danger-subtle" 
              title="Excluir atividade" 
              @click="$emit('delete', activity.id)"
            >
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBadge from '../ui/CategoryBadge.vue'
import { formatDate, getDaysRemaining, isRiskZone, isOverdue } from '../../utils/dateUtils'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  parentName: {
    type: String,
    default: ''
  },
  parentColor: {
    type: String,
    default: '#A184E5'
  }
})

const emit = defineEmits(['edit', 'delete', 'status-change'])

const isCompleted = computed(() => props.activity.status === 'concluida')
const isRisk = computed(() => isRiskZone(props.activity))

const formattedDate = computed(() => formatDate(props.activity.dueDate))

const riskLabel = computed(() => {
  if (isOverdue(props.activity)) return 'Atrasada!'
  const days = getDaysRemaining(props.activity.dueDate)
  if (days === 0) return 'Vence hoje!'
  if (days === 1) return 'Vence amanhã!'
  return `Vence em ${days} dias`
})

const priorityLabel = computed(() => {
  const map = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
  return map[props.activity.priority] || 'Normal'
})

const priorityClass = computed(() => {
  return `priority-${props.activity.priority || 'baixa'}`
})

const statusClass = computed(() => {
  if (props.activity.status === 'concluida') return 'status-done'
  if (props.activity.status === 'em_andamento') return 'status-progress'
  return 'status-todo'
})

const statusTooltip = computed(() => {
  if (props.activity.status === 'concluida') return 'Concluída (clique para reabrir)'
  if (props.activity.status === 'em_andamento') return 'Em andamento (clique para concluir)'
  return 'A fazer (clique para iniciar)'
})

function toggleStatus() {
  let nextStatus = 'em_andamento'
  if (props.activity.status === 'a_fazer') nextStatus = 'em_andamento'
  else if (props.activity.status === 'em_andamento') nextStatus = 'concluida'
  else if (props.activity.status === 'concluida') nextStatus = 'a_fazer'

  emit('status-change', { id: props.activity.id, status: nextStatus })
}

function onSelectStatus(status) {
  emit('status-change', { id: props.activity.id, status })
}
</script>

<style scoped>
.task-card {
  border-left: 5px solid var(--color-primary);
  background-color: var(--color-card-bg);
}

.task-card.task-risk {
  border-left-color: var(--color-risk);
  background: linear-gradient(90deg, rgba(224, 109, 83, 0.05) 0%, var(--color-card-bg) 30%);
}

.task-card.task-completed {
  border-left-color: var(--color-accent);
  opacity: 0.85;
}

.btn-status-toggle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-status-toggle.status-todo {
  color: var(--color-text-muted);
}
.btn-status-toggle.status-todo:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-status-toggle.status-progress {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.btn-status-toggle.status-done {
  border-color: var(--color-accent);
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(194, 208, 57, 0.4);
}

.task-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.task-desc {
  font-size: 0.88rem;
  line-height: 1.45;
}

.badge-priority {
  padding: 0.3rem 0.65rem;
  border-radius: var(--border-radius-pill);
  font-size: 0.74rem;
  font-weight: 700;
}

.priority-alta {
  background-color: #FEEEEE;
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.priority-media {
  background-color: #FEF9EB;
  color: #D97706;
  border: 1px solid rgba(217, 119, 6, 0.25);
}

.priority-baixa {
  background-color: rgba(81, 52, 144, 0.1);
  color: #513490;
  border: 1px solid rgba(81, 52, 144, 0.25);
}

.badge-due-date {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: #F3F1E7;
  padding: 0.3rem 0.65rem;
  border-radius: var(--border-radius-pill);
}

.badge-parent {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid;
  background: #fff;
}

.status-select {
  width: auto;
  border-radius: var(--border-radius-pill) !important;
  font-size: 0.8rem !important;
  font-weight: 600;
}

.border-top-subtle {
  border-top: 1px solid var(--color-border-subtle);
}

.btn-icon-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
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
  border-color: var(--color-border);
}

.btn-icon-action.text-danger-subtle:hover {
  background-color: #FEEEEE;
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.2);
}
</style>
