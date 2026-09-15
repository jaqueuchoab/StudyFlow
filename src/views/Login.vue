<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 p-3">
    <div class="login-card p-4 p-sm-5">
      <!-- Brand Header -->
      <div class="text-center mb-4">
        <div class="brand-badge mb-2">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <h2 class="login-title mb-1">StudyFlow</h2>
        <p class="login-subtitle mb-0">Gestão Universitária e Acadêmica</p>
      </div>

      <!-- Mode Selector (Entrar / Cadastrar) -->
      <div class="segmented-auth-toggle d-flex p-1 mb-4">
        <button 
          type="button" 
          class="btn-auth-toggle flex-fill" 
          :class="{ active: isLoginMode }"
          @click="isLoginMode = true; errorMessage = ''"
        >
          Entrar
        </button>
        <button 
          type="button" 
          class="btn-auth-toggle flex-fill" 
          :class="{ active: !isLoginMode }"
          @click="isLoginMode = false; errorMessage = ''"
        >
          Cadastrar
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Name (only in register mode) -->
        <div v-if="!isLoginMode" class="form-group mb-3">
          <label class="form-label-figma">Nome Completo</label>
          <div class="input-icon-wrap">
            <i class="bi bi-person input-icon text-muted"></i>
            <input 
              v-model="name" 
              type="text" 
              class="form-control-figma form-control-icon" 
              placeholder="Ex: Jaqueline Uchôa" 
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="form-group mb-3">
          <label class="form-label-figma">E-mail</label>
          <div class="input-icon-wrap">
            <i class="bi bi-envelope input-icon text-muted"></i>
            <input 
              v-model="email" 
              type="email" 
              class="form-control-figma form-control-icon" 
              placeholder="seu.email@exemplo.com" 
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="form-group mb-4">
          <label class="form-label-figma">Senha</label>
          <div class="input-icon-wrap">
            <i class="bi bi-lock input-icon text-muted"></i>
            <input 
              v-model="password" 
              type="password" 
              class="form-control-figma form-control-icon" 
              placeholder="••••••••" 
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn-login-submit w-100"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span>{{ isLoginMode ? 'Acessar Plataforma' : 'Criar Minha Conta' }}</span>
        </button>
      </form>

      <!-- Quick Test Hint -->
      <div class="text-center mt-4 pt-2 border-top-subtle">
        <p class="text-muted small mb-0">
          Conta de teste: <strong class="text-dark">estudante@studyflow.com</strong> | senha: <strong class="text-dark">123</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../services/api'

const router = useRouter()

const isLoginMode = ref(true)
const name = ref('')
const email = ref('estudante@studyflow.com')
const password = ref('123')
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    if (isLoginMode.value) {
      await login(email.value, password.value)
    } else {
      await register(name.value, email.value, password.value)
    }
    router.push('/')
  } catch (err) {
    errorMessage.value = err.message || 'Falha ao autenticar. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background-color: var(--color-bg);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.brand-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: var(--color-primary);
  color: #FFFFFF;
  font-size: 1.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow-primary);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #363636;
  letter-spacing: -0.03em;
}

.login-subtitle {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.segmented-auth-toggle {
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-pill);
}

.btn-auth-toggle {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-auth-toggle.active {
  background-color: #6D48C5;
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.form-label-figma {
  display: block;
  font-size: 0.86rem;
  font-weight: 600;
  color: #363636;
  margin-bottom: 0.35rem;
}

.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 1rem;
  pointer-events: none;
}

.form-control-figma {
  width: 100%;
  background-color: #FAF8F2;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.72rem 1rem;
  font-size: 0.92rem;
  color: #363636;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control-icon {
  padding-left: 40px !important;
}

.form-control-figma:focus {
  background-color: #FFFFFF;
  border-color: #8366C5;
  box-shadow: 0 0 0 3px rgba(131, 102, 197, 0.15);
}

.btn-login-submit {
  background-color: #C2D039;
  color: #363636;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.78rem;
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login-submit:hover:not(:disabled) {
  background-color: #AFC026;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(194, 208, 57, 0.35);
}

.btn-login-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.border-top-subtle {
  border-top: 1px solid var(--color-border);
}
</style>
