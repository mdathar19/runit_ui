'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaLaptopCode, FaBriefcase, FaRocket, FaUserAlt, FaDownload } from 'react-icons/fa';
import GradientButton from '@/components/global/GradientButton';

// Portfolio templates data
const portfolioTemplates = [
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    preview: '/assets/portfolio-sample5.png',
    description: 'Clean, modern dark design with minimalist approach',
    color: 'from-gray-900 to-purple-900',
  },
  {
    id: 'creative-neon',
    name: 'Creative Neon',
    preview: '/assets/portfolio-sample4.png',
    description: 'Bold neon accents on dark background for creative professionals',
    color: 'from-purple-900 to-pink-700',
  },
  {
    id: 'tech-gradient',
    name: 'Tech Gradient',
    preview: '/assets/portfolio-sample1.png',
    description: 'Modern tech-inspired gradient design for developers',
    color: 'from-blue-900 to-purple-800',
  },
  {
    id: 'elegant-portfolio',
    name: 'Elegant Portfolio',
    preview: '/assets/portfolio-sample2.png',
    description: 'Sophisticated and clean layout for designers and photographers',
    color: 'from-gray-800 to-gray-900',
  },
];

// Sample reviews
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    avatar: '/avatars/avatar1.jpg', // Replace with actual image paths
    content: "I created my portfolio in under 10 minutes and landed three interviews the following week. The templates are beautiful and professional!",
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'UX Designer',
    avatar: '/avatars/avatar2.jpg', // Replace with actual image paths
    content: "As a designer, I'm very particular about aesthetics. These portfolio templates exceeded my expectations. Clean, modern, and customizable.",
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Full Stack Developer',
    avatar: '/avatars/avatar3.jpg', // Replace with actual image paths
    content: "The simplicity of the process combined with the professional results was amazing. I've recommended it to all my coding bootcamp classmates!",
  },
];

// Features list
const features = [
  {
    id: 'responsive',
    icon: <FaLaptopCode className="h-6 w-6 text-purple-400" />,
    title: 'Fully Responsive',
    description: 'Your portfolio looks perfect on any device - desktop, tablet, or mobile',
  },
  {
    id: 'professional',
    icon: <FaBriefcase className="h-6 w-6 text-purple-400" />,
    title: 'Professional Designs',
    description: 'Curated templates designed to impress potential employers and clients',
  },
  {
    id: 'fast',
    icon: <FaRocket className="h-6 w-6 text-purple-400" />,
    title: 'Quick Setup',
    description: 'Go from zero to published in less than 5 minutes with our streamlined process',
  },
  {
    id: 'customizable',
    icon: <FaUserAlt className="h-6 w-6 text-purple-400" />,
    title: 'Highly Customizable',
    description: 'Easily customize colors, fonts, sections and content to match your personal brand',
  },
];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
const PortfolioLanding = () => {
  const router = useRouter();
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const templateSliderRef = useRef(null);
  
  // Handle navigation to template selection page
  const handleGetStarted = () => {
    router.push('/portfolio/templates-list');
  };
  const handleViewSamples = () => {
    router.push('/templates/eventmanagement/athar/index.html');
  };
  

  // Auto-rotate templates
  useEffect(() => {
    setIsVisible(true);
    
    // Debug image paths
    /* console.log("Portfolio template paths:", portfolioTemplates.map(t => t.preview)); */
    
    const interval = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % portfolioTemplates.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">professional portfolio</span> in minutes
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Choose a beautiful design, fill in your details, and publish your portfolio instantly. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GradientButton
                  variant="purple"
                  className="text-lg px-8 py-3"
                  onClick={handleGetStarted}
                >
                  Get Started <FaArrowRight className="ml-2 inline" />
                </GradientButton>
                <GradientButton
                  variant="dark"
                  className="text-lg px-8 py-3"
                  onClick={handleViewSamples}
                >
                  View Examples <FaDownload className="ml-2 inline" />
                </GradientButton>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden border border-gray-800">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTemplate}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      {/* Template image with gradient overlay */}
                      <div className={`relative h-64 md:h-80 rounded-t-lg overflow-hidden`}>
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${portfolioTemplates[activeTemplate].color} opacity-70 z-10`}></div>
                        
                        {/* Template image */}
                        <div className="relative w-full h-full">
                          <Image 
                            src={portfolioTemplates[activeTemplate].preview}
                            alt={`${portfolioTemplates[activeTemplate].name} template preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ 
                              objectFit: 'cover',
                              mixBlendMode: 'overlay'
                            }}
                            priority
                            onError={() => {
                              console.error(`Failed to load image: ${portfolioTemplates[activeTemplate].preview}`);
                            }}
                          />
                        </div>
                        
                        {/* Template name overlay */}
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center z-20"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p className="text-white font-semibold">{portfolioTemplates[activeTemplate].name}</p>
                        </motion.div>
                      </div>
                      
                      {/* Template description */}
                      <motion.div 
                        className="bg-gray-900 p-4 rounded-b-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold">{portfolioTemplates[activeTemplate].name}</h3>
                        <p className="text-gray-400 text-sm">{portfolioTemplates[activeTemplate].description}</p>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Template navigation dots */}
                <div className="flex justify-center items-center mt-4">
                  <div className="flex justify-center space-x-3">
                    {portfolioTemplates.map((_, index) => (
                      <button
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all ${
                          index === activeTemplate 
                            ? 'bg-purple-500 scale-110' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setActiveTemplate(index)}
                        aria-label={`View ${portfolioTemplates[index].name} template`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Portfolio in <span className="text-purple-400">3 Simple Steps</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process gets you from zero to a professional online presence in minutes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-900/60 border border-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose a Design</h3>
              <p className="text-gray-400">
                Browse our collection of professional templates and select the one that best represents your style
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/60 border border-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Add Your Content</h3>
              <p className="text-gray-400">
                Fill in your information, upload your work, and customize colors and fonts to match your personal brand
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/60 border border-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Publish Instantly</h3>
              <p className="text-gray-400">
                Preview your portfolio and publish it with one click. Share your professional URL with potential clients and employers
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <motion.section 
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Packed with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Powerful Features</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create a stunning professional portfolio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 rounded-lg p-6"
                variants={itemVariants}
              >
                <div className="rounded-full w-12 h-12 bg-purple-900/30 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Testimonials */}
      <section className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">
              Join thousands of professionals who have built their online presence with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  {/* Stars */}
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 italic mb-4">"{testimonial.content}"</p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to showcase your work to the world?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create your professional portfolio in just 5 minutes and stand out from the crowd.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GradientButton
                variant="purple"
                className="text-lg px-10 py-4"
                onClick={handleGetStarted}
              >
                Create Your Portfolio Now <FaArrowRight className="ml-2 inline" />
              </GradientButton>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} RunIt. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLanding;
