import React from 'react';

export const DashboardIcon = ({ color = '#10B981' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} stroke="#D1D5DB" strokeWidth="1"/>
    <path d="M6,8 L6,16 L18,16 L18,8 L6,8" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M4,10 L6,12 L18,12 L20,10" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
);

export const TemplateIcon = ({ color = '#F59E0B' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="12" height="12" fill={color} rx="3" stroke="#D1D5DB" strokeWidth="1"/>
    <path d="M8,8 L8,16 L16,16 L16,8 L8,8" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M8,12 L16,12" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
);

export const ProjectIcon = ({ color = '#3B82F6' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6,6 L18,6 L18,18 L6,18 Z" fill={color} stroke="#D1D5DB" strokeWidth="1"/>
    <path d="M10,6 L10,16 L14,16 L14,6 Z" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
);

export const ReportIcon = ({ color = '#9333EA' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} stroke="#D1D5DB" strokeWidth="1"/>
    <path d="M4,12 L20,12 L20,18 L4,18 Z" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M12,12 L12,18" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
);

export const SettingIcon = ({ color = '#EF4444' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="10" height="10" fill={color} rx="4" stroke="#D1D5DB" strokeWidth="1"/>
    <path d="M9,9 L15,9 L15,15 L9,15 Z" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
  </svg>
);