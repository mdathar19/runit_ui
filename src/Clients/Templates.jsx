'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEdit, FaEye, FaCode, FaSpinner } from 'react-icons/fa';
import { debounce } from 'lodash';
import GradientButton from '@/components/global/GradientButton';
import { 
  fetchTemplates, 
  setFilters, 
  clearTemplates,
  clearError 
} from '@/redux/slices/templateReducer';
import useReduxStore from '@/hooks/useReduxStore';
import { setTemplateHtml } from '@/redux/slices/editorSlice';
import { assetUrl, getUIBaseUrl } from '@/api';

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'portfolio', name: 'Portfolio' },
/*   { id: 'business', name: 'Business' },
  { id: 'agency', name: 'Agency' }, */
  { id: 'professional', name: 'Professional' },
];

function Templates() {
  const router = useRouter();
  const dispatch = useDispatch();
  const observerRef = useRef();
  const loadMoreRef = useRef();

  // Redux state
  const {
    templates,
    filters,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    hasMore
  } = useSelector(state => state.templates);

  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      dispatch(setFilters({ search: searchQuery }));
    }, 500),
    [dispatch]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    dispatch(setFilters({ category: categoryId }));
  };

  // Load more templates
  const loadMoreTemplates = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      dispatch(fetchTemplates({
        page: pagination.currentPage + 1,
        category: filters.category,
        search: filters.search
      }));
    }
  }, [dispatch, isLoadingMore, hasMore, pagination.currentPage, filters]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreTemplates();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreTemplates, hasMore, isLoadingMore]);

  // Fetch templates when filters change
  useEffect(() => {
    dispatch(fetchTemplates({
      page: 1,
      category: filters.category,
      search: filters.search
    }));
  }, [dispatch, filters.category, filters.search]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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

  // Handle template selection - navigate to editor with template name
  const handleSelectTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName);
    dispatch(setTemplateHtml(`${template.templateUrl}`));
    const width = 1024;
    const height = 768;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      `/portfolio/editor/${templateName}`, 
      "template_editor",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,location=no,menubar=no,toolbar=no`
    );
  };

  // Handle template preview
  const handlePreviewTemplate = (templateUrl) => {
    window.open(templateUrl, '_blank');
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 py-20">
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
                value={searchInput}
                onChange={handleSearchChange}
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
                  filters.category === category.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm underline hover:no-underline"
              onClick={() => dispatch(clearError())}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && templates.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
                <div className="h-60 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-700 rounded flex-1"></div>
                    <div className="h-8 bg-gray-700 rounded w-10"></div>
                    <div className="h-8 bg-gray-700 rounded w-10"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading || templates.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {templates.length > 0 ? (
              templates.map(template => (
                <motion.div 
                    key={template._id}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 h-full flex flex-col group"
                    variants={itemVariants}
                  >
                    {/* Template Preview - Larger and more prominent */}
                    <div className="relative h-72 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                      <div className="relative w-full h-full overflow-hidden">
                        <iframe
                          src={template.templateUrl}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none transform group-hover:scale-105 transition-transform duration-300"
                          scrolling="no"
                          style={{ border: 'none' }}
                          onError={() => template.coverImage}
                        />
                      </div>
                      
                      {/* Overlay Content */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
                        {/* Top: Category Badge */}
                        <div className="flex justify-end items-start">
                          <span className="bg-purple-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                          </span>
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            {/* <span className="text-white text-xs">{template.rating.average.toFixed(1)}</span> */}
                            <span className="text-white text-xs">{5.0}</span>
                          </div>
                        </div>
                        
                        {/* Bottom: Title */}
                        {/* <div>
                          <h3 className="text-xl font-bold text-white mb-1">{template.displayName}</h3>
                          <p className="text-sm text-gray-300">
                            Used {template.usageCount} times • {template.rating.count} reviews
                          </p>
                        </div> */}
                      </div>
                    </div>

                    {/* Compact Details Section */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Description - Fixed height with ellipsis */}
                      <div className="mb-3">
                        <p className="text-gray-300 text-sm leading-relaxed h-10 overflow-hidden">
                          <span className="line-clamp-2">
                            {template.description}
                          </span>
                        </p>
                      </div>

                      {/* Tags - Limited to 3 with overflow indicator */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.slice(0, 3).map(tag => (
                          <span 
                            key={`${template._id}-${tag}`} 
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="text-xs bg-gray-600 text-gray-400 px-2 py-1 rounded-md">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-auto">
                        <div className="flex gap-2">
                          <GradientButton
                            className="flex-1 text-sm py-2.5 font-medium"
                            onClick={() => handleSelectTemplate(template.name)}
                          >
                            <FaEdit className="mr-2" /> Edit Template
                          </GradientButton>
                          <button 
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-md transition-all duration-200 hover:scale-105"
                            onClick={() => handlePreviewTemplate(template.templateUrl)}
                            title="Preview Template"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

              ))
            ) : !isLoading && (
              <div className="col-span-3 py-12 text-center">
                <div className="text-gray-400 text-lg">No templates found matching your criteria</div>
                <button 
                  className="mt-4 text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    dispatch(setFilters({ category: 'all', search: '' }));
                    setSearchInput('');
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Load More Trigger & Loading Indicator */}
        <div ref={loadMoreRef} className="py-8 text-center">
          {isLoadingMore && (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              <span className="text-gray-400">Loading more templates...</span>
            </div>
          )}
          {!hasMore && templates.length > 0 && (
            <p className="text-gray-500">You've reached the end of the templates</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default useReduxStore(Templates);