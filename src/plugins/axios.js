// src/plugins/axios.js
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const api = axios.create({
  baseURL: "http://localhost/helpdesk/public/api",
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
})

// ✅ Helper to get CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
}

// ✅ Interceptor: attach both CSRF + latest auth token dynamically
api.interceptors.request.use((config) => {
  // Attach CSRF token
  const csrfToken = getCookie("XSRF-TOKEN")
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken)
  }

  // ✅ Always get latest token from Pinia (handles refresh case)
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})


api.interceptors.response.use(
  response => response,

  error => {
    if(error.response && error.response.status === 401){
      console.log(error.response);
      //clear tokens
      const authStore = useAuthStore();
      authStore.clearTokens(); //
      alert("Not logged in")
         // Redirect to login page
      router.push('/login') // make sure 'login' is a named route
    }
    return Promise.reject(error)
  }
)

export default api
