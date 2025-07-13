'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, 
  FaGlobe,
  FaTrash,
  FaUser,
  FaEdit,
  FaCalendar,
  FaLock,
  FaCode,
  FaExternalLinkAlt,
  FaImage
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolioStats, getUserPortfolios, publishPortfolio, selectPortfolios } from '@/redux/slices/portfolioSlice';
import useReduxStore from '@/hooks/useReduxStore';
import { setSavingStatus, setTemplateHtml } from '@/redux/slices/editorSlice';
import CheckWebsite from '../editor/CheckWebsite';
import { setPopupConfig } from '@/redux/slices/messagePopSlice';
import FeedbackForm from '../JsCompiler/FeedbackForm';
import { toggleFeedback } from '@/redux/slices/compilerSlice';

function PortfolioList({searchTerm, filterType}) {
    const portfolios = useSelector(selectPortfolios);
    const [imageLoadErrors, setImageLoadErrors] = useState({});
    const [showWebsiteNameModal, setShowWebsiteNameModal] = useState(false);
    const [templateZipBlob, setTemplateZipBlob] = useState(null);
    const [publishingTemplateName, setPubloshingTemplateName] = useState("")
    const dispatch = useDispatch();
    const getEngineDisplayName = (engine) => {
        switch (engine) {
        case 'extreme-4':
            return 'Extreme 4';
        case 'extreme-3':
            return 'Extreme 3';
        case 'extreme':
            return 'Extreme';
        default:
            return 'Standard';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    const handleDeletePortfolio = async (portfolioName) => {
        if (!confirm('Are you sure you want to delete this portfolio?')) {
        return;
        }
        return;
    };

    const handlePreview = (path) => {
        window.open(path, '_blank');
    };


    const handleEditInEditor = (templateName) => {
        const template = portfolios.find(t => t.name === templateName);
        dispatch(setTemplateHtml(`${template.path}`));
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


    const handleImageError = (portfolioName) => {
        setImageLoadErrors(prev => ({
            ...prev,
            [portfolioName]: true
        }));
    };

    const handleExport = async (templateUrl,tempName) => {

    try {
        // Set status to exporting
        setPubloshingTemplateName(tempName)
        // Fetch the HTML content from the provided URL
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        
        const htmlContent = await response.text();
        
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
        
        // Add the main HTML file
        zip.file('index.html', htmlContent);
        
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
    publishWithName(websiteName || 'untitled-portfolio');
    };
      
        // Function to publish with confirmed name
    const publishWithName = async (websiteName) => {
        try {
        // Create form data with the template zip and website name
        const formData = new FormData();
        formData.append('zipFile', templateZipBlob, 'template.zip');
        formData.append('websiteName', websiteName);
        formData.append('templateName', publishingTemplateName);
        dispatch(setPopupConfig({
            message: "Your portfolio is Publishing...",
            imageUrl: "/favicon_io/android-chrome-192x192.png",
            duration: 5000,
            }))
        // Dispatch the publish action
        const resultAction = await dispatch(publishPortfolio(formData));
        
        if (publishPortfolio.fulfilled.match(resultAction)) {
            dispatch(setPopupConfig({
            message: "Your portfolio has been published successfully!",
            imageUrl: "/favicon_io/android-chrome-192x192.png",
            linkText: "View Portfolio",
            linkUrl: `https://${websiteName}.runit.in`,
            duration: 5000,
            }));
            dispatch(getUserPortfolios());
            dispatch(fetchPortfolioStats())
        } else {
            return;
        }
        } catch (error) {
        console.error('Error publishing portfolio:', error);
        } finally {
        // Clear the stored blob
        setTemplateZipBlob(null);
        }
    };
    
    const filteredPortfolios = portfolios.filter(portfolio => {
        const matchesSearch = portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                portfolio.templateName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || 
                                (filterType === 'published' && portfolio.isPublic) ||
                                (filterType === 'private' && !portfolio.isPublic) ||
                                (filterType === 'expired' && portfolio.isExpired);
        return matchesSearch && matchesFilter;
    });
    return (
        <div>
            {filteredPortfolios.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="bg-gray-800/50 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                        <FaUser className="h-16 w-16 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                        {searchTerm || filterType !== 'all' ? 'No portfolios found' : 'No portfolios yet'}
                    </h3>
                    <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
                        {searchTerm || filterType !== 'all' 
                            ? 'Try adjusting your search criteria or filters to find what you\'re looking for' 
                            : 'Create your first AI-generated portfolio to showcase your work and skills'
                        }
                    </p>
                    {!searchTerm && filterType === 'all' && (
                        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium">
                            Create Portfolio
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPortfolios.map((portfolio, index) => (
                        <motion.div
                            key={portfolio._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10"
                        >
                            {/* Portfolio Preview Image */}
                            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                {!imageLoadErrors[portfolio.name] ? (
                                    <div className="relative w-full h-full">
                                        <iframe
                                            src={portfolio.path}
                                            className="w-full h-full scale-50 origin-top-left transform pointer-events-none"
                                            style={{ width: '200%', height: '200%' }}
                                            scrolling="no"
                                            onError={() => handleImageError(portfolio.name)}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <FaImage className="h-12 w-12 text-gray-600" />
                                        <span className="text-gray-500 text-sm">Preview not available</span>
                                    </div>
                                )}
                                
                                {/* Status Badges */}
                                <div className="absolute top-3 left-3 flex space-x-2">
                                    {portfolio.isPublic ? (
                                        <div className="bg-green-500/20 backdrop-blur-sm text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                                            <FaGlobe className="mr-1 h-3 w-3" />
                                            Published
                                        </div>
                                    ) : (
                                        <div className="bg-orange-500/20 backdrop-blur-sm text-orange-400 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                                            <FaLock className="mr-1 h-3 w-3" />
                                            Private
                                        </div>
                                    )}
                                    {portfolio.isExpired && (
                                        <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                            Expired
                                        </div>
                                    )}
                                </div>
                                
                                {/* Engine Badge */}
                                <div className="absolute top-3 right-3 bg-blue-500/20 backdrop-blur-sm text-blue-400 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                    {getEngineDisplayName(portfolio.engine)}
                                </div>

                                {/* Quick Preview Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handlePreview(portfolio.path)}
                                        className="cursor-pointer bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
                                    >
                                        <FaExternalLinkAlt className="h-4 w-4" />
                                        <span>Quick Preview</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Portfolio Info */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                                        {portfolio.name}
                                    </h3>
                                </div>
                                
                                {portfolio.templateName && (
                                    <p className="text-gray-400 text-sm mb-4 truncate">
                                        Template: {portfolio.templateName}
                                    </p>
                                )}
                                
                                {/* Dates */}
                                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                                    <div className="flex items-center space-x-1">
                                        <FaCalendar className="h-3 w-3" />
                                        <span>Created {formatDate(portfolio.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FaEdit className="h-3 w-3" />
                                        <span>Modified {formatDate(portfolio.lastModified)}</span>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handlePreview(portfolio.path)}
                                        className="cursor-pointer flex-1 bg-gray-800 text-white py-2.5 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                                    >
                                        <FaEye className="h-4 w-4" />
                                        <span>Preview</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleEditInEditor(portfolio.name)}
                                        className="cursor-pointer flex-1 bg-indigo-600 text-white py-2.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                                    >
                                        <FaCode className="h-4 w-4" />
                                        <span>Edit</span>
                                    </button>
                                    
                                    {!portfolio.isPublic && (
                                        <button 
                                            onClick={() => handleExport(portfolio.path,portfolio.name)}
                                            className="cursor-pointer flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 px-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2"
                                        >
                                            <FaGlobe className="h-4 w-4" />
                                            <span>Publish</span>
                                        </button>
                                    )}
                                    
                                    {/* <button 
                                        onClick={() => handleDeletePortfolio(portfolio.name)}
                                        className="cursor-pointer bg-red-500/20 text-red-400 py-2.5 px-3 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button> */}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            {showWebsiteNameModal && (
                <CheckWebsite
                setShowWebsiteNameModal={setShowWebsiteNameModal}
                initialName={'nothing-3'}
                onWebsiteNameConfirmed={handleWebsiteNameConfirmed}
                />
            )}
            <FeedbackForm handleClose={() => dispatch(toggleFeedback(false))} />
        </div>
    );
}

export default useReduxStore(PortfolioList);