<template>
  <div 
    v-if="isOpen" 
    class="modal-backdrop-blur" 
    @click.self="close"
  >
    <div class="modal-card p-4 p-sm-4.5">
      <!-- Header with Title, Subtitle & Close button -->
      <div class="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h2 class="modal-title mb-1">
            {{ modalTitle }}
          </h2>
          <p class="modal-subtitle mb-0">
            {{ modalSubtitle }}
          </p>
        </div>
        <button 
          type="button" 
          class="btn-close-modal" 
          title="Fechar"
          @click="close"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit">
        <!-- Row 1: Vincular disciplina & Nome da Atividade -->
        <div class="row g-3 mb-3.5">
          <!-- Vincular disciplina -->
          <div class="col-md-6">
            <label class="form-label-figma">Vincular disciplina</label>
            <div class="input-icon-wrap">
              <i class="bi bi-journal-bookmark input-icon text-muted"></i>
              <div 
                v-if="isReadOnlyMode" 
                class="form-control-figma form-control-icon readonly-field d-flex align-items-center"
              >
                <span>{{ selectedDisciplineName }}</span>
              </div>
              <select 
                v-else
                v-model="formData.parentId" 
                class="form-control-figma form-control-icon"
                required
              >
                <option value="" disabled>Selecione a disciplina...</option>
                <option v-for="d in disciplinesList" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Nome da Atividade -->
          <div class="col-md-6">
            <label class="form-label-figma">
              Nome da Atividade <span v-if="!isReadOnlyMode" class="text-danger">*</span>
            </label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="form-control-figma" 
              placeholder="Ex: Implementar Store reativa com Pinia"
              :readonly="isReadOnlyMode"
              :disabled="isReadOnlyMode"
              required 
              autofocus
            />
          </div>
        </div>

        <!-- Row 2: Descrição -->
        <div class="mb-3.5">
          <label class="form-label-figma">Descrição</label>
          <textarea 
            v-model="formData.description" 
            class="form-control-figma form-textarea-figma" 
            rows="3" 
            :readonly="isReadOnlyMode"
            :disabled="isReadOnlyMode"
            placeholder="Criar módulo de persistência local para armazenar tarefas dos estudos e vincular ao state global da aplicação."
          ></textarea>
        </div>

        <!-- Row 3: Prazo de Entrega & Categoria -->
        <div class="row g-3 mb-3.5">
          <!-- Prazo de Entrega -->
          <div class="col-md-6">
            <label class="form-label-figma">Prazo de Entrega</label>
            <div 
              class="form-control-figma custom-date-group d-flex align-items-center"
              :class="{ 'readonly-field': isReadOnlyMode }"
            >
              <div v-if="isReadOnlyMode" class="date-readonly-text flex-grow-1">
                {{ formattedDueDateDisplay }}
              </div>
              <input 
                v-else
                v-model="formData.dueDate" 
                type="date" 
                class="date-input-field flex-grow-1" 
                required 
              />
            </div>
          </div>

          <!-- Categoria -->
          <div class="col-md-6">
            <label class="form-label-figma">Categoria</label>
            <div class="input-icon-wrap">
              <i class="bi bi-layers input-icon text-muted"></i>
              <div 
                v-if="isReadOnlyMode" 
                class="form-control-figma form-control-icon readonly-field d-flex align-items-center"
              >
                <span>{{ categoryLabelDisplay }}</span>
              </div>
              <select 
                v-else
                v-model="formData.category" 
                class="form-control-figma form-control-icon" 
                required
              >
                <option value="trabalho_avaliativo">Trabalho Avaliativo</option>
                <option value="prova">Prova</option>
                <option value="seminario">Seminário</option>
                <option value="atividade_pontual">Atividade Pontual</option>
                <option value="revisao">Revisão</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Row 4: Prioridade & Status Inicial -->
        <div class="row g-3 mb-4">
          <!-- Prioridade -->
          <div class="col-md-6">
            <label class="form-label-figma">Prioridade</label>
            <div class="segmented-control d-flex p-1" :class="{ 'read-only': isReadOnlyMode }">
              <button 
                type="button" 
                class="btn-segment flex-grow-1" 
                :class="{ active: formData.priority === 'baixa' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.priority = 'baixa')"
              >
                Baixa
              </button>
              <button 
                type="button" 
                class="btn-segment flex-grow-1" 
                :class="{ active: formData.priority === 'media' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.priority = 'media')"
              >
                Média
              </button>
              <button 
                type="button" 
                class="btn-segment flex-grow-1 btn-priority-alta" 
                :class="{ active: formData.priority === 'alta' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.priority = 'alta')"
              >
                Alta
              </button>
            </div>
          </div>

          <!-- Status -->
          <div class="col-md-6">
            <label class="form-label-figma">
              {{ isEditing || isReadOnlyMode ? 'Status' : 'Status Inicial' }}
            </label>
            <div class="segmented-control d-flex p-1" :class="{ 'read-only': isReadOnlyMode }">
              <button 
                type="button" 
                class="btn-segment flex-grow-1" 
                :class="{ active: formData.status === 'a_fazer' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.status = 'a_fazer')"
              >
                A fazer
              </button>
              <button 
                type="button" 
                class="btn-segment flex-grow-1" 
                :class="{ active: formData.status === 'em_andamento' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.status = 'em_andamento')"
              >
                Em andamento
              </button>
              <button 
                type="button" 
                class="btn-segment flex-grow-1" 
                :class="{ active: formData.status === 'concluida' }"
                :disabled="isReadOnlyMode"
                @click="!isReadOnlyMode && (formData.status = 'concluida')"
              >
                Concluída
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Actions matching Figma -->
        <div v-if="!isReadOnlyMode" class="d-flex align-items-center justify-content-end gap-3 pt-2">
          <button 
            type="button" 
            class="btn-cancel" 
            @click="close"
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            class="btn-figma-save"
          >
            <i class="bi bi-check-lg me-1"></i>
            <span>{{ isEditing ? 'Salvar Alterações' : 'Salvar Atividade' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { getDisciplines } from '../../services/api'
import { formatDateFull } from '../../utils/dateUtils'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  activityToEdit: {
    type: Object,
    default: null
  },
  parentType: {
    type: String,
    default: 'discipline'
  },
  parentId: {
    type: String,
    default: ''
  },
  parentName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'saved'])

const isReadOnlyMode = computed(() => Boolean(props.isReadOnly))
const isEditing = computed(() => Boolean(props.activityToEdit && props.activityToEdit.id && !props.isReadOnly))

const modalTitle = computed(() => {
  if (isReadOnlyMode.value) return 'Visualizar Atividade'
  if (isEditing.value) return 'Editar Atividade'
  return 'Nova Atividade'
})

const modalSubtitle = computed(() => {
  if (isReadOnlyMode.value) return 'Detalhes e prazos da tarefa selecionada'
  if (isEditing.value) return 'Edite as informações e prazos da tarefa selecionada'
  return 'Adicione uma tarefa e vincule-a à uma disciplina'
})

const disciplinesList = ref([])

const formData = ref({
  id: '',
  name: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  category: 'trabalho_avaliativo',
  priority: 'alta',
  status: 'em_andamento',
  parentType: 'discipline',
  parentId: ''
})

const categoryLabels = {
  trabalho_avaliativo: 'Trabalho Avaliativo',
  prova: 'Prova',
  seminario: 'Seminário',
  atividade_pontual: 'Atividade Pontual',
  revisao: 'Revisão'
}

const categoryLabelDisplay = computed(() => {
  return categoryLabels[formData.value.category] || formData.value.category || 'Atividade'
})

const selectedDisciplineName = computed(() => {
  if (props.parentName) return props.parentName
  const targetId = formData.value.parentId || props.parentId || props.activityToEdit?.disciplineId
  const found = disciplinesList.value.find(d => String(d.id) === String(targetId))
  if (found) return found.name
  if (props.activityToEdit?.discipline?.name) return props.activityToEdit.discipline.name
  if (props.activityToEdit?.parentName) return props.activityToEdit.parentName
  return 'Disciplina'
})

const formattedDueDateDisplay = computed(() => {
  if (!formData.value.dueDate) return 'Sem prazo definido'
  return formatDateFull(formData.value.dueDate)
})

function syncFormData() {
  if (props.activityToEdit) {
    let rawDate = props.activityToEdit.dueDate
    if (rawDate && typeof rawDate === 'string') {
      rawDate = rawDate.split('T')[0]
    } else if (rawDate instanceof Date) {
      rawDate = rawDate.toISOString().split('T')[0]
    }

    formData.value = {
      ...props.activityToEdit,
      parentId: props.activityToEdit.disciplineId || props.activityToEdit.parentId || props.parentId || '',
      dueDate: rawDate || new Date().toISOString().split('T')[0]
    }
  } else {
    formData.value = {
      id: '',
      name: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'trabalho_avaliativo',
      priority: 'alta',
      status: 'em_andamento',
      parentType: props.parentType || 'discipline',
      parentId: props.parentId || (disciplinesList.value[0]?.id || '')
    }
  }
}

async function fetchDisciplines() {
  if (disciplinesList.value.length === 0) {
    try {
      disciplinesList.value = await getDisciplines()
      if (!formData.value.parentId && !props.parentId && disciplinesList.value.length > 0) {
        formData.value.parentId = disciplinesList.value[0].id
      }
    } catch (err) {
      console.error('Erro ao buscar disciplinas para o formulário:', err)
    }
  }
}

onMounted(() => {
  fetchDisciplines()
})

watch([() => props.isOpen, () => props.activityToEdit], ([isOpen]) => {
  if (isOpen) {
    syncFormData()
    fetchDisciplines()
  }
}, { immediate: true })

function close() {
  emit('close')
}

function handleSubmit() {
  if (!formData.value.name.trim()) return
  if (!formData.value.parentId && !props.parentId) return

  emit('saved', {
    ...formData.value,
    parentType: props.parentType || 'discipline',
    parentId: formData.value.parentId || props.parentId
  })
  close()
}
</script>

<style scoped>
/* Backdrop Overlay with Blur matching Figma */
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
  max-width: 680px;
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 90vh;
  overflow-y: auto;
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

.modal-subtitle {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
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
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.4rem;
}

.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 2;
}

.form-control-figma {
  width: 100%;
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.72rem 1rem;
  font-size: 0.92rem;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control-icon {
  padding-left: 38px !important;
}

.readonly-field {
  min-height: 44px;
  background-color: #F7F6F0 !important;
  color: #363636 !important;
  cursor: default !important;
  border-color: #E2DFD4 !important;
  user-select: text;
}

.custom-date-group {
  display: flex;
  align-items: center;
  padding: 0 0.85rem;
  min-height: 46px;
  cursor: pointer;
}

.custom-date-group:focus-within {
  background-color: #FFFFFF;
  border-color: #8366C5;
  box-shadow: 0 0 0 3px rgba(131, 102, 197, 0.15);
}


.date-readonly-text {
  font-size: 0.92rem;
  color: var(--color-text-primary);
  user-select: text;
}

.date-input-field {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  width: 100%;
  color: var(--color-text-primary);
  font-size: 0.92rem;
  font-family: inherit;
  min-height: 42px;
  padding: 0 !important;
  margin: 0 !important;
  cursor: pointer;
  box-shadow: none !important;
}

/* iOS Safari & Webkit resets */
.date-input-field::-webkit-date-and-time-value {
  text-align: left;
  margin: 0;
  padding: 0;
}

.date-input-field::-webkit-datetime-edit {
  padding: 0;
  margin: 0;
}

select.form-control-figma {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2352525B' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 12px 8px;
  padding-right: 38px !important;
  cursor: pointer;
}

.form-textarea-figma {
  resize: vertical;
  min-height: 85px;
}

.form-control-figma:disabled,
.form-control-figma[readonly] {
  background-color: #F7F6F0 !important;
  color: #363636 !important;
  cursor: default !important;
  opacity: 1 !important;
  border-color: #E2DFD4 !important;
}

.segmented-control.read-only {
  pointer-events: none;
  background-color: #F7F6F0;
  border-color: #E2DFD4;
}

.segmented-control.read-only .btn-segment {
  cursor: default;
}

.form-control-figma:focus {
  background-color: #FFFFFF;
  border-color: #8366C5;
  box-shadow: 0 0 0 3px rgba(131, 102, 197, 0.15);
}

.form-control-figma::placeholder {
  color: #A1A1AA;
}

/* Segmented Control matching Figma */
.segmented-control {
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-pill);
  gap: 3px;
}

.btn-segment {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  padding: 6px 12px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-segment:hover {
  color: var(--color-text-primary);
}

.btn-segment.active {
  background-color: #6D48C5;
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.btn-priority-alta.active {
  background-color: #FFFFFF;
  color: #DC2626;
  border: 1.5px solid #F87171;
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
