/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import LoginPage from '@/pages/LoginPage.vue'
import CreateTicketPage from '@/pages/CreateTicketPage.vue'
import Tickets from '@/pages/Tickets.vue'
import MyTickets from '@/pages/MyTickets.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        path: '/',

        component: AuthLayout,
        children: [
          {
            path:'register',
            name: 'register',
            component: RegisterPage
          
          },
          {
            path:'login',
            name: 'login',
            component: LoginPage
          }
        ]
      },
      {
        path: '/',

        component: DefaultLayout,
        children: [
          {
            path:'dashboard',
            name:'dashboard',
            component: Dashboard
          },{
            path:'tickets/create',
            name:'create-ticket',
            component: CreateTicketPage
          },{
            path:'tickets',
            name:'tickets',
            component: Tickets
          },{
            path:'tickets/my',
            name:'my-tickets',
            component: MyTickets
          }
        ]
      }
    ],

  
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
