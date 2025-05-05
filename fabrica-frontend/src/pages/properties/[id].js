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

  // Format currency with thousand separators
  const formatCurrency = (value, currency = 'AED') => {
    if (!value) return `${currency} 0`;
    return `${currency} ${value.toLocaleString()}`;
  };

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
          <p className="text-gray-600 mb-6">The property youre looking for doesnt exist or has been removed.</p>
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
                <p className="text-gray-600 mb-2">{property.description}</p>
                {property.location && (
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location.community && `${property.location.community}, `}
                    {property.location.city || 'Dubai'}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className={`bg-${property.status === 'available' ? 'green' : property.status === 'reserved' ? 'yellow' : property.status === 'off-plan' ? 'blue' : 'red'}-600 text-white px-4 py-2 rounded inline-block mb-2`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(property.price, property.currency)}</p>
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
                    src={property.images[activeImage].startsWith('http') 
                      ? property.images[activeImage] 
                      : `${process.env.NEXT_PUBLIC_API_BASE}${property.images[activeImage]}`} 
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
                          src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_BASE}${image}`} 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Property Type</h3>
                <p className="capitalize">{property.propertyType || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                <p className="capitalize">{property.status || 'N/A'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Price</h3>
                <p>{formatCurrency(property.price, property.currency)}</p>
              </div>
              
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Bedrooms</h3>
                  <p>{property.bedrooms}</p>
                </div>
              )}
              
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Bathrooms</h3>
                  <p>{property.bathrooms}</p>
                </div>
              )}
              
              {property.area !== undefined && property.area !== null && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Area</h3>
                  <p>{property.area} {property.areaUnit || 'sqft'}</p>
                </div>
              )}
              
              {property.furnishing && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Furnishing</h3>
                  <p className="capitalize">{property.furnishing}</p>
                </div>
              )}
              
              {property.ownership && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Ownership</h3>
                  <p className="capitalize">{property.ownership}</p>
                </div>
              )}
              
              {property.listingType && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Listing Type</h3>
                  <p className="capitalize">{property.listingType === 'off-plan' ? 'Off-Plan' : 'Secondary'}</p>
                </div>
              )}
              
              {/* Show additional off-plan details if applicable */}
              {property.listingType === 'off-plan' && (
                <>
                  {property.developer && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold text-gray-700 mb-2">Developer</h3>
                      <p>{property.developer}</p>
                    </div>
                  )}
                  
                  {property.handoverDate && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold text-gray-700 mb-2">Handover Date</h3>
                      <p>{new Date(property.handoverDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {property.paymentPlan && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold text-gray-700 mb-2">Payment Plan</h3>
                      <p>{property.paymentPlan}</p>
                    </div>
                  )}
                  
                  {property.downPayment && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold text-gray-700 mb-2">Down Payment</h3>
                      <p>{property.downPayment}%</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Features Section */}
          {property.features && property.features.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Section - Show if any additional media is available */}
          {(property.videoUrl || property.virtualTourUrl || property.floorPlanUrl || property.threeDModelUrl) && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Additional Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.videoUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Video Tour</h3>
                    <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                      {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                        <iframe 
                          src={property.videoUrl.replace('watch?v=', 'embed/')} 
                          title="Video tour"
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={property.videoUrl.startsWith('http') ? property.videoUrl : `${process.env.NEXT_PUBLIC_API_BASE}${property.videoUrl}`} 
                          controls
                          className="w-full h-full"
                        ></video>
                      )}
                    </div>
                  </div>
                )}
                
                {property.virtualTourUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Virtual Tour</h3>
                    <a 
                      href={property.virtualTourUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-blue-100 text-blue-800 rounded text-center"
                    >
                      View Virtual Tour
                    </a>
                  </div>
                )}
                
                {property.floorPlanUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Floor Plan</h3>
                    <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={property.floorPlanUrl.startsWith('http') ? property.floorPlanUrl : `${process.env.NEXT_PUBLIC_API_BASE}${property.floorPlanUrl}`} 
                        alt="Floor Plan"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                {property.threeDModelUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">3D Model</h3>
                    <a 
                      href={property.threeDModelUrl.startsWith('http') ? property.threeDModelUrl : `${process.env.NEXT_PUBLIC_API_BASE}${property.threeDModelUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-blue-100 text-blue-800 rounded text-center"
                    >
                      View 3D Model
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Section */}
          {property.location && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                    <p>{property.location.address || 'N/A'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {property.location.city && (
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-semibold text-gray-700 mb-2">City</h3>
                        <p>{property.location.city}</p>
                      </div>
                    )}
                    
                    {property.location.community && (
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-semibold text-gray-700 mb-2">Community</h3>
                        <p>{property.location.community}</p>
                      </div>
                    )}
                    
                    {property.location.district && (
                      <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-semibold text-gray-700 mb-2">District</h3>
                        <p>{property.location.district}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="h-64 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                  {property.location.latitude && property.location.longitude ? (
                    <div className="text-center text-gray-600">
                      <p>Map will be displayed here</p>
                      <p className="text-sm mt-2">Coordinates: {property.location.latitude}, {property.location.longitude}</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">No map coordinates available</p>
                  )}
                </div>
              </div>
            </div>
          )}

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