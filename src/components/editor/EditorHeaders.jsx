'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaUndo, FaRedo, FaCode, FaEye, FaSave, FaUpload, FaCoins, FaCreditCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectPreviewMode, setPreviewMode, selectHistoryIndex, selectEditorHistory, setSavingStatus, undo, redo } from '@/redux/slices/editorSlice';
import GradientButton from '@/components/global/GradientButton';
import { PREVIEW_MODES } from '@/utils/Utils';
import useReduxStore from '@/hooks/useReduxStore';
import CheckWebsite from './CheckWebsite';
import { publishPortfolio } from '@/redux/slices/portfolioSlice';
import { setPopupConfig } from '@/redux/slices/messagePopSlice';
import apis, { publishedPortfolioUrl } from '@/api';
import Login from '../Login';
import ResumeUploader from '../global/ResumeUploader';
import { enhanceHtml } from '@/redux/slices/resumeSlice';
import { selectSocketId } from '@/redux/slices/compilerSlice';
import CreditRechargeModal from './CreditRechargeModal ';
import { fetchPortfolioCreditInfo, getPortfolioCreditInfo } from '@/redux/slices/usageSlice';

function EditorHeaders({ 
    iframeRef
}) {
  const router = useRouter();
  const dispatch = useDispatch();
    // Get portfolio state from Redux
    const portfolioCreditInfo = useSelector(getPortfolioCreditInfo);
    const credits = portfolioCreditInfo?.remainingCredits || 0;
    const {
        portfolios
      } = useSelector((state) => state.portfolio);
    const {
        previewMode,
        editorHistory,
        historyIndex,
        templateId
    } = useSelector((state) => state.editor);
  const {
        isAuthenticated,
        token
    } = useSelector((state) => state.auth);
    const {
      data
    } = useSelector(state => state.resume);
    const socketId = useSelector(selectSocketId);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [templateZipBlob, setTemplateZipBlob] = useState(null);
    const [showWebsiteNameModal, setShowWebsiteNameModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResumeUploaderModal, setShowResumeUploaderModal] = useState(false);
    const [nextAction, setNextAction] = useState(null);
    
    // Credit system states
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [creditLoading, setCreditLoading] = useState(false);

  

    // Fetch credits when component mounts and when user authenticates
    useEffect(() => {
      if (isAuthenticated) {
        dispatch(fetchPortfolioCreditInfo());
      }
    }, [isAuthenticated]);

    // Handle export/publish template as ZIP
    const handleExport = async () => {
        if (!isAuthenticated) {
          // Show login modal
          setNextAction('Publish');
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
    const extractHtmlContent = () => {
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
      return previewContent;
    }
    // Preview in new tab
    const handlePreview = () => {
      const previewContent = extractHtmlContent();
      // Create a new window with the cleaned content
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write('<!DOCTYPE html>');
      previewWindow.document.write(previewContent.outerHTML);
      previewWindow.document.close();
    };

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
            linkUrl: `https://${websiteName}.runit.in`,
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

    const handleAIEnhance = () => {
      if (!isAuthenticated) {
        setNextAction('Enhance with AI');
        setShowLoginModal(true);
        return;
      }
      
      // Check if user has credits
      if (credits < 1) {
        setShowCreditModal(true);
        return;
      }
      
      setShowResumeUploaderModal(true);
    };

    // Handle successful login
    const handleLoginSuccess = (token) => {
        setShowLoginModal(false);
        // No need to manually set auth state as it's handled in the redux slice
        // Continue with export if that's what user was trying to do
        if (token) {
          if(nextAction === 'Enhance with AI') {
            handleAIEnhance();
          } else {
            handleExport();
          }
        }
    };

    const handleResumeUploaded = (resume) => {
      const previewContent = extractHtmlContent();
      if (previewContent && resume && socketId) {
        setShowResumeUploaderModal(false)
        dispatch(enhanceHtml({
          templateHtml: previewContent.outerHTML,
          resumeJson: resume,
          clientId: socketId, // Pass socket ID for progress updates
          useSocketProgress: true // Flag to use Socket.IO for progress
        }));
      }
    };

    // Handle credit purchase success
    const handleCreditPurchaseSuccess = () => {
      setShowCreditModal(false);
      // Refresh credits
      dispatch(fetchPortfolioCreditInfo());
      // Show success message
      dispatch(setPopupConfig({
        message: "Credits purchased successfully!",
        imageUrl: "/favicon_io/android-chrome-192x192.png",
        duration: 3000,
      }));
    };

    // Handle opening credit modal
    const handleOpenCreditModal = () => {
      if (!isAuthenticated) {
        setNextAction('Recharge Credits');
        setShowLoginModal(true);
        return;
      }
      setShowCreditModal(true);
    };

  return (
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
            
            {/* Credit Display and Recharge */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-1.5">
                <div className="flex items-center space-x-2">
                  <FaCoins className="text-yellow-400" />
                  <span className="text-white font-medium">
                    {creditLoading ? '...' : credits}
                  </span>
                  <span className="text-gray-400 text-sm">credits</span>
                </div>
                <button
                  onClick={handleOpenCreditModal}
                  className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                  title="Recharge Credits"
                >
                  <FaCreditCard />
                </button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <GradientButton
                className="flex items-center"
                onClick={handleAIEnhance}
                disabled={!socketId}
                colors={['from-red-600', 'to-purple-500']}
              >
                <FaCode className="mr-1.5" /> 
                {credits < 1 ? 'Enhance with AI (No Credits)' : 'Enhance with AI'}
              </GradientButton>
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
        
        {/* Website Name Check Modal */}
        {showWebsiteNameModal && (
            <CheckWebsite
            setShowWebsiteNameModal={setShowWebsiteNameModal}
            initialName={templateId?.split('-').join('-')}
            onWebsiteNameConfirmed={handleWebsiteNameConfirmed}
        />
        )}
        
        {/* Login Modal */}
        <Login
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
            nextAction={nextAction}
        />
        
        {/* Enhance with AI Modal */}
        <ResumeUploader
            isOpen={showResumeUploaderModal}
            onClose={() => setShowResumeUploaderModal(false)}
            onUploadSuccess={handleResumeUploaded}
        />
        
        {/* Credit Recharge Modal */}
        <CreditRechargeModal
            isOpen={showCreditModal}
            onClose={() => setShowCreditModal(false)}
            onSuccess={handleCreditPurchaseSuccess}
            currentCredits={credits}
        />
        </header>
  )
}

export default useReduxStore(EditorHeaders);