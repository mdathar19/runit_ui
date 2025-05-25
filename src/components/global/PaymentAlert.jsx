// src/components/global/PaymentAlert.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ArrowLeftCircle,
  X,
  Volume2,
  VolumeX,
  Clock,
  CreditCard,
  DollarSign
} from 'lucide-react';
import {
  selectActiveAlert,
  selectIsAlertVisible,
  selectAlertSettings,
  hideAlert,
  markAlertAsRead,
  toggleSound
} from '@/redux/slices/paymentAlertSlice';
import useReduxStore from '@/hooks/useReduxStore';

const PaymentAlert = () => {
  const dispatch = useDispatch();
  const activeAlert = useSelector(selectActiveAlert);
  const isVisible = useSelector(selectIsAlertVisible);
  const { soundEnabled, autoHide, autoHideDelay } = useSelector(selectAlertSettings);
  
  const alertRef = useRef(null);
  const timeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Icon mapping
  const iconMap = {
    'check-circle': CheckCircle,
    'x-circle': XCircle,
    'alert-triangle': AlertTriangle,
    'info': Info,
    'arrow-left-circle': ArrowLeftCircle,
  };

  // Type styling
  const getAlertStyles = (type) => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-md w-full transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-l-4 border-green-400 shadow-lg shadow-green-100`;
      case 'error':
        return `${baseStyles} bg-red-50 border-l-4 border-red-400 shadow-lg shadow-red-100`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-l-4 border-yellow-400 shadow-lg shadow-yellow-100`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-l-4 border-blue-400 shadow-lg shadow-blue-100`;
      default:
        return `${baseStyles} bg-gray-50 border-l-4 border-gray-400 shadow-lg`;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  // Play notification sound
  const playNotificationSound = (type) => {
    if (!soundEnabled) return;
    
    try {
      // Create different tones for different alert types
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different alert types
      const frequencies = {
        success: [800, 1000, 1200],
        error: [400, 350, 300],
        warning: [600, 650, 600],
        info: [700, 750, 800]
      };
      
      const freq = frequencies[type] || frequencies.info;
      
      oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
      oscillator.frequency.setValueAtTime(freq[1], audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(freq[2], audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });
  };

  // Handle alert close
  const handleClose = () => {
    if (activeAlert) {
      dispatch(markAlertAsRead(activeAlert.id));
    }
    dispatch(hideAlert());
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Auto-hide effect
  useEffect(() => {
    if (isVisible && activeAlert && autoHide) {
      const duration = activeAlert.duration || autoHideDelay;
      
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isVisible, activeAlert, autoHide, autoHideDelay]);

  // Play sound when new alert appears
  useEffect(() => {
    if (isVisible && activeAlert) {
      playNotificationSound(activeAlert.type);
    }
  }, [isVisible, activeAlert, soundEnabled]);

  // Animate alert entrance
  useEffect(() => {
    if (isVisible && alertRef.current) {
      alertRef.current.style.transform = 'translateX(100%)';
      requestAnimationFrame(() => {
        alertRef.current.style.transform = 'translateX(0)';
      });
    }
  }, [isVisible]);

  if (!isVisible || !activeAlert) return null;

  const IconComponent = iconMap[activeAlert.icon] || Info;

  return (
    <div
      ref={alertRef}
      className={`${getAlertStyles(activeAlert.type)} ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="relative p-4 pr-12">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} className="text-gray-500" />
        </button>

        {/* Sound toggle button */}
        <button
          onClick={() => dispatch(toggleSound())}
          className="absolute top-2 right-8 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <Volume2 size={14} className="text-gray-500" />
          ) : (
            <VolumeX size={14} className="text-gray-500" />
          )}
        </button>

        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${getIconColor(activeAlert.type)}`}>
            <IconComponent size={24} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className={`text-sm font-semibold ${getTextColor(activeAlert.type)}`}>
              {activeAlert.title}
            </h3>

            {/* Message */}
            <p className={`text-sm mt-1 ${getTextColor(activeAlert.type)} opacity-90`}>
              {activeAlert.message}
            </p>

            {/* Details */}
            {activeAlert.details && (
              <div className="mt-3 space-y-1">
                {activeAlert.details.paymentId && (
                  <div className="flex items-center text-xs text-gray-600">
                    <CreditCard size={12} className="mr-1" />
                    <span className="font-mono">{activeAlert.details.paymentId}</span>
                  </div>
                )}
                
                {activeAlert.details.amount && (
                  <div className="flex items-center text-xs text-gray-600">
                    <DollarSign size={12} className="mr-1" />
                    <span className="font-semibold">
                      {formatCurrency(activeAlert.details.amount, activeAlert.details.currency)}
                    </span>
                  </div>
                )}

                {activeAlert.details.method && (
                  <div className="text-xs text-gray-600 capitalize">
                    Payment Method: {activeAlert.details.method}
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock size={10} className="mr-1" />
              {formatTimestamp(activeAlert.timestamp)}
            </div>
          </div>
        </div>

        {/* Progress bar for auto-hide */}
        {autoHide && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b">
            <div 
              className={`h-full rounded-b transition-all ease-linear ${
                activeAlert.type === 'success' ? 'bg-green-400' :
                activeAlert.type === 'error' ? 'bg-red-400' :
                activeAlert.type === 'warning' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`}
              style={{
                animation: `shrink ${activeAlert.duration || autoHideDelay}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default useReduxStore(PaymentAlert);