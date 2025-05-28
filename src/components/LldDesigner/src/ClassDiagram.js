import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar/Toolbar';
import DiagramCanvas from './DiagramCanvas/DiagramCanvas';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import './ClassDiagram.css';

// Main component for class diagram editor
export default function ClassDiagram({savedDiagram, onSaveDiagram, onExportDiagram}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [classes, setClasses] = useState(savedDiagram?.classes || []);
  const [relationships, setRelationships] = useState(savedDiagram?.relationships || []);
  const [selectedTool, setSelectedTool] = useState('pointer');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [isDrawingRelationship, setIsDrawingRelationship] = useState(false);
  const [relationshipStart, setRelationshipStart] = useState(null);
  const [relationshipType, setRelationshipType] = useState('isA');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

  const updateClass = (updatedClass) => {
    setClasses(classes.map(c => 
      c.id === updatedClass.id ? updatedClass : c
    ));
  };

  const updateRelationship = (updatedRel) => {
    setRelationships(relationships.map(r => 
      r.id === updatedRel.id ? updatedRel : r
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

  const saveDiagram = () => {
    const diagramData = {
      classes: classes,
      relationships: relationships
    };
        // Call the onSaveDiagram prop with the diagram data
    onSaveDiagram(diagramData);
  }
  const exportDiagram = () => {
    const diagramData = {
      classes: classes,
      relationships: relationships
    };
        // Call the onSaveDiagram prop with the diagram data
    onExportDiagram(diagramData);
  }
  return (
    <div className="lld-class-diagram">
      <Toolbar 
        selectedTool={selectedTool}
        zoomLevel={zoomLevel}
        onToolSelect={handleToolSelect}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullScreen={toggleFullScreen}
        onSaveDiagram={saveDiagram}
        exportDiagram={exportDiagram}
      />

      <DiagramCanvas
        classes={classes}
        relationships={relationships}
        selectedClass={selectedClass}
        selectedRelationship={selectedRelationship}
        selectedTool={selectedTool}
        zoomLevel={zoomLevel}
        isDrawingRelationship={isDrawingRelationship}
        relationshipStart={relationshipStart}
        relationshipType={relationshipType}
        cursorPosition={cursorPosition}
        isFullScreen={isFullScreen}
        setSelectedClass={setSelectedClass}
        setSelectedRelationship={setSelectedRelationship}
        setIsDrawingRelationship={setIsDrawingRelationship}
        setRelationshipStart={setRelationshipStart}
        setRelationshipType={setRelationshipType}
        setCursorPosition={setCursorPosition}
        setSelectedTool={setSelectedTool}
        addNewClass={addNewClass}
        addNewRelationship={addNewRelationship}
        updateClass={updateClass}
        deleteClass={deleteClass}
      />
      
      <PropertiesPanel
        selectedClass={selectedClass}
        selectedRelationship={selectedRelationship}
        classes={classes}
        relationships={relationships}
        updateClass={updateClass}
        updateRelationship={updateRelationship}
        deleteClass={deleteClass}
        deleteRelationship={deleteRelationship}
      />
    </div>
  );
}