// src/pages/properties/index.js
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Layout from '../../components/Layout'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/properties`)
      setProperties(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching properties:', err)
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    return properties.filter(property => {
      // Filter by status
      if (filters.status && property.status !== filters.status) return false
      
      // Filter by min price
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false
      
      // Filter by max price
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false
      
      return true
    })
  }

  const filteredProperties = applyFilters()

  return (
    <Layout title="Fabrica Real Estate - All Properties">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">All Properties</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Min Price (AED)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Max Price (AED)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties match your filters.</p>
            <button 
              onClick={() => setFilters({ status: '', minPrice: '', maxPrice: '' })}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="property-image-container">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="property-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded">
                  {property.status}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                  <Link href={`/properties/${property.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}