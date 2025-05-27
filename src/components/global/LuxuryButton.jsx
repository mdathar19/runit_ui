import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * Luxury Button Component with Premium Styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size (sm, md, lg, xl)
 */
const LuxuryButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  ...rest
}) => {
  // Get variant-specific classes
  const getVariantClasses = () => {
    if (disabled || isLoading) {
      return 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50 shadow-none';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 text-black';
      case 'premium':
        return 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-800 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 text-white';
      case 'elegant':
        return 'bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-900 hover:via-black hover:to-gray-800 shadow-2xl shadow-gray-500/25 hover:shadow-gray-500/40 text-white border-gray-600';
      case 'platinum':
        return 'bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700 shadow-2xl shadow-slate-500/25 hover:shadow-slate-500/40 text-white';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 text-black';
      default:
        return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 text-black';
    }
  };

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-10 py-5 text-xl';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative flex items-center justify-center font-bold
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-2xl border-2 border-white/20 backdrop-blur-sm
        transform transition-all duration-300 hover:scale-105 hover:border-white/40
        focus:outline-none focus:ring-4 focus:ring-white/30
        font-luxury tracking-wider
        ${className}
      `}
      {...rest}
    >
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl shimmer" />
      
      {/* Button content */}
      <div className="relative flex items-center space-x-2 z-10">
        {isLoading && <FaSpinner className="animate-spin h-4 w-4" />}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default LuxuryButton;