import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Edit3, MousePointer, Square, ArrowRight } from 'lucide-react';

// Main component for class diagram editor
export default function ClassDiagram() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedTool, setSelectedTool] = useState('pointer');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [isDrawingRelationship, setIsDrawingRelationship] = useState(false);
  const [relationshipStart, setRelationshipStart] = useState(null);
  const [relationshipType, setRelationshipType] = useState('isA'); // 'isA' or 'hasA'
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const diagramRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Add event listeners for keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedTool('pointer');
        setSelectedClass(null);
        setSelectedRelationship(null);
        setIsDrawingRelationship(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSelectedClass(null);
    setSelectedRelationship(null);
  };

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
            setIsDrawingRelationship(true);
            setRelationshipStart(clickedClass.id);
            setRelationshipType(selectedTool);
          } else {
            // Finish drawing relationship
            if (clickedClass.id !== relationshipStart) {
              addNewRelationship(relationshipStart, clickedClass.id, selectedTool);
            }
            setIsDrawingRelationship(false);
            setRelationshipStart(null);
            setSelectedTool('pointer');
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

  const addNewClass = (x, y) => {
    const newClass = {
      id: Date.now(),
      x: Math.round(x / 10) * 10, // Snap to grid
      y: Math.round(y / 10) * 10, // Snap to grid
      width: 120,
      height: 150,
      name: 'NewClass',
      fields: ['field1', 'field2'],
      methods: ['method1()', 'method2()']
    };
    
    setClasses([...classes, newClass]);
    setSelectedClass(newClass.id);
    setSelectedTool('pointer');
  };

  const addNewRelationship = (fromId, toId, type) => {
    const newRelationship = {
      id: Date.now(),
      from: fromId,
      to: toId,
      type: type
    };
    
    setRelationships([...relationships, newRelationship]);
    setSelectedRelationship(newRelationship.id);
  };

  const handleClassNameChange = (id, newName) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { ...cls, name: newName } : cls
    ));
  };

  const handleClassDrag = (id, deltaX, deltaY) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { 
        ...cls, 
        x: Math.round((cls.x + deltaX) / 10) * 10, // Snap to grid
        y: Math.round((cls.y + deltaY) / 10) * 10  // Snap to grid
      } : cls
    ));
  };

  const handleClassResize = (id, width, height) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { 
        ...cls, 
        width: Math.max(80, Math.round(width / 10) * 10), // Snap to grid, min width
        height: Math.max(100, Math.round(height / 10) * 10) // Snap to grid, min height
      } : cls
    ));
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
    // Delete all relationships connected to this class
    setRelationships(relationships.filter(rel => rel.from !== id && rel.to !== id));
    setSelectedClass(null);
  };

  const deleteRelationship = (id) => {
    setRelationships(relationships.filter(rel => rel.id !== id));
    setSelectedRelationship(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded ${selectedTool === 'pointer' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => handleToolSelect('pointer')}
            title="Select Tool"
          >
            <MousePointer size={20} />
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'class' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => handleToolSelect('class')}
            title="Add Class"
          >
            <Square size={20} />
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'isA' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => handleToolSelect('isA')}
            title="Is-A Relationship"
          >
            <ArrowRight size={20} />
            <span className="text-xs">Is-A</span>
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'hasA' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => handleToolSelect('hasA')}
            title="Has-A Relationship"
          >
            <Edit3 size={20} />
            <span className="text-xs">Has-A</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 bg-white rounded"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <span className="p-2 bg-white rounded">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            className="p-2 bg-white rounded"
            onClick={handleZoomIn} 
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            className="p-2 bg-white rounded"
            onClick={toggleFullScreen}
            title="Toggle Full Screen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto relative"
        style={{
          height: isFullScreen ? 'calc(100vh - 56px)' : '600px'
        }}
      >
        <div 
          ref={diagramRef}
          className="relative"
          style={{ 
            width: '2000px', 
            height: '2000px', 
            transform: `scale(${zoomLevel})`,
            transformOrigin: '0 0',
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 10px 10px, 10px 10px',
            cursor: selectedTool === 'class' ? 'cell' : 
                   selectedTool === 'isA' || selectedTool === 'hasA' ? 'crosshair' : 'default'
          }}
          onClick={handleDiagramClick}
          onMouseMove={handleMouseMove}
        >
          {/* Draw relationship lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
                <g key={rel.id}>
                  {/* Arrow line */}
                  <line 
                    x1={fromX} 
                    y1={fromY} 
                    x2={toX} 
                    y2={toY} 
                    stroke={isSelected ? "blue" : "black"} 
                    strokeWidth={isSelected ? "3" : "2"}
                    strokeDasharray={rel.type === 'hasA' ? "5,5" : ""}
                  />
                  
                  {/* Arrow head */}
                  <polygon 
                    points={`${toX},${toY} ${toX-10},${toY-5} ${toX-10},${toY+5}`}
                    transform={`rotate(${Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI + 180}, ${toX}, ${toY})`}
                    fill={isSelected ? "blue" : "black"}
                  />
                  
                  {/* Relationship type label */}
                  <text 
                    x={(fromX + toX) / 2} 
                    y={(fromY + toY) / 2 - 10} 
                    textAnchor="middle" 
                    fill={isSelected ? "blue" : "black"}
                    backgroundColor="white"
                    className="text-sm"
                  >
                    {rel.type === 'isA' ? 'Is-A' : 'Has-A'}
                  </text>
                </g>
              );
            })}
            
            {/* Draw in-progress relationship line */}
            {isDrawingRelationship && relationshipStart && (
              <g>
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
                        stroke="gray" 
                        strokeWidth="2"
                        strokeDasharray={relationshipType === 'hasA' ? "5,5" : ""}
                      />
                      <text 
                        x={(fromX + cursorPosition.x) / 2} 
                        y={(fromY + cursorPosition.y) / 2 - 10} 
                        textAnchor="middle" 
                        fill="gray"
                      >
                        {relationshipType === 'isA' ? 'Is-A' : 'Has-A'}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </svg>
          
          {/* Class boxes */}
          {classes.map(cls => (
            <ClassBox 
              key={cls.id}
              classData={cls}
              isSelected={selectedClass === cls.id}
              onNameChange={handleClassNameChange}
              onDrag={handleClassDrag}
              onResize={handleClassResize}
              onDelete={deleteClass}
            />
          ))}
        </div>
      </div>
      
      {/* Properties panel */}
      <div className="bg-gray-100 p-4 h-64 overflow-auto">
        <h3 className="text-lg font-bold mb-2">Properties</h3>
        {selectedClass ? (
          <ClassProperties 
            classData={classes.find(c => c.id === selectedClass)}
            onChange={(updatedClass) => {
              setClasses(classes.map(c => 
                c.id === selectedClass ? updatedClass : c
              ));
            }}
            onDelete={() => deleteClass(selectedClass)}
          />
        ) : selectedRelationship ? (
          <RelationshipProperties 
            relationship={relationships.find(r => r.id === selectedRelationship)}
            classes={classes}
            onChange={(updatedRel) => {
              setRelationships(relationships.map(r => 
                r.id === selectedRelationship ? updatedRel : r
              ));
            }}
            onDelete={() => deleteRelationship(selectedRelationship)}
          />
        ) : (
          <div className="text-gray-500">
            <p>Select a class or relationship to edit its properties.</p>
            <p className="mt-4 text-sm">
              <strong>How to use:</strong><br />
              1. Click the Square icon to add a new class<br />
              2. Click the arrow icons to create relationships<br />
              3. Select classes or relationships to edit properties<br />
              4. Use zoom controls to adjust view
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for a class box
function ClassBox({ classData, isSelected, onNameChange, onDrag, onResize, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('handle')) {
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
  
  return (
    <div 
      className={`absolute border-2 ${isSelected ? 'border-blue-500' : 'border-black'} bg-white flex flex-col cursor-move`}
      style={{
        left: `${classData.x}px`,
        top: `${classData.y}px`,
        width: `${classData.width}px`,
        height: `${classData.height}px`,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-gray-200 p-2 border-b border-gray-400 text-center font-bold">
        {isSelected ? (
          <input 
            type="text" 
            value={classData.name} 
            onChange={(e) => onNameChange(classData.id, e.target.value)}
            className="w-full text-center"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          classData.name
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-2 text-sm">
        <div className="border-b border-gray-300 pb-2 mb-2">
          <div className="font-bold mb-1">Fields:</div>
          <ul>
            {classData.fields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold mb-1">Methods:</div>
          <ul>
            {classData.methods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {isSelected && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize handle" 
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            setInitialSize({ width: classData.width, height: classData.height });
            setInitialMousePos({ x: e.clientX, y: e.clientY });
          }}
        />
      )}
    </div>
  );
}

// Component for class properties panel
function ClassProperties({ classData, onChange, onDelete }) {
  const handleFieldChange = (index, value) => {
    const newFields = [...classData.fields];
    newFields[index] = value;
    onChange({ ...classData, fields: newFields });
  };
  
  const handleMethodChange = (index, value) => {
    const newMethods = [...classData.methods];
    newMethods[index] = value;
    onChange({ ...classData, methods: newMethods });
  };
  
  const addField = () => {
    onChange({ ...classData, fields: [...classData.fields, `field${classData.fields.length + 1}`] });
  };
  
  const addMethod = () => {
    onChange({ ...classData, methods: [...classData.methods, `method${classData.methods.length + 1}()`] });
  };
  
  const removeField = (index) => {
    const newFields = [...classData.fields];
    newFields.splice(index, 1);
    onChange({ ...classData, fields: newFields });
  };
  
  const removeMethod = (index) => {
    const newMethods = [...classData.methods];
    newMethods.splice(index, 1);
    onChange({ ...classData, methods: newMethods });
  };
  
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Class Name</label>
        <input 
          type="text" 
          value={classData.name}
          onChange={(e) => onChange({ ...classData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fields</label>
        {classData.fields.map((field, index) => (
          <div key={index} className="flex mt-1">
            <input 
              type="text" 
              value={field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <button 
              onClick={() => removeField(index)}
              className="ml-2 bg-red-500 text-white rounded p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}
        <button 
          onClick={addField}
          className="mt-2 bg-blue-500 text-white rounded px-2 py-1 text-sm"
        >
          Add Field
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Methods</label>
        {classData.methods.map((method, index) => (
          <div key={index} className="flex mt-1">
            <input 
              type="text" 
              value={method}
              onChange={(e) => handleMethodChange(index, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <button 
              onClick={() => removeMethod(index)}
              className="ml-2 bg-red-500 text-white rounded p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}
        <button 
          onClick={addMethod}
          className="mt-2 bg-blue-500 text-white rounded px-2 py-1 text-sm"
        >
          Add Method
        </button>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onDelete}
          className="bg-red-500 text-white rounded px-3 py-1"
        >
          Delete Class
        </button>
        <div className="text-gray-500 text-sm">
          Position: ({classData.x}, {classData.y})
        </div>
      </div>
    </div>
  );
}

// Component for relationship properties panel
function RelationshipProperties({ relationship, classes, onChange, onDelete }) {
  const fromClass = classes.find(c => c.id === relationship.from);
  const toClass = classes.find(c => c.id === relationship.to);
  
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
        <select 
          value={relationship.type}
          onChange={(e) => onChange({ ...relationship, type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="isA">Is-A (Inheritance)</option>
          <option value="hasA">Has-A (Composition)</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">From Class</label>
        <select 
          value={relationship.from}
          onChange={(e) => onChange({ ...relationship, from: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">To Class</label>
        <select 
          value={relationship.to}
          onChange={(e) => onChange({ ...relationship, to: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <button 
          onClick={onDelete}
          className="bg-red-500 text-white rounded px-3 py-1"
        >
          Delete Relationship
        </button>
      </div>
    </div>
  );
}