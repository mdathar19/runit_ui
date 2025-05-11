import React from 'react';
import styles from '../../css/ThemedButton.module.css';
import GradientButton from './GradientButton';

/**
 * IconButton - A specialized ThemedButton for icons
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.icon - Icon component to display
 * @param {string} props.variant - Button variant (primary, secondary, dark, light, etc.)
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.size - Button size (sm, lg)
 * @param {string} props.title - Button tooltip
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional classes
 * @param {Object} props.rest - Any other props to pass to Button
 */
const IconButton = ({ 
  icon,
  variant = 'dark',
  onClick,
  size,
  title,
  disabled = false,
  className = '',
  ...rest 
}) => {
  return (
    <GradientButton
      variant={variant}
      onClick={onClick}
      size={size}
      disabled={disabled}
      className={`${styles.iconButton} ${className}`}
      title={title}
      aria-label={title}
      {...rest}
    >
      {icon}
    </GradientButton>
  );
};

export default IconButton;