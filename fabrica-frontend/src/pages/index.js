import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Canvas component for smoke effect
const SmokeCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class for smoke effect
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 100;
      }
      
      // Update particle position and properties
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size = Math.max(0, this.size - 0.1);
        this.life -= 1;
        this.opacity -= 0.003;
      }
      
      // Draw particle on canvas
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Gold colors for smoke
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(199, 165, 101, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(217, 184, 124, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity * 0.1})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    // Array to store particles
    let particles = [];
    
    // Mouse position variables
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // Track mouse movement across the entire document
    const mouseMoveHandler = function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      // Create particles when mouse moves
      const moveDistance = Math.sqrt(
        Math.pow(mouseX - lastMouseX, 2) + 
        Math.pow(mouseY - lastMouseY, 2)
      );
      
      // Generate more particles for faster movements
      const particlesToCreate = Math.min(Math.floor(moveDistance / 5), 5);
      
      for (let i = 0; i < particlesToCreate; i++) {
        // Randomize position slightly around cursor
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;
        particles.push(new Particle(mouseX + offsetX, mouseY + offsetY));
      }
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    
    // Animation loop
    function animate() {
      // Apply semi-transparent fade effect instead of clearing completely
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove particles when they're too small or expired
        if (particles[i].life <= 0 || particles[i].size <= 0.5 || particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Automatically add particles at mouse position when not moving
      if (!isMouseMoving && Math.random() < 0.2 && particles.length < 200) {
        particles.push(new Particle(mouseX, mouseY));
      }
      
      isMouseMoving = false;
      
      // Limit particles for performance
      if (particles.length > 300) {
        particles = particles.slice(particles.length - 300);
      }
      
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none' // Allow clicking through the canvas
      }}
    />
  );
};

const HomePage = () => {
  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProperty, setActiveProperty] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      image: "/images/e44da0d6-c658-495d-85d6-529839c2becd.jpeg"
    },
    {
      id: 2,
      title: "Modern Downtown Apartment",
      location: "Downtown Dubai",
      price: 3200000,
      beds: 3,
      baths: 3.5,
      area: 2100,
      image: `${process.env.NEXT_PUBLIC_API_BASE}/images/DownTown.jpg`
    },
    {
      id: 3,
      title: "Exclusive Marina Penthouse",
      location: "Dubai Marina",
      price: 5800000,
      beds: 4,
      baths: 4.5,
      area: 3800,
      image: `${process.env.NEXT_PUBLIC_API_BASE}/images/Marina.jpg`
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
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
    <div className="font-sans bg-black">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-white text-4xl font-bold flex items-center"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="mr-3 w-12 h-12 bg-[#c7a565] rounded-lg"></div>
              FABRICA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smoke Effect Canvas */}
      <SmokeCanvas />

      {/* Header with fixed navigation */}
      <header className={`fixed w-full top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black bg-opacity-90 backdrop-blur-sm py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-[#c7a565] rounded-lg mr-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-10"></div>
              </div>
              <span className="text-2xl font-bold text-white">
                FABRICA
              </span>
            </motion.div>
            
            {/* Navigation - Hidden on mobile */}
            <motion.nav 
              className="hidden lg:block bg-black bg-opacity-40 backdrop-blur-sm py-3 px-8 rounded-full border border-[#c7a565]/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ul className="flex items-center space-x-16">
                <li>
                  <Link href="/" className="text-white font-medium hover:text-[#c7a565] transition-colors px-4 py-2">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-white font-medium hover:text-[#c7a565] transition-colors px-4 py-2">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/login" 
                    className="bg-[#c7a565] text-black px-8 py-3 rounded-full hover:shadow-[0_0_15px_rgba(199,165,101,0.5)] transition-all inline-block font-medium"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </motion.nav>
            
            {/* Mobile Menu Button - Visible only on smaller screens */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="text-white hover:text-[#c7a565] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Using AnimatePresence for proper animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black px-6 py-20 overflow-y-auto lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-8">
              {/* Close Button */}
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#c7a565] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#c7a565] rounded-lg mr-3"></div>
                <span className="text-2xl font-bold text-white">FABRICA</span>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-6">
                <Link 
                  href="/" 
                  className="text-white text-xl font-medium hover:text-[#c7a565] transition-colors py-2"
                >
                  Home
                </Link>
                <Link 
                  href="/properties" 
                  className="text-white text-xl font-medium hover:text-[#c7a565] transition-colors py-2"
                >
                  Properties
                </Link>
                <Link 
                  href="/login" 
                  className="bg-[#c7a565] text-black text-center px-8 py-3 rounded-full hover:shadow-[0_0_15px_rgba(199,165,101,0.5)] transition-all font-medium mt-4"
                >
                  Sign In
                </Link>
              </nav>
              
              {/* Mobile Contact */}
              <div className="border-t border-[#c7a565]/20 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                <div className="space-y-4 text-gray-400">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +971 4 123 4567
                  </p>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@fabricarealestate.com
                  </p>
                </div>
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                {[
                  { icon: "fab fa-facebook-f", url: "#" },
                  { icon: "fab fa-twitter", url: "#" },
                  { icon: "fab fa-instagram", url: "#" },
                  { icon: "fab fa-linkedin-in", url: "#" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    className="w-10 h-10 bg-[#c7a565]/20 text-[#c7a565] rounded-full flex items-center justify-center transition-colors hover:bg-[#c7a565] hover:text-black"
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-screen bg-black overflow-hidden flex items-center">
          {/* Background Image with Overlay - we're using only black background */}
          <div className="absolute inset-0 z-0 bg-black"></div>
          
          {/* Hero Content */}
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-xl mx-auto text-center">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Find Your <span className="text-[#c7a565]">Dream Home</span> in Dubai
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover exceptional properties in prime locations with our expert real estate services.
              </motion.p>
              
              {/* Search Box */}
              <motion.div 
                className="bg-white p-4 rounded-xl shadow-2xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="mb-4">
                  <input 
                    type="text"
                    placeholder="Search for properties..."
                    className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a565] text-center"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <select 
                      className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a565] text-center"
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
                      className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a565] text-center"
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
                      className="w-full p-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a565] text-center"
                    >
                      <option value="any">Price Range</option>
                      <option value="1000000-3000000">1M - 3M</option>
                      <option value="3000000-5000000">3M - 5M</option>
                      <option value="5000000-10000000">5M - 10M</option>
                      <option value="10000000">10M+</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-[#c7a565] text-black rounded-lg font-medium hover:shadow-lg transition-all">
                  Search Properties
                </button>
              </motion.div>
              
              {/* Quick Action Buttons - Centered */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg cursor-pointer text-center">
                  <div className="w-12 h-12 bg-[#c7a565] rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="text-white text-center">
                    <div className="font-medium">Buy Property</div>
                    <div className="text-xs opacity-70">Find your dream home</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg cursor-pointer text-center">
                  <div className="w-12 h-12 bg-[#c7a565] rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                  <div className="text-white text-center">
                    <div className="font-medium">Contact Agent</div>
                    <div className="text-xs opacity-70">Expert consultation</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

  {/* Featured Properties Section */}
<section className="py-20 px-6 bg-black">
  <div className="container mx-auto">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">Featured Properties</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
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
          image: "/images/e44da0d6-c658-495d-85d6-529839c2becd.jpeg"
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
      ].map((property, index) => (
        <motion.div 
          key={property.id}
          className="bg-black rounded-xl overflow-hidden shadow-xl border border-[#c7a565]/20 group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ 
            y: -10, 
            boxShadow: "0 25px 50px -12px rgba(199, 165, 101, 0.3)",
            borderColor: "rgba(199, 165, 101, 0.5)"
          }}
        >
          <div className="relative h-56 overflow-hidden">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 bg-[#c7a565] text-black px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c7a565] transition-colors">{property.title}</h3>
            <p className="text-gray-400 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </p>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold text-[#c7a565]">AED {property.price.toLocaleString()}</div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.beds} Beds
              </div>
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.baths} Baths
              </div>
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#c7a565]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {property.area} sqft
              </div>
            </div>
            
            <button className="w-full py-3 bg-[#c7a565] hover:bg-[#d9b87c] text-black rounded-lg font-medium transform transition-all group-hover:scale-[1.02]">
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
    
    <div className="text-center mt-12">
      <motion.button 
        className="bg-transparent text-[#c7a565] border-2 border-[#c7a565] px-8 py-3 rounded-full font-medium hover:bg-[#c7a565]/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View All Properties
      </motion.button>
    </div>
  </div>
</section>
      
{/* Services Section with Centered Grid */}
<section className="py-20 bg-black">
  <div className="container mx-auto px-6">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        We provide comprehensive real estate services to make your property journey seamless and successful.
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: "Property Sales",
          description: "Find your dream home or sell your property with our expert guidance throughout the process.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        },
        {
          title: "Property Management",
          description: "Let us handle the day-to-day management of your property with our comprehensive services.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          )
        },
        {
          title: "Investment Consulting",
          description: "Our team of experts will help you make informed decisions to maximize your property investment.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          title: "Luxury Property Tours",
          description: "Experience virtual or in-person tours of exclusive properties with our dedicated agents.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )
        }
      ].map((service, index) => (
        <motion.div 
          key={index}
          className="group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="bg-black border border-[#c7a565]/30 rounded-xl p-8 h-full flex flex-col transition-all duration-300 group-hover:border-[#c7a565] group-hover:shadow-[0_0_30px_rgba(199,165,101,0.15)]">
            <div className="w-16 h-16 bg-[#c7a565]/10 text-[#c7a565] rounded-lg flex items-center justify-center mb-6 mx-auto transform transition-transform group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#c7a565]/20">
              {service.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-[#c7a565] transition-colors">{service.title}</h3>
            <p className="text-gray-400 mb-6 text-center flex-grow">{service.description}</p>
            
            <div className="mt-auto flex items-center justify-center text-[#c7a565] font-medium">
              <span className="mr-1 transition-transform group-hover:translate-x-[-3px]">Learn More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
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
<section className="py-20 px-6 bg-black">
  <div className="container mx-auto">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">Popular Locations</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Discover premium properties in these sought-after Dubai neighborhoods.
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          name: "Palm Jumeirah",
          image: "/images/e44da0d6-c658-495d-85d6-529839c2becd.jpeg",
          properties: 24
        },
        {
          name: "Downtown Dubai",
          image: "https://via.placeholder.com/600x400",
          properties: 18
        },
        {
          name: "Dubai Marina",
          image: "https://via.placeholder.com/600x400",
          properties: 32
        },
        {
          name: "Jumeirah Beach",
          image: "https://via.placeholder.com/600x400",
          properties: 15
        }
      ].map((location, index) => (
        <motion.div 
          key={index}
          className="relative h-80 rounded-xl overflow-hidden group cursor-pointer"
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
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          
          {/* Gold Border Overlay (appears on hover) */}
          <div className="absolute inset-0 border-2 border-[#c7a565] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#c7a565] transform transition-all duration-300">{location.name}</h3>
            
            <div className="flex items-center text-white opacity-90 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c7a565]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>{location.properties} Properties</span>
            </div>
            
            <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
              <button className="bg-[#c7a565] text-black px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-transform">
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
<section className="py-20 bg-black text-white">
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
            className="text-5xl lg:text-6xl font-bold mb-4 text-[#c7a565]"
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
      
   {/* Testimonials with Centered Grid */}
<section className="py-20 px-6 bg-black">
  <div className="container mx-auto">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Hear from our satisfied clients about their experience working with Fabrica Real Estate.
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          name: "Sarah Johnson",
          role: "Property Buyer",
          image: "https://via.placeholder.com/150",
          quote: "The team at Fabrica has helped me build a valuable property portfolio. Their market knowledge and investment advice is exceptional."
        },
        {
          name: "Michael Chen",
          role: "Property Investor",
          image: "https://via.placeholder.com/150",
          quote: "I was amazed at how quickly they sold my property for above asking price. Their marketing strategy and negotiation skills are second to none."
        },
        {
          name: "Sophia Martinez",
          role: "Property Seller",
          image: "https://via.placeholder.com/150",
          quote: "Working with Fabrica Real Estate was a fantastic experience. They found my dream home within my budget and their professionalism made the process effortless."
        }
      ].map((testimonial, index) => (
        <motion.div 
          key={index}
          className="bg-white rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(199, 165, 101, 0.25)" }}
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#c7a565]">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h4 className="font-bold text-gray-900 text-xl mb-1 text-center">{testimonial.name}</h4>
            <p className="text-gray-600 text-sm mb-6 text-center">{testimonial.role}</p>
            
            <p className="text-gray-700 italic mb-6 text-center relative">
              <span className="absolute -top-4 -left-2 text-[#c7a565] text-5xl opacity-20">"</span>
              {testimonial.quote}
              <span className="absolute -bottom-4 -right-2 text-[#c7a565] text-5xl opacity-20">"</span>
            </p>
            
            <div className="flex justify-center mt-4 text-[#c7a565]">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
      
  {/* Contact & Footer with Center Alignment */}
<section className="py-20 px-6 bg-black">
  <div className="container mx-auto">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Have questions about a property or need professional advice? Our team is here to help you every step of the way.
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <motion.div
        className="contact-info"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8 mb-8">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-[#c7a565]/20 text-[#c7a565] rounded-full flex items-center justify-center mr-5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Office Location</h3>
              <p className="text-gray-400">Downtown Dubai, UAE</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-14 h-14 bg-[#c7a565]/20 text-[#c7a565] rounded-full flex items-center justify-center mr-5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
              <p className="text-gray-400">+971 4 123 4567</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-14 h-14 bg-[#c7a565]/20 text-[#c7a565] rounded-full flex items-center justify-center mr-5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
              <p className="text-gray-400">info@fabricarealestate.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
              <motion.a 
                key={index}
                href="#"
                className="w-10 h-10 bg-[#c7a565]/20 text-[#c7a565] rounded-full flex items-center justify-center transition-colors hover:bg-[#c7a565] hover:text-black"
                whileHover={{ y: -5 }}
              >
                <i className={`fab fa-${social}`}></i>
              </motion.a>
            ))}
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
        <form className="bg-black p-8 rounded-xl border border-[#c7a565]/30 shadow-[0_0_30px_rgba(199,165,101,0.1)]">
          <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#c7a565]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#c7a565] focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#c7a565]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#c7a565] focus:border-transparent"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              className="w-full px-4 py-3 rounded-lg bg-black border border-[#c7a565]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#c7a565] focus:border-transparent"
              placeholder="How can we help?"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="message">Message</label>
            <textarea 
              id="message" 
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-black border border-[#c7a565]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#c7a565] focus:border-transparent"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          
          <motion.button 
            type="submit"
            className="w-full py-3 bg-[#c7a565] text-black rounded-lg font-medium hover:shadow-[0_0_20px_rgba(199,165,101,0.4)] transition-all"
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
      
 {/* Footer */}
<footer className="bg-black text-white py-16 border-t border-[#c7a565]/20">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <div className="mb-8 md:mb-0">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-[#c7a565] rounded-lg mr-3"></div>
          <span className="text-xl font-bold">FABRICA</span>
        </div>
        
        <p className="text-gray-400 mb-6">
          Fabrica Real Estate provides premium property solutions in Dubai's most desirable locations.
        </p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
        <ul className="space-y-4">
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Home</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Properties</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">About Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Contact</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6">Our Services</h4>
        <ul className="space-y-4">
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Property Sales</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Property Management</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Investment Consulting</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#c7a565] transition-colors">Luxury Property Tours</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest property listings and market updates.</p>
        
        <div className="flex mb-4">
          <input 
            type="email" 
            placeholder="Your Email" 
            className="px-4 py-2 w-full bg-black text-white rounded-l-lg border border-[#c7a565]/50 focus:outline-none focus:ring-2 focus:ring-[#c7a565] focus:border-transparent"
            required
          />
          <button className="bg-[#c7a565] text-black px-4 py-2 rounded-r-lg hover:bg-[#d9b87c] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 text-sm">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
    
    <div className="border-t border-[#c7a565]/20 mt-12 pt-8 text-center">
      <p className="text-gray-400">
        &copy; {new Date().getFullYear()} Fabrica Real Estate. All rights reserved.
      </p>
    </div>
  </div>
</footer>
      
   
{/* Back to Top Button */}
<motion.button
  className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#c7a565] text-black shadow-lg flex items-center justify-center z-30 ${
    scrollY > 300 ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
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
    </div>
  );
};

export default HomePage;