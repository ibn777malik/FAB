// src/pages/properties/admin/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import PropertyForm from '../../../components/PropertyForm'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { AuthContext } from '../../../contexts/AuthContext'

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = router.query
  const { token } = useContext(AuthContext)
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id || !token) return
    
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/properties/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setInitialData(res.data)
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Failed to load property. It may have been deleted or you may not have permission to view it.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperty()
  }, [id, token])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!initialData) return null

  return (
    <ProtectedRoute>
      <PropertyForm initialData={initialData} isEdit={true} />
    </ProtectedRoute>
  )
}