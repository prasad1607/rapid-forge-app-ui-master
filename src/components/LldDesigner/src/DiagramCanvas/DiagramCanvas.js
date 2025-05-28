import React, { useRef } from 'react';
import ClassBox from '../ClassBox/ClassBox';
import RelationshipLine from '../RelationshipLine/RelationshipLine';
import './DiagramCanvas.css';

function DiagramCanvas({
  classes,
  relationships,
  selectedClass,
  selectedRelationship,
  selectedTool,
  zoomLevel,
  isDrawingRelationship,
  relationshipStart,
  relationshipType,
  cursorPosition,
  isFullScreen,
  setSelectedClass,
  setSelectedRelationship,
  setIsDrawingRelationship,
  setRelationshipStart,
  setRelationshipType,
  setCursorPosition,
  setSelectedTool,
  addNewClass,
  addNewRelationship,
  updateClass,
  deleteClass
}) {
  const containerRef = useRef(null);
  const diagramRef = useRef(null);

  const handleDiagramClick = (e) => {
    if (diagramRef.current && containerRef.current) {
      const rect = diagramRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      
      const x = (e.clientX - rect.left + scrollLeft) / zoomLevel;
      const y = (e.clientY - rect.top + scrollTop) / zoomLevel;
      
      if (selectedTool === 'class') {
        addNewClass(x, y);
      } else if (selectedTool === 'pointer') {
        // Check if clicked on any class
        const clickedClass = classes.find(cls => 
          x >= cls.x && x <= cls.x + cls.width &&
          y >= cls.y && y <= cls.y + cls.height
        );
        
        if (clickedClass) {
          setSelectedClass(clickedClass.id);
          setSelectedRelationship(null);
        } else {
          // Check if clicked on any relationship
          const clickedRelationship = relationships.find(rel => {
            // Simple proximity check to arrow line
            const startClass = classes.find(c => c.id === rel.from);
            const endClass = classes.find(c => c.id === rel.to);
            if (!startClass || !endClass) return false;
            
            const startX = startClass.x + startClass.width/2;
            const startY = startClass.y + startClass.height/2;
            const endX = endClass.x + endClass.width/2;
            const endY = endClass.y + endClass.height/2;
            
            // Distance from point to line calculation
            const lineLength = Math.sqrt((endX-startX)**2 + (endY-startY)**2);
            if (lineLength === 0) return false;
            
            const distance = Math.abs((endY-startY)*x - (endX-startX)*y + endX*startY - endY*startX) / lineLength;
            return distance < 10 && 
                   x >= Math.min(startX, endX) - 10 && 
                   x <= Math.max(startX, endX) + 10 && 
                   y >= Math.min(startY, endY) - 10 && 
                   y <= Math.max(startY, endY) + 10;
          });
          
          if (clickedRelationship) {
            setSelectedRelationship(clickedRelationship.id);
            setSelectedClass(null);
          } else {
            setSelectedClass(null);
            setSelectedRelationship(null);
          }
        }
      } else if (selectedTool === 'isA' || selectedTool === 'hasA') {
        // Check if clicked on any class to start drawing a relationship
        const clickedClass = classes.find(cls => 
          x >= cls.x && x <= cls.x + cls.width &&
          y >= cls.y && y <= cls.y + cls.height
        );
        
        if (clickedClass) {
          if (!isDrawingRelationship) {
            // Start drawing relationship
            setIsDrawingRelationship(true);
            setRelationshipStart(clickedClass.id);
            setRelationshipType(selectedTool);
            
            // Visual feedback - briefly highlight the source class
            // We temporarily set it as selected
            setSelectedClass(clickedClass.id);
          } else {
            // Finish drawing relationship
            if (clickedClass.id !== relationshipStart) {
              addNewRelationship(relationshipStart, clickedClass.id, selectedTool);
            }
            setIsDrawingRelationship(false);
            setRelationshipStart(null);
            setSelectedTool('pointer');
            setSelectedClass(null); // Clear selection when done
          }
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (diagramRef.current && containerRef.current) {
      const rect = diagramRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      
      const x = (e.clientX - rect.left + scrollLeft) / zoomLevel;
      const y = (e.clientY - rect.top + scrollTop) / zoomLevel;
      
      setCursorPosition({ x, y });
    }
  };

  const handleClassNameChange = (id, newName) => {
    const updatedClass = classes.find(cls => cls.id === id);
    if (updatedClass) {
      updateClass({ ...updatedClass, name: newName });
    }
  };

  const handleClassDrag = (id, deltaX, deltaY) => {
    const updatedClass = classes.find(cls => cls.id === id);
    if (updatedClass) {
      updateClass({ 
        ...updatedClass, 
        x: Math.round((updatedClass.x + deltaX) / 10) * 10, 
        y: Math.round((updatedClass.y + deltaY) / 10) * 10
      });
    }
  };

  const handleClassResize = (id, width, height) => {
    const updatedClass = classes.find(cls => cls.id === id);
    if (updatedClass) {
      updateClass({ 
        ...updatedClass, 
        width: Math.max(80, Math.round(width / 10) * 10),
        height: Math.max(100, Math.round(height / 10) * 10)
      });
    }
  };

  // Render in-progress relationship if drawing
  const renderInProgressRelationship = () => {
    if (!isDrawingRelationship || !relationshipStart) return null;
    
    const startClass = classes.find(c => c.id === relationshipStart);
    if (!startClass) return null;
    
    // Get the actual start point at the edge of the class box
    const startCenter = {
      x: startClass.x + startClass.width / 2,
      y: startClass.y + startClass.height / 2
    };
    
    // Find the point where the line should start (at the edge of the class)
    const dx = cursorPosition.x - startCenter.x;
    const dy = cursorPosition.y - startCenter.y;
    const angle = Math.atan2(dy, dx);
    
    // Determine which edge of the class box the line should start from
    let startPoint;
    const halfWidth = startClass.width / 2;
    const halfHeight = startClass.height / 2;
    
    // Simple intersection with class boundary
    if (Math.abs(Math.tan(angle)) < startClass.width / startClass.height) {
      // Intersect with left/right edge
      const xOffset = Math.sign(dx) * halfWidth;
      const yOffset = Math.tan(angle) * xOffset;
      startPoint = {
        x: startCenter.x + xOffset,
        y: startCenter.y + yOffset
      };
    } else {
      // Intersect with top/bottom edge
      const yOffset = Math.sign(dy) * halfHeight;
      const xOffset = yOffset / Math.tan(angle);
      startPoint = {
        x: startCenter.x + xOffset,
        y: startCenter.y + yOffset
      };
    }
    
    const endPoint = cursorPosition;
    
    // Calculate direction vector
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / lineLength;
    const normalizedDy = dy / lineLength;
    
    let arrowHead = null;
    
    // Generate arrowhead based on relationship type
    if (relationshipType === 'isA') {
      // Triangular arrowhead for inheritance
      const arrowSize = 15;
      const arrowAngle = Math.atan2(normalizedDy, normalizedDx);
      
      const point1 = {
        x: endPoint.x,
        y: endPoint.y
      };
      
      const point2 = {
        x: endPoint.x - arrowSize * Math.cos(arrowAngle - Math.PI/6),
        y: endPoint.y - arrowSize * Math.sin(arrowAngle - Math.PI/6)
      };
      
      const point3 = {
        x: endPoint.x - arrowSize * Math.cos(arrowAngle + Math.PI/6),
        y: endPoint.y - arrowSize * Math.sin(arrowAngle + Math.PI/6)
      };
      
      arrowHead = (
        <polygon 
          points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`}
          fill="white"
          stroke="#3498db"
          strokeWidth="2"
          strokeDasharray="4"
        />
      );
    } else if (relationshipType === 'hasA') {
      // Diamond arrowhead for composition
      const arrowSize = 12;
      const arrowAngle = Math.atan2(normalizedDy, normalizedDx);
      
      const point1 = {
        x: endPoint.x,
        y: endPoint.y
      };
      
      const point2 = {
        x: endPoint.x - arrowSize * Math.cos(arrowAngle - Math.PI/4),
        y: endPoint.y - arrowSize * Math.sin(arrowAngle - Math.PI/4)
      };
      
      const point3 = {
        x: endPoint.x - arrowSize * 1.5 * Math.cos(arrowAngle),
        y: endPoint.y - arrowSize * 1.5 * Math.sin(arrowAngle)
      };
      
      const point4 = {
        x: endPoint.x - arrowSize * Math.cos(arrowAngle + Math.PI/4),
        y: endPoint.y - arrowSize * Math.sin(arrowAngle + Math.PI/4)
      };
      
      arrowHead = (
        <polygon 
          points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} ${point4.x},${point4.y}`}
          fill="#3498db"
          stroke="#3498db"
          strokeWidth="2"
          strokeDasharray="4"
        />
      );
    }
    
    // Calculate the shortened endpoint for where the line meets the arrowhead
    const shortenBy = relationshipType === 'isA' ? 15 : 10;
    const arrowEndX = endPoint.x - normalizedDx * shortenBy;
    const arrowEndY = endPoint.y - normalizedDy * shortenBy;
    
    return (
      <g className="lld-in-progress-relationship">
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={arrowEndX}
          y2={arrowEndY}
          stroke="#3498db"
          strokeWidth={2}
          strokeDasharray="4"
        />
        {arrowHead}
        
        {/* Highlight indicator at the source class */}
        <circle 
          cx={startPoint.x} 
          cy={startPoint.y} 
          r={5} 
          fill="#3498db" 
          stroke="white" 
          strokeWidth={1} 
        />
      </g>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="lld-diagram-container"
      style={{
        height: isFullScreen ? 'calc(100vh - 56px)' : '600px'
      }}
    >
      <div 
        ref={diagramRef}
        className="lld-diagram-canvas"
        style={{ 
          transform: `scale(${zoomLevel})`,
          cursor: selectedTool === 'class' ? 'cell' : 
                 selectedTool === 'isA' || selectedTool === 'hasA' ? 'crosshair' : 'default'
        }}
        onClick={handleDiagramClick}
        onMouseMove={handleMouseMove}
      >
        {/* Grid Lines */}
        <svg className="lld-grid-lines" width="100%" height="100%">
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cccccc" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Relationships SVG Layer */}
        <svg className="lld-relationships-layer" width="100%" height="100%">
          {relationships.map(rel => (
            <RelationshipLine
              key={rel.id}
              relationship={rel}
              classes={classes}
              isSelected={selectedRelationship === rel.id}
              onSelect={setSelectedRelationship}
            />
          ))}
          {renderInProgressRelationship()}
        </svg>
        
        {/* Class Boxes */}
        {classes.map(cls => (
          <ClassBox 
            key={cls.id}
            classData={cls}
            isSelected={selectedClass === cls.id || (isDrawingRelationship && relationshipStart === cls.id)}
            isRelationshipSource={isDrawingRelationship && relationshipStart === cls.id}
            onNameChange={handleClassNameChange}
            onDrag={handleClassDrag}
            onResize={handleClassResize}
            onDelete={deleteClass}
          />
        ))}
        
        {/* Relationship Drawing Indicator */}
        {isDrawingRelationship && (
          <div className="lld-relationship-mode-indicator">
            Drawing {relationshipType === 'isA' ? 'Inheritance' : 'Composition'} Relationship
            <span className="lld-relationship-mode-help">
              Click on target class to connect or ESC to cancel
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagramCanvas;