"use client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const HomePage = () => {
  // Slideshow state and logic
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Brac_university_at_night.png/500px-Brac_university_at_night.png",
      alt: "BRAC University at Night",
      duration: 3000
    },
    {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "University Campus",
      duration: 2000
    },
    {
      src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "BRAC University Students",
      duration: 2000
    }
  ];

  // Office Partners data (Top Bangladesh companies)
  const officePartners = [
    { name: "Grameenphone", logo: "https://logos-world.net/wp-content/uploads/2023/01/Grameenphone-Logo.png" },
    { name: "BRAC Bank", logo: "https://logos-world.net/wp-content/uploads/2021/11/BRAC-Bank-Logo.png" },
    { name: "Square Pharmaceuticals", logo: "https://www.squarepharma.com.bd/images/square-pharma-logo.png" },
    { name: "Beximco", logo: "https://beximco.com/wp-content/uploads/2019/12/beximco-logo.png" },
    { name: "City Bank", logo: "https://www.thecitybank.com/assets/img/city-bank-logo.png" },
    { name: "Unilever Bangladesh", logo: "https://logos-world.net/wp-content/uploads/2020/11/Unilever-Logo.png" },
    { name: "Robi Axiata", logo: "https://logos-world.net/wp-content/uploads/2023/01/Robi-Logo.png" },
    { name: "BRAC", logo: "https://www.brac.net/images/brac-logo.png" }
  ];

  // News & Updates data
  const newsUpdates = [
    {
      id: 1,
      title: "EEE Department Achievements",
      description: "BRAC University's Electrical and Electronic Engineering department celebrates outstanding student achievements and innovative research projects.",
      image: "https://www.bracu.ac.bd/sites/default/files/bulletin/2017/January/eee33.jpg",
      date: "January 2024",
      category: "Academic Excellence"
    },
    {
      id: 2,
      title: "Campus Life at BRAC University",
      description: "Experience the vibrant campus culture and community life that makes BRAC University a perfect place for academic and personal growth.",
      image: "https://www.bracu.ac.bd/sites/default/files/news-image/IMG_8858.JPG",
      date: "February 2024",
      category: "Campus Life"
    },
    {
      id: 3,
      title: "Explore New BRAC University",
      description: "Discover the modern facilities, state-of-the-art infrastructure, and innovative learning environments at BRAC University.",
      image: "https://www.bracu.ac.bd/sites/default/files/news-image/2024/March/explore%20new%20BRAC%20University.jpg",
      date: "March 2024",
      category: "Infrastructure"
    },
    {
      id: 4,
      title: "Millennium Fellows 2024",
      description: "BRAC University students selected as Millennium Fellows 2024, representing excellence in leadership and global engagement.",
      image: "https://www.bracu.ac.bd/sites/default/files/news-image/2024/September/Millennium%20fellows%202024.jpg",
      date: "September 2024",
      category: "Achievements"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const currentSlideDuration = slides[currentSlide]?.duration || 3000;
    const timeout = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, currentSlideDuration);
    return () => clearTimeout(timeout);
  }, [currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Full-Width Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-blue-400">BRACU-out</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
            Your gateway to connecting students, alumni, recruiters, and administrators in one unified platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/student" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Join as Student
            </Link>
            <Link href="/auth/alumni" className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Join as Alumni
            </Link>
            <Link href="/auth/recruiter" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Join as Recruiter
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects diverse stakeholders in the academic and professional ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Student Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Students</h3>
              <p className="text-gray-600 leading-relaxed">Access resources, connect with peers, and explore career opportunities in your academic journey.</p>
            </div>

            {/* Alumni Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Alumni</h3>
              <p className="text-gray-600 leading-relaxed">Stay connected with your alma mater and mentor current students in their career development.</p>
            </div>

            {/* Recruiter Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Recruiters</h3>
              <p className="text-gray-600 leading-relaxed">Find talented candidates and build your recruitment network with access to both students and alumni.</p>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Administrators</h3>
              <p className="text-gray-600 leading-relaxed">Manage the platform and oversee all user activities with comprehensive administrative tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-sky-100 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Years of Excellence */}
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-blue-800 mb-2">4</h3>
                <p className="text-lg font-semibold text-gray-700">Years of Excellence</p>
                <p className="text-sm text-gray-600 mt-2">Connecting students, alumni, and recruiters since our inception</p>
              </div>
            </div>

            {/* Student Recruiters */}
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-sky-600 mb-2">2000+</h3>
                <p className="text-lg font-semibold text-gray-700">Student Recruiters</p>
                <p className="text-sm text-gray-600 mt-2">Active network of professionals helping students find opportunities</p>
              </div>
            </div>

            {/* Active Users */}
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-sky-600 mb-2">10K+</h3>
                <p className="text-lg font-semibold text-gray-700">Active Users</p>
                <p className="text-sm text-gray-600 mt-2">Students, alumni, and professionals actively using our platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest news, achievements, and developments from BRAC University.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newsUpdates.map((news) => (
              <div key={news.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {news.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {news.date}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {news.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              View All News
            </button>
          </div>
        </div>
      </section>

      {/* Office Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Office Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with Bangladesh's leading companies to provide exceptional career opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {officePartners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:bg-white group">
                <div className="text-center">
                  <div className="h-16 flex items-center justify-center mb-3">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`} 
                      className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{partner.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Already have an account?</h2>
          <p className="text-xl text-gray-600 mb-12">Sign in to access your personalized dashboard</p>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            <Link href="/auth/student" className="bg-white text-green-700 px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-green-200 hover:border-green-400 font-semibold">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>Student Login</span>
              </div>
            </Link>
            
            <Link href="/auth/alumni" className="bg-white text-purple-700 px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 font-semibold">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Alumni Login</span>
              </div>
            </Link>
            
            <Link href="/auth/recruiter" className="bg-white text-blue-700 px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 font-semibold">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
                <span>Recruiter Login</span>
              </div>
            </Link>
            
            <Link href="/auth/admin" className="bg-white text-red-700 px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 border-2 border-red-200 hover:border-red-400 font-semibold">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Admin Login</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Don't have an account?</h2>
          <p className="text-lg text-gray-600 mb-10">Create your account and join the BRACU community</p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <Link href="/register?role=student" className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>Don't have a Student account?</span>
              </div>
            </Link>
            
            <Link href="/register?role=alumni" className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Don't have an Alumni account?</span>
              </div>
            </Link>
            
            <Link href="/register?role=recruiter" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
                <span>Don't have a Recruiter account?</span>
              </div>
            </Link>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Select the appropriate registration link based on your role
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
