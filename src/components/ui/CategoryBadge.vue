<template>
  <span :class="['badge-category', categoryClass]" :title="categoryLabel">
    <i :class="categoryIcon"></i>
    <span>{{ categoryLabel }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const categoriesMap = {
  seminario: {
    label: 'Seminário',
    icon: 'bi bi-megaphone-fill',
    class: 'badge-seminario'
  },
  prova: {
    label: 'Prova',
    icon: 'bi bi-award-fill',
    class: 'badge-prova'
  },
  trabalho_avaliativo: {
    label: 'Trabalho',
    icon: 'bi bi-journal-code',
    class: 'badge-trabalho'
  },
  atividade_pontual: {
    label: 'Atividade',
    icon: 'bi bi-check-circle-fill',
    class: 'badge-atividade'
  },
  revisao: {
    label: 'Revisão',
    icon: 'bi bi-arrow-repeat',
    class: 'badge-revisao'
  }
}

const categoryInfo = computed(() => {
  return categoriesMap[props.category] || {
    label: props.category || 'Geral',
    icon: 'bi bi-bookmark-fill',
    class: 'badge-default'
  }
})

const categoryLabel = computed(() => categoryInfo.value.label)
const categoryIcon = computed(() => categoryInfo.value.icon)
const categoryClass = computed(() => categoryInfo.value.class)
</script>

<style scoped>
.badge-seminario {
  background-color: rgba(81, 52, 144, 0.12);
  color: #513490;
  border: 1px solid rgba(81, 52, 144, 0.25);
}
.badge-prova {
  background-color: #FEEEEE;
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}
.badge-trabalho {
  background-color: #F0EBFC;
  color: #8B5CF6;
  border: 1px solid rgba(139, 92, 246, 0.25);
}
.badge-atividade {
  background-color: #F6F9D7;
  color: #728004;
  border: 1px solid rgba(194, 208, 57, 0.4);
}
.badge-revisao {
  background-color: #FEF3E2;
  color: #D97706;
  border: 1px solid rgba(217, 119, 6, 0.25);
}
.badge-default {
  background-color: #F4F4F5;
  color: #71717A;
}
</style>
