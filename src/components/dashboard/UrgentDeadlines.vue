<template>
  <div class="study-card urgent-deadlines-card p-4 h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom-subtle">
      <div class="d-flex align-items-center gap-2">
        <div class="urgent-header-icon">
          <i class="bi bi-alarm-fill"></i>
        </div>
        <div>
          <h4 class="mb-0 text-primary">Prazos Iminentes</h4>
          <small class="text-muted">Atividades com entrega mais próxima</small>
        </div>
      </div>
      <router-link to="/disciplinas" class="small fw-bold text-decoration-none" style="color: #513490;">
        Ver todas
        <i class="bi bi-chevron-right ms-1"></i>
      </router-link>
    </div>

    <!-- Items List -->
    <div v-if="activities && activities.length > 0" class="urgent-list flex-grow-1 d-flex flex-column gap-2">
      <div 
        v-for="item in activities" 
        :key="item.id" 
        class="urgent-task-item p-3 d-flex align-items-center justify-content-between"
        :class="{ 'item-risk-border': isRisk(item) }"
      >
        <!-- Left: Quick check + Title + Discipline -->
        <div class="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
          <!-- Fast Complete Button -->
          <button 
            class="btn-fast-check flex-shrink-0" 
            :class="{ active: item.status === 'concluida' }"
            :title="item.status === 'concluida' ? 'Reabrir atividade' : 'Concluir atividade'"
            @click="$emit('status-change', { id: item.id, status: item.status === 'concluida' ? 'a_fazer' : 'concluida' })"
          >
            <i :class="item.status === 'concluida' ? 'bi bi-check2' : 'bi bi-circle'"></i>
          </button>

          <div class="min-w-0 flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span class="badge-parent-pill" :style="{ borderColor: item.parentColor, color: item.parentColor }">
                {{ item.parentName }}
              </span>
              <CategoryBadge :category="item.category" />
            </div>

            <div class="urgent-task-title text-truncate fw-bold" :class="{ 'text-decoration-line-through text-muted': item.status === 'concluida' }">
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- Right: Deadline indicator badge -->
        <div class="ms-3 flex-shrink-0 text-end">
          <div v-if="isRisk(item)" class="badge-risk">
            <i class="bi bi-exclamation-circle-fill me-1"></i>
            {{ formatDue(item) }}
          </div>
          <div v-else class="badge-normal-date">
            <i class="bi bi-calendar3 me-1"></i>
            {{ formatDate(item.dueDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-4 text-muted flex-grow-1 d-flex flex-column align-items-center justify-content-center">
      <i class="bi bi-check-circle-fill fs-2 mb-2" style="color: var(--color-accent-dark);"></i>
      <p class="mb-0 fw-semibold">Tudo em dia!</p>
      <small class="text-muted">Nenhuma atividade com prazo iminente no momento.</small>
    </div>
  </div>
</template>

<script setup>
import CategoryBadge from '../ui/CategoryBadge.vue'
import { formatDate, getDaysRemaining, isRiskZone, isOverdue } from '../../utils/dateUtils'

defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

defineEmits(['status-change'])

function isRisk(item) {
  return isRiskZone(item)
}

function formatDue(item) {
  if (isOverdue(item)) return 'Atrasada!'
  const days = getDaysRemaining(item.dueDate)
  if (days === 0) return 'Vence hoje!'
  if (days === 1) return 'Vence amanhã!'
  return `Em ${days} dias`
}
</script>

<style scoped>
.urgent-deadlines-card {
  background-color: var(--color-card-bg);
}

.urgent-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: var(--color-risk-light);
  color: var(--color-risk);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.urgent-task-item {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
}

.urgent-task-item:hover {
  border-color: #513490;
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.urgent-task-item.item-risk-border {
  border-left: 4px solid var(--color-risk);
}

.urgent-task-title {
  font-size: 0.92rem;
  color: var(--color-text-primary);
}

.badge-parent-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid;
  background-color: #fff;
}

.badge-normal-date {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: #F3F1E7;
  padding: 0.3rem 0.65rem;
  border-radius: var(--border-radius-pill);
}

.btn-fast-check {
  width: 32px;
  height: 32px;
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
