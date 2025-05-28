// import React, { useState, useEffect } from 'react';
// import './BuildToolSelector.css';
// import {
//   fetchAllBuildTools,
//   getBuildToolCategories,
//   getToolsByCategory,
//   getVersionsForTool
// } from '../../../../api/features/build-tool/buildToolApiService';

// const BuildToolSelector = ({ projectData, setProjectData }) => {
//   const [allBuildTools, setAllBuildTools] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedTool, setSelectedTool] = useState(projectData.buildTool || '');
//   const [selectedVersion, setSelectedVersion] = useState(projectData.buildToolVersion || '');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetching the build tools data from API
//   useEffect(() => {
//     const loadBuildTools = async () => {
//       try {
//         const data = await fetchAllBuildTools('LANG_JAVA','FRAME_SPRING');
//         setAllBuildTools(data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load build tools');
//         setLoading(false);
//       }
//     };
//     loadBuildTools();
//   }, []);

//   const categories = getBuildToolCategories(allBuildTools);
//   const availableTools = getToolsByCategory(allBuildTools, selectedCategory);
//   const availableVersions = getVersionsForTool(allBuildTools, selectedCategory, selectedTool);

//   const handleCategoryChange = (e) => {
//     const newCategory = e.target.value;
//     setSelectedCategory(newCategory);
//     setSelectedTool('');
//     setSelectedVersion('');
//     setProjectData(prev => ({
//       ...prev,
//       buildTool: '',
//       buildToolVersion: ''
//     }));
//   };

//   const handleToolSelect = (tool) => {
//     setSelectedTool(tool);
//     setSelectedVersion('');
//     setProjectData(prev => ({
//       ...prev,
//       buildTool: tool,
//       buildToolVersion: ''
//     }));
//   };

//   const handleVersionChange = (e) => {
//     const version = e.target.value;
//     setSelectedVersion(version);
//     setProjectData(prev => ({
//       ...prev,
//       buildToolVersion: version
//     }));
//   };

//   // Error and Loading state
//   if (loading) {
//     return <p>Loading build tools...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="step-section">
//       <h2>Select Build Tool</h2>

//       {/* Category Selector */}
//       <div className="input-group">
//         <label>Category</label>
//         <select value={selectedCategory} onChange={handleCategoryChange}>
//           <option value="">Select category</option>
//           {categories.map(category => (
//             <option key={category} value={category}>{category}</option>
//           ))}
//         </select>
//       </div>

//       {/* Build Tool Selector */}
//       {selectedCategory && (
//         <div className="build-tool-selector">
//           <h3>Select Build Tool</h3>
//           <div className="options-grid">
//             {availableTools.map(tool => (
//               <button
//                 key={tool}
//                 className={selectedTool === tool ? 'build-tool-button selected' : 'build-tool-button'}
//                 onClick={() => handleToolSelect(tool)}
//               >
//                 {tool}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Version Selector */}
//       {selectedTool && (
//         <div className="input-group">
//           <label>Version</label>
//           <select value={selectedVersion} onChange={handleVersionChange}>
//             <option value="">Select version</option>
//             {availableVersions.map(version => (
//               <option key={version} value={version}>{version}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Show Selected Tool and Version */}
//       <div className="selected-build-tool">
//         <h3>Selected Build Tool</h3>
//         {selectedTool ? (
//           <p>{selectedTool} - Version: {selectedVersion || 'N/A'}</p>
//         ) : (
//           <p>No build tool selected</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BuildToolSelector;


import React, { useState, useEffect } from 'react';
import './BuildToolSelector.css';
import { fetchAllBuildTools } from '../../../../api/features/build-tool/buildToolApiService';

const BuildToolSelector = ({ projectData, setProjectData }) => {
  const [buildTools, setBuildTools] = useState([]);
  const [selectedToolCode, setSelectedToolCode] = useState(projectData.buildTool || '');
  const [selectedVersion, setSelectedVersion] = useState(projectData.buildToolVersion || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch build tools on mount
  // useEffect(() => {
  //   const loadBuildTools = async () => {
  //     try {
  //       const response = await fetchAllBuildTools('LANG_JAVA', 'FRAME_SPRING');
  //       setBuildTools(response.content || []);
  //     } catch (err) {
  //       console.error('Failed to load build tools:', err);
  //       setError('Failed to load build tools');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadBuildTools();
  // }, []);


  useEffect(() => {
    const loadBuildTools = async () => {
      if (!projectData.languageId || !projectData.frameworkId) {
        console.warn('Missing langCode or frameCode for build tools');
        return;
      }
  
      try {
        setLoading(true);
        const response = await fetchAllBuildTools(projectData.languageId, projectData.frameworkId);
        setBuildTools(response.content || []);
      } catch (err) {
        console.error('Failed to load build tools:', err);
        setError('Failed to load build tools');
      } finally {
        setLoading(false);
      }
    };
  
    loadBuildTools();
  }, [projectData.languageId, projectData.frameworkId]);
  
  // Find selected build tool object
  const selectedTool = buildTools.find(tool => tool.buildToolsCode === selectedToolCode);
  const availableVersions = selectedTool?.versions || [];

  const handleToolChange = (e) => {
    const toolCode = e.target.value;
    setSelectedToolCode(toolCode);
    setSelectedVersion('');
    setProjectData(prev => ({
      ...prev,
      buildTool: toolCode,
      buildToolVersion: ''
    }));
  };

  const handleVersionChange = (e) => {
    const version = e.target.value;
    setSelectedVersion(version);
    setProjectData(prev => ({
      ...prev,
      buildToolVersion: version
    }));
  };
  
  if (loading) return <p>Loading build tools...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="step-section">
      <h2>Select Build Tool</h2>

      {/* Build Tool Selector */}
      <div className="input-group">
        <label>Build Tool</label>
        <select value={selectedToolCode} onChange={handleToolChange}>
          <option value="">Select build tool</option>
          {buildTools.map(tool => (
            <option key={tool.buildToolsCode} value={tool.buildToolsCode}>
              {tool.buildToolsName}
            </option>
          ))}
        </select>
      </div>

      {/* Version Selector */}
      {selectedToolCode && (
        <div className="input-group">
          <label>Version</label>
          <select value={selectedVersion} onChange={handleVersionChange}>
            <option value="">Select version</option>
            {availableVersions.map((version, i) => {
  const versionLabel = version.buildVer || version.buildVersion || `Version ${i + 1}`;
  return (
    <option key={version.buildToolVerCode || i} value={versionLabel}>
      {versionLabel}
    </option>
  );
})}

          </select>
        </div>
      )}

      {/* Summary */}
      <div className="selected-build-tool">
        <h3>Selected Build Tool</h3>
        {selectedToolCode ? (
          <p>
            {selectedTool?.buildToolsName || selectedToolCode} - Version: {selectedVersion || 'N/A'}
          </p>
        ) : (
          <p>No build tool selected</p>
        )}
      </div>
    </div>
  );
};

export default BuildToolSelector;
