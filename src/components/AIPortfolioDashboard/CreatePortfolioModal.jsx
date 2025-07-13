'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, 
  FaUpload, 
  FaPalette, 
  FaEye, 
  FaCheck, 
  FaSpinner, 
  FaGlobe,
  FaTrash,
  FaPlus,
  FaBolt,
  FaFire,
  FaUser,
  FaCoins,
  FaCreditCard,
  FaChevronRight,
  FaDownload,
  FaEdit,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaStar,
  FaHeart,
  FaShare,
  FaTimes,
  FaArrowRight,
  FaCalendar,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { fetchPortfolioStats, generatePortfolio, getUserPortfolios } from '@/redux/slices/portfolioSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectEnhancementComplete, setFileName, parseResume, clearResumeData, selectEnhancementInProgress, selectEnhancementMessage } from '@/redux/slices/resumeSlice';
import { getPortfolioCreditInfo } from '@/redux/slices/usageSlice';
import { engines, styles, steps } from '@/utils/Utils';
import { selectSocketId } from '@/redux/slices/compilerSlice';


// Create Portfolio Modal Component
const CreatePortfolioModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const dispatch = useDispatch();
    // Redux selectors
    const portfolioCreditInfo = useSelector(getPortfolioCreditInfo);
    const generatingMessage = useSelector(selectEnhancementMessage);
    const enhancementCompleted = useSelector(selectEnhancementComplete);
    const resumeState = useSelector(state => state.resume);
    
    // Extract data from resume state
    const { 
        isLoading, 
        error, 
        message, 
        data: resumeData,
        fileName 
    } = resumeState;
    
    // Component state
    const [selectedEngine, setSelectedEngine] = useState('extreme-4');
    const [selectedStyle, setSelectedStyle] = useState('Professional');
    const [uploadedResume, setUploadedResume] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [fileError, setFileError] = useState(null);
    const fileInputRef = useRef(null);
    const socketId = useSelector(selectSocketId);
    // Calculate credits from portfolio credit info
    const credits = portfolioCreditInfo?.remainingCredits || 0;

    const resetData = () => {
        setIsGenerating(false)
        setUploadedResume(null)
    }
    // Handle portfolio generation
    const handleGenerate = () => {
        setIsGenerating(true);
        const body = {
            resumeData: resumeData,
            style: selectedStyle,
            aiEngine: selectedEngine,
            clientId:socketId
        };
        dispatch(generatePortfolio(body));
    };

    // Check if step is complete
    const isStepComplete = (step) => {
        switch(step) {
            case 1: return selectedEngine !== null;
            case 2: return selectedStyle !== null;
            case 3: return uploadedResume !== null || (resumeData && fileName);
            case 4: return currentStep >= 4;
            default: return false;
        }
    };

    // Check if user can proceed to generate
    const canProceed = () => {
        return isStepComplete(1) && isStepComplete(2) && isStepComplete(3);
    };

    // Handle file validation and upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            validateAndUploadFile(file);
        }
    };

    const validateAndUploadFile = (file) => {
        setFileError(null);
        
        // Check file type (PDF, DOCX, DOC, TXT)
        const validTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'application/msword', 
            'text/plain'
        ];
        
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
        dispatch(parseResume(file));
        setUploadedResume(file);
    };

    // Handle file removal
    const handleRemoveFile = () => {
        setUploadedResume(null);
        dispatch(setFileName(''));
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Effect to handle enhancement completion
    useEffect(() => {
        if (enhancementCompleted) {
            dispatch(getUserPortfolios());
            dispatch(fetchPortfolioStats());
            setIsGenerating(false);
            onClose();
        }
    }, [enhancementCompleted, dispatch, onClose]);

    // Effect to sync uploaded resume with redux state
    useEffect(() => {
        if (fileName && resumeData && !uploadedResume) {
            setUploadedResume({ name: fileName });
        }
    }, [fileName, resumeData, uploadedResume]);

    // Get file size for display
    const getFileSize = (file) => {
        if (file && file.size) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            return `${sizeInMB} MB`;
        }
        return 'Unknown size';
    };

    // Get file name for display
    const getFileName = () => {
        if (uploadedResume && uploadedResume.name) {
            return uploadedResume.name;
        }
        if (fileName) {
            return fileName;
        }
        return 'document.pdf';
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={()=>{
                    dispatch(clearResumeData());
                    resetData();
                    onClose();
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create New Portfolio</h2>
                            <p className="text-gray-400 mt-1">Generate your AI-powered portfolio in minutes</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
                                <FaCoins className="text-yellow-400" />
                                <span className="text-white font-medium">{credits}</span>
                                <span className="text-gray-400 text-sm">credits</span>
                            </div>
                            <button
                                onClick={()=>{
                                    dispatch(clearResumeData());
                                    resetData();
                                    onClose();
                                }}
                                className="cursor-pointer text-gray-400 hover:text-white transition-colors p-2"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                            isStepComplete(step.id)
                                                ? 'bg-purple-500 border-purple-500 text-white' 
                                                : currentStep === step.id
                                                ? 'border-purple-500 text-purple-500'
                                                : 'border-gray-600 text-gray-400'
                                        }`}>
                                            {isStepComplete(step.id) ? <FaCheck className="h-4 w-4" /> : step.icon}
                                        </div>
                                        <span className={`ml-3 text-sm font-medium ${
                                            isStepComplete(step.id) || currentStep === step.id ? 'text-white' : 'text-gray-400'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-4 ${
                                            isStepComplete(step.id) ? 'bg-purple-500' : 'bg-gray-700'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                        {/* Step 1: Engine Selection */}
                        <div className="space-y-4">
                            <div className='flex gap-2 items-center'>
                                <h3 className="text-lg font-semibold text-white">1. Choose AI Engine</h3>
                                {(!credits || credits==0) && <div className="bg-red-800 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    No Credit left
                                </div>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {engines.map((engine) => (
                                    <div
                                        key={engine.id}
                                        onClick={() => (credits || credits != 0) && setSelectedEngine(engine.id)}
                                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                                            selectedEngine === engine.id
                                                ? 'border-purple-500 bg-purple-900/20'
                                                : 'border-gray-700 hover:border-gray-600'
                                        } ${
                                            (!credits || credits == 0) 
                                                ? 'cursor-not-allowed' 
                                                : 'cursor-pointer'
                                        }`}
                                    >
                                        {engine.recommended && (
                                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                                RECOMMENDED
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-r ${engine.color}`}>
                                                {engine.icon}
                                            </div>
                                            <div className="flex items-center space-x-1 bg-gray-800 rounded-full px-2 py-1">
                                                <FaCoins className="text-yellow-400 text-sm" />
                                                <span className="text-white font-semibold text-sm">{engine.credits}</span>
                                            </div>
                                        </div>
                                        
                                        <h4 className="text-lg font-semibold text-white mb-2">{engine.name}</h4>
                                        <p className="text-gray-400 text-sm mb-3">{engine.description}</p>
                                        
                                        <div className="space-y-1">
                                            {engine.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-xs text-gray-300">
                                                    <FaCheck className="mr-2 text-green-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Style Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">2. Select Design Style</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {styles.map((style) => (
                                    <div
                                        key={style.id}
                                        onClick={() => (credits || credits != 0) &&  setSelectedStyle(style.id)}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                                            selectedStyle === style.id
                                                ? 'border-purple-500 bg-purple-900/20'
                                                : 'border-gray-700 hover:border-gray-600'
                                        }${
                                            (!credits || credits == 0) 
                                                ? ' cursor-not-allowed' 
                                                : ' cursor-pointer'
                                        }`}
                                    >
                                        <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${style.gradient} mb-2 flex items-center justify-center text-xl`}>
                                            {style.preview}
                                        </div>
                                        <h4 className="text-xs font-medium text-white text-center">{style.name}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Resume Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">3. Upload Your Resume</h3>
                            
                            {/* File Error Display */}
                            {fileError && (
                                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <FaTimesCircle className="text-red-400 mr-3" />
                                        <p className="text-red-300">{fileError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <FaSpinner className="text-blue-400 mr-3 animate-spin" />
                                        <p className="text-blue-300">Processing your resume...</p>
                                    </div>
                                </div>
                            )}

                            {/* Success State */}
                            {(uploadedResume || (fileName && resumeData)) && !isLoading && (
                                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaCheckCircle className="text-green-400 mr-3" />
                                            <div>
                                                <p className="text-green-300 font-medium">Resume uploaded successfully!</p>
                                                <p className="text-green-400/70 text-sm">
                                                    {getFileName()} • {uploadedResume ? getFileSize(uploadedResume) : 'Processed'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            {!uploadedResume && !(fileName && resumeData) && !isLoading && (
                                <div
                                    onClick={() => (credits || credits != 0) &&  fileInputRef.current?.click()}
                                    className={`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors 
                                        ${
                                            (!credits || credits == 0) 
                                                ? ' cursor-not-allowed' 
                                                : ' cursor-pointer'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                    />
                                    <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-white font-medium mb-1">Drop your resume here or click to browse</p>
                                    <p className="text-gray-400 text-sm">Supports PDF, DOC, DOCX, TXT formats (max 5MB)</p>
                                </div>
                            )}
                        </div>

                        {/* Step 4: Generate */}
                        {canProceed() && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">4. Generate Portfolio</h3>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">AI Engine</p>
                                            <p className="text-white font-medium">{engines.find(e => e.id === selectedEngine)?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Design Style</p>
                                            <p className="text-white font-medium">{selectedStyle}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Credits Required</p>
                                            <p className="text-white font-medium">{engines.find(e => e.id === selectedEngine)?.credits}</p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || isLoading}
                                        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                                            isGenerating || isLoading
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-purple-500 cursor-pointer to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                                        }`}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2 inline" />
                                                {generatingMessage}
                                            </>
                                        ) : (
                                            <>
                                                <FaRocket className="mr-2 inline" />
                                                Generate My Portfolio
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreatePortfolioModal;