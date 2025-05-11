'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

/**
 * A reusable dropdown selector component
 * @param {Object} props
 * @param {Array} props.options - Array of option objects with at least id and name properties
 * @param {string} props.selectedId - The currently selected option id
 * @param {Function} props.onSelect - Callback function when an option is selected
 * @param {string} props.label - The label text for the dropdown
 * @param {Function} props.renderOption - Custom renderer for each option item (optional)
 * @param {Function} props.renderSelected - Custom renderer for the selected item (optional)
 * @param {string} props.placeholder - Placeholder text for the search input (optional)
 * @param {boolean} props.disabled - Whether the dropdown is disabled (optional)
 * @param {string} props.className - Additional classes for the main container (optional)
 */
const ReusableSelector = ({
  options = [],
  selectedId,
  onSelect,
  label = "Select option",
  renderOption,
  renderSelected,
  placeholder = "Search options...",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Find the currently selected option object
  const currentSelection = options.find(option => option.id === selectedId) || options[0] || null;

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle option selection
  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Default option renderer
  const defaultRenderOption = (option) => (
    <div className="flex items-center">
      {option.icon && (
        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-gray-800 rounded text-xs font-medium">
          {option.icon}
        </span>
      )}
      {option.name}
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        className={`flex items-center justify-between w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white transition-colors ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-600'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center truncate">
          {currentSelection 
            ? (renderSelected ? renderSelected(currentSelection) : defaultRenderOption(currentSelection))
            : <span className="text-gray-400">Select...</span>
          }
        </div>
        <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder={placeholder}
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                className={`flex items-center w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                  option.id === selectedId ? 'bg-purple-700 bg-opacity-30 text-purple-300' : 'text-white'
                }`}
                onClick={() => handleSelect(option)}
              >
                {renderOption ? renderOption(option) : defaultRenderOption(option)}
              </button>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400 text-sm">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableSelector;