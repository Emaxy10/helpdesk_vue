import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { useAuthStore } from '@/stores/auth'

// Styles
import 'unfonts.css'

const app = createApp(App)

// ----------------------
// Pinia
// ----------------------
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// ----------------------
// Register other plugins (Vuetify already initialized here)
// ----------------------
registerPlugins(app)

// ----------------------
// Load persisted auth
// ----------------------
const authStore = useAuthStore()
authStore.loadFromLocalStorage()

// ----------------------
// Mount app
// ----------------------
app.mount('#app')
console.log('App mounted with Pinia ✅')
