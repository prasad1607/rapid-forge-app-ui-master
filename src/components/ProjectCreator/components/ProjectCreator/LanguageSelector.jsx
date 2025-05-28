import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';
import languageApi from '../../../../api/features/language/languageApiService'; // Adjust if needed

const LanguageSelector = ({projectData, setProjectData }) => {
  const currentLanguage = {
    id: projectData.languageId,
    langName: projectData.languageName,
    version: projectData.languageVersion,
  }
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(projectData.languageVersion || '');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [languageOffset, setLanguageOffset] = useState(4);
  const [isFetchingLanguages, setIsFetchingLanguages] = useState(false);
  const [isFetchingVersions, setIsFetchingVersions] = useState(false);

  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const topLangs = await languageApi.getTopLanguages();
        console.log('topLangs', topLangs);
        setLanguages(topLangs.content);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
        setIsVersionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = async (lang) => {
    if (!lang) return;

    if (lang.id === 'fetch-more') {
      fetchMoreLanguages();
      return;
    }
    console.log('lang', lang)
    setSelectedLanguage(lang);
    setSelectedVersion('');
    console.log('lang.versions', lang.versions);
    setVersions(lang.versions || ['default']);
    setIsLanguageOpen(false);

    setProjectData(prev => ({
      ...prev,
      languageId: lang.langCode,
      languageName: lang.langName,
    }));
  };

  const handleVersionSelect = (ver) => {
    if (!ver) return;

    if (ver === 'fetch-more') {
      fetchMoreVersions();
      return;
    }

    setSelectedVersion(ver?.langVerCode);
    setIsVersionOpen(false);

    if (!selectedLanguage) return;

    setProjectData(prev => ({
      ...prev,
      languageVersion: ver?.langVerCode,
    }));

  };


  const fetchMoreLanguages = async () => {
    setIsFetchingLanguages(true);
    const more = await languageApi.fetchMoreLanguages({ offset: languageOffset, limit: 2 });
    setLanguages(prev => [...prev, ...more]);
    setLanguageOffset(prev => prev + more.length);
    setIsFetchingLanguages(false);
  };

  const fetchMoreVersions = async () => {
    if (!selectedLanguage) return;
    setIsFetchingVersions(true);
    const more = await languageApi.fetchLanguageVersions({
      id: selectedLanguage.id,
      offset: versions.length,
      limit: 2
    });
    setVersions(prev => [...prev, ...more]);
    setIsFetchingVersions(false);
  };
  console.log('selectedLanguage', selectedLanguage)
  return (
    <div className="step-section" ref={dropdownRef}>
      <h2>Select Programming Language</h2>

      {/* Language Dropdown */}
      <div className="language-dropdown-container">
        <label>Language:</label>
        <div className="custom-dropdown">
          <button
            className="dropdown-trigger"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            {selectedLanguage?.langName || 'Select a language'}
          </button>
          {isLanguageOpen && (
            <div className="dropdown-menu">
              {languages.map(lang => (
                <div
                  key={lang.langCode}
                  className="dropdown-item"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang.langName}
                </div>
              ))}
              {!isFetchingLanguages ? (
                <div
                  className="dropdown-item fetch-more"
                  onClick={() => handleLanguageSelect('fetch-more')}
                >
                  Fetch More Languages
                </div>
              ) : (
                <div className="dropdown-item loading">
                  <span className="loader"></span> Loading...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Version Dropdown */}
      <div className="version-dropdown-container">
        <label>Version:</label>
        <div className="custom-dropdown">
          <button
            className="dropdown-trigger"
            onClick={() => setIsVersionOpen(!isVersionOpen)}
            disabled={!selectedLanguage}
          >
            {selectedVersion || 'Select a version'}
          </button>
          {isVersionOpen && (
            <div className="dropdown-menu">
              {versions.map((ver) => (
                <div
                  key={ver?.langVerCode}
                  className="dropdown-item"
                  onClick={() => handleVersionSelect(ver)}
                >
                  {ver?.langVersion}
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
                  <span className="loader"></span> Loading...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Info */}
      {selectedLanguage && (
        <div className="selected-info">
          <p>
            <strong>Selected Language:</strong> {selectedLanguage?.langName}
          </p>
          {selectedVersion && (
            <p>
              <strong>Selected Version:</strong> {selectedVersion}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
