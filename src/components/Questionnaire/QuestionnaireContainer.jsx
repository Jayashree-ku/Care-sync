import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import ReviewScreen from './ReviewScreen';
import { initialQuestionnaireData } from '../../data/questionnaireData';
import { savePatientDoctorVisitDraft } from '../../data/familyStore';

export default function QuestionnaireContainer({
  activePatient,
  onGenerateSummary,
  onBackToDashboard
}) {
  // Initialize form data from active patient's draft or defaults
  const [formData, setFormData] = useState(() => {
    if (activePatient?.draftDoctorVisit?.formData) {
      return { ...initialQuestionnaireData, ...activePatient.draftDoctorVisit.formData };
    }
    return { ...initialQuestionnaireData };
  });

  const [currentStep, setCurrentStep] = useState(() => {
    if (activePatient?.draftDoctorVisit?.step) {
      return activePatient.draftDoctorVisit.step;
    }
    return 1;
  });

  const [isReviewing, setIsReviewing] = useState(false);
  const [validationError, setValidationError] = useState('');



  // Save draft for this active patient
  useEffect(() => {
    if (activePatient?.id) {
      savePatientDoctorVisitDraft(activePatient.id, currentStep, formData);
    }
  }, [activePatient?.id, currentStep, formData]);

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
          return 'Please describe what you are currently experiencing before continuing.';
        }
        return '';
      case 2:
        if (!formData.whenNoticed || !formData.whenNoticed.trim()) {
          return 'Please select when you first noticed this before continuing.';
        }
        return '';
      default:
        // Questions 3 through 12 are optional per specification
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
      // Step 12 -> Review My Answers screen
      setIsReviewing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerGenerate = () => {
    onGenerateSummary(formData);
  };

  const patientName = activePatient?.fullName || 'Patient';
  const relationship = activePatient?.relationship || 'Self';

  return (
    <div className="questionnaire-wrapper">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--cs-primary-light)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cs-primary)', marginBottom: '0.5rem' }}>
            <span>Preparing Visit for: <strong>{patientName}</strong> ({relationship})</span>
          </div>
          <h1 className="page-title">Prepare for My Doctor Visit</h1>
          <p className="page-subtitle">
            Answer a few questions to organize what you&apos;re experiencing into a clear summary you can share with a doctor.
          </p>
        </div>
        {onBackToDashboard && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToDashboard}
            aria-label="Back to dashboard"
          >
            &larr; Back to Dashboard
          </button>
        )}
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
                <div className="validation-message" role="alert" style={{ marginTop: '1.25rem' }}>
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
              {/* On Question 1: Back is disabled */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </button>

              {/* On Questions 1-11: Continue | On Question 12: Review My Answers */}
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
