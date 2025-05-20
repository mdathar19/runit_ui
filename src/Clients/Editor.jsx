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

function Editor({ templateId: propTemplateId }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  
  // Get state from Redux
  const {
    activeTab,
    previewMode,
    selectedElement,
    editorHistory,
    historyIndex,
    templateHtml,
    iframeLoaded,
    savingStatus,
    templateId
  } = useSelector((state) => state.editor);
  
  // Get auth state from Redux
  const {
    isAuthenticated,
    token,
    isSessionChecked
  } = useSelector((state) => state.auth);
  
  const iframeRef = useRef(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);
  
  // Fetch user portfolios on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(getUserPortfolios());
    }
  }, [isAuthenticated, token, dispatch]);
  
  // Set template ID on mount
  useEffect(() => {
    if (propTemplateId || params?.templateId) {
      const id = propTemplateId || params?.templateId || 'engineer-atif';
      dispatch(setTemplateId(id));
    }
  }, [propTemplateId, params, dispatch]);
  
  // Template path based on ID
  const templatePath = `/templates/${templateId?.split('-').join('/')}` || '';

  // Handle iframe load
  const handleIframeLoad = () => {
    dispatch(setIframeLoaded(true));
    
    try {
      // Access iframe content
      const iframe = iframeRef.current;
      if (!iframe) return;
      
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      
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
        
        // Create and append delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = type === ELEMENT_TYPES.SECTION ? 'section-delete-btn' : 'element-delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        
        if (type !== ELEMENT_TYPES.SECTION) {
          // Style for regular element delete buttons
          deleteBtn.style.position = 'absolute';
          deleteBtn.style.top = '-20px';
          deleteBtn.style.right = '0';
          deleteBtn.style.backgroundColor = '#e11d48';
          deleteBtn.style.color = 'white';
          deleteBtn.style.width = '20px';
          deleteBtn.style.height = '20px';
          deleteBtn.style.borderRadius = '50%';
          deleteBtn.style.display = 'flex';
          deleteBtn.style.alignItems = 'center';
          deleteBtn.style.justifyContent = 'center';
          deleteBtn.style.fontSize = '10px';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.opacity = '0';
          deleteBtn.style.zIndex = '1000';
          deleteBtn.style.transition = 'opacity 0.2s, background-color 0.2s';
        }
        
        // Make sure element has position relative
        const computedStyle = getComputedStyle(el);
        if (computedStyle.position === 'static') {
          el.style.position = 'relative';
        }
        
        el.appendChild(deleteBtn);
        
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
        
        // Add click event for delete button
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Only hide the element visually, don't remove it from DOM 
          // so it can be restored with undo
          el.style.display = 'none';
          
          // Dispatch delete action
          dispatch(deleteSelectedElement());
          
          // Show feedback
          dispatch(setSavingStatus('saving'));
          setTimeout(() => {
            dispatch(setSavingStatus('saved'));
            setTimeout(() => dispatch(setSavingStatus('')), 2000);
          }, 1000);
        });
        
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
      
      dispatch(setEditableElements(elementsData));
    } catch (error) {
      console.error('Error accessing iframe content:', error);
    }
  };

  // Load template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // In a real implementation, you would fetch the template HTML from your server
        dispatch(setTemplateHtml(`${templatePath}/index.html`));
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };
    
    if (templateId) {
      fetchTemplate();
    }
  }, [templatePath, templateId, dispatch]);

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

  // Add this function to handle delete of selected element
  const handleDeleteElement = () => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedElement) return;
    
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const element = iframeDocument.querySelector(`[data-editable="${selectedElement.id}"]`);
    
    if (element) {
      // Visually remove the element
      element.style.display = 'none';
      
      // Remove from Redux store
      dispatch(deleteSelectedElement());
      
      // Show feedback
      dispatch(setSavingStatus('saving'));
      setTimeout(() => {
        dispatch(setSavingStatus('saved'));
        setTimeout(() => dispatch(setSavingStatus('')), 2000);
      }, 1000);
    }
  };

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

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Editor Toolbar */}
      <EditorHeaders iframeRef={iframeRef}/>

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
              {templateHtml && (
                <iframe
                  ref={iframeRef}
                  src={templateHtml}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title="Template Preview"
                />
              )}
              
              {!iframeLoaded && (
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
              Template ID: {templateId}
            </div>
            <div>
              {getSavingStatusIndicator(savingStatus)}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
          {/* Editor Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.ELEMENTS ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch(setActiveTab(TABS.ELEMENTS))}
            >
              <FaLayerGroup className="inline-block mr-1.5" /> Elements
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.STYLE ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch(setActiveTab(TABS.STYLE))}
            >
              <FaFont className="inline-block mr-1.5" /> Style
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === TABS.SETTINGS ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => dispatch(setActiveTab(TABS.SETTINGS))}
            >
              <FaCog className="inline-block mr-1.5" /> Settings
            </button>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-hidden">
            <RenderTab iframeRef={iframeRef} />
          </div>
        </div>
      </div>
      
      
    </div>
  );
}

export default Editor;
