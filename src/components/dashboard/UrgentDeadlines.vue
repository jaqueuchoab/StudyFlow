<template>
  <div class="risk-zone-section d-flex flex-column h-100">
    <!-- Header matching Figma -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="section-title mb-0">Zona de Risco</h3>
      <span class="badge-priority-alert">Atenção Prioritária</span>
    </div>

    <!-- 2 Cards Side-by-Side matching Figma -->
    <div v-if="criticalActivities.length > 0" class="row g-3 flex-grow-1">
      <div 
        v-for="item in criticalActivities" 
        :key="item.id" 
        class="col-md-6 d-flex"
      >
        <div class="risk-card p-3 p-xl-4 h-100 w-100 d-flex flex-column justify-content-between">
          <div>
            <!-- Tags row: Discipline + Urgency -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span 
                class="tag-discipline"
                :class="getDisciplineTagClass(item)"
                :style="getCustomDisciplineStyle(item)"
              >
                {{ item.parentName }}
              </span>

              <span class="tag-urgency">
                <i class="bi bi-clock me-1"></i>
                {{ formatUrgency(item) }}
              </span>
            </div>

            <!-- Title -->
            <h4 class="risk-card-title mb-2 text-truncate" :title="item.name">
              {{ item.name }}
            </h4>

            <!-- Description / Snippet -->
            <p class="risk-card-desc mb-3">
              {{ item.description || 'Nenhuma descrição informada para esta atividade acadêmica.' }}
            </p>
          </div>

          <!-- Footer: Date & Time -->
          <div class="risk-card-footer pt-2 border-top-subtle d-flex align-items-center text-muted small">
            <i class="bi bi-calendar3 me-2"></i>
            <span>{{ formatDateTime(item) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="risk-card p-4 text-center text-muted">
      <i class="bi bi-shield-check text-success fs-2 mb-2 d-block"></i>
      <h6 class="fw-bold mb-1 text-dark">Nenhum prazo crítico no momento!</h6>
      <p class="small mb-0">Você não tem entregas nos próximos 3 dias. Bom trabalho!</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDaysRemaining, parseDate, isOverdue } from '../../utils/dateUtils'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

const criticalActivities = computed(() => {
  // Show up to 2 top critical items (matching Figma 2 cards)
  return props.activities.slice(0, 2)
})

function formatUrgency(item) {
  if (isOverdue(item)) return 'Atrasada'
  const days = getDaysRemaining(item.dueDate)
  if (days === 0) return 'Entrega hoje'
  if (days === 1) return 'Entrega amanhã'
  return `Entrega em ${days} dias`
}

function getDisciplineTagClass(item) {
  const name = (item.parentName || '').toLowerCase()
  if (name.includes('inteligência') || name.includes('ia') || name.includes('banco')) {
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

function formatDateTime(item) {
  if (!item.dueDate) return 'Sem prazo definido'
  const date = parseDate(item.dueDate)
  if (!date || isNaN(date.getTime())) return item.dueDate

  const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const weekDay = weekDays[date.getDay()]
  
  // Example default or mock hour for university assignments
  return `${weekDay}, 23:59`
}
</script>

<style scoped>
.risk-zone-section {
  width: 100%;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.badge-priority-alert {
  font-size: 0.78rem;
  font-weight: 700;
  color: #DC2626;
  background-color: #FEE2E2;
  padding: 0.3rem 0.8rem;
  border-radius: var(--border-radius-pill);
}

.risk-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.risk-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tag-discipline {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-pill);
}

.tag-lime {
  background-color: #EBF3CE;
  color: #55600c;
}

.tag-purple {
  background-color: #ECE8FA;
  color: #6D48C5;
}

.tag-urgency {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-pill);
  background-color: #FEE2E2;
  color: #EA580C;
}

.risk-card-title {
  font-size: 1.08rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.risk-card-desc {
  font-size: 0.86rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.risk-card-footer {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.border-top-subtle {
  border-top: 1px solid var(--color-border);
}
</style>
