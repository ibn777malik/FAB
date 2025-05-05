// src/components/ProtectedRoute.js
import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token])

  if (!token) return null
  return children
}
