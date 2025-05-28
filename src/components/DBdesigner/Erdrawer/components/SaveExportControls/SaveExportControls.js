// components/SaveExportControls/SaveExportControls.js
import React, { useRef } from 'react';
import './SaveExportControls.css';

const SaveExportControls = ({
  onSave,
  onLoad,
  onExportMySQL,
  onExportPostgreSQL
}) => {
  const fileInputRef = useRef(null);
  
  const handleLoadClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="erd-save-export-controls">
      <div className="erd-controls-section">
        <h3>Save / Load</h3>
        <button 
          className="erd-control-btn save-btn"
          onClick={onSave}
          title="Save Diagram"
        >
          Save Diagram
        </button>
        <button 
          className="erd-control-btn load-btn"
          onClick={handleLoadClick}
          title="Load Diagram"
        >
          Load Diagram
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onLoad} 
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="erd-controls-section">
        <h3>Export SQL</h3>
        <div className="erd-export-buttons">
          <button 
            className="erd-control-btn export-btn"
            onClick={onExportMySQL}
            title="Export as MySQL"
          >
            MySQL
          </button>
          <button 
            className="erd-control-btn export-btn"
            onClick={onExportPostgreSQL}
            title="Export as PostgreSQL"
          >
            PostgreSQL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveExportControls;