'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEdit, FaEye, FaCode } from 'react-icons/fa';
import GradientButton from '@/components/global/GradientButton';

// Template data structure
const availableTemplates = [
  {
    id: 'engineer-atif',
    name: 'Engineer Portfolio',
    category: 'professional',
    thumbnail: '/assets/portfolio-sample1.png', // Create a preview image for the template
    path: '/templates/engineer/atif',
    description: 'A clean, modern portfolio template for engineers and developers',
    tags: ['portfolio', 'developer', 'professional']
  },
  {
    id: 'eventmanagement-athar',
    name: 'Event Management',
    category: 'portfolio',
    thumbnail: '/assets/portfolio-sample5.png',
    path: '/templates/eventmanagement/athar',
    description: 'Sleek dark-themed portfolio with minimalist design',
    tags: ['minimal', 'dark', 'creative']
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'business', name: 'Business' },
  { id: 'agency', name: 'Agency' },
  { id: 'professional', name: 'Professional' },
];

function Templates() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates based on category and search query
  const filteredTemplates = availableTemplates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    router.push(`/portfolio/editor/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Template</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Select from our professionally designed templates to get started. 
            You can customize every aspect to match your unique style.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => (
              <motion.div 
                key={template.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
                variants={itemVariants}
              >
                {/* Template Preview */}
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-xl font-bold text-white">{template.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</p>
                  </div>
                </div>

                {/* Template Details */}
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map(tag => (
                      <span key={`${template.id}-${tag}`} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <GradientButton
                      className="flex-1 text-sm py-1.5"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <FaEdit className="mr-1.5" /> Edit
                    </GradientButton>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors">
                      <FaEye />
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors">
                      <FaCode />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <div className="text-gray-400 text-lg">No templates found matching your criteria</div>
              <button 
                className="mt-4 text-purple-400 hover:text-purple-300"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Templates;
