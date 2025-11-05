// stores/auth.js
import { defineStore } from "pinia"
import api from "@/plugins/axios"
import router from "@/router"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
    token: localStorage.getItem("token") || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  
  actions: {
    async login(credentials) {
      
       try {
         // 👇 Step 1: Get CSRF cookie first
        await api.get("/sanctum/csrf-cookie");

        const response = await api.post("/login", credentials);

        this.user = response.data.user;
        this.token = response.data.token;

        console.log(this.user)

        // Save token to localStorage
        localStorage.setItem("token", this.token);

        // Set default Authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        return true;
      } catch (error) {
        console.error("Login failed:", error.response?.data || error);
        throw error;
      }
      
      
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    async fetchUser() {

    },
  },
  
  persist: true,
})