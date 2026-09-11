import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap 5 & Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Custom Design System (Graphic Garden & eCoursie Layout)
import './assets/styles/main.css'

// Initialize storage seed data
import { initStorage } from './services/storage'
initStorage()

const app = createApp(App)
app.use(router)
app.mount('#app')
