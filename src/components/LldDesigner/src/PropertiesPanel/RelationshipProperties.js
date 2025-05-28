import React from 'react';
import './RelationshipProperties.css';

function RelationshipProperties({ relationship, classes, onChange, onDelete }) {
  const fromClass = classes.find(c => c.id === relationship.from);
  const toClass = classes.find(c => c.id === relationship.to);
  
  return (
    <div className="lld-relationship-properties">
      <div className="lld-property-group">
        <label className="lld-property-label">Relationship Type</label>
        <select 
          value={relationship.type}
          onChange={(e) => onChange({ ...relationship, type: e.target.value })}
          className="lld-property-select"
        >
          <option value="isA">Is-A (Inheritance)</option>
          <option value="hasA">Has-A (Composition)</option>
        </select>
      </div>
      
      <div className="lld-property-group">
        <label className="lld-property-label">From Class</label>
        <select 
          value={relationship.from}
          onChange={(e) => onChange({ ...relationship, from: parseInt(e.target.value) })}
          className="lld-property-select"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      
      <div className="lld-property-group">
        <label className="lld-property-label">To Class</label>
        <select 
          value={relationship.to}
          onChange={(e) => onChange({ ...relationship, to: parseInt(e.target.value) })}
          className="lld-property-select"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      
      <div className="lld-property-actions">
        <button 
          onClick={onDelete}
          className="lld-property-delete-btn"
        >
          Delete Relationship
        </button>
        <div className="lld-property-info">
          {fromClass?.name} → {toClass?.name}
        </div>
      </div>
    </div>
  );
}

export default RelationshipProperties;