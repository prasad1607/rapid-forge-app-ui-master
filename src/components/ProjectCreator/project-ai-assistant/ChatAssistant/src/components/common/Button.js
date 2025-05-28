import React from 'react';
import './Button.css';

function Button({ label, onClick, type = 'button', disabled = false, className = '' }) {
  return React.createElement(
    'button',
    {
      className: `btn ${className}`,
      type,
      onClick,
      disabled
    },
    label
  );
}

export default Button;
