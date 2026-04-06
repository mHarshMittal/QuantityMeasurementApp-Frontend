import client from './client'

export const authApi = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }).then(r => r.data),

  register: (name, email, password) =>
    client.post('/auth/register', { name, email, password }).then(r => r.data),
}
