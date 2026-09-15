<template>
  <div class="stats-panel-vertical d-flex flex-column justify-content-between h-100 gap-3">
    <!-- Skeleton State -->
    <template v-if="isLoading">
      <div v-for="n in 3" :key="n" class="stat-card p-3 d-flex align-items-center gap-3">
        <div class="skeleton-shimmer skeleton-icon"></div>
        <div class="d-flex align-items-center gap-2 flex-grow-1">
          <div class="skeleton-shimmer skeleton-number"></div>
          <div class="skeleton-shimmer skeleton-label"></div>
        </div>
      </div>
    </template>

    <!-- Normal Loaded State -->
    <template v-else>
      <!-- Card 1: Disciplinas Ativas -->
      <div class="stat-card p-3 d-flex align-items-center gap-3">
        <div class="stat-icon-wrap icon-purple">
          <i class="bi bi-book-half"></i>
        </div>
        <div class="d-flex align-items-baseline gap-2">
          <span class="stat-number">{{ stats.totalDisciplines || 0 }}</span>
          <span class="stat-text">Disciplinas ativas</span>
        </div>
      </div>

      <!-- Card 2: A Fazer -->
      <div class="stat-card p-3 d-flex align-items-center gap-3">
        <div class="stat-icon-wrap icon-orange">
          <i class="bi bi-calendar-event"></i>
        </div>
        <div class="d-flex align-items-baseline gap-2">
          <span class="stat-number">{{ stats.pendingCount || 0 }}</span>
          <span class="stat-text">A fazer</span>
        </div>
      </div>

      <!-- Card 3: Concluídas no mês -->
      <div class="stat-card p-3 d-flex align-items-center gap-3">
        <div class="stat-icon-wrap icon-green">
          <i class="bi bi-check2"></i>
        </div>
        <div class="d-flex align-items-baseline gap-2">
          <span class="stat-number">{{ stats.completedCount || 0 }}</span>
          <span class="stat-text">Concluídas no mês</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({
      totalDisciplines: 0,
      totalActivities: 0,
      pendingCount: 0,
      completedCount: 0,
      riskCount: 0
    })
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.skeleton-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-number {
  width: 32px;
  height: 28px;
  border-radius: 6px;
}

.skeleton-label {
  width: 120px;
  height: 18px;
  border-radius: 4px;
}

.stats-panel-vertical {
  width: 100%;
  height: 100%;
}

.stat-card {
  flex: 1;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.icon-purple {
  background-color: #ECE8FA;
  color: #8366C5;
}

.icon-orange {
  background-color: #FEE2E2;
  color: #EA580C;
}

.icon-green {
  background-color: #E6F4EA;
  color: #16A34A;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-text {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}
</style>
