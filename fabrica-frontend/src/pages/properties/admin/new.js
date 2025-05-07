import PropertyForm from '../../../components/PropertyForm';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function NewPropertyPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-6 max-w-7xl mx-auto">
        <PropertyForm />
      </div>
    </ProtectedRoute>
  );
}