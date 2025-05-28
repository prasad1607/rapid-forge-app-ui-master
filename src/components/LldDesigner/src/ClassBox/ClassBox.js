import React, { useState, useEffect } from 'react';
import './ClassBox.css';

function ClassBox({ 
  classData, 
  isSelected, 
  isRelationshipSource, 
  onNameChange, 
  onDrag, 
  onResize, 
  onDelete 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('resize-handle')) {
      // Resize
      setIsResizing(true);
      setInitialSize({ width: classData.width, height: classData.height });
      setInitialMousePos({ x: e.clientX, y: e.clientY });
    } else {
      // Drag
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - classData.x,
        y: e.clientY - classData.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    e.stopPropagation();
    if (isDragging) {
      onDrag(classData.id, e.clientX - dragOffset.x - classData.x, e.clientY - dragOffset.y - classData.y);
    } else if (isResizing) {
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;
      onResize(classData.id, initialSize.width + deltaX, initialSize.height + deltaY);
    }
  };
  
  const handleMouseUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setIsResizing(false);
  };
  
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);
  
  // Determine class name based on selection and relationship source status
  const classNames = ['lld-class-box'];
  if (isSelected) classNames.push('selected');
  if (isRelationshipSource) classNames.push('relationship-source');
  
  return (
    <div 
      className={classNames.join(' ')}
      style={{
        left: `${classData.x}px`,
        top: `${classData.y}px`,
        width: `${classData.width}px`,
        height: `${classData.height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="lld-class-header">
        {isSelected ? (
          <input 
            type="text" 
            value={classData.name} 
            onChange={(e) => onNameChange(classData.id, e.target.value)}
            className="lld-class-name-input"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          classData.name
        )}
      </div>
      
      <div className="lld-class-content">
        <div className="lld-class-section">
          <div className="lld-section-title">Fields:</div>
          <ul className="lld-section-list">
            {classData.fields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
        <div className="lld-class-section">
          <div className="lld-section-title">Methods:</div>
          <ul className="lld-section-list">
            {classData.methods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {isSelected && (
        <div className="lld-resize-handle" />
      )}
      
      {/* Source indicator */}
      {isRelationshipSource && (
        <div className="lld-relationship-source-indicator" />
      )}
    </div>
  );
}

export default ClassBox;