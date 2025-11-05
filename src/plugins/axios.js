// plugins/axios.js
import axios from "axios"
import { useAuthStore } from "@/stores/auth"
import router from '@/router'

const api = axios.create({
  baseURL: "http://localhost/helpdesk/public/api", 
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
})


api.interceptors.request.use((config) => {
  // Get CSRF token from cookie
  const csrfToken = getCookie('XSRF-TOKEN')
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken)
  }
  return config
})

// Load token from localStorage if it exists
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export default api