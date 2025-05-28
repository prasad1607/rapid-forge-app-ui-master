// App.js
import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import ZoomControls from './components/ZoomControls/ZoomControls';
import SaveExportControls from './components/SaveExportControls/SaveExportControls';
import Modal from './components/Modal/Modal';
import './ERDiagramApp.css';

function ERDiagramApp() {
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mode, setMode] = useState('select'); // select, addEntity, addRelationship
  const [modalContent, setModalContent] = useState(null);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [relationshipType, setRelationshipType] = useState('oneToOne');
  const [nextEntityId, setNextEntityId] = useState(1);
  const [nextRelationshipId, setNextRelationshipId] = useState(1);

  // Load saved diagram from localStorage if available
  useEffect(() => {
    const savedDiagram = localStorage.getItem('erDiagram');
    if (savedDiagram) {
      try {
        const parsed = JSON.parse(savedDiagram);
        if (parsed.entities) setEntities(parsed.entities);
        if (parsed.relationships) setRelationships(parsed.relationships);
        if (parsed.nextEntityId) setNextEntityId(parsed.nextEntityId);
        if (parsed.nextRelationshipId) setNextRelationshipId(parsed.nextRelationshipId);
      } catch (e) {
        console.error('Failed to load saved diagram', e);
      }
    }
  }, []);

  const handleAddEntity = (x, y) => {
    if (mode !== 'addEntity') return;
    
    const newEntity = {
      id: `entity_${nextEntityId}`,
      name: `Entity ${nextEntityId}`,
      x,
      y,
      width: 200,
      height: 150,
      attributes: [
        { id: `attr_${nextEntityId}_1`, name: 'id', type: 'INT', isPrimaryKey: true, isNotNull: true },
        { id: `attr_${nextEntityId}_2`, name: 'name', type: 'VARCHAR(255)', isPrimaryKey: false, isNotNull: false },
      ]
    };
    
    setEntities([...entities, newEntity]);
    setNextEntityId(nextEntityId + 1);
    setMode('select'); // Return to select mode after adding entity
  };

  const handleUpdateEntity = (updatedEntity) => {
    setEntities(
      entities.map(entity => entity.id === updatedEntity.id ? updatedEntity : entity)
    );
  };

  const handleSelectEntity = (entityId, isMultiSelect = false) => {
    if (entityId === null) {
      setSelectedEntities([]);
      return;
    }
    if (!isMultiSelect) {
      // Single select
      setSelectedEntities([entityId]);
    } else {
      // Multi-select for relationship creation
      if (selectedEntities.includes(entityId)) {
        setSelectedEntities(selectedEntities.filter(id => id !== entityId));
      } else {
        // Limit to 2 entities for relationship creation
        if (selectedEntities.length < 2) {
          setSelectedEntities([...selectedEntities, entityId]);
        }
      }
    }
  };

  const handleDeleteEntity = (entityId) => {
    // First, delete any relationships connected to this entity
    const updatedRelationships = relationships.filter(
      rel => rel.sourceEntityId !== entityId && rel.targetEntityId !== entityId
    );
    
    // Then delete the entity
    setEntities(entities.filter(entity => entity.id !== entityId));
    setRelationships(updatedRelationships);
    setSelectedEntities(selectedEntities.filter(id => id !== entityId));
  };

  const handleCreateRelationship = () => {
    if (selectedEntities.length !== 2) return;
    
    const newRelationship = {
      id: `relationship_${nextRelationshipId}`,
      sourceEntityId: selectedEntities[0],
      targetEntityId: selectedEntities[1],
      type: relationshipType,
      name: `Relationship ${nextRelationshipId}`
    };
    
    setRelationships([...relationships, newRelationship]);
    setNextRelationshipId(nextRelationshipId + 1);
    setSelectedEntities([]);
  };

  const handleDeleteRelationship = (relationshipId) => {
    setRelationships(relationships.filter(rel => rel.id !== relationshipId));
  };

  const handleUpdateRelationship = (updatedRelationship) => {
    setRelationships(
      relationships.map(rel => rel.id === updatedRelationship.id ? updatedRelationship : rel)
    );
  };

  const handleZoom = (newZoomLevel) => {
    setZoomLevel(Math.max(0.5, Math.min(2, newZoomLevel)));
  };

  const handleSaveDiagram = () => {
    // Save to localStorage
    const diagramData = {
      entities,
      relationships,
      nextEntityId,
      nextRelationshipId
    };
    
    localStorage.setItem('erDiagram', JSON.stringify(diagramData));
    
    // Optionally download as JSON file
    const blob = new Blob([JSON.stringify(diagramData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'er_diagram.json';
    a.click();
    URL.revokeObjectURL(url);
    
    setModalContent({
      title: 'Diagram Saved',
      content: 'Your diagram has been saved to local storage and downloaded as a JSON file.'
    });
  };

  const handleLoadDiagram = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setEntities(parsed.entities || []);
        setRelationships(parsed.relationships || []);
        setNextEntityId(parsed.nextEntityId || entities.length + 1);
        setNextRelationshipId(parsed.nextRelationshipId || relationships.length + 1);
        
        localStorage.setItem('erDiagram', e.target.result);
        
        setModalContent({
          title: 'Diagram Loaded',
          content: 'Your diagram has been loaded successfully.'
        });
      } catch (error) {
        setModalContent({
          title: 'Error Loading Diagram',
          content: 'The selected file is not a valid ER diagram JSON file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const generateSQLScript = (dbType) => {
    let sql = '';
    
    // Add comment header
    sql += `-- ER Diagram SQL Export (${dbType})\n`;
    sql += `-- Generated: ${new Date().toLocaleString()}\n\n`;
    
    // First pass: Create Tables (Entities)
    entities.forEach(entity => {
      // Start CREATE TABLE statement
      sql += `CREATE TABLE ${entity.name} (\n`;
      
      // Add attributes
      const attributeLines = entity.attributes.map(attr => {
        let line = `  ${attr.name} ${attr.type}`;
        if (attr.isPrimaryKey) line += ' PRIMARY KEY';
        if (attr.isNotNull) line += ' NOT NULL';
        if (attr.isUnique) line += ' UNIQUE';
        return line;
      });
      
      sql += attributeLines.join(',\n');
      sql += '\n);\n\n';
    });
    
    // Second pass: Add Foreign Keys for relationships
    relationships.forEach(rel => {
      const sourceEntity = entities.find(e => e.id === rel.sourceEntityId);
      const targetEntity = entities.find(e => e.id === rel.targetEntityId);
      
      if (!sourceEntity || !targetEntity) return;
      
      // Find primary keys
      const sourcePrimaryKey = sourceEntity.attributes.find(a => a.isPrimaryKey)?.name || 'id';
      const targetPrimaryKey = targetEntity.attributes.find(a => a.isPrimaryKey)?.name || 'id';
      
      // For one-to-many, add foreign key to "many" side
      if (rel.type === 'oneToMany') {
        sql += `-- One-to-Many: ${sourceEntity.name} -> ${targetEntity.name}\n`;
        sql += `ALTER TABLE ${targetEntity.name} ADD COLUMN ${sourceEntity.name.toLowerCase()}_${sourcePrimaryKey} ${sourceEntity.attributes.find(a => a.isPrimaryKey)?.type || 'INT'};\n`;
        sql += `ALTER TABLE ${targetEntity.name} ADD CONSTRAINT fk_${targetEntity.name}_${sourceEntity.name} `;
        sql += `FOREIGN KEY (${sourceEntity.name.toLowerCase()}_${sourcePrimaryKey}) REFERENCES ${sourceEntity.name}(${sourcePrimaryKey});\n\n`;
      }
      // For many-to-one, add foreign key to "many" side (reverse of one-to-many)
      else if (rel.type === 'manyToOne') {
        sql += `-- Many-to-One: ${sourceEntity.name} -> ${targetEntity.name}\n`;
        sql += `ALTER TABLE ${sourceEntity.name} ADD COLUMN ${targetEntity.name.toLowerCase()}_${targetPrimaryKey} ${targetEntity.attributes.find(a => a.isPrimaryKey)?.type || 'INT'};\n`;
        sql += `ALTER TABLE ${sourceEntity.name} ADD CONSTRAINT fk_${sourceEntity.name}_${targetEntity.name} `;
        sql += `FOREIGN KEY (${targetEntity.name.toLowerCase()}_${targetPrimaryKey}) REFERENCES ${targetEntity.name}(${targetPrimaryKey});\n\n`;
      }
      // For one-to-one, add foreign key to one side (arbitrarily choosing source)
      else if (rel.type === 'oneToOne') {
        sql += `-- One-to-One: ${sourceEntity.name} -> ${targetEntity.name}\n`;
        sql += `ALTER TABLE ${sourceEntity.name} ADD COLUMN ${targetEntity.name.toLowerCase()}_${targetPrimaryKey} ${targetEntity.attributes.find(a => a.isPrimaryKey)?.type || 'INT'} UNIQUE;\n`;
        sql += `ALTER TABLE ${sourceEntity.name} ADD CONSTRAINT fk_${sourceEntity.name}_${targetEntity.name} `;
        sql += `FOREIGN KEY (${targetEntity.name.toLowerCase()}_${targetPrimaryKey}) REFERENCES ${targetEntity.name}(${targetPrimaryKey});\n\n`;
      }
      // For many-to-many, create a junction table
      else if (rel.type === 'manyToMany') {
        const junctionTableName = `${sourceEntity.name}_${targetEntity.name}`;
        sql += `-- Many-to-Many: ${sourceEntity.name} <-> ${targetEntity.name}\n`;
        sql += `CREATE TABLE ${junctionTableName} (\n`;
        sql += `  ${sourceEntity.name.toLowerCase()}_${sourcePrimaryKey} ${sourceEntity.attributes.find(a => a.isPrimaryKey)?.type || 'INT'},\n`;
        sql += `  ${targetEntity.name.toLowerCase()}_${targetPrimaryKey} ${targetEntity.attributes.find(a => a.isPrimaryKey)?.type || 'INT'},\n`;
        sql += `  PRIMARY KEY (${sourceEntity.name.toLowerCase()}_${sourcePrimaryKey}, ${targetEntity.name.toLowerCase()}_${targetPrimaryKey}),\n`;
        sql += `  CONSTRAINT fk_${junctionTableName}_${sourceEntity.name} FOREIGN KEY (${sourceEntity.name.toLowerCase()}_${sourcePrimaryKey}) REFERENCES ${sourceEntity.name}(${sourcePrimaryKey}),\n`;
        sql += `  CONSTRAINT fk_${junctionTableName}_${targetEntity.name} FOREIGN KEY (${targetEntity.name.toLowerCase()}_${targetPrimaryKey}) REFERENCES ${targetEntity.name}(${targetPrimaryKey})\n`;
        sql += `);\n\n`;
      }
    });
    
    return sql;
  };

  const handleExportSQL = (dbType) => {
    const sql = generateSQLScript(dbType);
    
    // Create a downloadable file
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `er_diagram_${dbType}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    
    setModalContent({
      title: `SQL Export (${dbType})`,
      content: (
        <div>
          <p>Your SQL script has been generated and downloaded.</p>
          <pre style={{ maxHeight: '300px', overflow: 'auto', padding: '10px', background: '#f5f5f5', border: '1px solid #ddd' }}>
            {sql}
          </pre>
        </div>
      )
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="erd-app">
      <Toolbar 
        mode={mode} 
        setMode={setMode}
        selectedEntities={selectedEntities}
        relationshipType={relationshipType}
        setRelationshipType={setRelationshipType}
        onCreateRelationship={handleCreateRelationship}
        canCreateRelationship={selectedEntities.length === 2}
      />
      
      <div className="erd-main-content">
        <Canvas 
          entities={entities} 
          relationships={relationships}
          zoomLevel={zoomLevel}
          mode={mode}
          selectedEntities={selectedEntities}
          onAddEntity={handleAddEntity}
          onUpdateEntity={handleUpdateEntity}
          onSelectEntity={handleSelectEntity}
          onDeleteEntity={handleDeleteEntity}
          onDeleteRelationship={handleDeleteRelationship}
          onUpdateRelationship={handleUpdateRelationship}
        />
        
        <div className="erd-controls-container">
          <ZoomControls 
            zoomLevel={zoomLevel} 
            onZoomChange={handleZoom} 
          />
          
          <SaveExportControls 
            onSave={handleSaveDiagram}
            onLoad={handleLoadDiagram}
            onExportMySQL={() => handleExportSQL('MySQL')}
            onExportPostgreSQL={() => handleExportSQL('PostgreSQL')}
          />
        </div>
      </div>
      
      {modalContent && (
        <Modal 
          title={modalContent.title} 
          onClose={closeModal}
        >
          {modalContent.content}
        </Modal>
      )}
    </div>
  );
}

export default ERDiagramApp;