import React from 'react';
import './Header.css';
import Logo from '../Logo/Logo';

const Header = ({ toggleSidebar, searchQuery, onSearchChange }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="collapse-btn" onClick={toggleSidebar}>
          ≡
        </button>
        {/* <Logo /> */}
      </div>

      <div className="header-center">
        {/* <h1 className="header-title">Project Dashboard</h1> */}
        <Logo /> 
      </div>

      <div className="header-right">
        <div className="search-container">
          <input
            type="text"
            className="header-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="account-container">
          <div className="account-avatar">A</div>
          <span className="account-label">Account</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
