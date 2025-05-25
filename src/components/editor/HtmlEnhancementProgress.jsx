import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseCircle } from 'react-icons/io5';
import { 
  selectEnhancementInProgress,
  selectEnhancementProgress,
  selectEnhancementMessage,
  selectCurrentSection,
  selectTotalSections,
  selectEnhancementError,
  selectEnhancementComplete
} from '@/redux/slices/resumeSlice';

const HtmlEnhancementProgress = () => {
  const inProgress = useSelector(selectEnhancementInProgress);
  const progress = useSelector(selectEnhancementProgress);
  const message = useSelector(selectEnhancementMessage);
  const currentSection = useSelector(selectCurrentSection);
  const totalSections = useSelector(selectTotalSections);
  const error = useSelector(selectEnhancementError);
  const isComplete = useSelector(selectEnhancementComplete);

  const [isVisible, setIsVisible] = useState(true);

  // Auto-close after 5 seconds when enhancement completes
  useEffect(() => {
    if (isComplete && !error) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isComplete, error]);

  // Reset visibility when a new enhancement starts
  useEffect(() => {
    if (inProgress) {
      setIsVisible(true);
    }
  }, [inProgress]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || (!inProgress && !isComplete && !error)) {
    return null;
  }

  console.log("error", error);

  const getStatusConfig = () => {
    if (error) {
      return {
        icon: (
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
        title: "Enhancement Failed",
        message: error,
        borderColor: "#ef4444",
        textColor: "text-red-300",
        titleColor: "text-red-200"
      };
    }
    
    if (isComplete && !error) {
      return {
        icon: (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
        title: "Enhancement Complete!",
        message: "Your portfolio has been successfully enhanced with AI.",
        borderColor: "#22c55e",
        textColor: "text-green-300",
        titleColor: "text-green-200"
      };
    }
    
    if (inProgress && !error) {
      return {
        icon: (
          <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        ),
        title: "Enhancing Portfolio",
        message: message,
        borderColor: "#8a3ffc",
        textColor: "text-purple-300",
        titleColor: "text-purple-200"
      };
    }
  };

  const statusConfig = getStatusConfig();
 
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-4 right-4 z-50 max-w-md shadow-lg rounded-lg overflow-hidden"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: "linear-gradient(135deg, #121212 0%, #2d1b69 100%)",
            borderLeft: `4px solid ${statusConfig.borderColor}`
          }}
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 mr-3">
                {statusConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold ${statusConfig.titleColor}`}>
                  {statusConfig.title}
                </h3>
                <p className={`text-sm ${statusConfig.textColor} mt-1`}>
                  {statusConfig.message}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                aria-label="Close notification"
              >
                <IoCloseCircle className="w-5 h-5" />
              </button>
            </div>
          
          {inProgress && !error && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-300 font-medium">Progress</span>
                  <span className="text-purple-200 font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {currentSection && totalSections && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Section Progress</span>
                  <span className="text-purple-300 font-medium">
                    {currentSection} of {totalSections}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Subtle animated border effect for in-progress state */}
        {inProgress && !error && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${statusConfig.borderColor}20, transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HtmlEnhancementProgress;