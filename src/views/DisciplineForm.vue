<template>
  <div class="discipline-form-view pb-5">
    <!-- Breadcrumb / Header -->
    <div class="mb-4">
      <router-link to="/disciplinas" class="text-decoration-none text-muted small fw-semibold d-inline-flex align-items-center gap-1 mb-2">
        <i class="bi bi-arrow-left"></i>
        <span>Voltar para Minhas Disciplinas</span>
      </router-link>
      <h2 class="text-primary fw-extrabold mb-1">
        {{ isEditing ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina' }}
      </h2>
      <p class="text-muted mb-0">
        {{ isEditing ? 'Atualize as informações da matéria e organize suas atividades.' : 'Preencha os dados da matéria para começar a planejar seu semestre.' }}
      </p>
    </div>

    <div class="row g-4">
      <!-- Main Form Card -->
      <div class="col-lg-8">
        <div class="study-card p-4 p-md-5">
          <form @submit.prevent="handleSubmit">
            <!-- Nome da Disciplina -->
            <div class="mb-4">
              <label class="form-label">
                Nome da Disciplina <span class="text-danger">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                class="form-control form-control-lg" 
                placeholder="Ex: Sistemas Operacionais"
                required 
              />
            </div>

            <!-- Professor Responsável -->
            <div class="mb-4">
              <label class="form-label">
                Professor(a) Responsável <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0 text-primary">
                  <i class="bi bi-person-badge"></i>
                </span>
                <input 
                  v-model="form.professor" 
                  type="text" 
                  class="form-control border-start-0 ps-0" 
                  placeholder="Ex: Prof. Dr. Mark Lee"
                  required 
                />
              </div>
            </div>

            <!-- Row: Curso e Carga Horária -->
            <div class="row g-3 mb-4">
              <div class="col-md-7">
                <label class="form-label">Curso / Graduação</label>
                <input 
                  v-model="form.course" 
                  type="text" 
                  class="form-control" 
                  placeholder="Ex: Ciência da Computação"
                />
              </div>

              <div class="col-md-5">
                <label class="form-label">Carga Horária (Horas)</label>
                <div class="input-group">
                  <input 
                    v-model.number="form.workload" 
                    type="number" 
                    min="1" 
                    max="500" 
                    class="form-control" 
                    placeholder="60"
                  />
                  <span class="input-group-text bg-white text-muted">h</span>
                </div>
              </div>
            </div>

            <!-- Descrição Opcional -->
            <div class="mb-4">
              <label class="form-label">Ementa / Descrição Breve</label>
              <textarea 
                v-model="form.description" 
                class="form-control" 
                rows="3" 
                placeholder="Tópicos principais abordados, referências bibliográficas..."
              ></textarea>
            </div>

            <!-- Identidade Visual do Card (Cores do tema Graphic Garden) -->
            <div class="mb-4">
              <label class="form-label">Estilo do Card na Aplicação</label>
              <div class="d-flex flex-wrap gap-2">
                <button 
                  v-for="color in themeColorOptions" 
                  :key="color.hex"
                  type="button" 
                  class="theme-color-btn"
                  :class="{ active: form.themeColor === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="form.themeColor = color.hex"
                  :title="color.name"
                >
                  <i v-if="form.themeColor === color.hex" class="bi bi-check-lg" :style="{ color: color.checkColor }"></i>
                </button>
              </div>
            </div>

            <!-- Gatilho da especificação (Spec 4.4: "+ Adicionar atividade" via modal) -->
            <div class="p-3 mb-4 add-task-trigger-box d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <span class="fw-bold text-primary d-block">Já tem tarefas agendadas para esta matéria?</span>
                <small class="text-muted">Adicione provas, seminários ou trabalhos avaliativos agora mesmo.</small>
              </div>
              <button 
                type="button" 
                class="btn-study-outline py-1 px-3" 
                @click="openTaskModal"
              >
                <i class="bi bi-plus-circle-fill me-1"></i>
                <span>+ Adicionar atividade</span>
              </button>
            </div>

            <!-- Atividades temporárias criadas nesta sessão -->
            <div v-if="pendingActivitiesToSave.length > 0" class="mb-4">
              <h6 class="text-primary mb-2">Atividades a vincular ({{ pendingActivitiesToSave.length }}):</h6>
              <div class="list-group">
                <div 
                  v-for="(act, idx) in pendingActivitiesToSave" 
                  :key="idx" 
                  class="list-group-item d-flex align-items-center justify-content-between py-2 px-3"
                >
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary-subtle text-primary rounded-pill">{{ act.category }}</span>
                    <span class="fw-semibold">{{ act.name }}</span>
                    <small class="text-muted">({{ act.dueDate }})</small>
                  </div>
                  <button type="button" class="btn btn-sm text-danger p-0" @click="pendingActivitiesToSave.splice(idx, 1)">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="d-flex align-items-center justify-content-end gap-3 pt-3 border-top-subtle">
              <router-link to="/disciplinas" class="btn-study-outline">
                Cancelar
              </router-link>
              <button type="submit" class="btn-study-accent">
                <i class="bi bi-check2-circle"></i>
                <span>{{ isEditing ? 'Salvar Alterações' : 'Cadastrar Disciplina' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Helper / Preview Column -->
      <div class="col-lg-4">
        <div class="study-card p-4">
          <h5 class="text-primary mb-3">Prévia do Card</h5>
          <div class="study-card p-3 mb-3" :style="{ borderTop: '4px solid ' + form.themeColor }">
            <span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 mb-2 fw-bold small">
              {{ form.course || 'Curso' }} · {{ form.workload || 0 }}h
            </span>
            <h5 class="mb-1 text-truncate">{{ form.name || 'Nome da Disciplina' }}</h5>
            <small class="text-muted d-block mb-2">Prof. {{ form.professor || 'Nome do Professor' }}</small>
            <p class="small text-muted mb-0 text-truncate-2">
              {{ form.description || 'Descrição da ementa e atividades...' }}
            </p>
          </div>
          <div class="alert alert-light border small text-muted mb-0">
            <i class="bi bi-info-circle-fill text-primary me-1"></i>
            Ao salvar, você poderá gerenciar todas as notas, entregas e prazos detalhados na tela da disciplina.
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal for trigger -->
    <TaskFormModal
      :is-open="isTaskModalOpen"
      :parent-name="form.name || 'Nova Disciplina'"
      :parent-id="form.id"
      @close="isTaskModalOpen = false"
      @saved="handleActivityAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskFormModal from '../components/shared/TaskFormModal.vue'
import {
  getDisciplineById,
  saveDiscipline,
  saveActivity
} from '../services/storage'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => Boolean(route.params.id))
const isTaskModalOpen = ref(false)
const pendingActivitiesToSave = ref([])

const themeColorOptions = [
  { hex: '#A184E5', name: 'Roxo Graphic Garden', checkColor: '#fff' },
  { hex: '#C2D039', name: 'Verde-limão Graphic Garden', checkColor: '#2E2A27' },
  { hex: '#F5F4E3', name: 'Creme Graphic Garden', checkColor: '#A184E5' },
  { hex: '#E06D53', name: 'Coral Suave', checkColor: '#fff' },
  { hex: '#513490', name: 'Roxo Escuro (#513490)', checkColor: '#fff' }
]

const form = ref({
  id: '',
  name: '',
  professor: '',
  course: 'Ciência da Computação',
  workload: 60,
  description: '',
  themeColor: '#A184E5',
  illustration: 'desktop'
})

onMounted(() => {
  if (isEditing.value) {
    const existing = getDisciplineById(route.params.id)
    if (existing) {
      form.value = { ...existing }
    } else {
      router.push('/disciplinas')
    }
  }
})

function openTaskModal() {
  isTaskModalOpen.value = true
}

function handleActivityAdded(activityData) {
  if (isEditing.value) {
    // If editing existing discipline, save immediately
    saveActivity({ ...activityData, parentType: 'discipline', parentId: form.value.id })
  } else {
    // Stage for saving after discipline is created
    pendingActivitiesToSave.value.push(activityData)
  }
}

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.professor.trim()) return

  const saved = saveDiscipline(form.value)

  // Save any pending activities that were added via the modal before creating
  if (pendingActivitiesToSave.value.length > 0) {
    const disciplineId = saved.id || form.value.id
    pendingActivitiesToSave.value.forEach(act => {
      saveActivity({ ...act, parentType: 'discipline', parentId: disciplineId })
    })
  }

  router.push('/disciplinas/' + (saved.id || form.value.id))
}
</script>

<style scoped>
.fw-extrabold {
  font-weight: 800;
}

.add-task-trigger-box {
  background-color: var(--color-primary-light);
  border: 1.5px dashed var(--color-primary);
  border-radius: var(--border-radius-sm);
}

.theme-color-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.theme-color-btn:hover {
  transform: scale(1.15);
}

.theme-color-btn.active {
  outline: 2px solid var(--color-text-primary);
}

.border-top-subtle {
  border-top: 1px solid var(--color-border-subtle);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
