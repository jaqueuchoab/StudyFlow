<template>
  <div class="task-filters-container mb-4">
    <!-- Top row: Search input + quick stats -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <!-- Search bar with icon inspired by header in mockup -->
      <div class="search-box-wrapper flex-grow-1" style="max-width: 360px;">
        <i class="bi bi-search search-icon"></i>
        <input 
          type="text" 
          class="form-control form-control-search" 
          placeholder="Buscar atividades..."
          :value="modelValue.search"
          @input="updateFilter('search', $event.target.value)"
        />
        <button 
          v-if="modelValue.search" 
          class="btn-clear-search" 
          @click="updateFilter('search', '')"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="text-secondary small fw-bold">
          {{ totalCount }} {{ totalCount === 1 ? 'atividade' : 'atividades' }}
        </span>
        <button 
          v-if="hasActiveFilters" 
          class="btn btn-sm btn-link text-decoration-none text-muted py-0"
          @click="resetFilters"
        >
          <i class="bi bi-arrow-counterclockwise me-1"></i>Limpar filtros
        </button>
      </div>
    </div>

    <!-- Filter Pills Row inspired by "Filter by: Time, Level, Language, Type" -->
    <div class="filter-bar">
      <span class="filter-label">
        <i class="bi bi-funnel-fill me-1 text-primary"></i>Filtrar por:
      </span>

      <!-- Status Filter Dropdown / Pill -->
      <div class="dropdown">
        <button 
          class="filter-pill dropdown-toggle" 
          :class="{ active: modelValue.status !== 'all' }" 
          type="button" 
          data-bs-toggle="dropdown"
        >
          <span class="status-dot progress me-1" v-if="modelValue.status === 'em_andamento'"></span>
          <span class="status-dot done me-1" v-else-if="modelValue.status === 'concluida'"></span>
          <span>Situação: <strong>{{ statusLabel }}</strong></span>
        </button>
        <ul class="dropdown-menu shadow-sm border-0">
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('status', 'all')">Todas as situações</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('status', 'a_fazer')">A Fazer</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('status', 'em_andamento')">Em Andamento</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('status', 'concluida')">Concluídas</a></li>
        </ul>
      </div>

      <!-- Priority Filter Dropdown / Pill -->
      <div class="dropdown">
        <button 
          class="filter-pill dropdown-toggle" 
          :class="{ active: modelValue.priority !== 'all' }" 
          type="button" 
          data-bs-toggle="dropdown"
        >
          <span>Prioridade: <strong>{{ priorityLabel }}</strong></span>
        </button>
        <ul class="dropdown-menu shadow-sm border-0">
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('priority', 'all')">Todas as prioridades</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" @click.prevent="updateFilter('priority', 'alta')">Alta</a></li>
          <li><a class="dropdown-item text-warning" href="#" @click.prevent="updateFilter('priority', 'media')">Média</a></li>
          <li><a class="dropdown-item text-purple-deep" href="#" @click.prevent="updateFilter('priority', 'baixa')">Baixa</a></li>
        </ul>
      </div>

      <!-- Category Filter Dropdown / Pill -->
      <div class="dropdown">
        <button 
          class="filter-pill dropdown-toggle" 
          :class="{ active: modelValue.category !== 'all' }" 
          type="button" 
          data-bs-toggle="dropdown"
        >
          <span>Categoria: <strong>{{ categoryLabel }}</strong></span>
        </button>
        <ul class="dropdown-menu shadow-sm border-0">
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'all')">Todas as categorias</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'prova')">Prova</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'trabalho_avaliativo')">Trabalho Avaliativo</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'seminario')">Seminário</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'atividade_pontual')">Atividade Pontual</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="updateFilter('category', 'revisao')">Revisão</a></li>
        </ul>
      </div>

      <!-- Quick Filter for Risk Zone -->
      <button 
        class="filter-pill" 
        :class="{ active: modelValue.onlyRisk }"
        @click="updateFilter('onlyRisk', !modelValue.onlyRisk)"
      >
        <i class="bi bi-exclamation-triangle-fill text-danger me-1"></i>
        <span>Zona de Risco (≤ 3 dias)</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      onlyRisk: false
    })
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

function updateFilter(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

function resetFilters() {
  emit('update:modelValue', {
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    onlyRisk: false
  })
}

const hasActiveFilters = computed(() => {
  return (
    props.modelValue.search !== '' ||
    props.modelValue.status !== 'all' ||
    props.modelValue.priority !== 'all' ||
    props.modelValue.category !== 'all' ||
    props.modelValue.onlyRisk === true
  )
})

const statusLabel = computed(() => {
  const map = {
    all: 'Todas',
    a_fazer: 'A Fazer',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída'
  }
  return map[props.modelValue.status] || 'Todas'
})

const priorityLabel = computed(() => {
  const map = {
    all: 'Todas',
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  }
  return map[props.modelValue.priority] || 'Todas'
})

const categoryLabel = computed(() => {
  const map = {
    all: 'Todas',
    prova: 'Prova',
    trabalho_avaliativo: 'Trabalho',
    seminario: 'Seminário',
    atividade_pontual: 'Atividade',
    revisao: 'Revisão'
  }
  return map[props.modelValue.category] || 'Todas'
})
</script>

<style scoped>
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
  font-size: 0.88rem !important;
}

.form-control-search:focus {
  border-color: var(--color-primary) !important;
  background-color: #fff !important;
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

.dropdown-menu {
  border-radius: var(--border-radius-sm);
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border) !important;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  color: var(--color-text-primary);
}

.dropdown-item:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.text-purple-deep {
  color: #513490 !important;
  font-weight: 600;
}
</style>
