import React from 'react';
import './ProgressStepper.css';

const ProgressStepper = ({ steps, currentStep, goToStep }) => {
  return (
    <div className="progress-stepper">
      {steps.map((step, index) => (
        <div key={index} className="step-item">
          
          {/* Make the step-circle a button */}
          <button
            className={`step-circle ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
            onClick={() => goToStep(index + 1)}
          >
            {currentStep > index + 1 ? '✔' : index + 1}
          </button>

          <div className="step-label">{step.name}</div>

          {/* Line connecting steps (not for the last item) */}
          {index !== steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressStepper;
