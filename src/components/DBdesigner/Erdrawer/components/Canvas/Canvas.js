// components/Canvas/Canvas.js
import React, { useRef, useEffect } from 'react';
import EntityBox from '../EntityBox/EntityBox';
import RelationshipLine from '../RelationshipLine/RelationshipLine';
import './Canvas.css';

const Canvas = ({ 
  entities, 
  relationships,
  zoomLevel,
  mode,
  selectedEntities,
  onAddEntity,
  onUpdateEntity,
  onSelectEntity,
  onDeleteEntity,
  onDeleteRelationship,
  onUpdateRelationship
}) => {
  const canvasRef = useRef(null);
  
  const handleCanvasClick = (e) => {
    if (e.defaultPrevented) return; // Exit early if event was already handled
    if (mode === 'addEntity') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoomLevel;
      const y = (e.clientY - rect.top) / zoomLevel;
      onAddEntity(x, y);
    } else {
      onSelectEntity(null); // Deselect all when clicking on canvas
    }
  };
  

  return (
    <div 
      ref={canvasRef}
      className="erd-canvas" 
      onClick={handleCanvasClick}
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left'
      }}
    >
      {/* Draw relationships first so they appear behind entities */}
      {relationships.map(relationship => {
        const sourceEntity = entities.find(e => e.id === relationship.sourceEntityId);
        const targetEntity = entities.find(e => e.id === relationship.targetEntityId);
        
        if (!sourceEntity || !targetEntity) return null;
        
        return (
          <RelationshipLine 
            key={relationship.id}
            relationship={relationship}
            sourceEntity={sourceEntity}
            targetEntity={targetEntity}
            onDelete={() => onDeleteRelationship(relationship.id)}
            onUpdate={onUpdateRelationship}
          />
        );
      })}
      
      {/* Draw entities */}
      {entities.map(entity => (
        <EntityBox 
          key={entity.id}
          entity={entity}
          isSelected={selectedEntities.includes(entity.id)}
          onUpdate={onUpdateEntity}
          onSelect={(e) => {
            e.stopPropagation();
            onSelectEntity(entity.id, e.ctrlKey || e.metaKey);
          }}
          onDelete={() => onDeleteEntity(entity.id)}
          zoomLevel={zoomLevel}
        />
      ))}
    </div>
  );
};

export default Canvas;