"use client"
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  runCode, 
  selectIsLoading,
  selectSelectedLanguage
} from '../../redux/slices/compilerSlice';
import { useDeviceSetup } from '../../redux/hooks';
import GradientButton from '../global/GradientButton';
import { LanguageIcon, languageOptions } from '@/Utils';
import AppTooltip from '../global/AppTooltip';
import IconButton from '../global/IconButton';
import { FaExpand, FaImage } from 'react-icons/fa';



const EditorNavbar = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector(selectIsLoading);
  const { isMobileView } = useDeviceSetup();
  const selectedLanguage = useSelector(selectSelectedLanguage);
  // Language selection state
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Find the currently selected language object
  const selectedLangObj = languageOptions.find(lang => lang.id === selectedLanguage) || languageOptions[0];
  
  // Run code handler
  const handleRunCode = () => {
    dispatch(runCode());
  };
  
  // Handle language selection
  const handleLanguageSelect = (language) => {
    setShowLangDropdown(false);
    // Navigate to the language route
    router.push(language.path);
  };
  
  // Toggle language dropdown
  const toggleLangDropdown = () => setShowLangDropdown(!showLangDropdown);
  
  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowLangDropdown(false);
    }
  };
  
  // Setup click outside listener
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleNavigateSnippetPage = () =>{
    router.push('/create-snippet');
  }
  return (
    <div className="w-full mb-1">
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-900 to-purple-900 rounded-lg shadow-lg">
        {/* Language selector - Desktop uses tabs, Mobile uses dropdown */}
        {isMobileView ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleLangDropdown}
              className="relative flex items-center px-4 py-2 text-sm font-medium bg-black bg-opacity-30 text-white rounded-md hover:bg-opacity-40 transition-colors cursor-pointer"
            >
              <LanguageIcon language={selectedLangObj.id} selected={true} />
              <span className="mr-2">{selectedLangObj.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-300 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Mobile Language Dropdown */}
            {showLangDropdown && (
              <div className="absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {languageOptions.map((lang) => {
                    const isSelected = selectedLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        className={`flex items-center w-full px-4 py-3 text-sm cursor-pointer ${
                          isSelected 
                            ? 'bg-gradient-to-r from-purple-600 to-violet-800 text-white'
                            : 'text-gray-200 hover:bg-gray-700'
                        }`}
                        onClick={() => handleLanguageSelect(lang)}
                      >
                        <LanguageIcon language={lang.id} selected={isSelected} />
                        <span>{lang.name}</span>
                        {isSelected && (
                          <svg className="h-5 w-5 ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex space-x-1">
            {languageOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  selectedLanguage === lang.id
                    ? 'bg-gradient-to-r from-purple-600 to-violet-800 text-white shadow-lg'
                    : 'text-gray-200 hover:bg-black hover:bg-opacity-25'
                }`}
              >
                <LanguageIcon language={lang.id} selected={selectedLanguage === lang.id} />
                <span>{lang.name}</span>
              </button>
            ))}
          </nav>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Snippet Creator Button */}
            <AppTooltip position="left" icon={true} text="Create Snippet">
              <IconButton 
                icon={<FaImage />}
                variant="dark" 
                onClick={handleNavigateSnippetPage}
              />
            </AppTooltip>
          
          {!isMobileView && (
            <AppTooltip text='Full Screen'>
              <IconButton
                icon={<FaExpand/> }
                variant="dark" 
                onClick={toggleFullscreen}
              />
            </AppTooltip>
          )}
          
          <GradientButton
            onClick={handleRunCode} 
            disabled={isLoading}
            isLoading={isLoading}
          >
            Run
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default EditorNavbar;