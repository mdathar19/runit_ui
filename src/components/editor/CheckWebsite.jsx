'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkWebsiteName, clearNameCheckResult } from '@/redux/slices/portfolioSlice';
import { FaCheck, FaSpinner, FaTimes, FaInfoCircle } from 'react-icons/fa';

const CheckWebsite = ({ onWebsiteNameConfirmed, initialName }) => {
  const [websiteName, setWebsiteName] = useState(initialName || '');
  const [nameValid, setNameValid] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  
  const dispatch = useDispatch();
  const { checkNameStatus, nameCheckResult, error, portfolios } = useSelector(state => state.portfolio);
  
  useEffect(() => {
    // Clear previous checks when component mounts or unmounts
    return () => {
      dispatch(clearNameCheckResult());
    };
  }, [dispatch]);
  
  useEffect(() => {
    // Validate the input format
    const nameRegex = /^[a-z0-9-]+$/;
    setNameValid(websiteName.length >= 3 && nameRegex.test(websiteName));
  }, [websiteName]);
  
  // When we receive a result and it's available, auto-confirm if needed
  useEffect(() => {
    if (checkNameStatus === 'succeeded' && nameCheckResult?.available) {
      // If the name is available, we can proceed
      onWebsiteNameConfirmed(websiteName);
    }
  }, [checkNameStatus, nameCheckResult, websiteName, onWebsiteNameConfirmed]);
  
  const handleCheck = () => {
    if (nameValid) {
      console.log("nameValid", nameValid);
      dispatch(checkWebsiteName(websiteName));
      setInputTouched(true);
    }
  };
  
  const handleNameChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setWebsiteName(value);
    setInputTouched(true);
    
    // Clear previous check results when the input changes
    if (checkNameStatus !== 'idle') {
      dispatch(clearNameCheckResult());
    }
  };
  
  const handleUseSuggestion = () => {
    if (nameCheckResult?.suggestedName) {
      setWebsiteName(nameCheckResult.suggestedName);
      // Re-check the suggested name automatically
      setTimeout(() => {
        dispatch(checkWebsiteName(nameCheckResult.suggestedName));
      }, 100);
    }
  };
  
  const handlePortfolioSelect = (e) => {
    const value = e.target.value;
    setSelectedPortfolio(value);
    
    if (value === 'new') {
      setShowNewNameInput(true);
    } else if (value) {
      // If a portfolio is selected, use its name and proceed
      onWebsiteNameConfirmed(value);
    }
  };
  
  // Submit handler for the form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(nameValid, checkNameStatus, nameCheckResult);
    
    if (selectedPortfolio && selectedPortfolio !== 'new') {
      // If an existing portfolio is selected, proceed with that
      onWebsiteNameConfirmed(selectedPortfolio);
    } else if (nameValid) {
      // Otherwise check if the new name is valid
      if (checkNameStatus === 'succeeded' && nameCheckResult?.available) {
        onWebsiteNameConfirmed(websiteName);
      } else {
        handleCheck();
      }
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="max-w-lg w-full">
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Choose a Website Name</h2>
          
          <form onSubmit={handleSubmit}>
            {portfolios && portfolios.length > 0 && (
              <div className="mb-6">
                <label htmlFor="existingPortfolio" className="block text-sm font-medium text-gray-300 mb-1">
                  Select Existing Portfolio or Create New
                </label>
                <select
                  id="existingPortfolio"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedPortfolio}
                  onChange={handlePortfolioSelect}
                >
                  <option value="">-- Select a portfolio --</option>
                  {portfolios.map(portfolio => (
                    <option key={portfolio._id} value={portfolio.name}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
                
                {selectedPortfolio && selectedPortfolio !== 'new' && (
                  <div className="mt-2 text-sm text-green-400 flex items-start gap-2">
                    <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                    <span>You selected an existing portfolio. Click Confirm to proceed.</span>
                  </div>
                )}
              </div>
            )}
            
            {(showNewNameInput || !portfolios || portfolios.length === 0) && (
              <div className="mb-4">
                <label htmlFor="websiteName" className="block text-sm font-medium text-gray-300 mb-1">
                  {portfolios && portfolios.length > 0 ? 'New Portfolio Name' : 'Website Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="websiteName"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="my-portfolio"
                    value={websiteName}
                    onChange={handleNameChange}
                    autoComplete="off"
                  />
                  
                  {inputTouched && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkNameStatus === 'loading' && (
                        <FaSpinner className="animate-spin text-purple-500" />
                      )}
                      {checkNameStatus === 'succeeded' && nameCheckResult?.available && (
                        <FaCheck className="text-green-500" />
                      )}
                      {checkNameStatus === 'succeeded' && !nameCheckResult?.available && (
                        <FaTimes className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Input guidance */}
                <p className="mt-1 text-sm text-gray-400">
                  Use only lowercase letters, numbers, and hyphens. Minimum 3 characters.
                </p>
                
                {/* Validation message */}
                {inputTouched && !nameValid && (
                  <p className="mt-1 text-sm text-red-400">
                    Please use only lowercase letters, numbers, and hyphens (minimum 3 characters).
                  </p>
                )}
                
                {/* Availability message */}
                {checkNameStatus === 'succeeded' && (
                  <div className={`mt-2 text-sm ${nameCheckResult?.available ? 'text-green-400' : 'text-yellow-400'} flex items-start gap-2`}>
                    <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                    <span>{nameCheckResult?.message}</span>
                  </div>
                )}
                
                {/* Suggested name */}
                {checkNameStatus === 'succeeded' && !nameCheckResult?.available && nameCheckResult?.suggestedName && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-300">Suggested name:</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-purple-400">{nameCheckResult.suggestedName}</span>
                      <button
                        type="button"
                        className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                        onClick={handleUseSuggestion}
                      >
                        Use this
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Error message */}
                {checkNameStatus === 'failed' && (
                  <p className="mt-2 text-sm text-red-400">{error || 'Failed to check website name availability.'}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => onWebsiteNameConfirmed(null)}
              >
                Skip
              </button>
              
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(showNewNameInput && !nameValid) || (checkNameStatus === 'loading') || (!selectedPortfolio && portfolios && portfolios.length > 0 && !showNewNameInput)}
              >
                {checkNameStatus === 'loading' ? 'Checking...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckWebsite;
