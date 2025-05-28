// components/Header.js
import React from 'react';
import './Header.css';
import Button from './Button';

export default function Header() {
  return (
    <header className="home-header">
      <div className="home-header-logo">RapidForge</div>
      <nav className="home-header-nav">
        <Button to="/login" variant="outline">Login</Button>
        <Button to="/signup" variant="primary">Sign Up</Button>
      </nav>
    </header>
  );
}