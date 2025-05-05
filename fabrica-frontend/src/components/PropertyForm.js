// src/components/PropertyForm.js
import { useState, useEffect } from 'react'
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
    status: initialData.status || 'available',
    images: (initialData.images || []).join(',')
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { token } = useContext(AuthContext)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
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
    
    // Check image URLs format if provided
    if (formData.images.trim()) {
      const imageUrls = formData.images.split(',').map(url => url.trim())
      const hasInvalidUrl = imageUrls.some(url => !url.match(/^https?:\/\/.+/))
      
      if (hasInvalidUrl) {
        newErrors.images = 'All image URLs must start with http:// or https://'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSuccessMessage('')
    
    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      status: formData.status,
      images: formData.images.trim() ? formData.images.split(',').map(url => url.trim()) : []
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
            status: 'available',
            images: ''
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

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b">
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
                  Price (AED)<span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. 1000000"
                />
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
          </div>
          
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Status and Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="images">
                  Images (comma-separated URLs)
                </label>
                <input
                  type="text"
                  id="images"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.images ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter full URLs to images, separated by commas
                </p>
              </div>
            </div>
            
            {/* Image Preview - Show if there are any images */}
            {formData.images.trim() && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.split(',').map((url, index) => (
                    url.trim() && (
                      <div key={index} className="aspect-video bg-gray-200 rounded overflow-hidden">
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
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 flex justify-end space-x-4">
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