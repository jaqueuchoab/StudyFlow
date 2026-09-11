<template>
  <div 
    v-if="isOpen" 
    class="modal-backdrop-custom" 
    @click.self="close"
  >
    <div class="modal-dialog-custom">
      <div class="modal-content study-card p-4">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom-subtle">
          <div class="d-flex align-items-center gap-2">
            <div class="modal-icon-badge">
              <i class="bi bi-pencil-square"></i>
            </div>
            <div>
              <h5 class="mb-0 text-primary">{{ isEditing ? 'Editar Atividade' : 'Nova Atividade' }}</h5>
              <small class="text-muted">{{ parentLabel }}</small>
            </div>
          </div>
          <button type="button" class="btn-close-modal" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit">
          <!-- Nome da atividade -->
          <div class="mb-3">
            <label class="form-label">
              Nome da Atividade <span class="text-danger">*</span>
            </label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="form-control" 
              placeholder="Ex: Trabalho Prático de Escalonamento" 
              required 
            />
          </div>

          <!-- Disciplina (se não vier pré-selecionada) -->
          <div v-if="!fixedParentId" class="mb-3">
            <label class="form-label">
              Disciplina Vinculada <span class="text-danger">*</span>
            </label>
            <select v-model="formData.parentId" class="form-select" required>
              <option value="" disabled>Selecione a disciplina...</option>
              <option v-for="d in disciplinesList" :key="d.id" :value="d.id">
                {{ d.name }} ({{ d.professor }})
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div class="mb-3">
            <label class="form-label">Descrição ou Orientações</label>
            <textarea 
              v-model="formData.description" 
              class="form-control" 
              rows="3" 
              placeholder="Critérios de avaliação, referências ou detalhes da entrega..."
            ></textarea>
          </div>

          <!-- Prazo de Entrega -->
          <div class="mb-3">
            <label class="form-label">
              <i class="bi bi-calendar-event me-1 text-primary"></i>Prazo de Entrega
            </label>
            <input 
              v-model="formData.dueDate" 
              type="date" 
              class="form-control" 
              required
            />
          </div>

          <!-- Row: Categoria & Prioridade -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Categoria</label>
              <select v-model="formData.category" class="form-select" required>
                <option value="prova">Prova</option>
                <option value="trabalho_avaliativo">Trabalho Avaliativo</option>
                <option value="seminario">Seminário</option>
                <option value="atividade_pontual">Atividade Pontual</option>
                <option value="revisao">Revisão</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Prioridade</label>
              <select v-model="formData.priority" class="form-select" required>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta (Crítica)</option>
              </select>
            </div>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label class="form-label">Situação Inicial</label>
            <div class="status-radio-group d-flex gap-2">
              <label 
                class="status-radio-btn" 
                :class="{ active: formData.status === 'a_fazer' }"
              >
                <input type="radio" v-model="formData.status" value="a_fazer" class="d-none">
                <span>A Fazer</span>
              </label>
              <label 
                class="status-radio-btn" 
                :class="{ active: formData.status === 'em_andamento' }"
              >
                <input type="radio" v-model="formData.status" value="em_andamento" class="d-none">
                <span>Em Andamento</span>
              </label>
              <label 
                class="status-radio-btn" 
                :class="{ active: formData.status === 'concluida' }"
              >
                <input type="radio" v-model="formData.status" value="concluida" class="d-none">
                <span>Concluída</span>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex align-items-center justify-content-end gap-2 pt-3 border-top-subtle">
            <button type="button" class="btn-study-outline py-2 px-3" @click="close">
              Cancelar
            </button>
            <button type="submit" class="btn-study-accent py-2 px-4">
              <i class="bi bi-check2-circle"></i>
              <span>{{ isEditing ? 'Salvar Alterações' : 'Criar Atividade' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getDisciplines } from '../../services/storage'

const props = defineProps({
  isOpen: {
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

const fixedParentId = computed(() => Boolean(props.parentId))
const isEditing = computed(() => Boolean(props.activityToEdit && props.activityToEdit.id))

const disciplinesList = ref([])

const formData = ref({
  id: '',
  name: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  category: 'trabalho_avaliativo',
  priority: 'media',
  status: 'a_fazer',
  parentType: 'discipline',
  parentId: ''
})

const parentLabel = computed(() => {
  if (props.parentName) return `Vinculada a: ${props.parentName}`
  return 'Preencha os detalhes da atividade'
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    disciplinesList.value = getDisciplines()
    
    if (props.activityToEdit) {
      formData.value = {
        ...props.activityToEdit,
        dueDate: props.activityToEdit.dueDate || new Date().toISOString().split('T')[0]
      }
    } else {
      // Default reset
      formData.value = {
        id: '',
        name: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'trabalho_avaliativo',
        priority: 'media',
        status: 'a_fazer',
        parentType: props.parentType || 'discipline',
        parentId: props.parentId || (disciplinesList.value[0]?.id || '')
      }
    }
  }
})

function close() {
  emit('close')
}

function handleSubmit() {
  if (!formData.value.name.trim()) return
  if (!formData.value.parentId && !props.parentId) return

  emit('saved', {
    ...formData.value,
    parentType: props.parentType || 'discipline',
    parentId: props.parentId || formData.value.parentId
  })
  close()
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(46, 42, 39, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1.5rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 540px;
  animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-close-modal {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.status-radio-group {
  display: flex;
  width: 100%;
}

.status-radio-btn {
  flex: 1;
  text-align: center;
  padding: 0.55rem 0.6rem;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.status-radio-btn.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.border-bottom-subtle {
  border-bottom: 1px solid var(--color-border-subtle);
}
.border-top-subtle {
  border-top: 1px solid var(--color-border-subtle);
}
</style>
