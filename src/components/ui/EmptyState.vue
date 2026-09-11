<template>
  <div class="empty-state text-center p-5 my-4">
    <div class="empty-icon-circle mx-auto mb-3">
      <i :class="icon"></i>
    </div>
    <h4 class="mb-2">{{ title }}</h4>
    <p class="text-muted mb-4 max-w-md mx-auto">{{ description }}</p>
    <button v-if="actionLabel" class="btn-study-accent" @click="$emit('action')">
      <i class="bi bi-plus-lg"></i>
      <span>{{ actionLabel }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'bi bi-folder-plus'
  },
  title: {
    type: String,
    default: 'Nenhum item encontrado'
  },
  description: {
    type: String,
    default: 'Comece adicionando seu primeiro item para manter seus estudos organizados.'
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  background-color: var(--color-card-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-card);
}

.empty-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.max-w-md {
  max-width: 440px;
}
</style>
