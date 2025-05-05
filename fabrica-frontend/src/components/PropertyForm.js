import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Link from 'next/link'

export default function PropertyForm({ initialData = {}, isEdit = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    currency: initialData.currency || 'AED',
    status: initialData.status || 'available',
    listingType: initialData.listingType || 'secondary',
    bedrooms: initialData.bedrooms || '',
    bathrooms: initialData.bathrooms || '',
    area: initialData.area || '',
    areaUnit: initialData.areaUnit || 'sqft',
    propertyType: initialData.propertyType || 'apartment',
    furnishing: initialData.furnishing || 'unfurnished',
    ownership: initialData.ownership || 'freehold',
    handoverDate: initialData.handoverDate ? new Date(initialData.handoverDate).toISOString().split('T')[0] : '',
    paymentPlan: initialData.paymentPlan || '',
    downPayment: initialData.downPayment || '',
    installments: initialData.installments || '',
    developer: initialData.developer || '',
    reraPermit: initialData.reraPermit || '',
    location: {
      city: initialData.location?.city || 'Dubai',
      community: initialData.location?.community || '',
      district: initialData.location?.district || '',
      latitude: initialData.location?.latitude || '',
      longitude: initialData.location?.longitude || '',
      address: initialData.location?.address || ''
    },
    features: initialData.features?.join(', ') || '',
    images: (initialData.images || []).join(','),
    videoUrl: initialData.videoUrl || '',
    virtualTourUrl: initialData.virtualTourUrl || '',
    floorPlanUrl: initialData.floorPlanUrl || '',
    threeDModelUrl: initialData.threeDModelUrl || '',
    
    // CRM Fields
    leadStatus: initialData.leadStatus || 'new',
    priority: initialData.priority || 'medium',
    source: initialData.source || 'manual',
    followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
    tags: initialData.tags?.join(', ') || '',
    notes: initialData.notes || ''
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    video: null,
    floorPlan: null,
    threeDModel: null,
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('basic') // basic, location, features, media, crm
  const { token } = useContext(AuthContext)
  const router = useRouter()

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested location object
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    
    if (name === 'propertyImages') {
      setUploadedFiles(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }))
    } else if (name === 'propertyVideo') {
      setUploadedFiles(prev => ({
        ...prev,
        video: files[0]
      }))
    } else if (name === 'floorPlan') {
      setUploadedFiles(prev => ({
        ...prev,
        floorPlan: files[0]
      }))
    } else if (name === 'threeDModel') {
      setUploadedFiles(prev => ({
        ...prev,
        threeDModel: files[0]
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }
    
    if (formData.bedrooms && (isNaN(formData.bedrooms) || Number(formData.bedrooms) < 0)) {
      newErrors.bedrooms = 'Bedrooms must be a positive number'
    }
    
    if (formData.bathrooms && (isNaN(formData.bathrooms) || Number(formData.bathrooms) < 0)) {
      newErrors.bathrooms = 'Bathrooms must be a positive number'
    }
    
    if (formData.area && (isNaN(formData.area) || Number(formData.area) <= 0)) {
      newErrors.area = 'Area must be a positive number'
    }
    
    // Validate latitude/longitude if provided
    if (formData.location.latitude && (isNaN(formData.location.latitude) || 
        Number(formData.location.latitude) < -90 || Number(formData.location.latitude) > 90)) {
      newErrors['location.latitude'] = 'Latitude must be between -90 and 90'
    }
    
    if (formData.location.longitude && (isNaN(formData.location.longitude) || 
        Number(formData.location.longitude) < -180 || Number(formData.location.longitude) > 180)) {
      newErrors['location.longitude'] = 'Longitude must be between -180 and 180'
    }
    
    // Off-plan specific validation
    if (formData.listingType === 'off-plan') {
      if (formData.downPayment && (isNaN(formData.downPayment) || 
          Number(formData.downPayment) < 0 || Number(formData.downPayment) > 100)) {
        newErrors.downPayment = 'Down payment must be between 0 and 100'
      }
      
      if (formData.installments && (isNaN(formData.installments) || 
          Number(formData.installments) < 0)) {
        newErrors.installments = 'Installments must be a positive number'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFiles = async () => {
    const uploadedImageUrls = []
    let videoUrl = formData.videoUrl
    let floorPlanUrl = formData.floorPlanUrl
    let threeDModelUrl = formData.threeDModelUrl
    
    // Upload images
    if (uploadedFiles.images.length > 0) {
      for (const image of uploadedFiles.images) {
        const formDataObj = new FormData()
        formDataObj.append('file', image)
        formDataObj.append('type', 'image')
        
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/upload`,
            formDataObj,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          uploadedImageUrls.push(res.data.fileUrl)
        } catch (err) {
          console.error('Error uploading image:', err)
        }
      }
    }
    
    // Upload video
    if (uploadedFiles.video) {
      const formDataObj = new FormData()
      formDataObj.append('file', uploadedFiles.video)
      formDataObj.append('type', 'video')
      
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/upload`,
          formDataObj,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        videoUrl = res.data.fileUrl
      } catch (err) {
        console.error('Error uploading video:', err)
      }
    }
    
    // Upload floor plan
    if (uploadedFiles.floorPlan) {
      const formDataObj = new FormData()
      formDataObj.append('file', uploadedFiles.floorPlan)
      formDataObj.append('type', 'file')
      
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/upload`,
          formDataObj,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        floorPlanUrl = res.data.fileUrl
      } catch (err) {
        console.error('Error uploading floor plan:', err)
      }
    }
    
    // Upload 3D model
    if (uploadedFiles.threeDModel) {
      const formDataObj = new FormData()
      formDataObj.append('file', uploadedFiles.threeDModel)
      formDataObj.append('type', 'file')
      
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/upload`,
          formDataObj,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        threeDModelUrl = res.data.fileUrl
      } catch (err) {
        console.error('Error uploading 3D model:', err)
      }
    }
    
    // Combine existing image URLs with newly uploaded ones
    const existingImageUrls = formData.images ? formData.images.split(',').filter(url => url.trim()) : []
    const allImageUrls = [...existingImageUrls, ...uploadedImageUrls]
    
    return {
      images: allImageUrls,
      videoUrl,
      floorPlanUrl,
      threeDModelUrl
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSuccessMessage('')
    
    // Upload files first
    const uploadedUrls = await uploadFiles()
    
    // Prepare payload
    const features = formData.features.split(',')
      .map(feature => feature.trim())
      .filter(feature => feature !== '')
    
    const tags = formData.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '')
    
    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      currency: formData.currency,
      status: formData.status,
      listingType: formData.listingType,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      area: formData.area ? Number(formData.area) : null,
      areaUnit: formData.areaUnit,
      propertyType: formData.propertyType,
      furnishing: formData.furnishing,
      ownership: formData.ownership,
      handoverDate: formData.handoverDate || null,
      paymentPlan: formData.paymentPlan || null,
      downPayment: formData.downPayment ? Number(formData.downPayment) : null,
      installments: formData.installments ? Number(formData.installments) : null,
      developer: formData.developer || null,
      reraPermit: formData.reraPermit || null,
      location: {
        city: formData.location.city,
        community: formData.location.community,
        district: formData.location.district,
        latitude: formData.location.latitude ? Number(formData.location.latitude) : null,
        longitude: formData.location.longitude ? Number(formData.location.longitude) : null,
        address: formData.location.address
      },
      features: features,
      images: uploadedUrls.images,
      videoUrl: uploadedUrls.videoUrl,
      virtualTourUrl: formData.virtualTourUrl || null,
      floorPlanUrl: uploadedUrls.floorPlanUrl,
      threeDModelUrl: uploadedUrls.threeDModelUrl,
      
      // CRM Fields
      leadStatus: formData.leadStatus,
      priority: formData.priority,
      source: formData.source,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null,
      tags: tags,
      notes: formData.notes || null
    }

    try {
      if (isEdit) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/properties/${initialData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccessMessage('Property updated successfully!')
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/properties`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccessMessage('Property created successfully!')
        
        // Reset form after successful creation
        if (!isEdit) {
          setFormData({
            title: '',
            description: '',
            price: '',
            currency: 'AED',
            status: 'available',
            listingType: 'secondary',
            bedrooms: '',
            bathrooms: '',
            area: '',
            areaUnit: 'sqft',
            propertyType: 'apartment',
            furnishing: 'unfurnished',
            ownership: 'freehold',
            handoverDate: '',
            paymentPlan: '',
            downPayment: '',
            installments: '',
            developer: '',
            reraPermit: '',
            location: {
              city: 'Dubai',
              community: '',
              district: '',
              latitude: '',
              longitude: '',
              address: ''
            },
            features: '',
            images: '',
            videoUrl: '',
            virtualTourUrl: '',
            floorPlanUrl: '',
            threeDModelUrl: '',
            
            // CRM Fields
            leadStatus: 'new',
            priority: 'medium',
            source: 'manual',
            followUpDate: '',
            tags: '',
            notes: ''
          })
          
          setUploadedFiles({
            images: [],
            video: null,
            floorPlan: null,
            threeDModel: null,
          })
        }
      }
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error saving property:', err)
      setErrors({ submit: 'Failed to save property. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Property' : 'Create New Property'}
            </h1>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6">
          <button
            className={`py-2 px-4 ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => handleTabChange('basic')}
          >
            Basic Info
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'location' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => handleTabChange('location')}
          >
            Location
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'features' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => handleTabChange('features')}
          >
            Features
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => handleTabChange('media')}
          >
            Media
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'crm' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => handleTabChange('crm')}
          >
            CRM
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Title<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Luxury Villa in Downtown"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                    Price<span className="text-red-600">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-l-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. 1000000"
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-r-md p-2 bg-gray-50"
                    >
                      <option value="AED">AED</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Describe the property..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                    Status<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="off-plan">Off-Plan</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="listingType">
                    Listing Type
                  </label>
                  <select
                    id="listingType"
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="secondary">Secondary</option>
                    <option value="off-plan">Off-Plan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="propertyType">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bedrooms">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    step="1"
                    />
                    {errors.bedrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
                    )}
                    </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bathrooms">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    step="0.5"
                  />
                  {errors.bathrooms && (
                    <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="area">
                    Area
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-l-md ${errors.area ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                    />
                    <select
                      name="areaUnit"
                      value={formData.areaUnit}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-r-md p-2 bg-gray-50"
                    >
                      <option value="sqft">sqft</option>
                      <option value="sqm">sqm</option>
                    </select>
                  </div>
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="furnishing">
                    Furnishing
                  </label>
                  <select
                    id="furnishing"
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="furnished">Furnished</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ownership">
                    Ownership
                  </label>
                  <select
                    id="ownership"
                    name="ownership"
                    value={formData.ownership}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reraPermit">
                    RERA Permit
                  </label>
                  <input
                    type="text"
                    id="reraPermit"
                    name="reraPermit"
                    value={formData.reraPermit}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Permit number"
                  />
                </div>
              </div>
              
              {/* Off-plan specific fields - conditionally shown when listingType is 'off-plan' */}
              {formData.listingType === 'off-plan' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Off-Plan Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="developer">
                        Developer
                      </label>
                      <input
                        type="text"
                        id="developer"
                        name="developer"
                        value={formData.developer}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Developer name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="handoverDate">
                        Handover Date
                      </label>
                      <input
                        type="date"
                        id="handoverDate"
                        name="handoverDate"
                        value={formData.handoverDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentPlan">
                        Payment Plan
                      </label>
                      <input
                        type="text"
                        id="paymentPlan"
                        name="paymentPlan"
                        value={formData.paymentPlan}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g. 40/60"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="downPayment">
                        Down Payment (%)
                      </label>
                      <input
                        type="number"
                        id="downPayment"
                        name="downPayment"
                        value={formData.downPayment}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.downPayment ? 'border-red-500' : 'border-gray-300'}`}
                        min="0"
                        max="100"
                        placeholder="e.g. 20"
                      />
                      {errors.downPayment && (
                        <p className="mt-1 text-sm text-red-600">{errors.downPayment}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="installments">
                        Installments
                      </label>
                      <input
                        type="number"
                        id="installments"
                        name="installments"
                        value={formData.installments}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.installments ? 'border-red-500' : 'border-gray-300'}`}
                        min="0"
                        placeholder="Number of installments"
                      />
                      {errors.installments && (
                        <p className="mt-1 text-sm text-red-600">{errors.installments}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.city">
                    City
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Dubai"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.community">
                    Community
                  </label>
                  <input
                    type="text"
                    id="location.community"
                    name="location.community"
                    value={formData.location.community}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Downtown"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.district">
                    District
                  </label>
                  <input
                    type="text"
                    id="location.district"
                    name="location.district"
                    value={formData.location.district}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Burj Khalifa District"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Full address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.latitude">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="location.latitude"
                    name="location.latitude"
                    value={formData.location.latitude}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors['location.latitude'] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 25.1972"
                  />
                  {errors['location.latitude'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['location.latitude']}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location.longitude">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="location.longitude"
                    name="location.longitude"
                    value={formData.location.longitude}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors['location.longitude'] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 55.2744"
                  />
                  {errors['location.longitude'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['location.longitude']}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800 mb-2">Map Preview</h3>
                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  {formData.location.latitude && formData.location.longitude ? (
                    <p>Map would display at: {formData.location.latitude}, {formData.location.longitude}</p>
                  ) : (
                    <p>Enter latitude and longitude to see map preview</p>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Note: You can get coordinates from Google Maps by right-clicking on a location and selecting Whats here?
                </p>
              </div>
            </div>
          )}
          
          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Property Features</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="features">
                  Features (comma-separated)
                </label>
                <textarea
                  id="features"
                  name="features"
                  rows="4"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. private pool, maid room, balcony, covered parking, central AC"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  Enter features separated by commas (e.g. private pool, maid room, balcony)
                </p>
              </div>
              
              {/* Feature preview */}
              {formData.features && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Preview</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.split(',').map((feature, index) => (
                      feature.trim() && (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {feature.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800 mb-2">Common Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'Private pool', 
                    'Balcony', 
                    'Maid room', 
                    'Study room',
                    'Walk-in closet', 
                    'Covered parking', 
                    'Gym', 
                    'Central AC',
                    'Sea view', 
                    'City view', 
                    'Garden', 
                    'Jacuzzi',
                    'Security', 
                    'Pet friendly', 
                    'Concierge service', 
                    'Shared pool'
                  ].map((feature, index) => (
                    <button
                      key={index}
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm"
                      onClick={() => {
                        const currentFeatures = formData.features ? formData.features.split(',').map(f => f.trim()) : [];
                        const featureLower = feature.toLowerCase();
                        
                        // Check if feature already exists (case insensitive)
                        if (!currentFeatures.some(f => f.toLowerCase() === featureLower)) {
                          const newFeatures = [...currentFeatures, feature].filter(Boolean);
                          setFormData({
                            ...formData,
                            features: newFeatures.join(', ')
                          });
                        }
                      }}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Media</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Images
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-l-md"
                    placeholder="Enter comma-separated image URLs or upload files below"
                  />
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Images
                  </label>
                  <input
                    type="file"
                    name="propertyImages"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Image Preview - Show if there are any images */}
                {(formData.images || uploadedFiles.images.length > 0) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {/* Existing images */}
                      {formData.images.split(',').map((url, index) => (
                        url.trim() && (
                          <div key={`existing-${index}`} className="group relative aspect-video bg-gray-200 rounded overflow-hidden">
                            <img 
                              src={url.trim()} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTE5IDNINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDVWNWgxNHYxNHptLTUuMDQtNi45NGwyLjQ0LTIuNDQgMS4xOCAxLjE4LTMuNjIgMy42Mi0yLjQ0LTIuNDQgMS4xOC0xLjE4em0tNi4zOCAxLjg4bDIuNDQgMi40NCAxLjE4LTEuMTgtMy42Mi0zLjYyLTIuNDQgMi40NCAxLjE4IDEuMTh6Ii8+PC9zdmc+';
                                e.target.classList.add('error-image');
                              }}
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newImages = formData.images.split(',')
                                  .filter((_, i) => i !== index)
                                  .join(',');
                                setFormData({...formData, images: newImages});
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )
                      ))}
                      
                      {/* Newly uploaded images */}
                      {Array.from(uploadedFiles.images).map((file, index) => (
                        <div key={`new-${index}`} className="group relative aspect-video bg-gray-200 rounded overflow-hidden">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`New upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
                            New
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFiles = [...uploadedFiles.images];
                              newFiles.splice(index, 1);
                              setUploadedFiles({...uploadedFiles, images: newFiles});
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. https://yourdomain.com/videos/property.mp4"
                  />
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Video File
                    </label>
                    <input
                      type="file"
                      name="propertyVideo"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Virtual Tour URL
                  </label>
                  <input
                    type="text"
                    name="virtualTourUrl"
                    value={formData.virtualTourUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. https://my-virtual-tour-provider.com/tour/12345"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor Plan URL
                  </label>
                  <input
                    type="text"
                    name="floorPlanUrl"
                    value={formData.floorPlanUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. https://yourdomain.com/floorplans/property.pdf"
                  />
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Floor Plan
                    </label>
                    <input
                      type="file"
                      name="floorPlan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    3D Model URL
                  </label>
                  <input
                    type="text"
                    name="threeDModelUrl"
                    value={formData.threeDModelUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. https://yourdomain.com/models/property.glb"
                  />
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload 3D Model
                    </label>
                    <input
                      type="file"
                      name="threeDModel"
                      accept=".glb,.gltf,.obj"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* CRM Tab */}
          {activeTab === 'crm' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">CRM Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="leadStatus">
                    Lead Status
                  </label>
                  <select
                    id="leadStatus"
                    name="leadStatus"
                    value={formData.leadStatus}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="hot">Hot</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="source">
                    Source
                  </label>
                  <select
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="manual">Manual</option>
                    <option value="website">Website</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="followUpDate">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. VIP, urgent, cash buyer"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter tags separated by commas (e.g. VIP, urgent, cash buyer)
                </p>
              </div>
              
              {/* Tags preview */}
              {formData.tags && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Tags Preview</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      tag.trim() && (
                        <span 
                          key={index} 
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800 mb-2">Common Tags</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'VIP', 
                    'Urgent', 
                    'Cash buyer', 
                    'Investor',
                    'End user', 
                    'First-time buyer', 
                    'Repeat client', 
                    'Local',
                    'International', 
                    'Negotiable', 
                    'Motivated seller', 
                    'Viewing scheduled'
                  ].map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm"
                      onClick={() => {
                        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
                        const tagLower = tag.toLowerCase();
                        
                        // Check if tag already exists (case insensitive)
                        if (!currentTags.some(t => t.toLowerCase() === tagLower)) {
                          const newTags = [...currentTags, tag].filter(Boolean);
                          setFormData({
                            ...formData,
                            tags: newTags.join(', ')
                          });
                        }
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add any additional notes about this property..."
                ></textarea>
              </div>
              
              {/* Agent Assignment - In a real application, this would include a dropdown for assigning agents */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Agency Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Agent
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    >
                      <option value="">Current User</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Agent assignment feature will be available in a future update
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agency
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      value="Fabrica Real Estate"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 flex justify-end space-x-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting 
                ? 'Saving...' 
                : isEdit 
                  ? 'Update Property' 
                  : 'Create Property'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}