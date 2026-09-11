<template>
  <div class="task-list-container">
    <div v-if="activities && activities.length > 0">
      <TaskCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        :parent-name="parentName"
        :parent-color="parentColor"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @status-change="$emit('status-change', $event)"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="bi bi-card-checklist"
      :title="emptyTitle"
      :description="emptyDescription"
      :action-label="showAddButton ? '+ Nova Atividade' : ''"
      @action="$emit('add')"
    />
  </div>
</template>

<script setup>
import TaskCard from './TaskCard.vue'
import EmptyState from '../ui/EmptyState.vue'

defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  parentName: {
    type: String,
    default: ''
  },
  parentColor: {
    type: String,
    default: '#A184E5'
  },
  emptyTitle: {
    type: String,
    default: 'Nenhuma atividade encontrada'
  },
  emptyDescription: {
    type: String,
    default: 'Não há tarefas cadastradas ou que correspondam aos filtros selecionados.'
  },
  showAddButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['edit', 'delete', 'status-change', 'add'])
</script>
