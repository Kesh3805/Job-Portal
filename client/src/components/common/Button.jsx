import React from 'react';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg border border-transparent',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent',
  outline: 'bg-transparent border border-input text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  glass: 'glass text-foreground hover:bg-white/20 border-white/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'h-10 w-10 p-2',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false, 
  disabled = false, 
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
