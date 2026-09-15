<template>
  <div class="app-container" :class="{ 'login-layout': isLoginPage }">
    <!-- Mobile Top Bar with Toggle -->
    <header v-if="!isLoginPage" class="mobile-header d-lg-none d-flex align-items-center justify-content-between p-3">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-light border" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <i class="bi bi-list fs-5"></i>
        </button>
        <span class="fw-bold text-primary fs-5">StudyFlow</span>
      </div>
    </header>

    <!-- 1. Left Sidebar (Fixed / Persistent) -->
    <div v-if="!isLoginPage" :class="['sidebar-wrapper', { 'mobile-open': isMobileMenuOpen }]">
      <Sidebar @navigate="isMobileMenuOpen = false" />
      <div v-if="isMobileMenuOpen" class="sidebar-backdrop d-lg-none" @click="isMobileMenuOpen = false"></div>
    </div>

    <!-- 2. Main Center Content -->
    <main class="main-content-area flex-grow-1" :class="{ 'p-0': isLoginPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const isLoginPage = computed(() => route.name === 'Login' || route.path === '/login')

watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
})
</script>

<style>
/* Global CSS is imported in main.js, this is structural layout */
.mobile-header {
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 999;
}

.sidebar-wrapper {
  position: relative;
  z-index: 1000;
}

@media (max-width: 991px) {
  .sidebar-wrapper {
    position: fixed;
    top: 0;
    left: -280px;
    bottom: 0;
    transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sidebar-wrapper.mobile-open {
    left: 0;
  }

  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 260px;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
  }
}
</style>
