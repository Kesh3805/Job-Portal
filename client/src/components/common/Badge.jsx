import React from 'react';

const variants = {
  primary: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border border-transparent',
  success: 'bg-green-500/10 text-green-600 border border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  danger: 'bg-destructive/10 text-destructive border border-destructive/20',
  info: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  outline: 'bg-transparent text-foreground border border-border',
};

const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
