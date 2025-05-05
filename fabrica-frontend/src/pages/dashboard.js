// src/pages/dashboard.js
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../contexts/AuthContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { token, logout } = useContext(AuthContext)
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    reservedProperties: 0,
    soldProperties: 0
  })
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      console.log('No authentication token available - user needs to log in first')
      router.push('/login') // Redirect to login if no token
      return
    }
    
    console.log('Token available - fetching data')
    
    // Fetch user profile (mock implementation)
    setUserProfile({
      name: 'Admin User',
      email: 'admin@fabrica.com',
      role: 'Administrator'
    })
    
    // Load properties with the token
    const fetchProperties = async () => {
      if (tab !== 'properties') return
      
      setLoading(true)
      try {
        console.log('Making authenticated API request to fetch properties')
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/properties`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log(`Successfully fetched ${res.data.length} properties`)
        setProperties(res.data)
        
        // Calculate dashboard stats
        const stats = {
          totalProperties: res.data.length,
          availableProperties: res.data.filter(p => p.status === 'available').length,
          reservedProperties: res.data.filter(p => p.status === 'reserved').length,
          soldProperties: res.data.filter(p => p.status === 'sold').length
        }
        
        setDashboardStats(stats)
      } catch (err) {
        console.error('Error fetching properties:', err)
        if (err.response?.status === 401) {
          console.error('Authentication failed - token may be invalid or expired')
          alert('Your session has expired. Please log in again.')
          logout() // Clear token and redirect to login
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperties()
  }, [token, tab, logout, router])

  const loadProperties = async () => {
    if (tab !== 'properties' || !token) return
    setLoading(true)
    
    try {
      console.log('Making API request with token:', token.substring(0, 20) + '...')
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/properties`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('API response received:', res.status)
      setProperties(res.data)
      
      // Calculate dashboard stats
      const stats = {
        totalProperties: res.data.length,
        availableProperties: res.data.filter(p => p.status === 'available').length,
        reservedProperties: res.data.filter(p => p.status === 'reserved').length,
        soldProperties: res.data.filter(p => p.status === 'sold').length
      }
      
      setDashboardStats(stats)
    } catch (err) {
      console.error('Error loading properties:', err)
      console.error('Error details:', err.response?.data || 'No response data')
      console.error('Error status:', err.response?.status || 'No status code')
      
      // If token is invalid, redirect to login
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.')
        logout() // Make sure this function clears the token and redirects
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/properties/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the properties list
      setProperties(prevProperties => prevProperties.filter(p => p.id !== id))
      
      // Update dashboard stats
      const deletedProperty = properties.find(p => p.id === id)
      if (deletedProperty) {
        setDashboardStats(prev => ({
          ...prev,
          totalProperties: prev.totalProperties - 1,
          availableProperties: deletedProperty.status === 'available' ? prev.availableProperties - 1 : prev.availableProperties,
          reservedProperties: deletedProperty.status === 'reserved' ? prev.reservedProperties - 1 : prev.reservedProperties,
          soldProperties: deletedProperty.status === 'sold' ? prev.soldProperties - 1 : prev.soldProperties
        }))
      }
    } catch (err) {
        console.error('Error deleting property:', err)
        alert('Failed to delete property')
      }
    }

  // Filter properties based on search term
  const filteredProperties = properties.filter(prop => 
    prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md z-10">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Fabrica CRM</h1>
          </div>
          <div className="p-4">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Logged in as:</p>
              <p className="font-medium">{userProfile?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{userProfile?.role || 'User'}</p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  tab === 'dashboard' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => setTab('properties')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  tab === 'properties' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Properties
              </button>
              <button
                onClick={() => setTab('settings')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  tab === 'settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </button>
            </nav>
          </div>
          <div className="p-4 border-t mt-auto">
            <button 
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2v10h10V5H4zm2.293 4.293a1 1 0 011.414 0L9 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'properties' && 'Property Management'}
                {tab === 'settings' && 'User Settings'}
              </h1>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  View Website
                </Link>
              </div>
            </div>
          </header>

          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Properties</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalProperties}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Available</p>
                      <p className="text-2xl font-bold">{dashboardStats.availableProperties}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Reserved</p>
                      <p className="text-2xl font-bold">{dashboardStats.reservedProperties}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Sold</p>
                      <p className="text-2xl font-bold">{dashboardStats.soldProperties}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">Activity logs will be displayed here in the future.</p>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {tab === 'properties' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="pl-10 pr-4 py-2 border rounded-md w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <button
  className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
  onClick={() => router.push('/properties/admin/new')}
>
  New Property
</button>
              </div>

              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">Loading properties...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">No properties found.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map(prop => (
  <tr key={prop.id}>
    <td className="border px-4 py-2">{prop.title}</td>
    <td className="border px-4 py-2">{prop.price}</td>
    <td className="border px-4 py-2">{prop.status}</td>
    <td className="border px-4 py-2">
      <button
        className="text-blue-500 mr-2"
        onClick={() => router.push(`/properties/admin/${prop.id}`)}
      >
        Edit
      </button>
      <button
        className="text-red-500"
        onClick={() => handleDelete(prop.id)}
      >
        Delete
      </button>
    </td>
  </tr>
))}
                     
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        defaultValue={userProfile?.name || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        defaultValue={userProfile?.email || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                        defaultValue={userProfile?.role || ''}
                        disabled
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}