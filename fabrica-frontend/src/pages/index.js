import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const HomePage = () => {
  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProperty, setActiveProperty] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [scrollY, setScrollY] = useState(0);
  
  // Refs
  const heroRef = useRef(null);
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  // Sample data
  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      location: "Palm Jumeirah",
      price: 7500000,
      beds: 5,
      baths: 6,
      area: 7200,
      image: "/images/57a771b1-a9b5-4d05-8dd3-3043fc60e81a.jpg"
    },
    {
      id: 2,
      title: "Modern Downtown Apartment",
      location: "Downtown Dubai",
      price: 3200000,
      beds: 3,
      baths: 3.5,
      area: 2100,
      image: "https://via.placeholder.com/600x400"
    },
    {
      id: 3,
      title: "Exclusive Marina Penthouse",
      location: "Dubai Marina",
      price: 5800000,
      beds: 4,
      baths: 4.5,
      area: 3800,
      image: "https://via.placeholder.com/600x400"
    }
  ];
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Set initial loaded state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'AED',
      maximumFractionDigits: 0 
    });
  };

  return (
    <div className="font-sans bg-gray-50">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-white text-4xl font-bold flex items-center"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="mr-3 w-12 h-12 bg-white rounded-lg"></div>
              FABRICA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Clean, well-structured layout with right-aligned navigation */}
      <div className="min-h-screen bg-white font-sans">
  {/* Header with logo on left and navigation on right */}
  {/* Header with fixed navigation links using Next.js Link components */}
{/* Header with more spacious navigation */}
<header className={`fixed w-full top-0 left-0 right-0 z-40 transition-all duration-300 ${
  scrollY > 50 ? 'bg-white shadow-md py-3' : 'bg-black bg-opacity-50 py-4'
}`}>
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3"></div>
        <span className={`text-2xl font-bold ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}>
          FABRICA
        </span>
      </div>
      
      {/* Navigation - Extra spacious */}
      <nav className="bg-black bg-opacity-40 backdrop-blur-sm py-3 px-12 rounded-full border border-white border-opacity-20">
        <ul className="flex items-center space-x-20">
          <li>
            <Link href="/properties" className="text-white font-medium hover:text-blue-300 transition-colors px-4 py-2">
              Properties
            </Link>
          </li>
          <li>
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all inline-block font-medium"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>

  {/* Hero Section */}
  <section className="relative h-screen bg-gray-900 overflow-hidden flex items-center">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://via.placeholder.com/1920x1080" 
        alt="Luxury Property" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
    </div>
    
    {/* Hero Content */}
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Find Your <span className="text-blue-400">Dream Home</span> in Dubai
        </h1>
        
        <p className="text-xl text-gray-200 mb-8">
          Discover exceptional properties in prime locations with our expert real estate services.
        </p>
        
        {/* Search Box */}
        <div className="bg-white p-4 rounded-xl shadow-2xl mb-8">
          <div className="mb-4">
            <input 
              type="text"
              placeholder="Search for properties..."
              className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <select 
                className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              >
                <option value="">All Locations</option>
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="Downtown Dubai">Downtown Dubai</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Jumeirah Beach">Jumeirah Beach</option>
              </select>
            </div>
            
            <div className="text-center">
              <select 
                className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              >
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>
            
            <div className="text-center">
              <select 
                className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              >
                <option value="any">Price Range</option>
                <option value="1000000-3000000">1M - 3M</option>
                <option value="3000000-5000000">3M - 5M</option>
                <option value="5000000-10000000">5M - 10M</option>
                <option value="10000000">10M+</option>
              </select>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            Search Properties
          </button>
        </div>
        
        {/* Quick Action Buttons - Centered */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg cursor-pointer text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div className="text-white text-center">
              <div className="font-medium">Buy Property</div>
              <div className="text-xs opacity-70">Find your dream home</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg cursor-pointer text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <div className="text-white text-center">
              <div className="font-medium">Contact Agent</div>
              <div className="text-xs opacity-70">Expert consultation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Rest of the page content... */}
</div>
   {/* Featured Properties Section with Centered Cards */}
<section className="py-20 px-6">
  <div className="container mx-auto">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover our handpicked selection of luxury properties in the most desirable locations across Dubai.
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Palm Jumeirah",
    price: 7500000,
    beds: 5,
    baths: 6,
    area: 7200,
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/beachfront.jpg`  // Add API base URL
  },
  {
    id: 2,
    title: "Modern Downtown Apartment",
    location: "Downtown Dubai",
    price: 3200000,
    beds: 3,
    baths: 3.5,
    area: 2100,
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/DownTown.jpg`  // Add API base URL
  },
  {
    id: 3,
    title: "Exclusive Marina Penthouse",
    location: "Dubai Marina",
    price: 5800000,
    beds: 4,
    baths: 4.5,
    area: 3800,
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/Marina.jpg`  // Add API base URL
  }
].map((property, index) => (
        <motion.div 
          key={property.id}
          className="bg-white rounded-xl overflow-hidden shadow-lg group mx-auto max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -10 }}
        >
          <div className="relative h-48 overflow-hidden">
            <img 
              src={property.image} 
              alt={property.title} 
              className="property-card-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ maxHeight: "200px" }}
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{property.title}</h3>
            <p className="text-gray-600 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </p>
            
            <div className="flex justify-center items-center mb-6">
              <div className="text-2xl font-bold text-blue-600">AED {property.price.toLocaleString()}</div>
            </div>
            
            <div className="flex justify-between items-center mb-6 max-w-xs mx-auto">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.beds} Beds
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.baths} Baths
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {property.area} sqft
              </div>
            </div>
            
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transform transition-all hover:scale-[1.02] hover:shadow-xl">
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
    
    <div className="text-center mt-12">
      <motion.button 
        className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View All Properties
      </motion.button>
    </div>
  </div>
</section>
      
     {/* Services Section with Centered Grid */}
<section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
  <div className="container mx-auto px-6">
    <div className="section-header">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
      <p className="text-gray-600 mx-auto">
        We provide comprehensive real estate services to make your property journey seamless and successful.
      </p>
    </div>
    
    <div className="services-grid">
      {[
        {
          title: "Property Sales",
          description: "Find your dream home or sell your property with our expert guidance throughout the process.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
          color: "from-blue-500 to-blue-600"
        },
        {
          title: "Property Management",
          description: "Let us handle the day-to-day management of your property with our comprehensive services.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
          color: "from-purple-500 to-purple-600"
        },
        {
          title: "Investment Consulting",
          description: "Our team of experts will help you make informed decisions to maximize your property investment.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          color: "from-pink-500 to-pink-600"
        },
        {
          title: "Luxury Property Tours",
          description: "Experience virtual or in-person tours of exclusive properties with our dedicated agents.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
          color: "from-amber-500 to-amber-600"
        }
      ].map((service, index) => (
        <motion.div 
          key={index}
          className="service-card group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="relative z-10">
            <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-lg text-white flex items-center justify-center mb-6 mx-auto transform transition-transform group-hover:rotate-6 group-hover:scale-110`}>
              {service.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            
            <div className="mt-6 flex items-center justify-center text-blue-600 font-medium">
              <span>Learn More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
      
     {/* Locations Section with Centered Grid */}
<section className="py-20 px-6">
  <div className="container mx-auto">
    <div className="section-header">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Locations</h2>
      <p className="text-gray-600 mx-auto">
        Discover premium properties in these sought-after Dubai neighborhoods.
      </p>
    </div>
    
    <div className="locations-grid">
      {[
  {
    name: "Palm Jumeirah",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/PalmJumeirah.jpg`,  // Updated path
    properties: 24
  },
  {
    name: "Downtown Dubai",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/DownTownDubai.jpg`,  // Updated path
    properties: 18
  },
  {
    name: "Dubai Marina",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/DubaiMarina.jpg`,  // Updated path
    properties: 32
  },
  {
    name: "Jumeirah Beach",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/JumeirahBeach.jpg`,  // Updated path
    properties: 15
  }
].map((location, index) => (
        <motion.div 
  key={index}
  className="location-card group cursor-pointer"
  whileHover={{ scale: 1.03 }}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ 
    duration: 0.5, 
    delay: index * 0.1,
    hover: { duration: 0.3 }
  }}
>
  {/* Background Image */}
  <img 
    src={location.image} 
    alt={location.name}
    className="location-card-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    style={{ maxHeight: "180px" }}
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
  
  {/* Content */}
  <div className="absolute bottom-0 left-0 p-6 w-full text-center">
    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-0 transform transition-transform duration-300">{location.name}</h3>
    
    <div className="flex items-center justify-center text-white opacity-90">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
      <span>{location.properties} Properties</span>
    </div>
    
    <div className="mt-4 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-transform">
        Explore Area
      </button>
    </div>
  </div>
</motion.div>
      ))}
    </div>
  </div>
</section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { number: "500+", label: "Properties Sold" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "15+", label: "Years Experience" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div 
                  className="text-5xl lg:text-6xl font-bold mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Testimonials */}
    {/* Testimonials with Centered Grid */}
<section className="py-20 px-6">
  <div className="container mx-auto">
    <div className="section-header">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
      <p className="text-gray-600 mx-auto">
        Hear from our satisfied clients about their experience working with Fabrica Real Estate.
      </p>
    </div>
    
    <div className="testimonials-grid">
      {[
  {
    name: "Billie Eilish",
    role: "Property Buyer",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/Bille.jpg`,  // Updated path
    quote: "The team at Fabrica has helped me build a valuable property portfolio. Their market knowledge and investment advice is exceptional."
  },
  {
    name: "Leonardo DiCaprio",
    role: "Property Investor",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/Leo.jpg`,  // Updated path
    quote: "I was amazed at how quickly they sold my property for above asking price. Their marketing strategy and negotiation skills are second to none."
  },
  {
    name: "Johnny Depp",
    role: "Property Seller",
    image: `${process.env.NEXT_PUBLIC_API_BASE}/images/John.jpg`,  // Updated path
    quote: "Working with Fabrica Real Estate was a fantastic experience. They found my dream home within my budget and their professionalism made the process effortless."
  }
].map((testimonial, index) => (
        <motion.div 
          key={index}
          className="testimonial-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="testimonial-profile-image w-full h-full object-cover"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
          </div>
          
          <h4 className="font-bold text-gray-900 text-xl mb-1">{testimonial.name}</h4>
          <p className="text-gray-600 text-sm mb-4">{testimonial.role}</p>
          
          <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
          
          <div className="flex justify-center mt-4 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
      
    {/* Contact & Footer with Center Alignment */}
<section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
  <div className="container mx-auto">
    <div className="section-header">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
      <p className="text-gray-600 mx-auto">
        Have questions about a property or need professional advice? Our team is here to help you every step of the way.
      </p>
    </div>
    
    <div className="contact-grid">
      <motion.div
        className="contact-info"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-center md:justify-start">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Office Location</h3>
              <p className="text-gray-600">Downtown Dubai, UAE</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-600">+971 4 123 4567</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600">info@fabricarealestate.com</p>
            </div>
          </div>
        </div>
        
        
      </motion.div>
      
      <motion.div
        className="contact-form"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">Send us a Message</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How can we help?"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">Message</label>
            <textarea 
              id="message" 
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          
          <motion.button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  </div>
</section>
      
    {/* Footer with Centered Layout */}
<footer className="bg-gray-900 text-white py-16">
  <div className="container mx-auto px-6">
    <div className="footer-grid">
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3"></div>
          <span className="text-xl font-bold">FABRICA</span>
        </div>
        
        <p className="text-gray-400 mb-6">
          Fabrica Real Estate provides premium property solutions in Dubais most desirable locations.
        </p>
        
        <div className="flex justify-center md:justify-start space-x-4">
          <motion.a 
            href="#" 
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            whileHover={{ y: -5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </motion.a>
          
          <motion.a 
            href="#" 
            className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            whileHover={{ y: -5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>
            </svg>
          </motion.a>
          
          <motion.a 
            href="#" 
            className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
            whileHover={{ y: -5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
            </svg>
          </motion.a>
        </div>
      </div>
      
      <div className="text-center md:text-left">
        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
        <ul className="space-y-4">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Properties</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
      
      <div className="text-center md:text-left">
        <h3 className="text-lg font-semibold mb-6">Our Services</h3>
        <ul className="space-y-4">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Property Sales</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Property Management</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Investment Consulting</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Luxury Property Tours</a></li>
        </ul>
      </div>
      
      <div className="text-center md:text-left">
        <h3 className="text-lg font-semibold mb-6">Subscribe</h3>
        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest property listings and market updates.</p>
        
        <form className="flex mb-4 justify-center md:justify-start">
          <input 
            type="email" 
            placeholder="Your Email" 
            className="px-4 py-2 w-full bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
        
        <p className="text-gray-400 text-sm">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
    
    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
      <p className="text-gray-400">
        &copy; {new Date().getFullYear()} Fabrica Real Estate. All rights reserved.
      </p>
    </div>
  </div>
</footer>
      
      {/* Back to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center z-30 ${scrollY > 300 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
    );
  };
  
  export default HomePage;