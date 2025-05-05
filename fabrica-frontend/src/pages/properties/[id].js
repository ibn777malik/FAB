// src/pages/properties/[id].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Layout from '../../components/Layout'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    if (!id) return
    
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/properties/${id}`)
        setProperty(res.data)
      } catch (err) {
        console.error('Error fetching property details:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperty()
  }, [id])

  const handleInquiryChange = (e) => {
    const { name, value } = e.target
    setInquiry(prev => ({ ...prev, [name]: value }))
  }

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    
    // In a real application, this would send the inquiry to your backend
    // For now, we'll just simulate a success
    console.log('Sending inquiry:', { ...inquiry, propertyId: id })
    
    alert('Thank you for your inquiry! An agent will contact you soon.')
    setShowInquiryForm(false)
    setInquiry({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </Layout>
    )
  }
  if (!property) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties" className="text-blue-600 hover:underline">
            Back to Properties
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${property.title} | Fabrica Real Estate`}>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/properties" className="text-blue-600 hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px' }}
              className="mr-1"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back to Properties
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Property Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-gray-600">{property.description}</p>
              </div>
              <div className="text-right">
                <div className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-2">
                  {property.status}
                </div>
                <p className="text-2xl font-bold text-blue-600">AED {property.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            
            {property.images && property.images.length > 0 ? (
              <div>
                {/* Main Image */}
                <div className="h-96 bg-gray-200 mb-4 rounded overflow-hidden">
                  <img 
                    src={property.images[activeImage]} 
                    alt={`${property.title} - Image ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {property.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`h-20 bg-gray-200 rounded overflow-hidden cursor-pointer ${index === activeImage ? 'ring-2 ring-blue-600' : ''}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${property.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                No images available
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                <p>{property.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Price</h3>
                <p>AED {property.price.toLocaleString()}</p>
              </div>
              {/* More details would go here in a real application */}
            </div>
          </div>

          {/* Map - Placeholder for now */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="h-72 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Map will be displayed here
            </div>
          </div>

          {/* Contact Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interested in this property?</h2>
            
            {!showInquiryForm ? (
              <button 
                onClick={() => setShowInquiryForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
              >
                Contact Agent
              </button>
            ) : (
              <form onSubmit={handleInquirySubmit} className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={inquiry.name}
                      onChange={handleInquiryChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={inquiry.email}
                      onChange={handleInquiryChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={inquiry.phone}
                    onChange={handleInquiryChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={inquiry.message}
                    onChange={handleInquiryChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="I'm interested in this property and would like more information..."
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                  >
                    Send Inquiry
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}