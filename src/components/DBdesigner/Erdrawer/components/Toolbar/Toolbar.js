// components/Toolbar/Toolbar.js
import React from 'react';
import './Toolbar.css';

const Toolbar = ({
  mode,
  setMode,
  selectedEntities,
  relationshipType,
  setRelationshipType,
  onCreateRelationship,
  canCreateRelationship
}) => {
  return (
    <div className="erd-toolbar">
      <div className="erd-toolbar-section">
        <h3>Entities</h3>
        <button
          className={`erd-toolbar-btn ${mode === 'select' ? 'active' : ''}`}
          onClick={() => setMode('select')}
          title="Select Mode"
        >
          <span className="erd-icon">👆</span>
          <span className="erd-label">Select</span>
        </button>
        <button
          className={`erd-toolbar-btn ${mode === 'addEntity' ? 'active' : ''}`}
          onClick={() => setMode('addEntity')}
          title="Add Entity"
        >
          <span className="erd-icon">➕</span>
          <span className="erd-label">Add Entity</span>
        </button>
      </div>
      
      <div className="erd-toolbar-section">
        <h3>Relationships</h3>
        <div className="erd-relationship-controls">
          <select
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value)}
            className="erd-relationship-type-select"
          >
            <option value="oneToOne">One-to-One (1:1)</option>
            <option value="oneToMany">One-to-Many (1:N)</option>
            <option value="manyToOne">Many-to-One (N:1)</option>
            <option value="manyToMany">Many-to-Many (M:N)</option>
          </select>
          <button
            className="erd-create-relationship-btn"
            onClick={onCreateRelationship}
            disabled={!canCreateRelationship}
            title={canCreateRelationship ? "Create Relationship" : "Select 2 entities first"}
          >
            Create Relationship
          </button>
        </div>
        <div className="erd-selection-info">
          {selectedEntities.length === 0 && (
            <span className="erd-hint">Select 2 entities to create a relationship</span>
          )}
          {selectedEntities.length === 1 && (
            <span className="erd-hint">Select 1 more entity</span>
          )}
          {selectedEntities.length === 2 && (
            <span className="erd-hint">Ready to create relationship</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;