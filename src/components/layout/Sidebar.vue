<template>
  <aside class="study-sidebar">
    <!-- Brand / Logo Area matching Figma -->
    <div class="sidebar-brand">
      <h1 class="brand-title">StudyFlow</h1>
      <span class="brand-tag">Gestão Universitária</span>
    </div>

    <!-- Main Navigation Items matching Figma -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <!-- Dashboard -->
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" exact>
            <div class="nav-icon">
              <i class="bi bi-grid-fill"></i>
            </div>
            <span>Dashboard</span>
          </router-link>
        </li>

        <!-- Minhas Disciplinas -->
        <li class="nav-item">
          <router-link to="/disciplinas" class="nav-link" active-class="active">
            <div class="nav-icon">
              <i class="bi bi-book-half"></i>
            </div>
            <span>Minhas Disciplinas</span>
          </router-link>
        </li>

      </ul>
    </nav>

    <!-- User Profile & Logout matching Figma -->
    <div class="sidebar-user-footer pt-3 border-top-subtle d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
        <div class="user-avatar-circle">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="user-details overflow-hidden">
          <span class="user-name text-truncate d-block">{{ currentUser?.name || 'Estudante' }}</span>
          <span class="user-email text-truncate d-block">{{ currentUser?.email || 'estudante@studyflow.com' }}</span>
        </div>
      </div>
      <button class="btn-logout" title="Sair da conta" @click="handleLogout">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../../services/api'

const router = useRouter()
const currentUser = ref(null)

onMounted(() => {
  currentUser.value = getCurrentUser()
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.study-sidebar {
  width: var(--sidebar-width);
  background-color: var(--color-primary);
  color: var(--color-text-light);
  display: flex;
  flex-direction: column;
  padding: 2.25rem 1.25rem;
  flex-shrink: 0;
  z-index: 10;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-brand {
  margin-bottom: 2.5rem;
  padding-left: 0.75rem;
}

.brand-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #FFFFFF !important;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
}

.brand-tag {
  display: block;
  font-size: 0.82rem;
  color: rgba(245, 244, 227, 0.85);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.sidebar-nav {
  flex-grow: 1;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1.15rem;
  border-radius: var(--border-radius-pill);
  color: rgba(245, 244, 227, 0.85);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.nav-link.active {
  background-color: var(--color-bg);
  color: var(--color-primary);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.nav-link.active .nav-icon {
  color: var(--color-primary);
}

.nav-icon {
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-user-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.user-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.user-email {
  font-size: 0.76rem;
  color: rgba(245, 244, 227, 0.7);
  line-height: 1.2;
}

.btn-logout {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: rgba(245, 244, 227, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
}
</style>
