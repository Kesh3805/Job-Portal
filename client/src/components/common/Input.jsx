import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground/80 mb-1.5">
          {label}
        </label>
      )} 
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 bg-background border rounded-lg transition-all duration-200
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary
            disabled:bg-muted disabled:text-muted-foreground
            ${error 
              ? 'border-destructive focus:ring-destructive/20' 
              : 'border-input hover:border-primary/50'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive animate-fade-in flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
