import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  to = null
}) => {
  const baseStyle = 'px-4 py-2 rounded-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 inline-block text-center';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-indigo-500 disabled:text-gray-400 disabled:border-gray-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    link: 'bg-transparent text-blue-600 hover:underline focus:ring-blue-500 disabled:text-gray-400',
    icon: 'p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:text-gray-400 disabled:bg-transparent'
  };

  const combinedClassName = `${baseStyle} ${variants[variant]} ${disabled ? 'cursor-not-allowed opacity-75' : ''} ${className}`;

  if (to && !disabled) {
    return (
      <Link
        to={to}
        className={combinedClassName}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  if (to && disabled) {
    return (
      <span 
        className={combinedClassName} 
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'destructive', 'link', 'icon']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  to: PropTypes.string,
};

export default Button; 