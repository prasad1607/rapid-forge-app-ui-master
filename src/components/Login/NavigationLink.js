import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './NavigationLink.css';

const NavigationLink = ({ to, label }) => {
  const navigate = useNavigate();

  return (
    <button 
      className="navigation-link"
      onClick={() => navigate(to)}
    >
      {to === '/' && <ArrowLeft size={20} className="mr-2" />}
      {label}
    </button>
  );
};

export default NavigationLink;
