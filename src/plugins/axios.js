// src/plugins/axios.js
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const api = axios.create({
  baseURL: "http://helpdesk_server/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Attach token automatically if stored
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});



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
