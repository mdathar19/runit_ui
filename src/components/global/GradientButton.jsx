import React from 'react';

/**
 * Reusable button component with purple-black gradient theme
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Object} props.rest - Any other props to pass to the button element
 */
const GradientButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  isLoading = false,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center px-6 py-2 text-sm font-medium text-white
        cursor-pointer
        ${disabled || isLoading
          ? 'bg-gray-600 cursor-not-allowed opacity-70'
          : 'bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900'
        }
        rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default GradientButton;