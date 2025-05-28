import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="home-footer">
      <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </footer>
  );
}