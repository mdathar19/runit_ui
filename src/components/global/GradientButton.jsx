import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * Reusable button component with multiple theme variants
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.variant - Button style variant ('purple', 'dark', 'gray')
 * @param {Object} props.rest - Any other props to pass to the button element
 */
const GradientButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  isLoading = false,
  type = 'button',
  variant = 'purple',
  ...rest
}) => {
  // Define button style variants
  const getVariantClasses = () => {
    if (disabled || isLoading) {
      return 'bg-gray-600 cursor-not-allowed opacity-70';
    }
    
    switch (variant) {
      case 'purple':
        return 'bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900';
      case 'dark':
        return 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black';
      case 'gray':
        return 'bg-gray-700 hover:bg-gray-600';
      default:
        return 'bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center px-6 py-2 text-sm font-medium text-white
        cursor-pointer
        ${getVariantClasses()}
        rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin h-4 w-4 text-white" />
        </>
      ) : children}
    </button>
  );
};

export default GradientButton;