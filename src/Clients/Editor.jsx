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
  
  // Get portfolio state from Redux
  const {
    portfolios
  } = useSelector((state) => state.portfolio);
  
  const iframeRef = useRef(null);
  
  // Authentication modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Website name modal state
  const [showWebsiteNameModal, setShowWebsiteNameModal] = useState(false);
  const [templateZipBlob, setTemplateZipBlob] = useState(null);
  
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

  // Handle undo/redo
  const handleUndo = () => {
    // Get the current history entry before dispatching undo
    const historyEntry = historyIndex >= 0 ? editorHistory[historyIndex] : null;
    
    dispatch(undo());
    
    if (!historyEntry) return;
    
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
    if (historyEntry.type === 'DELETE') {
      // For delete actions, make the element visible again
      const element = iframeDocument.querySelector(`[data-editable="${historyEntry.elementData.id}"]`);
      if (element) {
        element.style.display = ''; // Reset to default display value
      }
    } else {
      // For content updates
      const element = iframeDocument.querySelector(`[data-editable="${historyEntry.elementId}"]`);
      
      if (element) {
        // Revert to old value based on element type
        if (element.tagName === 'IMG') {
          element.src = historyEntry.oldValue;
        } else if (element.tagName === 'A') {
          if (typeof historyEntry.oldValue === 'object') {
            if (historyEntry.oldValue.href) element.href = historyEntry.oldValue.href;
            if (historyEntry.oldValue.text) element.innerText = historyEntry.oldValue.text;
          }
        } else {
          element.innerText = historyEntry.oldValue;
        }
      }
    }
  };

  const handleRedo = () => {
    // First check if we can redo
    if (historyIndex >= editorHistory.length - 1) return;
    
    // Get the next history entry that we'll redo to
    const historyEntry = editorHistory[historyIndex + 1];
    
    dispatch(redo());
    
    if (!historyEntry) return;
    
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
    if (historyEntry.type === 'DELETE') {
      // For delete actions, hide the element again
      const element = iframeDocument.querySelector(`[data-editable="${historyEntry.elementData.id}"]`);
      if (element) {
        element.style.display = 'none';
      }
    } else {
      // For content updates
      const element = iframeDocument.querySelector(`[data-editable="${historyEntry.elementId}"]`);
      
      if (element) {
        // Apply new value based on element type
        if (element.tagName === 'IMG') {
          element.src = historyEntry.newValue;
        } else if (element.tagName === 'A') {
          if (typeof historyEntry.newValue === 'object') {
            if (historyEntry.newValue.href) element.href = historyEntry.newValue.href;
            if (historyEntry.newValue.text) element.innerText = historyEntry.newValue.text;
          }
        } else {
          element.innerText = historyEntry.newValue;
        }
      }
    }
  };

  // Handle save
  const handleSave = () => {
    // In a real implementation, you would save the changes to your server
    dispatch(setSavingStatus('saving'));
    
    setTimeout(() => {
      dispatch(setSavingStatus('saved'));
      setTimeout(() => dispatch(setSavingStatus('')), 2000);
    }, 1500);
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

  // Preview in new tab
  const handlePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframe.contentDocument || iframeWindow.document;
    
    // Clone the document to remove editor-specific elements/styles
    const previewContent = iframeDocument.documentElement.cloneNode(true);
    
    // Remove editor-specific attributes and styles
    previewContent.querySelectorAll('[data-editable]').forEach(el => {
      el.removeAttribute('data-editable');
      el.removeAttribute('data-editable-type');
      el.classList.remove('selected');
    });
    
    // Create a new window with the cleaned content
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write('<!DOCTYPE html>');
    previewWindow.document.write(previewContent.outerHTML);
    previewWindow.document.close();
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

  // Handle website name confirmation
  const handleWebsiteNameConfirmed = (websiteName) => {
    setShowWebsiteNameModal(false);
    
    if (!templateZipBlob) {
      console.error('No template ZIP available');
      dispatch(setSavingStatus('error'));
      setTimeout(() => dispatch(setSavingStatus('')), 3000);
      return;
    }
    
    // Proceed with publishing
    publishWithName(websiteName || (portfolios.length > 0 ? portfolios[0].name : 'untitled-portfolio'));
  };
  
  // Function to publish with confirmed name
  const publishWithName = async (websiteName) => {
    try {
      dispatch(setSavingStatus('publishing'));
      
      // Create form data with the template zip and website name
      const formData = new FormData();
      formData.append('zipFile', templateZipBlob, 'template.zip');
      formData.append('websiteName', websiteName);
      
      // Dispatch the publish action
      const resultAction = await dispatch(publishPortfolio(formData));
      
      if (publishPortfolio.fulfilled.match(resultAction)) {
        dispatch(setSavingStatus('published'));
        setTimeout(() => dispatch(setSavingStatus('')), 2000);
        dispatch(setPopupConfig({
          message: "Your portfolio has been published successfully!",
          imageUrl: "/favicon_io/android-chrome-192x192.png",
          linkText: "View Portfolio",
          linkUrl: publishedPortfolioUrl+'/'+websiteName,
          duration: 5000,
        }));
      } else {
        return;
      }
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      dispatch(setSavingStatus('error'));
      setTimeout(() => dispatch(setSavingStatus('')), 3000);
    } finally {
      // Clear the stored blob
      setTemplateZipBlob(null);
    }
  };

  // Handle export/publish template as ZIP
  const handleExport = async () => {
    if (!isAuthenticated) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Set status to exporting
      dispatch(setSavingStatus('exporting'));
      
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      
      // Get the template HTML content - Clean it up by removing editor-related attributes
      const templateContent = iframeDocument.documentElement.cloneNode(true);
      
      // Remove editor-specific attributes and styles from the cloned template
      const editableElements = templateContent.querySelectorAll('[data-editable]');
      editableElements.forEach(el => {
        el.removeAttribute('data-editable');
        el.removeAttribute('data-editable-type');
        el.classList.remove('selected');
        
        // Remove editor buttons
        const deleteBtn = el.querySelector('.element-delete-btn, .section-delete-btn');
        if (deleteBtn) {
          deleteBtn.parentNode.removeChild(deleteBtn);
        }
      });

      // Load JSZip library dynamically (to avoid adding it as a dependency if not used often)
      if (!window.JSZip) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.async = true;
        
        // Wait for the script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      
      // Create a new ZIP file
      const zip = new window.JSZip();
      
      // Portfolio prefix to use for all assets (if available)
      const portfolioPrefix = portfolios.length > 0 ? `${portfolios[0].name}/` : '';
      
      // Get references to all assets (CSS, JS, images)
      const cssLinks = Array.from(iframeDocument.querySelectorAll('link[rel="stylesheet"]'))
        .map(link => {
          const href = link.getAttribute('href');
          return {
            href: href,
            element: templateContent.querySelector(`link[href="${href}"]`),
            originalPath: href
          };
        })
        .filter(item => item.href && !item.href.startsWith('http') && !item.href.startsWith('//'));
      
      const jsScripts = Array.from(iframeDocument.querySelectorAll('script'))
        .map(script => {
          const src = script.getAttribute('src');
          return {
            src: src,
            element: templateContent.querySelector(`script[src="${src}"]`),
            originalPath: src
          };
        })
        .filter(item => item.src && !item.src.startsWith('http') && !item.src.startsWith('//'));
      
      const imgSources = Array.from(iframeDocument.querySelectorAll('img'))
        .map(img => {
          const src = img.getAttribute('src');
          return {
            src: src,
            element: templateContent.querySelector(`img[src="${src}"]`),
            originalPath: src
          };
        })
        .filter(item => item.src && !item.src.startsWith('http') && !item.src.startsWith('//'));
      
      // Background images in CSS
      const elementsWithBgImage = Array.from(iframeDocument.querySelectorAll('*'))
        .filter(el => {
          const style = getComputedStyle(el);
          return style.backgroundImage && 
                 style.backgroundImage !== 'none' && 
                 !style.backgroundImage.startsWith('url(http') &&
                 !style.backgroundImage.startsWith('url(//');
        })
        .map(el => {
          const style = getComputedStyle(el);
          const bgImage = style.backgroundImage;
          const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
          const src = urlMatch ? urlMatch[1] : null;
          return {
            src: src,
            element: templateContent.querySelector(`*[style*="${src}"]`),
            originalPath: src
          };
        })
        .filter(item => item.src);
      
      // Set status update
      dispatch(setSavingStatus('preparing'));
      
      // Helper function to fetch file and add to zip
      const addFileToZip = async (path, zipPath) => {
        try {
          // Only add absolute path prefix if the path doesn't already have a protocol
          const fetchPath = path.startsWith('http') ? path : (path.startsWith('/') ? path : `/${path}`);
          const response = await fetch(fetchPath);
          if (!response.ok) throw new Error(`Failed to fetch ${fetchPath}`);
          const blob = await response.blob();
          zip.file(zipPath, blob);
          return true;
        } catch (error) {
          console.error(`Error fetching ${path}:`, error);
          return false;
        }
      };
      
      // Process CSS files
      for (const cssItem of cssLinks) {
        const path = cssItem.href;
        console.log("cssItem.href", cssItem.href);
        // Extract filename from path, handling both relative and absolute paths
        const pathParts = path.split('/').filter(part => part);
        const filename = pathParts[pathParts.length - 1];
        // Create a consistent path structure
        const zipPath = `${portfolioPrefix}css/${filename}`;
        console.log("zipPath", zipPath);
        await addFileToZip(cssItem.originalPath, zipPath);
        
        // Update the path in the HTML
        if (cssItem.element) {
          cssItem.element.setAttribute('href', `/${zipPath}`);
        }
      }
      
      // Process JS files
      for (const jsItem of jsScripts) {
        const path = jsItem.src;
        // Extract filename from path, handling both relative and absolute paths
        const pathParts = path.split('/').filter(part => part);
        const filename = pathParts[pathParts.length - 1];
        // Create a consistent path structure
        const zipPath = `${portfolioPrefix}js/${filename}`;
        
        await addFileToZip(jsItem.originalPath, zipPath);
        
        // Update the path in the HTML
        if (jsItem.element) {
          jsItem.element.setAttribute('src', `/${zipPath}`);
        }
      }
      
      // Process images
      for (const imgItem of imgSources) {
        const path = imgItem.src;
        // Extract filename from path, handling both relative and absolute paths
        const pathParts = path.split('/').filter(part => part);
        const filename = pathParts[pathParts.length - 1];
        // Create a consistent path structure
        const zipPath = `${portfolioPrefix}img/${filename}`;
        await addFileToZip(imgItem.originalPath, zipPath);
        
        // Update the path in the HTML
        if (imgItem.element) {
          imgItem.element.setAttribute('src', `/${zipPath}`);
        }
      }
      
      // Process background images
      for (const bgItem of elementsWithBgImage) {
        if (!bgItem.src) continue;
        
        const path = bgItem.src;
        // Extract filename from path, handling both relative and absolute paths
        const pathParts = path.split('/').filter(part => part);
        const filename = pathParts[pathParts.length - 1];
        // Create a consistent path structure
        const zipPath = `${portfolioPrefix}img/${filename}`;
        
        // Only add absolute path prefix if the path doesn't already have a protocol
        const fetchPath = path.startsWith('http') ? path : (path.startsWith('/') ? path : `/${path}`);
        
        try {
          const response = await fetch(fetchPath);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(zipPath, blob);
            
            // Update the path in the HTML
            if (bgItem.element) {
              const currentStyle = bgItem.element.getAttribute('style') || '';
              // Replace the URL correctly, handling different formats of url() references
              const updatedStyle = currentStyle.replace(
                new RegExp(`url\\(['"]?${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?\\)`, 'g'), 
                `url('/${zipPath}')`
              );
              bgItem.element.setAttribute('style', updatedStyle);
            }
          } else {
            console.error(`Failed to fetch ${fetchPath}`);
          }
        } catch (error) {
          console.error(`Error processing background image ${path}:`, error);
        }
      }
      
      // Generate the clean HTML content with updated paths
      const cleanHtmlContent = '<!DOCTYPE html>\n' + templateContent.outerHTML;
      
      // Add the main HTML file
      zip.file('index.html', cleanHtmlContent);
      
      // Generate the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Store the ZIP blob for later use
      setTemplateZipBlob(content);
      setShowWebsiteNameModal(true);
      
    } catch (error) {
      console.error('Error exporting template:', error);
      dispatch(setSavingStatus('error'));
      setTimeout(() => dispatch(setSavingStatus('')), 3000);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (token) => {
    setShowLoginModal(false);
    // No need to manually set auth state as it's handled in the redux slice
    // Continue with export if that's what user was trying to do
    if (token) {
      handleExport();
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
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="text-white hover:text-purple-400 transition-colors"
              onClick={() => router.push('/templates')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-white font-medium">Editing Template</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-4">
              <button 
                className={`p-1.5 rounded transition-colors ${previewMode === PREVIEW_MODES.DESKTOP ? 'bg-purple-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => dispatch(setPreviewMode(PREVIEW_MODES.DESKTOP))}
                title="Desktop preview"
              >
                <FaDesktop />
              </button>
              <button 
                className={`p-1.5 rounded transition-colors ${previewMode === PREVIEW_MODES.TABLET ? 'bg-purple-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => dispatch(setPreviewMode(PREVIEW_MODES.TABLET))}
                title="Tablet preview"
              >
                <FaTabletAlt />
              </button>
              <button 
                className={`p-1.5 rounded transition-colors ${previewMode === PREVIEW_MODES.MOBILE ? 'bg-purple-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => dispatch(setPreviewMode(PREVIEW_MODES.MOBILE))}
                title="Mobile preview"
              >
                <FaMobileAlt />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="text-gray-400 hover:text-white transition-colors p-1.5"
                onClick={handleUndo}
                disabled={historyIndex < 0}
                title="Undo"
              >
                <FaUndo />
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors p-1.5"
                onClick={handleRedo}
                disabled={historyIndex >= editorHistory.length - 1}
                title="Redo"
              >
                <FaRedo />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm flex items-center">
                <FaCode className="mr-1.5" /> Code
              </button>
              <button 
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm flex items-center"
                onClick={handlePreview}
              >
                <FaEye className="mr-1.5" /> Preview
              </button>
              <GradientButton
                className="flex items-center"
                onClick={handleSave}
              >
                <FaSave className="mr-1.5" /> Save
              </GradientButton>
              <GradientButton
                className="flex items-center"
                onClick={handleExport}
                colors={['from-green-600', 'to-blue-500']}
              >
                <FaUpload className="mr-1.5" /> Publish
              </GradientButton>
            </div>
          </div>
        </div>
      </header>

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
      
      {/* Login Modal */}
      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* Website Name Check Modal */}
      {showWebsiteNameModal && (
        <CheckWebsite
        initialName={templateId?.split('-').join('-')}
        onWebsiteNameConfirmed={handleWebsiteNameConfirmed}
      />
      )}
    </div>
  );
}

export default Editor;
