import React from 'react';
import './FeatureCard.css';

export default function FeatureCard({ title, desc }) {
  return (
    <div className="home-feature-card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}