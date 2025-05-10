"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleQuestionInput, selectAnswerPosition } from '../../redux/slices/compilerSlice';

const SearchIcon = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const answerPosition = useSelector(selectAnswerPosition);
  
  // Handler to show question box
  const showQuestionBox = () => {
    dispatch(toggleQuestionInput(true));
  };
  
  // Create or update floating search icon with tooltip
  useEffect(() => {
    let searchIconContainer = null;
    
    // Create floating search icon
    const createSearchIcon = () => {
      // Create container for the search icon
      searchIconContainer = document.createElement('div');
      searchIconContainer.id = 'search-icon-floating';
      searchIconContainer.className = 'fixed z-40';
      
      // Create the icon button
      const searchIconButton = document.createElement('button');
      searchIconButton.className = 'cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-900 text-white shadow-lg hover:shadow-purple-500/50';
      searchIconButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon-inner">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap';
      tooltip.innerHTML = `
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-300">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          Ask a question (Ctrl+Space)
        </div>
        <div class="tooltip-arrow"></div>
      `;
      
      // Wrap button in a group for hover effects
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'group relative';
      buttonGroup.appendChild(searchIconButton);
      buttonGroup.appendChild(tooltip);
      
      // Position tooltip based on screen space
      if (window.innerWidth < 768) {
        tooltip.classList.add('-top-8', 'left-1/2', '-translate-x-1/2');
      } else {
        tooltip.classList.add('top-1/2', '-translate-y-1/2', 'left-full', 'ml-2');
      }
      
      // Add event listeners
      searchIconButton.onclick = showQuestionBox;
      
      // Add pulse animation class
      /* searchIconButton.classList.add('animate-pulse');
      setTimeout(() => {
        searchIconButton.classList.remove('animate-pulse');
      }, 1000); */
      
      // Append elements
      searchIconContainer.appendChild(buttonGroup);
      document.body.appendChild(searchIconContainer);
    };
    
    // Remove existing search icon
    const removeExistingIcon = () => {
      const existingIcon = document.getElementById('search-icon-floating');
      if (existingIcon) {
        document.body.removeChild(existingIcon);
      }
    };
    
    // Update position of icon
    const updatePosition = () => {
      if (searchIconContainer && answerPosition) {
        searchIconContainer.style.top = `${answerPosition.top - 30}px`;
        searchIconContainer.style.left = `${answerPosition.left + 30}px`;
      }
    };
    
    // Add keyboard shortcut listener (Ctrl+Space)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault(); // Prevent default browser behavior
        showQuestionBox();
      }
    };
    
    // Initialize - always remove existing before creating a new one
    removeExistingIcon();
    
    if (answerPosition) {
      createSearchIcon();
      updatePosition();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      removeExistingIcon();
    };
  }, [answerPosition, dispatch]);
  
  // This component doesn't render anything directly
  return null;
};

export default SearchIcon;