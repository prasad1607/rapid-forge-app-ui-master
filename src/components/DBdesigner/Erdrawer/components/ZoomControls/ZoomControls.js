// components/ZoomControls/ZoomControls.js
import React from 'react';
import './ZoomControls.css';

const ZoomControls = ({ zoomLevel, onZoomChange }) => {
  const zoomIn = () => {
    onZoomChange(zoomLevel + 0.1);
  };
  
  const zoomOut = () => {
    onZoomChange(zoomLevel - 0.1);
  };
  
  const resetZoom = () => {
    onZoomChange(1);
  };
  
  // Format zoom level as percentage
  const zoomPercentage = Math.round(zoomLevel * 100);
  
  return (
    <div className="zoom-controls">
      <button 
        className="zoom-btn" 
        onClick={zoomOut} 
        disabled={zoomLevel <= 0.5}
        title="Zoom Out"
      >
        −
      </button>
      <button 
        className="zoom-btn zoom-reset" 
        onClick={resetZoom}
        title="Reset Zoom"
      >
        {zoomPercentage}%
      </button>
      <button 
        className="zoom-btn" 
        onClick={zoomIn}
        disabled={zoomLevel >= 2}
        title="Zoom In"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControls;