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
    type: '',
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
      console.log('Loaded properties:', res.data)
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
      
      // Filter by property type
      if (filters.type && property.propertyType !== filters.type) return false
      
      // Filter by min price
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false
      
      // Filter by max price
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false
      
      return true
    })
  }

  const filteredProperties = applyFilters()

  // Format currency
  const formatCurrency = (value, currency = 'AED') => {
    if (!value) return `${currency} 0`;
    return `${currency} ${value.toLocaleString()}`;
  };

  return (
    <Layout title="Fabrica Real Estate - All Properties">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Explore Our Properties</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <option value="off-plan">Off-Plan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Property Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="plot">Plot</option>
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
              onClick={() => setFilters({ status: '', type: '', minPrice: '', maxPrice: '' })}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-gray-200 relative">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0].startsWith('http') 
                        ? property.images[0] 
                        : `${process.env.NEXT_PUBLIC_API_BASE}${property.images[0]}`} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                  <div className={`absolute top-0 right-0 m-4 px-3 py-1 text-sm font-semibold text-white rounded-full
                    ${property.status === 'available' ? 'bg-green-500' : 
                      property.status === 'reserved' ? 'bg-yellow-500' : 
                      property.status === 'off-plan' ? 'bg-blue-500' : 
                      'bg-red-500'}`}
                  >
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location ? (
                      <span>
                        {property.location.community ? `${property.location.community}, ` : ''}
                        {property.location.city || 'Dubai'}
                      </span>
                    ) : (
                      'Dubai'
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {property.description || 'No description available for this property.'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(property.price, property.currency)}
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      {property.propertyType && (
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                          {property.propertyType}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-700 mb-4">
                    {property.bedrooms !== undefined && property.bedrooms !== null && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                      </div>
                    )}
                    
                    {property.bathrooms !== undefined && property.bathrooms !== null && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </div>
                    )}
                    
                    {property.area !== undefined && property.area !== null && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {property.area} {property.areaUnit || 'sqft'}
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/properties/${property.id}`}
                    className="w-full block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}