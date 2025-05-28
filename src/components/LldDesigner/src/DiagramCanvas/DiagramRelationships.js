import React from 'react';
import './DiagramRelationships.css';

function DiagramRelationships({
  relationships,
  classes,
  selectedRelationship,
  isDrawingRelationship,
  relationshipStart,
  relationshipType,
  cursorPosition
}) {
  return (
    <svg className="relationships-layer">
      {/* Draw relationship lines */}
      {relationships.map(rel => {
        const fromClass = classes.find(c => c.id === rel.from);
        const toClass = classes.find(c => c.id === rel.to);
        
        if (!fromClass || !toClass) return null;
        
        const fromX = fromClass.x + fromClass.width/2;
        const fromY = fromClass.y + fromClass.height/2;
        const toX = toClass.x + toClass.width/2;
        const toY = toClass.y + toClass.height/2;
        
        const isSelected = selectedRelationship === rel.id;
        
        return (
          <g key={rel.id} className={isSelected ? 'relationship selected' : 'relationship'}>
            {/* Arrow line */}
            <line 
              x1={fromX} 
              y1={fromY} 
              x2={toX} 
              y2={toY} 
              className={rel.type === 'hasA' ? 'relationship-line dashed' : 'relationship-line'}
            />
            
            {/* Arrow head */}
            <polygon 
              points={`${toX},${toY} ${toX-10},${toY-5} ${toX-10},${toY+5}`}
              transform={`rotate(${Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI + 180}, ${toX}, ${toY})`}
              className="relationship-arrow"
            />
            
            {/* Relationship type label */}
            <text 
              x={(fromX + toX) / 2} 
              y={(fromY + toY) / 2 - 10} 
              className="relationship-label"
            >
              {rel.type === 'isA' ? 'Is-A' : 'Has-A'}
            </text>
          </g>
        );
      })}
      
      {/* Draw in-progress relationship line */}
      {isDrawingRelationship && relationshipStart && (
        <g className="drawing-relationship">
          {(() => {
            const fromClass = classes.find(c => c.id === relationshipStart);
            if (!fromClass) return null;
            
            const fromX = fromClass.x + fromClass.width/2;
            const fromY = fromClass.y + fromClass.height/2;
            
            return (
              <>
                <line 
                  x1={fromX} 
                  y1={fromY} 
                  x2={cursorPosition.x} 
                  y2={cursorPosition.y} 
                  className={relationshipType === 'hasA' ? 'drawing-line dashed' : 'drawing-line'}
                />
                <text 
                  x={(fromX + cursorPosition.x) / 2} 
                  y={(fromY + cursorPosition.y) / 2 - 10} 
                  className="drawing-label"
                >
                  {relationshipType === 'isA' ? 'Is-A' : 'Has-A'}
                </text>
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
}

export default DiagramRelationships;