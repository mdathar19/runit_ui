"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  runCode, 
  selectIsLoading,
  setSelectedLanguage,
  selectSelectedLanguage
} from '../../redux/slices/compilerSlice';
import SnippetCreator from './SnippetCreator';
import { useDeviceSetup } from '../../redux/hooks';

// Custom language icon components
const LanguageIcon = ({ language, selected }) => {
  const getLanguageColor = (lang) => {
    switch(lang) {
      case 'javascript': return selected ? "text-white" : "text-yellow-400";
      case 'typescript': return selected ? "text-white" : "text-blue-500";
      case 'python': return selected ? "text-white" : "text-blue-600";
      case 'c': return selected ? "text-white" : "text-gray-400";
      case 'c++': return selected ? "text-white" : "text-blue-700";
      case 'go': return selected ? "text-white" : "text-blue-400";
      case 'java': return selected ? "text-white" : "text-orange-600";
      default: return selected ? "text-white" : "text-gray-400";
    }
  };

  const getLanguageSymbol = (lang) => {
    switch(lang) {
      case 'javascript': return "JS";
      case 'typescript': return "TS";
      case 'python': return "PY";
      case 'c': return "C";
      case 'c++': return "C++";
      case 'go': return "GO";
      case 'java': return "JV";
      default: return "?";
    }
  };
  
  return (
    <div className={`h-5 w-5 mr-2 font-mono font-bold ${getLanguageColor(language)}`}>
      {getLanguageSymbol(language)}
    </div>
  );
};

// Tooltip component
const AppTooltip = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black bg-opacity-80 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-opacity-80"></div>
      </div>
    </div>
  );
};

const EditorNavbar = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const { isMobileView } = useDeviceSetup();
  const selectedLanguage = useSelector(selectSelectedLanguage);
  
  // Language selection modal state
  const [showLangModal, setShowLangModal] = useState(false);
  const modalRef = useRef(null);
  
  // Get the code from the Redux store
  const code = useSelector(state => state.compiler.code);
  
  // Language options with their display names
  const languageOptions = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'c', name: 'C' },
    { id: 'c++', name: 'C++' },
    { id: 'go', name: 'Go' },
    { id: 'java', name: 'Java' }
  ];
  
  // Find the currently selected language object
  const selectedLangObj = languageOptions.find(lang => lang.id === selectedLanguage) || languageOptions[0];
  
  // Run code handler
  const handleRunCode = () => {
    dispatch(runCode());
  };
  
  // Handle language selection
  const handleLanguageSelect = (language) => {
    dispatch(setSelectedLanguage(language));
    setShowLangModal(false); // Close modal after selection
  };
  
  // Toggle language modal
  const toggleLangModal = () => setShowLangModal(!showLangModal);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLangModal(false);
      }
    }
    
    if (showLangModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLangModal]);
  
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

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-900 to-purple-900 rounded-lg shadow-lg">
        {/* Language selector - Desktop uses tabs, Mobile uses slide-out menu */}
        {isMobileView ? (
          <div className="relative">
            <button 
              onClick={toggleLangModal}
              className="relative flex items-center px-4 py-2 text-sm font-medium bg-black bg-opacity-30 text-white rounded-md hover:bg-opacity-40 transition-colors"
            >
              <LanguageIcon language={selectedLangObj.id} selected={true} />
              <span className="mr-2">{selectedLangObj.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-5 w-auto min-w-[20px] items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs text-white">
                Change
              </span>
            </button>
            
            {/* Mobile Language Sidebar */}
            {showLangModal && (
              <div className="fixed inset-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowLangModal(false)}></div>
                
                <div 
                  ref={modalRef}
                  className="absolute inset-y-0 left-0 max-w-full flex"
                >
                  <div className="w-screen max-w-xs">
                    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-purple-900 shadow-xl overflow-y-auto">
                      <div className="px-4 py-5 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Select Language</h2>
                        <button 
                          className="text-gray-300 hover:text-white" 
                          onClick={() => setShowLangModal(false)}
                        >
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="p-4 flex-1">
                        <div className="space-y-2">
                          {languageOptions.map((lang) => {
                            const isSelected = selectedLanguage === lang.id;
                            return (
                              <button
                                key={lang.id}
                                className={`flex items-center justify-between w-full p-3 rounded-md transition-colors ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-purple-600 to-violet-800 text-white'
                                    : 'bg-black bg-opacity-25 text-gray-200 hover:bg-opacity-40'
                                }`}
                                onClick={() => handleLanguageSelect(lang.id)}
                              >
                                <div className="flex items-center">
                                  <LanguageIcon language={lang.id} selected={isSelected} />
                                  <span>{lang.name}</span>
                                </div>
                                {isSelected && (
                                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex space-x-1">
            {languageOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
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
          <div>
            <SnippetCreator 
              code={code}
              language={selectedLanguage}
            />
          </div>
          
          {!isMobileView && (
            <AppTooltip text='Full Screen'>
              <button 
                onClick={toggleFullscreen} 
                className="p-2 text-gray-300 hover:text-white bg-black bg-opacity-30 rounded-md hover:bg-opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
            </AppTooltip>
          )}
          
          <button 
            onClick={handleRunCode} 
            disabled={isLoading}
            className={`flex items-center px-6 py-2 text-sm font-medium text-white 
              ${isLoading 
                ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900'} 
              rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running
              </>
            ) : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorNavbar;