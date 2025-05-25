'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaFileUpload, 
  FaSpinner, 
  FaCheck, 
  FaFilePdf, 
  FaFileWord, 
  FaFileAlt 
} from 'react-icons/fa';
import { parseResume, resetResumeState, clearResumeData, setFileName } from '@/redux/slices/resumeSlice';
import useReduxStore from '@/hooks/useReduxStore';
import { publishedPortfolioUrl } from '@/api';

const ResumeUploader = ({ isOpen, onClose, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  const { 
    isLoading, 
    error, 
    message, 
    data,
    fileName 
  } = useSelector(state => state.resume);

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(resetResumeState());
    }
  }, [isOpen, dispatch]);

  // Call onUploadSuccess when data is available
  useEffect(() => {
    if (isOpen && data) {
      onUploadSuccess(data);
    }
  }, [isOpen, data]);

  // Handle file validation and upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  // Validate and upload file
  const validateAndUploadFile = (file) => {
    setFileError(null);
    
    // Check file type (PDF, DOCX, DOC, TXT)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setFileError('Please upload a PDF, DOCX, DOC, or TXT file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit');
      return;
    }
    
    // Store file name and upload
    dispatch(setFileName(file.name));
    if(publishedPortfolioUrl !== 'http://localhost:3000'){
      dispatch(parseResume(file));
    }
  };

  // Handle click on upload button
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  // Get file icon based on file name extension
  const getFileIcon = () => {
    if (!fileName) return <FaFileAlt className="text-gray-400" />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return <FaFilePdf className="text-red-400" />;
    if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-400" />;
    return <FaFileAlt className="text-gray-400" />;
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-800 to-violet-900 px-6 py-8 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <FaFileUpload className="text-white text-2xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">
              Upload Your Resume
            </h2>
            
            <p className="text-white/70 text-sm">
              We'll analyze your resume to customize the template
            </p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            {message && !error && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-400 text-sm flex items-center">
                <FaCheck className="mr-2 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}
            
            {(error || fileError) && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error || fileError}
              </div>
            )}
            
            <div className="space-y-5">
              {/* File drop zone */}
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />

                {isLoading ? (
                  <div className="py-5 flex flex-col items-center justify-center text-gray-400">
                    <FaSpinner className="animate-spin text-4xl mb-3" />
                    <p className="text-sm">Analyzing your resume...</p>
                  </div>
                ) : fileName ? (
                  <div className="py-2 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3">
                      {getFileIcon()}
                    </div>
                    <p className="text-gray-300 text-sm font-medium truncate max-w-full">
                      {fileName}
                    </p>
                    <button 
                      className="mt-3 text-xs text-purple-400 hover:text-purple-300 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(clearResumeData());
                        fileInputRef.current.value = '';
                      }}
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-gray-400">
                    <FaFileUpload className="text-4xl mb-3" />
                    <p className="text-sm">
                      <span className="font-medium text-gray-300">Drag & drop</span> your resume here
                    </p>
                    <p className="text-xs mt-1">or click to browse files</p>
                    <p className="text-xs mt-3 text-gray-500">
                      Supports PDF, DOCX, DOC, TXT (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Your resume data is only used to personalize your experience.
              We respect your <a href="#" className="text-purple-400 hover:text-purple-300">privacy</a>.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default useReduxStore(ResumeUploader);