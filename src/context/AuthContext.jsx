import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('qm_token')
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('qm_user')
        localStorage.removeItem('qm_token')
        return null
      }
      return JSON.parse(localStorage.getItem('qm_user'))
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('qm_token')
    if (t && isTokenExpired(t)) {
      localStorage.removeItem('qm_token')
      return null
    }
    return t || null
  })

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
