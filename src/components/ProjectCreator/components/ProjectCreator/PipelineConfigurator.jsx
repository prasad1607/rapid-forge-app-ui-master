import React, { useState } from 'react';
import './PipelineConfigurator.css';

const PipelineConfigurator = ({ projectData, setProjectData }) => {
  const allPipelines = ['GitHub Actions', 'Jenkins', 'GitLab CI'];

  const [selectedPipelines, setSelectedPipelines] = useState(projectData.pipelines || []);

  const handleTogglePipeline = (pipeline) => {
    const updated = selectedPipelines.includes(pipeline)
      ? selectedPipelines.filter(p => p !== pipeline)
      : [...selectedPipelines, pipeline];

    setSelectedPipelines(updated);
    setProjectData(prev => ({ ...prev, pipelines: updated }));
  };

  return (
    <div className="step-section">
      <h2>Configure Pipelines (Optional)</h2>
      <div className="pipeline-options">
        {allPipelines.map(pipe => (
          <button
            key={pipe}
            className={selectedPipelines.includes(pipe) ? 'pipeline-card selected' : 'pipeline-card'}
            onClick={() => handleTogglePipeline(pipe)}
          >
            {pipe}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PipelineConfigurator;
