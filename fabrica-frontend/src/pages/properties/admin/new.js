// src/pages/properties/admin/new.js
import PropertyForm from '../../../components/PropertyForm'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function NewPropertyPage() {
  return (
    <ProtectedRoute>
      <PropertyForm />
    </ProtectedRoute>
  )
}