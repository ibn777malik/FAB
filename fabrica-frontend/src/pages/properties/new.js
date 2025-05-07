import PropertyForm from '../../components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Add a New <span className="text-[#c7a565]">Property</span>
        </h1>
        <div className="max-w-2xl mx-auto bg-black border border-[#c7a565]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(199,165,101,0.15)]">
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}