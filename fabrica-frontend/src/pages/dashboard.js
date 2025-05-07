import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { token, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    reservedProperties: 0,
    soldProperties: 0,
    offPlanProperties: 0,
  });
  const router = useRouter();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    furnishing: '',
    location: '',
  });

  // Column definitions
  const columns = [
    { id: 'image', label: 'Image' },
    { id: 'title', label: 'Title' },
    { id: 'ref', label: 'Reference #' },
    { id: 'propertyType', label: 'Property Type' },
    { id: 'location', label: 'Location' },
    { id: 'bedBath', label: 'Bed/Bath' },
    { id: 'area', label: 'Area' },
    { id: 'price', label: 'Price' },
    { id: 'status', label: 'Status' },
    { id: 'listingType', label: 'Listing Type' },
    { id: 'furnishing', label: 'Furnishing' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'leadStatus', label: 'Lead Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'source', label: 'Source' },
    { id: 'followUpDate', label: 'Follow-up Date' },
    { id: 'tags', label: 'Tags' },
    { id: 'actions', label: 'Actions' },
  ];

  // Default visible columns
  const [visibleColumns, setVisibleColumns] = useState([
    'image', 'title', 'propertyType', 'location', 'price', 'status', 'actions',
  ]);

  useEffect(() => {
    if (!token) {
      console.log('No authentication token available - user needs to log in first');
      router.push('/login');
      return;
    }

    console.log('Token available - fetching data');

    setUserProfile({
      name: 'Admin User',
      email: 'admin@fabrica.com',
      role: 'Administrator',
    });

    loadProperties();
  }, [token, tab, logout, router]);

  const loadProperties = async () => {
    if (tab !== 'properties' || !token) return;
    setLoading(true);

    try {
      console.log('Making API request with token:', token.substring(0, 20) + '...');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API response received:', res.status);
      setProperties(res.data);

      const stats = {
        totalProperties: res.data.length,
        availableProperties: res.data.filter(p => p.status === 'available').length,
        reservedProperties: res.data.filter(p => p.status === 'reserved').length,
        soldProperties: res.data.filter(p => p.status === 'sold').length,
        offPlanProperties: res.data.filter(p => p.status === 'off-plan').length,
      };

      setDashboardStats(stats);
    } catch (err) {
      console.error('Error loading properties:', err);
      console.error('Error details:', err.response?.data || 'No response data');
      console.error('Error status:', err.response?.status || 'No status code');

      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/properties/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProperties(prevProperties => prevProperties.filter(p => p.id !== id));

      const deletedProperty = properties.find(p => p.id === id);
      if (deletedProperty) {
        setDashboardStats(prev => ({
          ...prev,
          totalProperties: prev.totalProperties - 1,
          availableProperties: deletedProperty.status === 'available' ? prev.availableProperties - 1 : prev.availableProperties,
          reservedProperties: deletedProperty.status === 'reserved' ? prev.reservedProperties - 1 : prev.reservedProperties,
          soldProperties: deletedProperty.status === 'sold' ? prev.soldProperties - 1 : prev.soldProperties,
          offPlanProperties: deletedProperty.status === 'off-plan' ? prev.offPlanProperties - 1 : prev.offPlanProperties,
        }));
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.location?.community && prop.location.community.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.location?.city && prop.location.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus ? prop.status === filterStatus : true;
    const matchesType = filterType ? prop.propertyType === filterType : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (value, currency = 'AED') => {
    if (!value) return `${currency} 0`;
    return `${currency} ${value.toLocaleString()}`;
  };

  const toggleColumn = (columnId) => {
    if (visibleColumns.includes(columnId)) {
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter(id => id !== columnId));
      }
    } else {
      setVisibleColumns([...visibleColumns, columnId]);
    }
  };

  const resetColumns = () => {
    setVisibleColumns(['image', 'title', 'propertyType', 'location', 'price', 'status', 'actions']);
  };

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnishing: '',
      location: '',
    });
  };

  const applyAdvancedFilters = () => {
    console.log('Advanced filters applied:', advancedFilters);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-white">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 shadow-xl z-20">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-[#c7a565]">
              Fabrica CRM
            </h1>
          </div>
          <div className="p-4">
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-1">Logged in as:</p>
              <p className="font-semibold text-lg text-black">{userProfile?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{userProfile?.role || 'User'}</p>
            </div>
            <nav className="space-y-2">
              {[
                { name: 'Dashboard', icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z', tab: 'dashboard' },
                { name: 'Properties', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z', tab: 'properties' },
                { name: 'Settings', icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', tab: 'settings' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => setTab(item.tab)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    tab === item.tab
                      ? 'bg-[#c7a565] text-black shadow-md'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
          <header className="sticky top-0 z-10 bg-white shadow-md px-6 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-[#c7a565]">
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'properties' && 'Property Management'}
                {tab === 'settings' && 'User Settings'}
              </h1>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center text-[#c7a565] hover:text-[#d9b87c] transition-all duration-200"
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
            <div className="p-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[
                  { title: 'Total Properties', value: dashboardStats.totalProperties, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                  { title: 'Available', value: dashboardStats.availableProperties, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { title: 'Reserved', value: dashboardStats.reservedProperties, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { title: 'Sold', value: dashboardStats.soldProperties, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                  { title: 'Off-Plan', value: dashboardStats.offPlanProperties, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                ].map(stat => (
                  <div key={stat.title} className="rounded-xl shadow-md p-6 bg-white border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-[#c7a565]/20 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-extrabold text-black">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl shadow-md p-6 bg-white border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Recent Activity</h2>
                <p className="text-gray-600">Activity logs will be displayed here in the future.</p>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {tab === 'properties' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="rounded-xl shadow-md mb-6 p-6 bg-white border border-gray-200">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-semibold text-[#c7a565]">
                    Property Management
                  </h2>
                  <button
                    className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-md"
                    onClick={() => router.push('/properties/admin/new')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Property
                  </button>
                </div>

                {/* Advanced Filters */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search properties..."
                        className="pl-10 pr-4 py-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <select
                        className="rounded-lg border bg-white border-gray-200 text-black px-4 py-2 focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="off-plan">Off-Plan</option>
                      </select>
                      <select
                        className="rounded-lg border bg-white border-gray-200 text-black px-4 py-2 focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                        <option value="plot">Plot</option>
                      </select>
                    </div>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="text-[#c7a565] hover:text-[#d9b87c] flex items-center text-sm transition-all duration-200"
                    >
                      {showAdvancedFilters ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Hide Advanced Filters
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Show Advanced Filters
                        </>
                      )}
                    </button>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showAdvancedFilters && (
                    <div className="mt-4 p-6 rounded-lg border bg-white border-gray-200 shadow-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Min Price</label>
                          <input
                            type="number"
                            value={advancedFilters.minPrice}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, minPrice: e.target.value })}
                            placeholder="Min Price"
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Max Price</label>
                          <input
                            type="number"
                            value={advancedFilters.maxPrice}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxPrice: e.target.value })}
                            placeholder="Max Price"
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Bedrooms</label>
                          <select
                            value={advancedFilters.bedrooms}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, bedrooms: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Bathrooms</label>
                          <select
                            value={advancedFilters.bathrooms}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, bathrooms: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Furnishing</label>
                          <select
                            value={advancedFilters.furnishing}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, furnishing: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Any</option>
                            <option value="furnished">Furnished</option>
                            <option value="semi-furnished">Semi-Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                          <input
                            type="text"
                            value={advancedFilters.location}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, location: e.target.value })}
                            placeholder="Filter by location"
                            className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-4">
                        <button
                          onClick={resetAdvancedFilters}
                          className="text-gray-600 hover:text-gray-800 transition-all duration-200"
                        >
                          Reset Filters
                        </button>
                        <button
                          onClick={applyAdvancedFilters}
                          className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column Visibility Toggle */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowColumnSettings(!showColumnSettings)}
                        className="text-[#c7a565] hover:text-[#d9b87c] flex items-center text-sm transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Column Settings
                      </button>
                      <div className="text-sm text-gray-600">
                        Showing {filteredProperties.length} of {properties.length} properties
                      </div>
                    </div>
                  </div>

                  {/* Column Toggle Dropdown */}
                  {showColumnSettings && (
                    <div className="mt-2 p-4 border rounded-lg shadow-lg absolute z-20 bg-white border-gray-200">
                      <h3 className="font-semibold text-black mb-2">Visible Columns</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {columns.map(column => (
                          <div key={column.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`column-${column.id}`}
                              checked={visibleColumns.includes(column.id)}
                              onChange={() => toggleColumn(column.id)}
                              className="mr-2 rounded text-[#c7a565] focus:ring-[#c7a565]"
                            />
                            <label htmlFor={`column-${column.id}`} className="cursor-pointer text-sm text-black">{column.label}</label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={resetColumns}
                          className="text-gray-600 hover:text-gray-800 transition-all duration-200"
                        >
                          Reset to Default
                        </button>
                        <button
                          onClick={() => setShowColumnSettings(false)}
                          className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-3 py-1 rounded-lg transition-all duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="rounded-xl shadow-md p-6 text-center bg-white border-gray-200">
                    <p className="text-gray-600">Loading properties...</p>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="rounded-xl shadow-md p-6 text-center bg-white border-gray-200">
                    <p className="text-gray-600">No properties found matching your filters.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('');
                        setFilterType('');
                        resetAdvancedFilters();
                      }}
                      className="mt-4 text-[#c7a565] hover:text-[#d9b87c] transition-all duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl shadow-md overflow-hidden bg-white border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            {columns.filter(col => visibleColumns.includes(col.id)).map(col => (
                              <th key={col.id} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProperties.map((property, index) => (
                            <tr key={property.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-opacity-50' : ''}`}>
                              {visibleColumns.includes('image') && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-14 w-20 bg-gray-200 rounded-lg overflow-hidden">
                                    {property.images && property.images.length > 0 ? (
                                      <img
                                        src={property.images[0].startsWith('http')
                                          ? property.images[0]
                                          : `${process.env.NEXT_PUBLIC_API_BASE}${property.images[0]}`}
                                        alt={property.title}
                                        className="h-full w-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes('title') && (
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-black">{property.title}</span>
                                    <span className="text-sm text-gray-600 truncate max-w-xs">
                                      {property.description ? property.description.substring(0, 50) + (property.description.length > 50 ? '...' : '') : ''}
                                    </span>
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes('ref') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {property.reraPermit || property.id.substring(0, 8)}
                                </td>
                              )}
                              {visibleColumns.includes('propertyType') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-black">
                                  {property.propertyType || 'N/A'}
                                </td>
                              )}
                              {visibleColumns.includes('location') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                  {property.location ? (
                                    <span>
                                      {property.location.community ? `${property.location.community}, ` : ''}
                                      {property.location.city || 'Dubai'}
                                    </span>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes('bedBath') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                  {property.bedrooms !== undefined && property.bedrooms !== null
                                    ? `${property.bedrooms} Bed${property.bedrooms !== 1 ? 's' : ''}`
                                    : '-'} /
                                  {property.bathrooms !== undefined && property.bathrooms !== null
                                    ? ` ${property.bathrooms} Bath${property.bathrooms !== 1 ? 's' : ''}`
                                    : ' -'}
                                </td>
                              )}
                              {visibleColumns.includes('area') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                  {property.area ? `${property.area} ${property.areaUnit || 'sqft'}` : '-'}
                                </td>
                              )}
                              {visibleColumns.includes('price') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                  {formatCurrency(property.price, property.currency)}
                                </td>
                              )}
                              {visibleColumns.includes('status') && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-[#c7a565]/20 text-[#c7a565]`}>
                                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.includes('listingType') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-black">
                                  {property.listingType || 'Secondary'}
                                </td>
                              )}
                              {visibleColumns.includes('furnishing') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-black">
                                  {property.furnishing || 'Unfurnished'}
                                </td>
                              )}
                              {visibleColumns.includes('createdAt') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '-'}
                                </td>
                              )}
                              {visibleColumns.includes('leadStatus') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm">
                                  {property.leadStatus ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-[#c7a565]/20 text-[#c7a565]`}>
                                      {property.leadStatus.charAt(0).toUpperCase() + property.leadStatus.slice(1)}
                                    </span>
                                  ) : (
                                    'New'
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes('priority') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm">
                                  {property.priority ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-[#c7a565]/20 text-[#c7a565]`}>
                                      {property.priority.charAt(0).toUpperCase() + property.priority.slice(1)}
                                    </span>
                                  ) : (
                                    'Medium'
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes('source') && (
                                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-black">
                                  {property.source || 'Manual'}
                                </td>
                              )}
                              {visibleColumns.includes('followUpDate') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                  {property.followUpDate ? new Date(property.followUpDate).toLocaleDateString() : '-'}
                                </td>
                              )}
                              {visibleColumns.includes('tags') && (
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex flex-wrap gap-1">
                                    {property.tags && property.tags.length > 0 ?
                                      property.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="bg-[#c7a565]/20 text-[#c7a565] px-2 py-1 rounded-full text-xs">
                                          {tag}
                                        </span>
                                      )) : '-'}
                                    {property.tags && property.tags.length > 3 && (
                                      <span className="text-gray-600 text-xs flex items-center">
                                        +{property.tags.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.includes('actions') && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-3">
                                    <Link
                                      href={`/properties/${property.id}`}
                                      className="text-[#c7a565] hover:text-[#d9b87c] transition-all duration-200"
                                      target="_blank"
                                    >
                                      View
                                    </Link>
                                    <button
                                      className="text-[#c7a565] hover:text-[#d9b87c] transition-all duration-200"
                                      onClick={() => router.push(`/properties/admin/${property.id}`)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-800 transition-all duration-200"
                                      onClick={() => handleDelete(property.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl shadow-md p-6 bg-white border-gray-200">
                  <h2 className="text-xl font-semibold text-[#c7a565] mb-4">
                    User Profile
                  </h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                        defaultValue={userProfile?.name || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                        defaultValue={userProfile?.email || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-600 focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200 cursor-not-allowed"
                        defaultValue={userProfile?.role || ''}
                        disabled
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
                <div className="rounded-xl shadow-md p-6 bg-white border-gray-200">
                  <h2 className="text-xl font-semibold text-[#c7a565] mb-4">
                    Change Password
                  </h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 rounded-lg border bg-white border-gray-200 text-black focus:ring-2 focus:ring-[#c7a565] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
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
  );
}