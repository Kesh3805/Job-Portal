import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizes[size]} mx-4 my-8`}>
        <div className="relative bg-background border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <FiX size={24} />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
