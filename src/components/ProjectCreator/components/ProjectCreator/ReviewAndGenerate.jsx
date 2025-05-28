import React from 'react';
import './ReviewAndGenerate.css';

const ReviewAndGenerate = ({ projectData }) => {
  return (
    <div className="step-section">
      <h2>Review Your Project</h2>
      <pre className="review-box">
        {JSON.stringify(projectData, null, 2)}
      </pre>
    </div>
  );
};

export default ReviewAndGenerate;
