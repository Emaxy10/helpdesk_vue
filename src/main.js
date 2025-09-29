/**
 * main.js
 *
 * Bootstraps Vuetify, Pinia and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Styles
import 'unfonts.css'

const app = createApp(App)

// Create Pinia
const pinia = createPinia()
app.use(pinia)

// Register other plugins
registerPlugins(app)

// Mount App
app.mount('#app')
