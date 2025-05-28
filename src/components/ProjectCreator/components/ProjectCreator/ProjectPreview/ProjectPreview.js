// components/ProjectCreator/components/ProjectPreview.js

import React from 'react';
import './ProjectPreview.css';

const ProjectPreview = ({ projectData }) => {
  // Destructure the properties with default values in case of null or undefined
  const {
    language = {},
    framework = {},
    frameworkVersion = 'N/A',
    projectName = 'N/A',
    groupId = 'N/A',
    artifactId = 'N/A',
    author = 'N/A',
    dependencies = [],
    plugins = [],
    buildTool = 'N/A',
    pipelines = []
  } = projectData || {}; // In case projectData is null or undefined

  // Safe access to nested properties using optional chaining (?.)
  const languageName = language?.name || 'N/A';
  const frameworkName = framework?.name || 'N/A';
  const frameworkVersionValue = frameworkVersion || 'N/A';

  return (
    <div className="project-preview">
      <h2>Project Preview</h2>

      <div className="preview-section">
        <strong>Language:</strong> {languageName}
      </div>
      <div className="preview-section">
        <strong>Framework:</strong> {frameworkName}
      </div>
      <div className="preview-section">
        <strong>Framework Version:</strong> {frameworkVersionValue}
      </div>
      <div className="preview-section">
        <strong>Project Name:</strong> {projectName}
      </div>
      <div className="preview-section">
        <strong>Group ID:</strong> {groupId}
      </div>
      <div className="preview-section">
        <strong>Artifact ID:</strong> {artifactId}
      </div>
      <div className="preview-section">
        <strong>Author:</strong> {author}
      </div>

      <div className="selected-dependencies">
        <h3>Selected Dependencies</h3>
        {dependencies?.length === 0 ? (
          <p>No dependencies selected</p>
        ) : (
          <ul className="dependency-list">
            {dependencies?.map((dep, index) => (
              <li key={index}>
                {dep?.name || 'Unnamed Dependency'} - {dep?.version || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="selected-plugins">
        <h3>Selected Plugins</h3>
        {plugins?.length === 0 ? (
          <p>No plugins selected</p>
        ) : (
          <ul className="plugin-list">
            {plugins?.map((plugin, index) => (
              <li key={index}>
                {plugin?.name || 'Unnamed Plugin'} - {plugin?.version || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="preview-section">
        <strong>Build Tool:</strong> {buildTool || 'N/A'}
      </div>
      
      <div className="preview-section">
        <strong>Pipelines:</strong> {pipelines?.length > 0 ? pipelines.join(', ') : 'None'}
      </div>
    </div>
  );
};

export default ProjectPreview;
