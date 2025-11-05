// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('auth-store', JSON.stringify({ token: this.token, user: this.user }))
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('auth-store', JSON.stringify({ token: this.token, user: this.user }))
    },
    loadFromLocalStorage() {
      const data = localStorage.getItem('auth-store')
      if (data) {
        const parsed = JSON.parse(data)
        this.user = parsed.user || null
        this.token = parsed.token || null
      }
    },
    clearTokens() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth-store')
    }
  }
})
