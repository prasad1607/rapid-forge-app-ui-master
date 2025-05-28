// components/EntityBox/EntityBox.js
import React, { useState, useRef, useEffect } from 'react';
import './EntityBox.css';

const EntityBox = ({
  entity,
  isSelected,
  onUpdate,
  onSelect,
  onDelete,
  zoomLevel
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingName, setEditingName] = useState(entity.name);
  const [showAttributeEditor, setShowAttributeEditor] = useState(false);
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'VARCHAR(255)',
    isPrimaryKey: false,
    isNotNull: false,
    isUnique: false
  });
  
  const entityRef = useRef(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  const handleMouseDown = (e) => {
    // e.preventDefault(); 
    // e.stopPropagation();
    // onSelect(e);
  
    // Prevent dragging when Ctrl or Cmd is pressed
    if (!editMode && !e.ctrlKey && !e.metaKey) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: entity.x,
        initialY: entity.y
      };
    }
  };
  

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - dragRef.current.startX) / zoomLevel;
    const dy = (e.clientY - dragRef.current.startY) / zoomLevel;
    
    onUpdate({
      ...entity,
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleEditMode = (e) => {
    e.stopPropagation();
    setEditMode(!editMode);
    setEditingName(entity.name);
  };

  const saveName = () => {
    onUpdate({
      ...entity,
      name: editingName
    });
    setEditMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveName();
    }
  };

  const toggleAttributeEditor = (e) => {
    e.stopPropagation();
    setShowAttributeEditor(!showAttributeEditor);
  };

  const addAttribute = () => {
    if (!newAttribute.name.trim()) return;
    
    const updatedEntity = {
      ...entity,
      attributes: [
        ...entity.attributes,
        {
          id: `attr_${entity.id}_${entity.attributes.length + 1}`,
          ...newAttribute
        }
      ]
    };
    
    onUpdate(updatedEntity);
    
    // Reset form
    setNewAttribute({
      name: '',
      type: 'VARCHAR(255)',
      isPrimaryKey: false,
      isNotNull: false,
      isUnique: false
    });
  };

  const deleteAttribute = (attrId) => {
    const updatedAttributes = entity.attributes.filter(attr => attr.id !== attrId);
    
    onUpdate({
      ...entity,
      attributes: updatedAttributes
    });
  };

  const updateAttribute = (attrId, field, value) => {
    const updatedAttributes = entity.attributes.map(attr => {
      if (attr.id === attrId) {
        return { ...attr, [field]: value };
      }
      return attr;
    });
    
    onUpdate({
      ...entity,
      attributes: updatedAttributes
    });
  };

  return (
    <div 
      ref={entityRef}
      className={`erd-entity-box ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: entity.x,
        top: entity.y,
        width: entity.width,
        minHeight: entity.height
      }}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
    >
      <div className="erd-entity-header">
        {editMode ? (
          <input 
            type="text" 
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveName}
            autoFocus
          />
        ) : (
          <h3>{entity.name}</h3>
        )}
        <div className="erd-entity-controls">
          <button className="erd-entity-btn edit-btn" onClick={toggleEditMode}>
            ✏️
          </button>
          <button className="erd-entity-btn delete-btn" onClick={onDelete}>
            🗑️
          </button>
        </div>
      </div>
      
      <div className="erd-entity-attributes">
        {entity.attributes.map(attr => (
          <div key={attr.id} className="erd-attribute-item">
            <div className="erd-attribute-name">
              {attr.isPrimaryKey && <span className="erd-key-icon">🔑</span>}
              {attr.name}
            </div>
            <div className="erd-attribute-type">{attr.type}</div>
            <div className="erd-attribute-constraints">
              {attr.isNotNull && <span className="erd-constraint">NN</span>}
              {attr.isUnique && <span className="erd-constraint">UQ</span>}
            </div>
            {isSelected && (
              <div className="erd-attribute-actions">
                <button 
                  className="erd-attribute-btn"
                  onClick={() => deleteAttribute(attr.id)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
        
        {isSelected && (
          <button 
            className="erd-add-attribute-btn"
            onClick={toggleAttributeEditor}
          >
            {showAttributeEditor ? "− Hide Attribute Editor" : "+ Add Attribute"}
          </button>
        )}
        
        {showAttributeEditor && (
          <div className="erd-attribute-editor">
            <input
              type="text"
              placeholder="Attribute Name"
              value={newAttribute.name}
              onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
            />
            <select
              value={newAttribute.type}
              onChange={(e) => setNewAttribute({...newAttribute, type: e.target.value})}
            >
              <option value="INT">INT</option>
              <option value="VARCHAR(255)">VARCHAR(255)</option>
              <option value="TEXT">TEXT</option>
              <option value="DATE">DATE</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
              <option value="TIMESTAMP">TIMESTAMP</option>
            </select>
            <div className="erd-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newAttribute.isPrimaryKey}
                  onChange={(e) => setNewAttribute({...newAttribute, isPrimaryKey: e.target.checked})}
                />
                Primary Key
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newAttribute.isNotNull}
                  onChange={(e) => setNewAttribute({...newAttribute, isNotNull: e.target.checked})}
                />
                Not Null
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newAttribute.isUnique}
                  onChange={(e) => setNewAttribute({...newAttribute, isUnique: e.target.checked})}
                />
                Unique
              </label>
            </div>
            <button
              className="erd-add-attribute-submit"
              onClick={addAttribute}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityBox;