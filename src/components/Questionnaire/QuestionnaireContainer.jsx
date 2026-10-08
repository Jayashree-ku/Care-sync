import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import ReviewScreen from './ReviewScreen';
import {
  loadQuestionnaireData,
  saveQuestionnaireData,
  loadSavedStep,
  saveCurrentStep
} from '../../data/questionnaireData';

export default function QuestionnaireContainer({ onGenerateSummary, onBackToDashboard }) {
  const [formData, setFormData] = useState(() => loadQuestionnaireData());
  const [currentStep, setCurrentStep] = useState(() => loadSavedStep());
  const [isReviewing, setIsReviewing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Persist formData on change
  useEffect(() => {
    saveQuestionnaireData(formData);
  }, [formData]);

  // Persist currentStep on change
  useEffect(() => {
    if (!isReviewing) {
      saveCurrentStep(currentStep);
    }
  }, [currentStep, isReviewing]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (validationError) {
      setValidationError('');
    }
  };

  const handleFileSelect = (fileMeta) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocument: fileMeta
    }));
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({
      ...prev,
      attachedDocument: null
    }));
  };

  const validateCurrentStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.currentSymptoms || !formData.currentSymptoms.trim()) {
          return 'Please describe what you are currently experiencing to continue.';
        }
        return '';
      case 2:
        if (!formData.whenNoticed) {
          return 'Please select when you first noticed these symptoms.';
        }
        return '';
      case 3:
        if (!formData.frequency) {
          return 'Please select how often this happens.';
        }
        return '';
      case 4:
        if (!formData.timingOptions || formData.timingOptions.length === 0) {
          return 'Please select at least one time or situation when this usually happens.';
        }
        return '';
      case 5:
        if (!formData.dailyImpact || !formData.dailyImpact.trim()) {
          return 'Please describe how this is affecting you or select a suggestion chip.';
        }
        return '';
      case 6:
        if (!formData.experiencedBefore) {
          return 'Please indicate whether you have experienced this before.';
        }
        return '';
      case 7:
        if (!formData.takenMedication) {
          return 'Please indicate whether you have taken anything for this.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleContinue = () => {
    const error = validateCurrentStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');

    if (currentStep < 12) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 12 -> Review screen
      setIsReviewing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBackToDashboard();
    }
  };

  const handleEditStepFromReview = (stepNumber) => {
    setIsReviewing(false);
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToQuestions = () => {
    setIsReviewing(false);
    setCurrentStep(12);
  };

  const handleTriggerGenerate = () => {
    onGenerateSummary(formData);
  };

  return (
    <div className="questionnaire-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Prepare for My Doctor Visit</h1>
        <p className="page-subtitle">
          Answer a few questions to organize what you're experiencing into a clear summary you can share with a doctor.
        </p>
      </div>

      <div className="cs-card">
        {isReviewing ? (
          <ReviewScreen
            formData={formData}
            onEditStep={handleEditStepFromReview}
            onGenerateSummary={handleTriggerGenerate}
            onBackToQuestions={handleBackToQuestions}
          />
        ) : (
          <div>
            <ProgressBar currentStep={currentStep} totalSteps={12} />

            <div style={{ minHeight: '260px' }}>
              <QuestionStep
                step={currentStep}
                formData={formData}
                onChange={handleFieldChange}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                validationError={validationError}
              />

              {validationError && (
                <div className="validation-message" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                {currentStep === 1 ? 'Back to Dashboard' : 'Back'}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinue}
              >
                {currentStep === 12 ? 'Review My Answers' : 'Continue'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
