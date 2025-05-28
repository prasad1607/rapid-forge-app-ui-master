import React from 'react';
import './ClassProperties.css';

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
    onChange({ 
      ...classData, 
      fields: [...classData.fields, `field${classData.fields.length + 1}`] 
    });
  };
  
  const addMethod = () => {
    onChange({ 
      ...classData, 
      methods: [...classData.methods, `method${classData.methods.length + 1}()`] 
    });
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
    <div className="lld-class-properties">
      <div className="lld-property-group">
        <label className="lld-property-label">Class Name</label>
        <input 
          type="text" 
          value={classData.name}
          onChange={(e) => onChange({ ...classData, name: e.target.value })}
          className="lld-property-input"
        />
      </div>
      
      <div className="lld-property-group">
        <label className="lld-property-label">Fields</label>
        {classData.fields.map((field, index) => (
          <div key={index} className="lld-property-item">
            <input 
              type="text" 
              value={field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              className="lld-property-input"
            />
            <button 
              onClick={() => removeField(index)}
              className="lld-property-remove-btn"
            >
              X
            </button>
          </div>
        ))}
        <button 
          onClick={addField}
          className="lld-property-add-btn"
        >
          Add Field
        </button>
      </div>
      
      <div className="lld-property-group">
        <label className="lld-property-label">Methods</label>
        {classData.methods.map((method, index) => (
          <div key={index} className="lld-property-item">
            <input 
              type="text" 
              value={method}
              onChange={(e) => handleMethodChange(index, e.target.value)}
              className="lld-property-input"
            />
            <button 
              onClick={() => removeMethod(index)}
              className="lld-property-remove-btn"
            >
              X
            </button>
          </div>
        ))}
        <button 
          onClick={addMethod}
          className="lld-property-add-btn"
        >
          Add Method
        </button>
      </div>
      
      <div className="lld-property-actions">
        <button 
          onClick={onDelete}
          className="lld-property-delete-btn"
        >
          Delete Class
        </button>
        <div className="lld-property-info">
          Position: ({classData.x}, {classData.y})
        </div>
      </div>
    </div>
  );
}

export default ClassProperties;