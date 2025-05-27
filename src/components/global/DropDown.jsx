"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const DropDown = ({ 
  trigger, 
  children, 
  className = '',
  dropdownClassName = '',
  position = 'bottom-right',
  offset = 8,
  theme = 'dark' // 'dark', 'light', 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Theme styles
  const themeStyles = {
    dark: {
      bg: 'bg-gray-900/95',
      border: 'border-gray-700',
      text: 'text-white',
      backdrop: 'backdrop-blur-md',
      shadow: 'shadow-2xl shadow-black/50'
    },
    light: {
      bg: 'bg-white/95',
      border: 'border-gray-200',
      text: 'text-gray-900',
      backdrop: 'backdrop-blur-md',
      shadow: 'shadow-2xl shadow-gray-500/20'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.dark;

  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0';
      case 'bottom-right':
        return 'top-full right-0';
      case 'top-left':
        return 'bottom-full left-0';
      case 'top-right':
        return 'bottom-full right-0';
      case 'bottom-center':
        return 'top-full left-1/2 transform -translate-x-1/2';
      default:
        return 'top-full right-0';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position.includes('top') ? 10 : -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: position.includes('top') ? 10 : -10,
      transition: { duration: 0.15 }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className={`
              absolute z-50 min-w-48
              ${getPositionStyles()}
              ${currentTheme.bg}
              ${currentTheme.border}
              ${currentTheme.text}
              ${currentTheme.backdrop}
              ${currentTheme.shadow}
              border rounded-lg overflow-hidden
              ${dropdownClassName}
            `}
            style={{ 
              marginTop: position.includes('bottom') ? `${offset}px` : 'auto',
              marginBottom: position.includes('top') ? `${offset}px` : 'auto'
            }}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({ 
  children, 
  onClick, 
  className = '',
  theme = 'dark',
  disabled = false,
  icon,
  danger = false
}) => {
  const themeStyles = {
    dark: {
      hover: danger ? 'hover:bg-red-900/20 hover:text-red-400' : 'hover:bg-gray-800',
      text: danger ? 'text-red-400' : 'text-gray-300 hover:text-white',
      disabled: 'text-gray-600 cursor-not-allowed'
    },
    light: {
      hover: danger ? 'hover:bg-red-100 hover:text-red-600' : 'hover:bg-gray-100',
      text: danger ? 'text-red-600' : 'text-gray-700 hover:text-gray-900',
      disabled: 'text-gray-400 cursor-not-allowed'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.dark;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-3 transition-colors duration-150
        flex items-center space-x-3
        ${disabled ? currentTheme.disabled : `${currentTheme.text} ${currentTheme.hover}`}
        ${className}
      `}
    >
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
};

// Dropdown Divider Component
export const DropdownDivider = ({ theme = 'dark' }) => {
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  return <div className={`border-t ${borderColor} my-1`} />;
};

// Dropdown Header Component
export const DropdownHeader = ({ children, theme = 'dark' }) => {
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${textColor}`}>
      {children}
    </div>
  );
};

export default DropDown;