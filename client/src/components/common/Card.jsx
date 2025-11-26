import React from 'react';

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
  return (
    <div 
      className={`
        rounded-2xl border border-border/50 overflow-hidden
        ${glass ? 'glass' : 'bg-card shadow-soft'}
        ${hover ? 'transition-all duration-300 hover:shadow-medium hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
