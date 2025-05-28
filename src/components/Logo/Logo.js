// src/components/Logo/Logo.js
import React from 'react';
import logo from './logo.svg';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo">
        <img src={logo} alt="Logo" width="300px" />
      </div>
    </div>
  );
};

export default Logo;