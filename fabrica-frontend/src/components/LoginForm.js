// src/components/LoginForm.js
import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setToken } = useContext(AuthContext)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
        console.log('Logging in to:', process.env.NEXT_PUBLIC_API_BASE + '/auth/login')
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, { email, password })
      setToken(res.data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  )
}