import axios from 'axios'

// IMPORTANT: Set VITE_API_GATEWAY_URL in Vercel → Settings → Environment Variables
// Value: your deployed API Gateway URL on Render
// Example: https://api-gateway-xxxx.onrender.com
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://api-gateway-7065.onrender.com'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
client.interceptors.request.use(config => {
  const token = localStorage.getItem('qm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize error messages
client.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err.response?.data?.message ||
      (typeof err.response?.data === 'string' ? err.response.data : null) ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default client
