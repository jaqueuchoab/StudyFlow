<template>
  <aside class="study-sidebar">
    <!-- Brand / Logo Area -->
    <div class="sidebar-brand d-flex align-items-center gap-3">
      <div class="brand-logo-circle">
        <i class="bi bi-journal-bookmark-fill"></i>
      </div>
      <div class="brand-text">
        <span class="brand-title">StudyFlow</span>
        <span class="brand-tag">Gestão de Estudos</span>
      </div>
    </div>

    <!-- Main Navigation Items -->
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
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <span>Minhas Disciplinas</span>
          </router-link>
        </li>

        <!-- Estudos Paralelos (Etapa 2) -->
        <li class="nav-item">
          <div class="nav-link nav-link-disabled" title="Disponível na Etapa 2">
            <div class="nav-icon">
              <i class="bi bi-layers-fill"></i>
            </div>
            <span>Estudos Paralelos</span>
            <span class="badge-stage-2">Etapa 2</span>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// Navigation only
</script>

<style scoped>
.study-sidebar {
  width: var(--sidebar-width);
  background-color: var(--color-primary);
  color: var(--color-text-light);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  flex-shrink: 0;
  box-shadow: 4px 0 20px rgba(161, 132, 229, 0.2);
  z-index: 10;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-brand {
  margin-bottom: 2.5rem;
  padding-left: 0.5rem;
}

.brand-logo-circle {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  box-shadow: 0 4px 12px rgba(194, 208, 57, 0.35);
}

.brand-title {
  display: block;
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.brand-tag {
  display: block;
  font-size: 0.72rem;
  color: rgba(245, 244, 227, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
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
  gap: 1rem;
  padding: 0.85rem 1.15rem;
  border-radius: var(--border-radius-pill);
  color: rgba(245, 244, 227, 0.9);
  font-weight: 600;
  font-size: 0.94rem;
  transition: all 0.22s ease;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.14);
  color: #fff;
  transform: translateX(3px);
}

.nav-link.active {
  background-color: var(--color-bg);
  color: var(--color-primary);
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.nav-link.active .nav-icon {
  color: var(--color-primary);
}

.nav-link-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.nav-link-disabled:hover {
  transform: none;
  background: transparent;
}

.badge-stage-2 {
  font-size: 0.68rem;
  background-color: rgba(194, 208, 57, 0.3);
  color: var(--color-accent);
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  margin-left: auto;
}

.nav-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
