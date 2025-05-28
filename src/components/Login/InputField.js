import React from 'react';
import './InputField.css';

const InputField = ({ label, name, value, onChange, error, type, placeholder, children }) => (
  <div className="input-field">
    <label htmlFor={name} className="input-label">{label}</label>
    <div className="input-wrapper">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
      />
      {children}
    </div>
    {error && <p className="error-message">{error}</p>}
  </div>
);

export default InputField;
