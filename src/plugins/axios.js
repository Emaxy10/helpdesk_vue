import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/helpdesk/public', // adjust as needed
  withCredentials: true, // 👈 important for CSRF cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const token = getCookieValue('XSRF-TOKEN')
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }
  return config
})

function getCookieValue(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}


export default api
