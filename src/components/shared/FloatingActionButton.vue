<template>
  <div class="fab-container">
    <transition name="fab-menu">
      <div v-if="isExpanded" class="fab-menu">
        <button 
          class="fab-menu-item" 
          @click="triggerAction('discipline')" 
          title="Nova Disciplina"
        >
          <div class="fab-icon-small bg-accent-soft">
            <i class="bi bi-journal-plus"></i>
          </div>
          <span class="fab-label">Nova Disciplina</span>
        </button>

        <button 
          class="fab-menu-item" 
          @click="triggerAction('activity')" 
          title="Nova Atividade"
        >
          <div class="fab-icon-small bg-primary-soft">
            <i class="bi bi-check2-square"></i>
          </div>
          <span class="fab-label">Nova Atividade</span>
        </button>
      </div>
    </transition>

    <button 
      class="btn-fab" 
      :class="{ active: isExpanded }"
      :title="isExpanded ? 'Fechar menu' : 'Adicionar rápido'"
      @click="toggle"
    >
      <i class="bi" :class="isExpanded ? 'bi-x-lg' : 'bi-plus-lg'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

const emit = defineEmits(['create-discipline', 'create-activity'])

function toggle() {
  isExpanded.value = !isExpanded.value
}

function triggerAction(type) {
  isExpanded.value = false
  if (type === 'discipline') {
    emit('create-discipline')
  } else if (type === 'activity') {
    emit('create-activity')
  }
}
</script>

<style scoped>
.fab-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.fab-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
}

.fab-menu-item {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.fab-label {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  padding: 0.35rem 0.8rem;
  border-radius: var(--border-radius-pill);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.fab-icon-small {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.fab-menu-item:hover .fab-icon-small {
  transform: scale(1.1);
}

.bg-primary-soft {
  background-color: var(--color-primary);
  color: #fff;
}

.bg-accent-soft {
  background-color: var(--color-accent);
  color: var(--color-text-primary);
}

/* Botão principal FAB */
.btn-fab {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  box-shadow: 0 4px 18px rgba(81, 52, 144, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  flex-shrink: 0;
}

.btn-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(81, 52, 144, 0.55);
}

.btn-fab.active {
  background: var(--color-text-secondary, #6b7280);
  transform: rotate(45deg);
}

/* Animação: entra/sai deslizando da direita para a esquerda */
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>
