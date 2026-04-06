import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8080',
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
    const msg = err.response?.data?.message || err.response?.data || err.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default client
