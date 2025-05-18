import { useState, useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopup } from '../../redux/slices/messagePopSlice';
import useReduxStore from '@/hooks/useReduxStore';

const MessagePopup = ({ 
  message, 
  imageUrl, 
  linkText, 
  linkUrl, 
  duration,
  onClose,
  show,
  // Props for local control if needed
  useLocalState = false
}) => {
  // Get global state from Redux if useLocalState is false
  const globalPopupState = useSelector((state) => state.messagePop);
  const dispatch = useDispatch();
  
  // Determine whether to use local props or global state
  const popupConfig = useLocalState ? {
    message: message || "Check out our latest features!",
    imageUrl: imageUrl || "/api/placeholder/80/80",
    linkText: linkText || "Learn More",
    linkUrl: linkUrl || "#",
    duration: duration !== undefined ? duration : 7000,
    show: show !== undefined ? show : true
  } : globalPopupState;

  const [isVisible, setIsVisible] = useState(popupConfig.show);

  useEffect(() => {
    setIsVisible(popupConfig.show);
    
    // Auto hide after duration if provided and not null
    if (popupConfig.show && popupConfig.duration !== null) {
      const timer = setTimeout(() => {
        handleClose();
      }, popupConfig.duration);
      
      return () => clearTimeout(timer);
    }
  }, [popupConfig.show, popupConfig.duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (useLocalState) {
      onClose && onClose();
    } else {
      dispatch(hidePopup());
      onClose && onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-4 right-4 z-50 flex items-center max-w-md shadow-lg rounded-lg overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: "linear-gradient(135deg, #121212 0%, #2d1b69 100%)",
            borderLeft: "4px solid #8a3ffc"
          }}
        >
          <div className="flex items-center p-4 w-full">
            {popupConfig.imageUrl && (
              <div className="flex-shrink-0 mr-4">
                <img 
                  src={popupConfig.imageUrl} 
                  alt="Notification" 
                  className="h-12 w-12 rounded object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium mb-1">
                {popupConfig.message}
              </p>
              
              {popupConfig.linkText && popupConfig.linkUrl && (
                <a 
                  href={popupConfig.linkUrl}
                  className="text-purple-300 hover:text-purple-200 text-xs font-semibold inline-flex items-center"
                >
                  {popupConfig.linkText}
                  <svg 
                    className="ml-1 w-3 h-3" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </a>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close notification"
            >
              <IoCloseCircle className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default useReduxStore(MessagePopup);