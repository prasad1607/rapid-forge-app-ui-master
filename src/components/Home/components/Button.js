import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({ to, children, variant }) {
  const cls = variant === 'primary' ? 'home-btn-primary' : 'home-btn-outline';
  return (
    <Link to={to} className={`home-btn ${cls}`}>{children}</Link>
  );
}
