<template>
  <div class="study-card priority-board p-4 h-100">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom-subtle">
      <div class="d-flex align-items-center gap-2">
        <div class="priority-header-icon">
          <i class="bi bi-lightning-charge-fill"></i>
        </div>
        <div>
          <h4 class="mb-0 text-primary">Quadro de Prioridades</h4>
          <small class="text-muted">Cruzamento inteligente de prazo iminente e prioridade de entrega</small>
        </div>
      </div>
      <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
        Top {{ displayedActivities.length }} urgentes
      </span>
    </div>

    <div v-if="displayedActivities.length > 0" class="priority-list">
      <div 
        v-for="(item, index) in displayedActivities" 
        :key="item.id" 
        class="priority-item d-flex align-items-center justify-content-between p-3 mb-2"
        :class="{ 'item-risk': isRisk(item), 'item-done': item.status === 'concluida' }"
      >
        <!-- Left: Rank index + Title & Details -->
        <div class="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
          <div class="rank-badge" :class="'rank-' + (index + 1)">
            #{{ index + 1 }}
          </div>

          <div class="min-w-0 flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span class="badge-parent-pill" :style="{ borderColor: item.parentColor, color: item.parentColor }">
                {{ item.parentName }}
              </span>
              <CategoryBadge :category="item.category" />
              <span :class="['badge-priority-sm', 'priority-' + item.priority]">
                {{ item.priority.toUpperCase() }}
              </span>
            </div>
            <div class="priority-title text-truncate fw-bold" :class="{ 'text-decoration-line-through text-muted': item.status === 'concluida' }">
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- Right: Due date & status action -->
        <div class="d-flex align-items-center gap-3 ms-3 flex-shrink-0">
          <div class="text-end d-none d-sm-block">
            <div v-if="isRisk(item)" class="badge-risk">
              <i class="bi bi-alarm me-1"></i>
              {{ formatDue(item) }}
            </div>
            <div v-else class="text-muted small fw-semibold">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatDate(item.dueDate) }}
            </div>
          </div>

          <!-- Fast status toggle -->
          <button 
            class="btn-fast-check" 
            :class="{ active: item.status === 'concluida' }" 
            :title="item.status === 'concluida' ? 'Reabrir' : 'Concluir atividade'"
            @click="toggleStatus(item)"
          >
            <i :class="item.status === 'concluida' ? 'bi bi-check2' : 'bi bi-circle'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-4 text-muted">
      <i class="bi bi-emoji-smile fs-2 text-primary d-block mb-2"></i>
      <p class="mb-0">Tudo em dia! Nenhuma atividade pendente no momento.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBadge from '../ui/CategoryBadge.vue'
import { formatDate, getDaysRemaining, isRiskZone, isOverdue } from '../../utils/dateUtils'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['status-change'])

const displayedActivities = computed(() => {
  // Show pending first, then top N
  return props.activities.slice(0, props.limit)
})

function isRisk(item) {
  return isRiskZone(item)
}

function formatDue(item) {
  if (isOverdue(item)) return 'Atrasada!'
  const days = getDaysRemaining(item.dueDate)
  if (days === 0) return 'Hoje!'
  if (days === 1) return 'Amanhã!'
  return `${days} dias`
}

function toggleStatus(item) {
  const nextStatus = item.status === 'concluida' ? 'a_fazer' : 'concluida'
  emit('status-change', { id: item.id, status: nextStatus })
}
</script>

<style scoped>
.priority-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.priority-item {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
}

.priority-item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.priority-item.item-risk {
  border-left: 4px solid var(--color-risk);
  background: linear-gradient(90deg, rgba(224, 109, 83, 0.04) 0%, #fff 30%);
}

.priority-item.item-done {
  opacity: 0.65;
  border-left: 4px solid var(--color-accent);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 800;
  flex-shrink: 0;
}

.rank-1 {
  background-color: #FEEEEE;
  color: #EF4444;
}

.rank-2 {
  background-color: #FEF9EB;
  color: #D97706;
}

.rank-3 {
  background-color: var(--color-accent-light);
  color: #55600c;
}

.priority-title {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.badge-parent-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid;
  background-color: #fff;
}

.badge-priority-sm {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius-pill);
}

.priority-alta {
  background-color: #FEEEEE;
  color: #EF4444;
}
.priority-media {
  background-color: #FEF9EB;
  color: #D97706;
}
.priority-baixa {
  background-color: rgba(81, 52, 144, 0.1);
  color: #513490;
}

.btn-fast-check {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: #fff;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-fast-check:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-dark);
}

.btn-fast-check.active {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-text-primary);
}

.border-bottom-subtle {
  border-bottom: 1px solid var(--color-border-subtle);
}
</style>
