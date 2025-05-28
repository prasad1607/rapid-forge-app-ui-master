
import React, { useState, useEffect } from 'react';
import './DependencySelector.css';
import { fetchDependencies } from '../../../../api/features/dependency/dependencyApiService';

const DependencySelector = ({ projectData, setProjectData }) => {
  const [allDependencies, setAllDependencies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDependency, setSelectedDependency] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [selectedDeps, setSelectedDeps] = useState(projectData.dependencies || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDependencies = async () => {
      if (!projectData.languageId || !projectData.frameworkId) {
        console.warn('Missing langCode or frameCode:', projectData.languageId, projectData.frameworkId);
        return;
      }
      try {
        const response = await fetchDependencies(
          projectData.languageId,
          projectData.frameworkId,
          1,
          100
        );
        setAllDependencies(response.content || []);
      } catch (error) {
        console.error('Failed to load dependencies:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadDependencies();
  }, [projectData.languageId, projectData.frameworkId]);
  

  // Extract unique categories
  const categories = [...new Set(allDependencies.map(dep => dep.dependCategory || 'General'))];

  // Filter dependencies
  const filteredDependencies = allDependencies.filter(dep => {
    if (searchTerm) {
      return dep.dependName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (selectedCategory) {
      return (dep.dependCategory || 'General') === selectedCategory;
    }
    return true;
  });

  const getVersionsForDependency = (depName) => {
    const found = allDependencies.find(dep => dep.dependName === depName);
    if (!found) return [];
    return found.versions.length ? found.versions : [found.version];
  };

  const handleAddDependency = () => {
    if (selectedDependency && selectedVersion) {
      const newDep = { name: selectedDependency, version: selectedVersion };
      const updatedDeps = [...selectedDeps, newDep];
      setSelectedDeps(updatedDeps);
      setProjectData(prev => ({ ...prev, dependencies: updatedDeps }));

      setSelectedDependency('');
      setSelectedVersion('');
    }
  };

  const handleRemoveDependency = (index) => {
    const updatedDeps = selectedDeps.filter((_, i) => i !== index);
    setSelectedDeps(updatedDeps);
    setProjectData(prev => ({ ...prev, dependencies: updatedDeps }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('');
    setSelectedDependency('');
    setSelectedVersion('');
  };

  return (
    <div className="step-section">
      <h2>Select Dependencies</h2>

      {loading ? (
        <p>Loading dependencies...</p>
      ) : (
        <>
          <div className="dependency-select-container">
            {/* Search Box */}
            <div className="input-group">
              <label>Search Dependencies</label>
              <input
                type="text"
                placeholder="Search dependencies"
                value={searchTerm}
                onChange={handleSearch}
                className="dependency-search-input"
              />
            </div>

            {/* Category Selector */}
            <div className="input-group">
              <label>Category (Optional)</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSearchTerm('');
                  setSelectedDependency('');
                  setSelectedVersion('');
                }}
                className="category-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Dependency Selector */}
            <div className="input-group">
              <label>Dependency</label>
              <select
                value={selectedDependency}
                onChange={(e) => {
                  setSelectedDependency(e.target.value);
                  setSelectedVersion('');
                }}
                className="dependency-select"
                disabled={!filteredDependencies.length}
              >
                <option value="">Select dependency</option>
                {filteredDependencies.map(dep => (
                  <option key={dep.dependCode} value={dep.dependName}>
                    {dep.dependName}
                  </option>
                ))}
              </select>
            </div>

            {/* Version Selector */}
            <div className="input-group">
              <label>Version</label>
              <select
             value={selectedVersion}
             onChange={(e) => setSelectedVersion(e.target.value)}
             className="version-select"
             disabled={!selectedDependency}
           >
             <option value="">Select version</option>
             {getVersionsForDependency(selectedDependency).map((v, i) => {
               const versionLabel = typeof v === 'string' ? v :
                                    v?.buildVer || v?.version || v?.buildVersion || `Version ${i + 1}`;
               return (
                 <option key={i} value={versionLabel}>
                   {versionLabel}
                 </option>
               );
             })}
           </select>
            </div>
          </div>

          {/* Add Button */}
          {selectedDependency && selectedVersion && (
            <div className="add-btn-container">
              <button className="add-btn" onClick={handleAddDependency}>
                Add Dependency
              </button>
            </div>
          )}

          {/* Selected Dependencies */}
          <div className="selected-dependencies">
            <h3>Selected Dependencies</h3>
            {selectedDeps.length === 0 ? (
              <p>No dependencies selected</p>
            ) : (
              <ul className="dependency-list">
                {selectedDeps.map((dep, index) => (
                  <li key={index} className="dependency-item">
                    {dep.name} - {dep.version}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveDependency(index)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DependencySelector;

