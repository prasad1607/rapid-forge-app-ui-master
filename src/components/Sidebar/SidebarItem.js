import React from 'react';
import './SidebarItem.css';
import { DashboardIcon, TemplateIcon, ProjectIcon, ReportIcon, SettingIcon } from '../Icons/Icons';

const SidebarItem = ({ icon, label, color, active, collapsed }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'dashboard':
        return <DashboardIcon color={color} />;
      case 'template':
        return <TemplateIcon color={color} />;
      case 'create_project':
        return <ProjectIcon color={color} />;
      case 'history':
        return <ReportIcon color={color} />;
      case 'setting':
        return <SettingIcon color={color} />;
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar-item ${active ? 'active' : ''}`}>
      <div className="icon-container">
        {renderIcon()}
      </div>
      {!collapsed && <span className="item-label">{label}</span>}
    </div>
  );
};

export default SidebarItem;
