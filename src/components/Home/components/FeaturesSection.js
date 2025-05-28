import React from 'react';
import './FeaturesSection.css';
import FeatureCard from './FeatureCard';

const features = [
  { title: 'Project Templates', desc: 'Generate any web app framework template.' },
  { title: 'UML Diagrams', desc: 'Design class diagrams visually.' },
  { title: 'ER Diagrams', desc: 'Model relational databases.' },
  { title: 'AI Assistant', desc: 'Ask questions & get help.' },
  { title: 'Quick Starts', desc: 'Kick off projects instantly.' },
];

export default function FeaturesSection() {
  return (
    <section className="home-features">
      {features.map(f => <FeatureCard key={f.title} {...f} />)}
    </section>
  );
}