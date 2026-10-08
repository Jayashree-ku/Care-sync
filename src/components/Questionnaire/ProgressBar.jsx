import React from 'react';

export default function ProgressBar({ currentStep, totalSteps = 12 }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-step-text">
          Question {currentStep} of {totalSteps}
        </span>
        <span className="progress-percent-text">
          {percentage}% completed
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
