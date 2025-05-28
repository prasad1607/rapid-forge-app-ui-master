import React from 'react';
import ClassProperties from './ClassProperties';
import RelationshipProperties from './RelationshipProperties';
import './PropertiesPanel.css';

function PropertiesPanel({
  selectedClass,
  selectedRelationship,
  classes,
  relationships,
  updateClass,
  updateRelationship,
  deleteClass,
  deleteRelationship
}) {
  const selectedClassData = selectedClass ? classes.find(c => c.id === selectedClass) : null;
  const selectedRelData = selectedRelationship ? relationships.find(r => r.id === selectedRelationship) : null;

  return (
    <div className="lld-properties-panel">
      <h3 className="lld-properties-title">Properties</h3>
      
      {selectedClassData ? (
        <ClassProperties 
          classData={selectedClassData}
          onChange={updateClass}
          onDelete={() => deleteClass(selectedClass)}
        />
      ) : selectedRelData ? (
        <RelationshipProperties 
          relationship={selectedRelData}
          classes={classes}
          onChange={updateRelationship}
          onDelete={() => deleteRelationship(selectedRelationship)}
        />
      ) : (
        <div className="lld-properties-empty">
          <p>Select a class or relationship to edit its properties.</p>
          <p className="lld-properties-help">
            <strong>How to use:</strong><br />
            1. Click the Square icon to add a new class<br />
            2. Click the arrow icons to create relationships<br />
            3. Select classes or relationships to edit properties<br />
            4. Use zoom controls to adjust view
          </p>
        </div>
      )}
    </div>
  );
}

export default PropertiesPanel;