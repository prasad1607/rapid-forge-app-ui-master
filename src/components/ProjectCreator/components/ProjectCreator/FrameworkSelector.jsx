import React, { useState, useRef, useEffect } from 'react';
import './FrameworkSelector.css';
import { fetchFrameworkVersions, getFrameworksByLanguage } from '../../../../api/features/framework/frameworkApiService';


const FrameworkSelector = ({ projectData, setProjectData }) => {
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFrameworkOpen, setIsFrameworkOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isFetchingFrameworks, setIsFetchingFrameworks] = useState(false);
  const [isFetchingVersions, setIsFetchingVersions] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Handle clicking outside to close dropdowns
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFrameworkOpen(false);
        setIsVersionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchFrameworks = async () => {
      setLoading(true);
      try {
        const response = await getFrameworksByLanguage({
          langCode: projectData.languageId,
          page: 1,
          size: 5
        });
        // console.log('response', response);
        setFrameworks(response?.content);
      } catch (error) {
        console.error("Failed to fetch frameworks:", error);
      }
      setLoading(false);
    };
  
    if (projectData.languageId) {
      fetchFrameworks();
    }
  }, [projectData.languageId]);

  const handleFrameworkSelect = async (choosenFramework) => {
    if (choosenFramework.id === 'fetch-more') {
      fetchMoreFrameworks();
      return;
    }

    // const selectedFramework = await frameworkApi.getFrameworkById({ id: frameworkId });

    if (!choosenFramework) return;
    setSelectedFramework(choosenFramework);
    setProjectData(prev => ({
      ...prev,
      frameworkId: choosenFramework.frameCode,
      frameworkName: choosenFramework.frameName,
      frameworkVersion: '',
    }));
    setIsFrameworkOpen(false);
  };

  const handleVersionSelect = (versionObj) => {
    if (versionObj === 'fetch-more') {
      fetchMoreVersions();
      return;
    }

    setProjectData(prev => ({
      ...prev,
      frameworkVersion: versionObj.frameVersion
    }));
    setIsVersionOpen(false);
  };

  // const fetchMoreFrameworks = async () => {
  //   setIsFetchingFrameworks(true);
  //   try {
  //     const moreFrameworks = await frameworkApi.fetchMoreLanguages({ offset: frameworks.length, limit: 3 });
  //     setFrameworks(prev => [...prev, ...moreFrameworks]);
  //   } catch (error) {
  //     console.error("Failed to fetch more frameworks:", error);
  //   }
  //   setIsFetchingFrameworks(false);
  // };

  const fetchMoreFrameworks = async () => {
    setIsFetchingFrameworks(true);
    try {
      const { frameworks: moreFrameworks } = await getFrameworksByLanguage({
        langCode: projectData.languageId,
        page: Math.floor(frameworks.length / 5) + 1,
        size: 5
      });
      setFrameworks(prev => [...prev, ...moreFrameworks]);
    } catch (error) {
      console.error("Failed to fetch more frameworks:", error);
    }
    setIsFetchingFrameworks(false);
  };

  // const fetchMoreVersions = async () => {
  //   if (!projectData.frameworkId) return;

  //   setIsFetchingVersions(true);
  //   try {
  //     const newVersions = await frameworkApi.fetchLanguageVersions({ id: projectData.frameworkId, offset: 0, limit: 2 });

  //     setProjectData(prev => ({
  //       ...prev,
  //       frameworkVersions: [...(prev.frameworkVersions || []), ...newVersions]
  //     }));
  //   } catch (error) {
  //     console.error("Failed to fetch more versions:", error);
  //   }
  //   setIsFetchingVersions(false);
  // };

  const fetchMoreVersions = async () => {
    if (!projectData.frameworkId) return;
  
    setIsFetchingVersions(true);
    try {
      const newVersions = await fetchFrameworkVersions({
        id: projectData.frameworkId,
        offset: (projectData.frameworkVersions || []).length,
        limit: 3
      });
  
      setProjectData(prev => ({
        ...prev,
        frameworkVersions: [...(prev.frameworkVersions || []), ...newVersions]
      }));
    } catch (error) {
      console.error("Failed to fetch more versions:", error);
    }
    setIsFetchingVersions(false);
  };
  
console.log("frameworks",frameworks);
console.log("selectedFramework",selectedFramework)
  return (
    <div className="step-section" ref={dropdownRef}>
      <h2>Select Framework & Version</h2>

      {loading ? (
        <div className="loading-container">
          <span className="loader"></span>
          <p>Loading frameworks...</p>
        </div>
      ) : (
        <>
          {/* Framework dropdown */}
          <div className="framework-dropdown-container">
            <label>Framework:</label>
            <div className="custom-dropdown">
              <button
                className="dropdown-trigger"
                onClick={() => setIsFrameworkOpen(!isFrameworkOpen)}
                disabled={!projectData.languageId}
              >
                {projectData.frameworkName || 'Select a framework'}
              </button>

              {isFrameworkOpen && (
                <div className="dropdown-menu">
                  {frameworks.map(fw => (
                    <div
                      key={fw.id}
                      className="dropdown-item"
                      onClick={() => handleFrameworkSelect(fw)}
                    >
                      {fw?.frameName}
                    </div>
                  ))}
                  {!isFetchingFrameworks ? (
                    <div
                      className="dropdown-item fetch-more"
                      onClick={() => handleFrameworkSelect('fetch-more')}
                    >
                      Fetch More Frameworks
                    </div>
                  ) : (
                    <div className="dropdown-item loading">
                      <span className="loader"></span>
                      Loading more frameworks...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          
          {/* Version dropdown */}
          <div className="version-dropdown-container">
            <label>Version:</label>
            <div className="custom-dropdown">
              <button
                className="dropdown-trigger"
                onClick={() => setIsVersionOpen(!isVersionOpen)}
                disabled={!projectData.frameworkId}
              >
                {projectData.frameworkVersion || 'Select a version'}
              </button>

              {isVersionOpen && (
                <div className="dropdown-menu">
                  {(selectedFramework?.versions || []).map(ver => (
                    <div
                      key={ver.frameVerCode}
                      className="dropdown-item"
                      onClick={() => handleVersionSelect(ver)}
                    >
                      {ver.frameVersion}
                    </div>
                  ))}
                  {!isFetchingVersions ? (
                    <div
                      className="dropdown-item fetch-more"
                      onClick={() => handleVersionSelect('fetch-more')}
                    >
                      Fetch More Versions
                    </div>
                  ) : (
                    <div className="dropdown-item loading">
                      <span className="loader"></span>
                      Loading more versions...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Display selected framework and version */}
          {projectData.frameworkName && (
            <div className="selected-info">
              <p>
                <strong>Selected Framework:</strong> {projectData.frameworkName}
              </p>
              {projectData.frameworkVersion && (
                <p>
                  <strong>Selected Version:</strong> {projectData.frameworkVersion}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FrameworkSelector;
