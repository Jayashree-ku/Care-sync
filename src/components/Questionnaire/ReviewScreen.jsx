import React from 'react';

export default function ReviewScreen({ formData, onEditStep, onGenerateSummary, onBackToQuestions }) {
  const getDisplayTiming = () => {
    let list = Array.isArray(formData.timingOptions) ? [...formData.timingOptions] : [];
    if (formData.timingOther) {
      list = list.filter(t => t !== 'Other');
      list.push(`Other (${formData.timingOther})`);
    }
    return list.length > 0 ? list.join(', ') : 'Not specified';
  };

  const getDisplayMedication = () => {
    if (!formData.takenMedication) return 'Not answered';
    if (formData.takenMedication !== 'Yes') return formData.takenMedication;
    return `Yes: ${formData.medicationName || 'Name not provided'}` +
      (formData.medicationPrescribed ? ` • Prescribed: ${formData.medicationPrescribed}` : '') +
      (formData.medicationTiming ? ` • Taken: ${formData.medicationTiming}` : '') +
      (formData.medicationHelped ? ` • Helped: ${formData.medicationHelped}` : '');
  };

  const questionsList = [
    {
      step: 1,
      number: 'Question 1',
      title: 'Current Symptoms',
      value: formData.currentSymptoms || 'Not specified'
    },
    {
      step: 2,
      number: 'Question 2',
      title: 'When It Started',
      value: formData.whenNoticed || 'Not specified'
    },
    {
      step: 3,
      number: 'Question 3',
      title: 'Frequency',
      value: formData.frequency || 'Not specified',
      subValue: formData.frequencyDetails ? `Additional details: ${formData.frequencyDetails}` : null
    },
    {
      step: 4,
      number: 'Question 4',
      title: 'When It Usually Happens',
      value: getDisplayTiming(),
      subValue: formData.timingDetails ? `Additional details: ${formData.timingDetails}` : null
    },
    {
      step: 5,
      number: 'Question 5',
      title: 'Effect on Daily Life',
      value: formData.dailyImpact || 'Not specified'
    },
    {
      step: 6,
      number: 'Question 6',
      title: 'Previous Occurrences',
      value: formData.experiencedBefore || 'Not specified',
      subValue: formData.experiencedBefore === 'Yes' && formData.previousDetails ? `Details: ${formData.previousDetails}` : null
    },
    {
      step: 7,
      number: 'Question 7',
      title: 'Medications Taken for This',
      value: getDisplayMedication()
    },
    {
      step: 8,
      number: 'Question 8',
      title: 'Regular Medications',
      value: formData.regularMedicines || 'None reported'
    },
    {
      step: 9,
      number: 'Question 9',
      title: 'Existing Conditions',
      value: formData.existingConditions || 'None reported'
    },
    {
      step: 10,
      number: 'Question 10',
      title: 'Known Allergies',
      value: formData.knownAllergies || 'None reported'
    },
    {
      step: 11,
      number: 'Question 11',
      title: 'Related Reports or Documents',
      value: formData.attachedDocument ? `${formData.attachedDocument.name} (${(formData.attachedDocument.size / 1024).toFixed(1)} KB)` : 'No documents attached'
    },
    {
      step: 12,
      number: 'Question 12',
      title: 'Additional Notes for Doctor',
      value: formData.additionalNotes || 'None provided'
    }
  ];

  return (
    <div className="review-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cs-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Final Check
          </span>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
            Review Your Answers
          </h2>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Review and adjust any answer before generating your Doctor Visit Summary.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onGenerateSummary}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Generate Doctor Visit Summary
        </button>
      </div>

      <div className="review-grid">
        {questionsList.map((item) => (
          <div key={item.step} className="review-item-card">
            <div style={{ flex: 1 }}>
              <div className="review-question-num">{item.number}</div>
              <div className="review-question-title">{item.title}</div>
              <div className="review-answer-value">{item.value}</div>
              {item.subValue && <div className="review-answer-sub">{item.subValue}</div>}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEditStep(item.step)}
              title={`Edit ${item.number}`}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToQuestions}
        >
          &larr; Back to Questions
        </button>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onGenerateSummary}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Generate Doctor Visit Summary
        </button>
      </div>
    </div>
  );
}
