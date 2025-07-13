'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaSave, FaUndo, FaRedo, FaDesktop, FaTabletAlt, FaMobileAlt, FaEye, FaCode, FaCog, FaLayerGroup, FaFont, FaTrash, FaDownload, FaUpload } from 'react-icons/fa';
import GradientButton from '@/components/global/GradientButton';
import RenderTab from '@/components/editor/RenderTab';
import Login from '@/components/Login';
import CheckWebsite from '@/components/editor/CheckWebsite';
import { TABS, PREVIEW_MODES, ELEMENT_TYPES, getSavingStatusIndicator } from '@/utils/Utils';
import { 
  setActiveTab, 
  setPreviewMode, 
  setSelectedElement, 
  setTemplateHtml, 
  setIframeLoaded, 
  setEditableElements,
  setSavingStatus,
  setTemplateId,
  undo,
  redo,
  deleteSelectedElement,
  selectSelectedElement
} from '@/redux/slices/editorSlice';
import { checkSession } from '@/redux/slices/authSlice';
import { publishPortfolio, getUserPortfolios } from '@/redux/slices/portfolioSlice';
import { setPopupConfig } from '@/redux/slices/messagePopSlice';
import { portfolioUrl, publishedPortfolioUrl } from '@/api';
import EditorHeaders from '@/components/editor/EditorHeaders';
import HtmlEnhancementProgress from '@/components/editor/HtmlEnhancementProgress';
import { updateIframeDOM } from '@/utils/Utils';
import PaymentAlert from '@/components/global/PaymentAlert';
import { selectEnhancementComplete } from '@/redux/slices/resumeSlice';
import { toggleFeedback } from '@/redux/slices/compilerSlice';
import FeedbackForm from '@/components/JsCompiler/FeedbackForm';

function Editor({ templateId: propTemplateId }) {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Add error state
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    templates
  } = useSelector(state => state.templates || {});
  
  // Get state from Redux with fallbacks
  const {
    activeTab = TABS.ELEMENTS,
    previewMode = PREVIEW_MODES.DESKTOP,
    selectedElement,
    editorHistory = [],
    historyIndex = 0,
    templateHtml = '',
    iframeLoaded = false,
    savingStatus = '',
    templateId
  } = useSelector((state) => state.editor || {});
  
  // Get auth state from Redux with fallbacks
  const {
    isAuthenticated = false,
    token = null,
    isSessionChecked = false
  } = useSelector((state) => state.auth || {});
  
  const iframeRef = useRef(null);
  const [isIframeInitialized, setIsIframeInitialized] = useState(false);
  const [lastTemplateHtml, setLastTemplateHtml] = useState('');
  const [isTemplateUrl, setIsTemplateUrl] = useState(false);
  const [fetchedHtml, setFetchedHtml] = useState('');
  const updateTimeoutRef = useRef(null);
  const enhancementCompleted = useSelector(selectEnhancementComplete);
  // Add error boundary
  useEffect(() => {
    const handleError = (error) => {
      console.error('Editor Error:', error);
      setError(error.message);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(new Error(event.reason));
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  // Function to fetch HTML content from URL
  const fetchTemplateHtml = async (url) => {
    try {
      dispatch(setSavingStatus('loading'));
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
      }
      const html = await response.text();
      setFetchedHtml(html);
      dispatch(setTemplateHtml(html));
      dispatch(setSavingStatus(''));
    } catch (error) {
      console.error('Error fetching template HTML:', error);
      dispatch(setSavingStatus('error'));
      setError(`Failed to load template: ${error.message}`);
    }
  };

  // Check if templateHtml is a URL or actual HTML content
  useEffect(() => {
    if (templateHtml) {
      const isUrl = templateHtml.startsWith('http://') || templateHtml.startsWith('https://');
      setIsTemplateUrl(isUrl);
      
      if (isUrl) {
        fetchTemplateHtml(templateHtml);
      } else {
        setFetchedHtml(templateHtml);
      }
    } else {
      // Handle case where templateHtml is empty
      setIsLoading(false);
    }
  }, [templateHtml]);

  // Safe function to check if iframe content is accessible
  const canAccessIframeContent = (iframe) => {
    try {
      if (!iframe) return false;
      // This will throw an error if cross-origin
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return false;
      // Try to access a property to trigger security check
      doc.body;
      return true;
    } catch (error) {
      console.log('Cannot access iframe content due to cross-origin restrictions');
      return false;
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    try {
      dispatch(setIframeLoaded(true));
      setIsLoading(false);
      
      if (typeof window === 'undefined' || !window.document) return;
      
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Check if we can access iframe content
      if (!canAccessIframeContent(iframe)) {
        console.log('Template loaded from cross-origin URL - editing features disabled');
        return;
      }

      // Access iframe content (only if not cross-origin)
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframeDocument) return;
      
      // Add editor styles to iframe
      const style = iframeDocument.createElement('style');
      style.textContent = `
        [data-editable] {
          outline: 2px dashed transparent;
          transition: outline-color 0.2s;
          position: relative;
        }
        [data-editable]:hover {
          outline: 2px dashed rgba(124, 58, 237, 0.5);
          cursor: pointer;
        }
        [data-editable].selected {
          outline: 2px solid rgba(124, 58, 237, 1);
        }
        [data-editable]::before {
          content: attr(data-editable-type);
          position: absolute;
          top: -20px;
          left: 0;
          background: #7c3aed;
          color: white;
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 999;
        }
        [data-editable]:hover::before {
          opacity: 1;
        }
        [data-editable].selected::before {
          opacity: 1;
        }
        [data-editable="background"] {
          position: relative;
        }
        [data-editable="background"]::after {
          content: "Edit Background";
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(124, 58, 237, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        [data-editable="background"]:hover::after {
          opacity: 1;
        }
        [data-editable="section"] {
          position: relative;
        }
        [data-editable="section"]::after {
          content: "Edit Section";
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(124, 58, 237, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        [data-editable="section"]:hover::after {
          opacity: 1;
        }
        .section-delete-btn {
          position: absolute;
          top: 10px;
          right: 50px;
          background-color: #e11d48;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s, background-color 0.2s;
        }
        [data-editable="section"]:hover .section-delete-btn {
          opacity: 0.8;
        }
        .section-delete-btn:hover {
          opacity: 1 !important;
          background-color: #f43f5e;
        }
      `;
      iframeDocument.head.appendChild(style);
      
      // Add FontAwesome CSS to iframe if it's not there
      if (!iframeDocument.querySelector('link[href*="font-awesome"]')) {
        const fontAwesomeLink = iframeDocument.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        iframeDocument.head.appendChild(fontAwesomeLink);
      }
      
      // Find all potential editable elements
      const headers = Array.from(iframeDocument.querySelectorAll('h1, h2, h3, h4, h5, h6, p'));
      const images = Array.from(iframeDocument.querySelectorAll('img'));
      const links = Array.from(iframeDocument.querySelectorAll('a'));
      const buttons = Array.from(iframeDocument.querySelectorAll('button, .btn, [class*="button"]'));
      const progressBars = Array.from(iframeDocument.querySelectorAll('.skill-progress, [class*="progress"]'));
      const spans = Array.from(iframeDocument.querySelectorAll('span')); 
      const formElements = Array.from(iframeDocument.querySelectorAll('input, textarea, label, form, select, option'));
      
      // Find entire sections - these are typically <section> elements or divs with section-like classes
      const sections = Array.from(iframeDocument.querySelectorAll('section, [id], [class*="section"]'))
        .filter(el => {
          // Exclude body and html elements
          return el.tagName.toLowerCase() !== 'body' && el.tagName.toLowerCase() !== 'html';
        });
      
      // Find background image elements - typically these are sections or divs with background-image styles
      const backgroundElements = Array.from(iframeDocument.querySelectorAll('section, div, header, body'))
        .filter(el => {
          const computedStyle = getComputedStyle(el);
          return computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none';
        });
      
      // Mark elements as editable
      const allEditableElements = [
        ...headers.map(el => ({ el, type: ELEMENT_TYPES.TEXT })),
        ...images.map(el => ({ el, type: ELEMENT_TYPES.IMAGE })),
        ...links.map(el => ({ el, type: ELEMENT_TYPES.LINK })),
        ...buttons.map(el => ({ el, type: ELEMENT_TYPES.BUTTON })),
        ...progressBars.map(el => ({ el, type: ELEMENT_TYPES.PROGRESS })),
        ...spans.map(el => ({ el, type: ELEMENT_TYPES.TEXT })),
        ...sections.map(el => ({ el, type: ELEMENT_TYPES.SECTION })),
        ...formElements.map(el => {
          // Handle different form element types appropriately
          if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
            return { el, type: ELEMENT_TYPES.INPUT };
          } else if (el.tagName.toLowerCase() === 'label') {
            return { el, type: ELEMENT_TYPES.TEXT };
          } else {
            return { el, type: ELEMENT_TYPES.FORM };
          }
        }),
        ...backgroundElements.map(el => ({ el, type: ELEMENT_TYPES.BACKGROUND }))
      ];
      
      allEditableElements.forEach(({ el, type }, index) => {
        el.setAttribute('data-editable', `element-${index}`);
        el.setAttribute('data-editable-type', type);
        
        // If it's a form element, prevent default submission
        if (el.tagName.toLowerCase() === 'form') {
          el.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Form submission prevented in editor mode');
          });
        }
        
        // If it's an input or textarea, prevent focus stealing
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
          el.addEventListener('focus', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Simulate click to select the element in the editor
            el.click();
          });
          
          // Prevent typing directly in the input
          el.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
        }
        
        // Add click event to make element editable
        el.addEventListener('click', (e) => {
          // Don't select if clicking on delete button
          if (e.target.closest('.section-delete-btn') || e.target.closest('.element-delete-btn')) return;
          
          e.preventDefault();
          e.stopPropagation();
          
          // Remove selected class from all elements
          allEditableElements.forEach(({ el }) => {
            el.classList.remove('selected');
            // Add null check to avoid errors
            const deleteBtn = el.querySelector('.element-delete-btn, .section-delete-btn');
            if (deleteBtn && deleteBtn.className === 'element-delete-btn') {
              deleteBtn.style.opacity = '0';
            }
          });
          
          // Add selected class to clicked element
          el.classList.add('selected');
          
          // Find delete button and make it visible if it's not a section delete button
          const deleteBtn = el.querySelector('.element-delete-btn');
          if (deleteBtn) {
            deleteBtn.style.opacity = '1';
          }
          
          // Switch to Elements tab whenever an element is selected
          dispatch(setActiveTab(TABS.ELEMENTS));
          
          // Process different content types
          let content;
          if (type === ELEMENT_TYPES.TEXT) {
            content = el.innerText;
          } else if (type === ELEMENT_TYPES.IMAGE) {
            content = el.src;
          } else if (type === ELEMENT_TYPES.LINK) {
            content = { href: el.href, text: el.innerText };
          } else if (type === ELEMENT_TYPES.PROGRESS) {
            // For progress bars, get the width or aria-valuenow attribute
            const width = el.style.width || el.getAttribute('data-width') || '0%';
            const valueNow = el.getAttribute('aria-valuenow') || width.replace('%', '');
            content = { width, valueNow };
          } else if (type === ELEMENT_TYPES.SECTION) {
            // For sections, get the ID or class for identification
            const sectionId = el.id || '';
            const sectionClass = el.className || '';
            content = { sectionId, sectionClass };
          } else if (type === ELEMENT_TYPES.BACKGROUND) {
            // Extract background image URL from style
            const computedStyle = getComputedStyle(el);
            const bgImage = computedStyle.backgroundImage;
            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            content = urlMatch ? urlMatch[1] : '';
          } else if (type === ELEMENT_TYPES.INPUT) {
            content = el.placeholder || '';
            // Also capture value and other attributes
            const value = el.value || '';
            const name = el.name || '';
            const inputType = el.type || 'text';
            content = { placeholder: content, value, name, inputType };
          } else if (type === ELEMENT_TYPES.FORM) {
            const formId = el.id || '';
            const action = el.action || '';
            const method = el.method || 'post';
            content = { formId, action, method };
          } else {
            content = el.innerText;
          }
          
          // Set selected element
          dispatch(setSelectedElement({
            id: `element-${index}`,
            type,
            content
          }));
        });
      });
        
      // Create a catalog of all editable elements
      const elementsData = allEditableElements.map(({ el, type }, index) => {
        let content;
        if (type === ELEMENT_TYPES.TEXT) {
          content = el.innerText;
        } else if (type === ELEMENT_TYPES.IMAGE) {
          content = el.src;
        } else if (type === ELEMENT_TYPES.LINK) {
          content = { href: el.href, text: el.innerText };
        } else if (type === ELEMENT_TYPES.PROGRESS) {
          const width = el.style.width || el.getAttribute('data-width') || '0%';
          const valueNow = el.getAttribute('aria-valuenow') || width.replace('%', '');
          content = { width, valueNow };
        } else if (type === ELEMENT_TYPES.SECTION) {
          const sectionId = el.id || '';
          const sectionClass = el.className || '';
          content = { sectionId, sectionClass };
        } else if (type === ELEMENT_TYPES.BACKGROUND) {
          const computedStyle = getComputedStyle(el);
          const bgImage = computedStyle.backgroundImage;
          const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
          content = urlMatch ? urlMatch[1] : '';
        } else {
          content = el.innerText;
        }
        
        return {
          id: `element-${index}`,
          type,
          content
        };
      });
      
      if (dispatch && setEditableElements) {
        dispatch(setEditableElements(elementsData));
      }
    } catch (error) {
      console.error('Error in handleIframeLoad:', error);
      setError(`Editor initialization failed: ${error.message}`);
    }
  };

  // Get preview mode dimensions
  const getPreviewDimensions = () => {
    switch(previewMode) {
      case PREVIEW_MODES.DESKTOP:
        return { width: '100%', height: '100%' };
      case PREVIEW_MODES.TABLET:
        return { width: '768px', height: '100%' };
      case PREVIEW_MODES.MOBILE:
        return { width: '375px', height: '100%' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  // Main useEffect for handling template updates when we have HTML content (not URL)
  useEffect(() => {
    try {
      if (isTemplateUrl || !fetchedHtml) return;

      // Clear any pending updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Only proceed if we have valid HTML content
      if (fetchedHtml.length < 50) return;
      
      // If iframe isn't initialized yet, do initial load
      if (!isIframeInitialized && iframeRef.current) {
        const iframe = iframeRef.current;
        
        // Check if we can safely access iframe content
        if (canAccessIframeContent(iframe)) {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          
          if (iframeDocument) {
            // Initial load
            iframeDocument.open();
            iframeDocument.write(fetchedHtml);
            iframeDocument.close();
            
            setLastTemplateHtml(fetchedHtml);
            setIsIframeInitialized(true);
            
            // Initialize editor after a short delay
            setTimeout(() => {
              handleIframeLoad();
            }, 200);
          }
        }
        return;
      }

      // For subsequent updates, use DOM diffing
      if (isIframeInitialized && fetchedHtml !== lastTemplateHtml) {
        // Debounce updates to avoid too frequent DOM manipulations
        updateTimeoutRef.current = setTimeout(() => {
          const iframe = iframeRef.current;
          
          if (canAccessIframeContent(iframe)) {
            const updatedHtml = updateIframeDOM ? updateIframeDOM(fetchedHtml, iframeRef) : fetchedHtml;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            
            if (iframeDocument) {
              iframeDocument.open();
              iframeDocument.write(updatedHtml);
              iframeDocument.close();
              setLastTemplateHtml(updatedHtml);
              
              // Initialize editor after update
              setTimeout(() => {
                handleIframeLoad();
              }, 200);
            }
          }
        }, 100); // 100ms debounce
      }
    } catch (error) {
      console.error('Error in template update effect:', error);
      setError(`Template update failed: ${error.message}`);
    }
  }, [fetchedHtml,enhancementCompleted, isIframeInitialized, isTemplateUrl]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    try {
      if (dispatch && checkSession) {
        dispatch(checkSession());
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, [dispatch]);

  // Fetch user portfolios on mount if authenticated
  useEffect(() => {
    try {
      if (isAuthenticated && token && dispatch && getUserPortfolios) {
        dispatch(getUserPortfolios());
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  }, [isAuthenticated, token, dispatch]);
  useEffect(() => {
    if (enhancementCompleted) {
        dispatch(toggleFeedback(true))
    }
    }, [enhancementCompleted]);
  // Early return for error state
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-red-900 bg-opacity-20 rounded-lg border border-red-500">
          <div className="text-red-400 text-xl mb-4">⚠️ Editor Error</div>
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Editor
          </button>
        </div>
      </div>
    );
  }

  // If template ID is not set, show loading
  if (!templateId) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white">Loading editor...</p>
        </div>
      </div>
    );
  }

  // Show loading state while initializing
  if (isLoading && !fetchedHtml) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Editor Toolbar */}
      {EditorHeaders && <EditorHeaders iframeRef={iframeRef}/>}

      {/* Editor Main Content */}
      <div className="flex-1 flex">
        {/* Preview Panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Preview Container */}
          <div className="flex-1 bg-gray-950 flex items-center justify-center overflow-auto">
            <div 
              className="bg-white transition-all duration-300 flex items-center justify-center"
              style={{
                ...getPreviewDimensions(),
                height: 'calc(100vh - 120px)',
                maxHeight: 'calc(100vh - 120px)'
              }}
            >
              {/* Conditional iframe rendering based on content type */}
              {isTemplateUrl ? (
                // For URL-based templates (no editing capabilities due to CORS)
                <iframe
                  ref={iframeRef}
                  src={templateHtml}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : fetchedHtml?.length > 50 ? (
                // For HTML content-based templates (full editing capabilities)
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                  // No src or srcdoc - content will be injected via DOM
                />
              ) : (
                // Fallback for any other case
                <iframe
                  ref={iframeRef}
                  src={templateHtml}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
              
              {(!iframeLoaded || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-400 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-white">Loading template...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="h-8 bg-gray-900 border-t border-gray-800 px-4 py-1 flex justify-between items-center text-xs">
            <div className="text-gray-400">
              Template ID: {templateId} {isTemplateUrl && "(Preview Only - Limited Editing)"}
            </div>
            <div>
              {getSavingStatusIndicator && getSavingStatusIndicator(savingStatus)}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
          {/* Editor Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.ELEMENTS ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch && setActiveTab && dispatch(setActiveTab(TABS.ELEMENTS))}
            >
              <FaLayerGroup className="inline-block mr-1.5" /> Elements
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.STYLE ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch && setActiveTab && dispatch(setActiveTab(TABS.STYLE))}
            >
              <FaFont className="inline-block mr-1.5" /> Style
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.SETTINGS ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch && setActiveTab && dispatch(setActiveTab(TABS.SETTINGS))}
            >
              <FaCog className="inline-block mr-1.5" /> Settings
            </button>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            {RenderTab && <RenderTab iframeRef={iframeRef} />}
          </div>
        </div>
      </div>
      {HtmlEnhancementProgress && <HtmlEnhancementProgress />}
       <FeedbackForm handleClose={() => dispatch(toggleFeedback(false))} />
    </div>
  );
}

export default Editor;