// stores/auth.js
import { defineStore } from "pinia"
import api from "@/plugins/axios"
import router from "@/router"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  
  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('Step 1: Getting CSRF cookie...')
        
        // 1. Get CSRF cookie first
        await api.get("/sanctum/csrf-cookie")
        
        
        // 2. Attempt login
        const response = await api.post("/login", credentials)
        
        console.log('Login response:', response.data.status)

        if(response.data.status === 401){
          alert('email or passowrd incorret')
          router.push('/login')
          return { success: false } // ✅ Stop execution here
        }
        
        if (response.data.status === 200) {
        //   console.log('Step 3: Fetching user data...')
          
        //   // 3. Get user data
        //   await this.fetchUser()
        //   console.log('Login successful, user:', this.user)
          return { success: true }
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Login failed'
        console.error('Login error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        })
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await api.post("/logout")
        this.user = null

        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async fetchUser() {
      try {
        const response = await api.get("/user")
        this.user = response.data
        console.log('User fetched successfully:', this.user)
        return this.user
      } catch (error) {
        console.error('Fetch user error:', error)
        this.user = null
        throw error
      }
    },
  },
  
  persist: true,
})