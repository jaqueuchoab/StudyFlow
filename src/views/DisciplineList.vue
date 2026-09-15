<template>
  <div class="disciplines-view pb-5">
    <!-- Top Header & Search/Filters matching Figma -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <h1 class="page-title mb-0">Minhas Disciplinas</h1>

      <!-- Right side: Search Box + Sort Pills -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- Search Input -->
        <div class="search-input-wrap">
          <i class="bi bi-search search-icon"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control-figma-search" 
            placeholder="Pesquisar por nome..." 
          />
        </div>

        <!-- Sort / Filter Pills matching Figma -->
        <div class="sort-pills-wrap d-flex align-items-center gap-1">
          <button 
            class="btn-sort-pill" 
            :class="{ active: sortBy === 'pending' }" 
            @click="sortBy = 'pending'"
          >
            Mais Pendências
          </button>
          <button 
            class="btn-sort-pill" 
            :class="{ active: sortBy === 'total' }" 
            @click="sortBy = 'total'"
          >
            Mais Atividades
          </button>
        </div>
      </div>
    </div>

    <!-- 3-Column Grid matching Figma -->
    <div class="row g-4">
      <!-- Skeleton Loading Cards -->
      <template v-if="isLoading">
        <div v-for="n in 5" :key="n" class="col-12 col-md-6 col-lg-4">
          <div class="discipline-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="skeleton-shimmer skeleton-workload-badge"></div>
              </div>
              <div class="skeleton-shimmer skeleton-disc-title mb-2"></div>
              <div class="skeleton-shimmer skeleton-disc-prof mb-4"></div>
            </div>
            <div class="card-footer-action pt-3 border-top-subtle d-flex justify-content-end">
              <div class="skeleton-shimmer skeleton-link-action"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Discipline Cards -->
      <template v-else>
        <div 
          v-for="disc in filteredDisciplines" 
          :key="disc.id" 
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="discipline-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <!-- Badges: Workload & Pendências -->
              <div class="d-flex align-items-center gap-2 mb-3">
                <span class="badge-workload">
                  <i class="bi bi-clock me-1"></i>
                  {{ disc.workload }}h
                </span>
                <span v-if="disc.pendingActivities > 0" class="badge-pending-pill">
                  <i class="bi bi-list-check me-1"></i>
                  {{ disc.pendingActivities }} {{ disc.pendingActivities === 1 ? 'pendência' : 'pendências' }}
                </span>
              </div>

              <!-- Discipline Title -->
              <h3 class="discipline-name mb-2 text-truncate" :title="disc.name">
                {{ disc.name }}
              </h3>

              <!-- Professor Line -->
              <div class="discipline-professor mb-4 d-flex align-items-center gap-2 text-muted">
                <i class="bi bi-person"></i>
                <span>{{ disc.professor || 'Sem professor informado' }}</span>
              </div>
            </div>

            <!-- Divider & Footer Link -->
            <div class="card-footer-action pt-3 border-top-subtle d-flex justify-content-end align-items-center">
              <router-link :to="'/disciplinas/' + disc.id" class="link-access-details">
                Acessar detalhes
                <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <!-- Add New Discipline Card (Dashed border) matching Figma -->
      <div class="col-12 col-md-6 col-lg-4">
        <div 
          class="add-discipline-card p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
          @click="$router.push('/disciplinas/nova')"
          role="button"
          tabindex="0"
        >
          <div class="add-icon-circle mb-3">
            <i class="bi bi-plus-lg"></i>
          </div>
          <h4 class="add-card-title mb-1">Adicionar Matéria</h4>
          <p class="add-card-subtitle text-muted mb-0 small">Cadastre uma nova disciplina</p>
        </div>
      </div>
    </div>

    <!-- Empty search result fallback -->
    <div v-if="!isLoading && filteredDisciplines.length === 0 && searchQuery" class="text-center py-5">
      <i class="bi bi-search fs-1 text-muted d-block mb-3"></i>
      <h5 class="fw-bold">Nenhuma disciplina encontrada</h5>
      <p class="text-muted">Não encontramos nenhuma disciplina com o termo "{{ searchQuery }}".</p>
      <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="searchQuery = ''">
        Limpar busca
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDisciplinesWithMetrics } from '../services/api'

const disciplines = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const sortBy = ref('pending') // 'pending' | 'total'

async function loadData() {
  try {
    disciplines.value = await getDisciplinesWithMetrics()
  } catch (err) {
    console.error('Erro ao carregar disciplinas:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredDisciplines = computed(() => {
  let list = [...disciplines.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) ||
      (d.professor && d.professor.toLowerCase().includes(q)) ||
      (d.course && d.course.toLowerCase().includes(q))
    )
  }

  if (sortBy.value === 'pending') {
    list.sort((a, b) => {
      const diff = (b.pendingActivities || 0) - (a.pendingActivities || 0)
      if (diff !== 0) return diff
      const diffTotal = (b.totalActivities || 0) - (a.totalActivities || 0)
      if (diffTotal !== 0) return diffTotal
      return (a.name || '').localeCompare(b.name || '')
    })
  } else if (sortBy.value === 'total') {
    list.sort((a, b) => {
      const diff = (b.totalActivities || 0) - (a.totalActivities || 0)
      if (diff !== 0) return diff
      return (b.pendingActivities || 0) - (a.pendingActivities || 0)
    })
  }

  return list
})
</script>

<style scoped>
.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
}

/* Search Box matching Figma */
.search-input-wrap {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  font-size: 0.88rem;
  pointer-events: none;
}

.form-control-figma-search {
  width: 100%;
  height: 38px;
  background-color: #FFFFFF !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--border-radius-pill) !important;
  padding-left: 36px !important;
  padding-right: 14px !important;
  font-size: 0.85rem !important;
  color: var(--color-text-primary) !important;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control-figma-search:focus {
  border-color: #8366C5 !important;
  box-shadow: 0 0 0 3px rgba(131, 102, 197, 0.15) !important;
}

/* Sort Pills matching Figma */
.sort-pills-wrap {
  background: #FFFFFF;
  border-radius: var(--border-radius-pill);
  padding: 3px;
  border: 1px solid var(--color-border);
}

.btn-sort-pill {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  padding: 5px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sort-pill:hover {
  color: var(--color-text-primary);
}

.btn-sort-pill.active {
  background-color: #ECE8FA;
  color: #6D48C5;
  font-weight: 700;
}

/* Discipline Card matching Figma */
.discipline-card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-sm);
  min-height: 220px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.discipline-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.badge-workload {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.7rem;
  border-radius: var(--border-radius-pill);
  display: inline-flex;
  align-items: center;
}

.badge-pending-pill {
  font-size: 0.76rem;
  font-weight: 700;
  color: #DC2626;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  padding: 0.25rem 0.65rem;
  border-radius: var(--border-radius-pill);
  display: inline-flex;
  align-items: center;
}

.discipline-name {
  font-size: 1.28rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1.25;
}

.discipline-professor {
  font-size: 0.88rem;
}

.border-top-subtle {
  border-top: 1px solid var(--color-border);
}

.link-access-details {
  color: #6D48C5;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.link-access-details:hover {
  color: #513490;
  transform: translateX(2px);
}

/* Add Discipline Card (Dashed Border) */
.add-discipline-card {
  background-color: rgba(255, 255, 255, 0.45);
  border: 1.5px dashed #D6D2C4;
  border-radius: var(--border-radius-card);
  min-height: 220px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-discipline-card:hover {
  background-color: rgba(255, 255, 255, 0.85);
  border-color: #8366C5;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.add-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(131, 102, 197, 0.1);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  transition: transform 0.2s ease;
}

.add-discipline-card:hover .add-icon-circle {
  transform: scale(1.15);
  color: #8366C5;
}

.add-card-title {
  font-size: 1.12rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.add-card-subtitle {
  color: var(--color-text-muted);
}

.skeleton-workload-badge {
  width: 55px;
  height: 24px;
  border-radius: var(--border-radius-pill);
}

.skeleton-disc-title {
  height: 24px;
  width: 80%;
  border-radius: 6px;
}

.skeleton-disc-prof {
  height: 16px;
  width: 60%;
  border-radius: 4px;
}

.skeleton-link-action {
  height: 16px;
  width: 110px;
  border-radius: 4px;
}
</style>
