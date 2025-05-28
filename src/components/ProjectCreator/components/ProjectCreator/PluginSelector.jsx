import React, { useState, useEffect } from 'react';
import './PluginSelector.css';

const PluginSelector = ({ projectData, setProjectData }) => {
  const [allCategories, setAllCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlugins, setSelectedPlugins] = useState(projectData.plugins || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('');

  useEffect(() => {
    const fetchPluginData = async () => {
      try {
        const response = await fetch('/api/plugins'); // Replace with your API endpoint
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error('Error fetching plugin data:', error);
        // Hardcoding data for testing in case the API fails
        setAllCategories({
          "Build Tools": [
            { "name": "Docker Plugin", "versions": ["1.0", "2.0", "latest"] },
            { "name": "SonarQube Plugin", "versions": ["1.0", "1.5", "2.0"] }
          ],
          "API": [
            { "name": "Swagger Plugin", "versions": ["1.0", "2.0"] }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPluginData();
  }, []);

  const handleTogglePlugin = (pluginName, version) => {
    const plugin = Object.values(allCategories).flat().find(p => p.name === pluginName);
    if (!plugin) return;

    const exists = selectedPlugins.some(p => p.name === pluginName);
    let updatedPlugins;

    if (exists) {
      updatedPlugins = selectedPlugins.filter(p => p.name !== pluginName);
    } else {
      updatedPlugins = [...selectedPlugins, { name: pluginName, version }];
    }

    setSelectedPlugins(updatedPlugins);
    setProjectData(prev => ({ ...prev, plugins: updatedPlugins }));
  };

  const handleRemovePlugin = (pluginName) => {
    const updatedPlugins = selectedPlugins.filter(p => p.name !== pluginName);
    setSelectedPlugins(updatedPlugins);
    setProjectData(prev => ({ ...prev, plugins: updatedPlugins }));
  };

  const getVersionsForPlugin = (pluginName) => {
    const plugin = Object.values(allCategories).flat().find(p => p.name === pluginName);
    return plugin ? plugin.versions : [];
  };

  // Filter plugins based on category and search term
  const allPlugins = Object.values(allCategories).flat();
  const filteredPlugins = allPlugins.filter(plugin => {
    const matchesCategory = !selectedCategory || allCategories[selectedCategory]?.includes(plugin);
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="step-section">Loading plugins...</div>;
  }

  return (
    <div className="step-section">
      <h2>Select Plugins</h2>

      {/* Category Selector */}
      <div className="input-group">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedPlugin(null);
            setSelectedVersion('');
          }}
        >
          <option value="">All Categories</option>
          {Object.keys(allCategories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Search Bar */}
      <div className="input-group">
        <label>Search Plugins</label>
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search plugins..."
        />
      </div>

      {/* Plugin Dropdown */}
      <div className="input-group">
        <label>Select Plugin</label>
        <select
          value={selectedPlugin}
          onChange={(e) => {
            setSelectedPlugin(e.target.value);
            setSelectedVersion('');
          }}
        >
          <option value="">Select a plugin</option>
          {filteredPlugins.map(plugin => (
            <option key={plugin.name} value={plugin.name}>{plugin.name}</option>
          ))}
        </select>
      </div>

      {/* Version Dropdown */}
      <div className="input-group">
        <label>Select Version</label>
        <select
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          disabled={!selectedPlugin}
        >
          <option value="">Select version</option>
          {getVersionsForPlugin(selectedPlugin).map(version => (
            <option key={version} value={version}>{version}</option>
          ))}
        </select>
      </div>

       {/* Add Plugin Button */}
       <button
        className="add-plugin-btn"
        onClick={() => handleTogglePlugin(selectedPlugin, selectedVersion)}
        disabled={!selectedPlugin || !selectedVersion}
      >
        Add Plugin
      </button>
      {/* Show Selected Plugins */}
      <div className="selected-plugins">
        <h3>Selected Plugins</h3>
        {selectedPlugins.length === 0 ? (
          <p>No plugins selected</p>
        ) : (
          <ul className="plugin-list">
            {selectedPlugins.map((plugin, index) => (
              <li key={index}>
                <div className="plugin-item">
                  <span>{plugin.name} (Version: {plugin.version})</span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemovePlugin(plugin.name)}
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default PluginSelector;