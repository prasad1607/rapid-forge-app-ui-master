// components/Modal/Modal.js
import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ title, onClose, children }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  return (
    <div className="erd-modal-overlay" onClick={onClose}>
      <div className="erd-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="erd-modal-header">
          <h2>{title}</h2>
          <button className="erd-modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="erd-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;