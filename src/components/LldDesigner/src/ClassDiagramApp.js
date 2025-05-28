// src/components/ClassDiagramApp.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDiagram } from '../../../store/DiagramReducer';
import ClassDiagram from './ClassDiagram';
import './ClassDiagramApp.css';

function ClassDiagramApp() {
  const dispatch = useDispatch();
  
  const savedDiagram = useSelector((state) => state.classDiagram);

  const handleSaveDiagram = (diagram) => {
    dispatch(setDiagram(diagram));
  };

  const onExportDiagram = (diagram) => {
    console.log('Exporting diagram:', diagram);
  }

  return (
    <div className="lld-designer-app">
      <ClassDiagram savedDiagram={savedDiagram} onSaveDiagram={handleSaveDiagram} onExportDiagram={onExportDiagram}/>
    </div>
  );
}

export default ClassDiagramApp;
