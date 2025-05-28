import React from 'react';
import './ProjectDetailsForm.css';

const ProjectDetailsForm = ({ projectData, setProjectData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  // Helper: Check if projectData.language is Java
  const isJavaBased = projectData.languageName && projectData.languageName.toLowerCase() === 'java';

  return (
    <div className="step-section">
      <h2>Project Details</h2>
      <form className="project-details-form">
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={projectData.projectName || ''}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Project Description"
          value={projectData.description || ''}
          onChange={handleChange}
        />

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={projectData.author || ''}
          onChange={handleChange}
        />

        <input
          type="text"
          name="version"
          placeholder="Version (e.g., 1.0.0)"
          value={projectData.version || ''}
          onChange={handleChange}
        />

        {isJavaBased && (
          <>
            <input
              type="text"
              name="groupId"
              placeholder="Group ID (e.g., com.example)"
              value={projectData.groupId || ''}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="artifactId"
              placeholder="Artifact ID (e.g., my-app)"
              value={projectData.artifactId || ''}
              onChange={handleChange}
              required
            />
          </>
        )}
      </form>
    </div>
  );
};

export default ProjectDetailsForm;
