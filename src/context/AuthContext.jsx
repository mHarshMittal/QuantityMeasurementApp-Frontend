import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qm_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('qm_token') || null)

  const login = useCallback((userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('qm_user', JSON.stringify(userData))
    localStorage.setItem('qm_token', jwt)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('qm_user')
    localStorage.removeItem('qm_token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
