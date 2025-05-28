import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}