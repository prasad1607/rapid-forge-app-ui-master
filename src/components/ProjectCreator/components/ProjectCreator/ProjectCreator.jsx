import React, { useEffect, useState } from 'react';
import './ProjectCreator.css';
import ProgressStepper from '../common/ProgressStepper';
import LanguageSelector from './LanguageSelector';
import FrameworkSelector from './FrameworkSelector';
import ProjectDetailsForm from './ProjectDetailsForm';
import DependencySelector from './DependencySelector';
import BuildToolSelector from './BuildToolSelector';
import ReviewAndGenerate from './ReviewAndGenerate';
import ChatAssistantApp from '../../project-ai-assistant/ChatAssistant/src/ChatAssistantApp';

const ProjectCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [projectData, setProjectData] = useState({
    projectDescritption: '',
    languageName: '',
    languageId: '',
    languageVersion: '',
    frameworkId: '',
    frameworkName: '',
    frameworkVersion: '',
    projectName: '',
    groupId: '',
    artifactId: '',
    author: '',
    dependencies: [],
    plugins: [],
    buildTool: '',
    pipelines: []
  });
  
  useEffect(() => {
    console.log('Project Data Updated:', projectData);
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [projectData]);
  
  const steps = [
    { id: 1, name: 'Language' },
    { id: 2, name: 'Framework' },
    { id: 3, name: 'Project Details' },
    { id: 4, name: 'Dependencies' },
    { id: 5, name: 'Build Tool' },
    { id: 6, name: 'Review & Generate' }
    // { id: 7, name: 'Plugins' },
    // { id: 8, name: 'Pipelines' },
  ];

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step: Generate the project
      handleGenerateProject();
    }
  };

  const handleGenerateProject = () => {
    console.log('Generating Project...', projectData);
    alert('Project generated! (Simulated)');
    // Later: Call backend API here
  };

  const goToStep = (step) => {
    for(let i=1;i<step;i++) {
      if(!isStepValid(i) ) {
        return;
      }
    }
    setCurrentStep(step);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1: // Language
        return projectData.languageName !=='';
  
      case 2: // Framework
        return projectData.frameworkName !== '';
  
      case 3: // Project Details
        const isJava = projectData.languageName?.toLowerCase() === 'java';
        return (
          projectData.projectName &&
          projectData.author &&
          (!isJava || (projectData.groupId && projectData.artifactId))
        );
  
      case 4: // Dependencies
        return Array.isArray(projectData.dependencies); // can be empty
  
      case 5: // Build Tool
        return projectData.buildTool !== '';
  
      case 6: // Review step – always valid
        return true;
  
      default:
        return false;
    }
  };
  

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <LanguageSelector projectData={projectData} setProjectData={setProjectData} />;
      case 2:
        return <FrameworkSelector projectData={projectData} setProjectData={setProjectData} />;
      case 3:
        return <ProjectDetailsForm projectData={projectData} setProjectData={setProjectData} />;
      case 4:
        return <DependencySelector projectData={projectData} setProjectData={setProjectData} />;
      case 5:
        return <BuildToolSelector projectData={projectData} setProjectData={setProjectData} />;
      case 6:
        return <ReviewAndGenerate projectData={projectData} />;
      // case 7:
      //   return <PluginSelector projectData={projectData} setProjectData={setProjectData} />;
      // case 8:
      //   return <PipelineConfigurator projectData={projectData} setProjectData={setProjectData} />;
      default:
        return null;
    }
  };

  return (
    <div className="content-container">
      <div className="project-creator">
        <h1 className="creator-title">Create a New Project</h1>

        <div className="stepper-container">
          <ProgressStepper steps={steps} currentStep={currentStep} goToStep={goToStep} />
        </div>

        <div className="step-content">
          {renderCurrentStep()}
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNextStep}
            disabled={!isStepValid(currentStep)}
          >
            {currentStep === steps.length ? 'Generate Project' : 'Next'}
          </button>
        </div>


      </div>
      <div className='ai-assistant'>
        <ChatAssistantApp
          currentStep={currentStep}
          steps={steps}
          projectData={projectData}
        />
      </div>
      {/* Right Section - Preview */}
      {/* <div className="preview-section">
        <ProjectPreview projectData={projectData} />
      </div> */}
    </div>
  );
};

export default ProjectCreator;
