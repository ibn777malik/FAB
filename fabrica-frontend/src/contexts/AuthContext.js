// src/contexts/AuthContext.js
import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext({ token: null, setToken: () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null)

  useEffect(() => {
    const t = Cookies.get('token')
    if (t) setTokenState(t)
  }, [])

  const setToken = newToken => {
    Cookies.set('token', newToken, { expires: 1 })
    setTokenState(newToken)
  }

  const logout = () => {
    Cookies.remove('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}