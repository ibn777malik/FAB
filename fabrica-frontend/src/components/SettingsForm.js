// src/components/SettingsForm.js
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'

export default function SettingsForm() {
  const { token } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    // fetch current profile
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setEmail(res.data.email)
      })
      .catch(() => setStatus('Failed to load profile'))
  }, [token])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/me`,
        { email, ...(password ? { password } : {}) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStatus('Profile updated successfully!')
    } catch {
      setStatus('Failed to update profile')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-2xl">Your Settings</h2>
      {status && <p className="text-sm text-green-600">{status}</p>}

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </form>
  )
}
