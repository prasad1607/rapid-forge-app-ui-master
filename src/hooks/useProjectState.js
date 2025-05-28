import { useState } from 'react';

/**
 * Custom hook for managing project creation state
 * @returns {Object} Project state and methods
 */
const useProjectState = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    language: null,
    template: null,
    dependencies: [],
    version: '1.0.0',
    database: null,
    settings: {
      includeTests: true,
      buildTool: 'maven', // or 'gradle', 'npm', etc.
      packaging: 'jar',    // or 'war', etc.
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const updateProjectData = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateSettings = (setting, value) => {
    setProjectData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }));
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1: // Select Template
        if (!projectData.template) {
          newErrors.template = 'Please select a template';
        }
        break;
      case 2: // Configure Settings
        if (!projectData.name || projectData.name.trim() === '') {
          newErrors.name = 'Project name is required';
        }
        if (!projectData.language) {
          newErrors.language = 'Please select a language';
        }
        break;
      // Add validation for other steps as needed
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    return true;
  };

  const resetProject = () => {
    setProjectData({
      name: '',
      language: null,
      template: null,
      dependencies: [],
      version: '1.0.0',
      database: null,
      settings: {
        includeTests: true,
        buildTool: 'maven',
        packaging: 'jar',
      }
    });
    setCurrentStep(1);
    setErrors({});
  };

  return {
    projectData,
    currentStep,
    errors,
    updateProjectData,
    updateSettings,
    nextStep,
    prevStep,
    resetProject,
    validateCurrentStep
  };
};

export default useProjectState;