<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="confirm-modal-backdrop"
      @click.self="handleCancel"
    >
      <div class="confirm-modal-card">
        <!-- Close button top-right -->
        <button 
          type="button" 
          class="btn-close-corner" 
          title="Fechar"
          @click="handleCancel"
        >
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Icon & Content -->
        <div class="d-flex flex-column align-items-center text-center px-4 pt-4 pb-3">
          <div 
            class="modal-icon-badge mb-3"
            :class="'badge-' + type"
          >
            <i :class="getIconClass"></i>
          </div>

          <h3 class="confirm-title mb-2">{{ title }}</h3>
          <p class="confirm-message mb-0">{{ message }}</p>
        </div>

        <!-- Action Buttons: Não / Sim -->
        <div class="confirm-modal-footer d-flex align-items-center justify-content-center gap-3 p-4 pt-2">
          <button 
            type="button" 
            class="btn-confirm-cancel"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>

          <button 
            type="button" 
            class="btn-confirm-accept"
            :class="'btn-' + type"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmação'
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja realizar esta ação?'
  },
  confirmText: {
    type: String,
    default: 'Sim'
  },
  cancelText: {
    type: String,
    default: 'Não'
  },
  type: {
    type: String,
    default: 'danger', // 'danger' | 'warning' | 'info' | 'primary'
    validator: (val) => ['danger', 'warning', 'info', 'primary'].includes(val)
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const getIconClass = computed(() => {
  if (props.icon) return props.icon
  switch (props.type) {
    case 'danger':
      return 'bi bi-trash3-fill'
    case 'warning':
      return 'bi bi-exclamation-triangle-fill'
    case 'info':
      return 'bi bi-info-circle-fill'
    default:
      return 'bi bi-question-circle-fill'
  }
})

function handleConfirm() {
  emit('confirm')
  emit('close')
}

function handleCancel() {
  emit('cancel')
  emit('close')
}

function handleKeydown(e) {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    handleCancel()
  } else if (e.key === 'Enter') {
    handleConfirm()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.confirm-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(24, 24, 27, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  animation: backdropFade 0.2s ease;
}

@keyframes backdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-modal-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background-color: #FFFFFF;
  border: 1px solid var(--color-border, #EFECE0);
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: modalScaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.93) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.btn-close-corner {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #A1A1AA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s ease;
}

.btn-close-corner:hover {
  background-color: #F4F4F5;
  color: #363636;
}

.modal-icon-badge {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.badge-danger {
  background-color: #FEE2E2;
  color: #DC2626;
}

.badge-warning {
  background-color: #FEF3C7;
  color: #D97706;
}

.badge-info {
  background-color: #ECE8FA;
  color: #6D48C5;
}

.badge-primary {
  background-color: #EBF3CE;
  color: #55600c;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-primary, #363636);
  letter-spacing: -0.02em;
}

.confirm-message {
  font-size: 0.92rem;
  color: var(--color-text-secondary, #52525B);
  line-height: 1.45;
}

.confirm-modal-footer {
  border-top: none;
}

.btn-confirm-cancel {
  flex: 1;
  background-color: #F4F4F5;
  color: #52525B;
  border: 1px solid #E4E4E7;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  border-radius: var(--border-radius-pill, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm-cancel:hover {
  background-color: #E4E4E7;
  color: #363636;
}

.btn-confirm-accept {
  flex: 1;
  border: none;
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: var(--border-radius-pill, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger {
  background-color: #DC2626;
  color: #FFFFFF;
}

.btn-danger:hover {
  background-color: #B91C1C;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transform: translateY(-1px);
}

.btn-warning {
  background-color: #D97706;
  color: #FFFFFF;
}

.btn-warning:hover {
  background-color: #B45309;
}

.btn-info {
  background-color: #8366C5;
  color: #FFFFFF;
}

.btn-info:hover {
  background-color: #6D48C5;
}

.btn-primary {
  background-color: #C2D039;
  color: #363636;
}

.btn-primary:hover {
  background-color: #AFC026;
}
</style>
