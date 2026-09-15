<template>
  <div class="discipline-form-page-wrapper">
    <!-- Underlying Page Content (blurred in background) matching Figma -->
    <div class="background-underlay" aria-hidden="true">
      <DisciplineList :is-background="true" />
    </div>

    <!-- Modal Backdrop Overlay with Blur matching Figma -->
    <div class="modal-backdrop-blur" @click.self="handleCancel">
      <!-- Modal Card -->
      <div class="modal-card p-4 p-sm-4.5">
        <!-- Header with Title & Close button -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2 class="modal-title mb-0">
            {{ isEditing ? 'Editar Disciplina' : 'Nova Disciplina' }}
          </h2>
          <button 
            type="button" 
            class="btn-close-modal" 
            title="Fechar"
            @click="handleCancel"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit">
          <!-- 1. Nome da disciplina -->
          <div class="form-group mb-3.5">
            <label class="form-label-figma">
              Nome da disciplina <span class="text-danger">*</span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              class="form-control-figma" 
              placeholder="Ex: Sistemas Distribuídos"
              required 
              autofocus
            />
          </div>

          <!-- 2. Professor responsável -->
          <div class="form-group mb-3.5">
            <label class="form-label-figma">
              Professor responsável
            </label>
            <input 
              v-model="form.professor" 
              type="text" 
              class="form-control-figma" 
              placeholder="Ex: Prof. Dr. Ricardo Santos"
            />
          </div>

          <!-- 3. Curso e Carga horária (Row) -->
          <div class="row g-3 mb-4">
            <!-- Curso -->
            <div class="col-sm-7">
              <label class="form-label-figma">Curso</label>
              <input 
                v-model="form.course" 
                type="text" 
                class="form-control-figma" 
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <!-- Carga horária -->
            <div class="col-sm-5">
              <label class="form-label-figma">Carga horária</label>
              <div class="input-with-suffix">
                <input 
                  v-model.number="form.workload" 
                  type="number" 
                  min="1" 
                  max="500" 
                  class="form-control-figma input-suffix-field" 
                  placeholder="72"
                />
                <span class="suffix-text">horas</span>
              </div>
            </div>
          </div>

          <!-- Footer Actions matching Figma -->
          <div class="d-flex align-items-center justify-content-end gap-3 pt-2">
            <button 
              type="button" 
              class="btn-cancel" 
              @click="handleCancel"
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              class="btn-figma-save"
            >
              <i class="bi bi-check-lg me-1"></i>
              <span>{{ isEditing ? 'Salvar Alterações' : 'Salvar Disciplina' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DisciplineList from './DisciplineList.vue'
import {
  getDisciplineById,
  getCachedDiscipline,
  saveDiscipline
} from '../services/api'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => Boolean(route.params.id))
const cached = route.params.id ? getCachedDiscipline(route.params.id) : null
const isLoading = ref(isEditing.value && !cached)

const form = ref({
  id: cached?.id || '',
  name: cached?.name || '',
  professor: cached?.professor || '',
  course: cached?.course || '',
  workload: cached?.workload || null,
  description: cached?.description || '',
  themeColor: cached?.themeColor || '#8366C5',
  illustration: cached?.illustration || 'desktop'
})

onMounted(async () => {
  if (isEditing.value) {
    try {
      const existing = await getDisciplineById(route.params.id)
      if (existing) {
        form.value = { ...existing }
      } else {
        router.push('/disciplinas')
      }
    } catch (err) {
      console.error('Erro ao carregar disciplina:', err)
      router.push('/disciplinas')
    } finally {
      isLoading.value = false
    }
  } else {
    // Mode Cadastro: Campos sem preenchimento
    form.value = {
      id: '',
      name: '',
      professor: '',
      course: '',
      workload: null,
      description: '',
      themeColor: '#8366C5',
      illustration: 'desktop'
    }
    isLoading.value = false
  }
})

function handleCancel() {
  if (isEditing.value && form.value.id) {
    router.push(`/disciplinas/${form.value.id}`)
  } else {
    router.push('/disciplinas')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) return

  try {
    const saved = await saveDiscipline({
      ...form.value,
      workload: form.value.workload ? Number(form.value.workload) : 60
    })

    router.push(`/disciplinas/${saved.id || form.value.id}`)
  } catch (err) {
    console.error('Erro ao salvar disciplina:', err)
  }
}
</script>

<style scoped>
.discipline-form-page-wrapper {
  position: relative;
  min-height: 100vh;
}

/* Background Underlay (blurred) */
.background-underlay {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
  opacity: 0.85;
}

/* Backdrop Overlay with Blur matching Figma Frame 9:1126 */
.modal-backdrop-blur {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(46, 42, 39, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: backdropFade 0.2s ease;
}

@keyframes backdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Card */
.modal-card {
  width: 100%;
  max-width: 600px;
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.btn-close-modal {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #71717A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background-color: #F4F4F5;
  color: #363636;
}

.form-label-figma {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.4rem;
}

.form-control-figma {
  width: 100%;
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.94rem;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control-figma:focus {
  background-color: #FFFFFF;
  border-color: #8366C5;
  box-shadow: 0 0 0 3px rgba(131, 102, 197, 0.15);
}

.form-control-figma::placeholder {
  color: #A1A1AA;
}

/* Suffix wrapper for Carga Horária */
.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-suffix-field {
  padding-right: 52px !important;
}

.suffix-text {
  position: absolute;
  right: 14px;
  color: #71717A;
  font-size: 0.88rem;
  pointer-events: none;
}

/* Action Buttons */
.btn-cancel {
  background: transparent;
  border: none;
  color: #52525B;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  border-radius: var(--border-radius-pill);
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #F4F4F5;
  color: #363636;
}

.btn-figma-save {
  background-color: #C2D039;
  color: #363636;
  border: none;
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.65rem 1.45rem;
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-figma-save:hover {
  background-color: #AFC026;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(194, 208, 57, 0.35);
}
</style>
