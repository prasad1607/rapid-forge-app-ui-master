import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import ProjectCreator from './components/ProjectCreator/components/ProjectCreator/ProjectCreator';
import ChatAssistantApp from './components/ChatAssistant/src/ChatAssistantApp';
import ProjectTemplates from './components/Templates/ProjectTemplates';
import ClassDiagramApp from './components/LldDesigner/src/ClassDiagramApp';
import ERDiagramApp from './components/DBdesigner/Erdrawer/ERDiagramApp';
import Home from './components/Home/Home';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import LoginPage from './components/Login/LoginPage';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);  // Track login status

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          {isLoggedIn ? (  // Check if logged in
            <>
              <Header
                toggleSidebar={toggleSidebar}
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
              />
              <div className="app-container">
                <Sidebar collapsed={sidebarCollapsed} />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                    <Route path="/create_project" element={<ProjectCreator />} />
                    <Route path="/lld_designer" element={<ClassDiagramApp />} />
                    <Route path="/erd_designer" element={<ERDiagramApp />} />
                    <Route path="/templates" element={<ProjectTemplates />} />
                    <Route path="/history" element={<div>History Page</div>} />
                    <Route path="/settings" element={<div>Settings Page</div>} />
                  </Routes>
                </main>
              </div>

              {/* Floating Chat Assistant Button */}
              {/* <button className="chat-assistant-button" onClick={toggleChat}>
                {showChat ? 'Close Chat' : 'Chat Assistant'}
              </button> */}

              {/* Floating Chat Window */}
              {showChat && (
                <div className="chat-assistant-popup">
                  <ChatAssistantApp />
                </div>
              )}
            </>
          ) : (
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginPage/>} />
            </Routes>
          )}
        </div>
      </Router>
    </Provider>
  );
};

export default App;
