import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import SidebarItem from './SidebarItem';

const Sidebar = ({ collapsed }) => {
  const location = useLocation(); // <-- To detect current URL path

  const sidebarItems = [
    { id: 'create_project', icon: 'create_project', label: 'Create Project', color: '#3B82F6' },
    { id: 'lld_Designer', icon: 'setting', label: 'LLD Designer', color: '#EF4444' },
    { id: 'erd_designer', icon: 'dashboard', label: 'DB Designer', color: '#EF4444' },
    { id: 'templates', icon: 'template', label: 'Templates', color: '#F59E0B' },
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', color: '#10B981' },
    { id: 'history', icon: 'history', label: 'History', color: '#9333EA' },
    { id: 'settings', icon: 'setting', label: 'Settings', color: '#EF4444' }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {sidebarItems.map(item => (
          <Link key={item.id} to={`/${item.id}`} style={{ textDecoration: 'none' }}>
            <SidebarItem
              icon={item.icon}
              label={item.label}
              color={item.color}
              active={location.pathname.includes(item.id)} // <-- highlight active item
              collapsed={collapsed}
            />
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
