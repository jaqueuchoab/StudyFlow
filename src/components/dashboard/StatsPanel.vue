<template>
  <div class="row g-3 mb-4">
    <!-- Card: Total Disciplinas -->
    <div class="col-sm-6 col-xl-3">
      <div class="study-card stat-card p-3 p-xl-4 h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="stat-label">Disciplinas</span>
          <div class="stat-icon-circle bg-primary-light text-primary">
            <i class="bi bi-book-half"></i>
          </div>
        </div>
        <div class="stat-value">{{ stats.totalDisciplines }}</div>
        <div class="stat-caption text-muted">
          <i class="bi bi-check2-circle text-success me-1"></i>Matérias ativas
        </div>
      </div>
    </div>

    <!-- Card: Atividades Pendentes -->
    <div class="col-sm-6 col-xl-3">
      <div class="study-card stat-card p-3 p-xl-4 h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="stat-label">Pendentes</span>
          <div class="stat-icon-circle bg-warning-light text-warning">
            <i class="bi bi-hourglass-split"></i>
          </div>
        </div>
        <div class="stat-value">{{ stats.pendingCount }}</div>
        <div class="stat-caption text-muted">
          A fazer ou em andamento
        </div>
      </div>
    </div>

    <!-- Card: Zona de Risco (Spec: <= 3 dias) -->
    <div class="col-sm-6 col-xl-3">
      <div :class="['study-card stat-card p-3 p-xl-4 h-100', { 'border-risk': stats.riskCount > 0 }]">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="stat-label text-danger-emphasis">Zona de Risco</span>
          <div class="stat-icon-circle bg-risk-light text-risk">
            <i class="bi bi-exclamation-octagon-fill"></i>
          </div>
        </div>
        <div class="stat-value text-risk">{{ stats.riskCount }}</div>
        <div class="stat-caption text-muted">
          <span v-if="stats.riskCount > 0" class="badge-risk py-0 px-2">
            Prazo em até 3 dias!
          </span>
          <span v-else class="text-success">
            Nenhuma atividade crítica
          </span>
        </div>
      </div>
    </div>

    <!-- Card: Concluídas -->
    <div class="col-sm-6 col-xl-3">
      <div class="study-card stat-card p-3 p-xl-4 h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="stat-label">Concluídas</span>
          <div class="stat-icon-circle bg-accent-light text-accent-dark">
            <i class="bi bi-trophy-fill"></i>
          </div>
        </div>
        <div class="stat-value">{{ stats.completedCount }}</div>
        <div class="stat-caption text-muted">
          Entregas realizadas
        </div>
      </div>
    </div>
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
  }
})
</script>

<style scoped>
.stat-card {
  border-radius: var(--border-radius-card);
  transition: all 0.2s ease;
}

.stat-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.bg-primary-light { background-color: rgba(81, 52, 144, 0.12); color: #513490 !important; }
.bg-warning-light { background-color: #FEF9EB; color: #D97706 !important; }
.bg-risk-light { background-color: var(--color-risk-light); }
.bg-accent-light { background-color: var(--color-accent-light); }

.text-risk { color: var(--color-risk) !important; }
.text-accent-dark { color: #55600c !important; }

.border-risk {
  border-color: rgba(224, 109, 83, 0.45) !important;
  box-shadow: 0 4px 16px rgba(224, 109, 83, 0.12) !important;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.1;
  margin-bottom: 0.35rem;
}

.stat-caption {
  font-size: 0.82rem;
  display: flex;
  align-items: center;
}
</style>
