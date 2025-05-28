import React, { createContext, useContext } from 'react';
import useProjectState from '../hooks/useProjectState';

// Create context
const ProjectContext = createContext();

/**
 * Provider component for project state
 * @param {Object} props 
 * @returns {JSX.Element} Context Provider
 */
export const ProjectProvider = ({ children }) => {
  const projectState = useProjectState();
  
  return (
    <ProjectContext.Provider value={projectState}>
      {children}
    </ProjectContext.Provider>
  );
};

/**
 * Hook to use project context
 * @returns {Object} Project context
 */
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
