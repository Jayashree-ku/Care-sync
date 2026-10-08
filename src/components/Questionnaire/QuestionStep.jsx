import React from 'react';

export default function QuestionStep({
  step,
  formData,
  onChange,
  onFileSelect,
  onFileRemove,
  validationError
}) {
  // Helper to update a field in formData
  const update = (field, value) => {
    onChange(field, value);
  };

  // Helper for toggle multi-select in array
  const toggleArrayItem = (field, item) => {
    const current = Array.isArray(formData[field]) ? formData[field] : [];
    if (current.includes(item)) {
      update(field, current.filter(i => i !== item));
    } else {
      update(field, [...current, item]);
    }
  };

  switch (step) {
    case 1:
      return (
        <div>
          <label className="form-label" htmlFor="q1-symptoms">
            What are you currently experiencing? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Be as specific as possible. Describe sensations (e.g., sharp, dull, throbbing), location, and any accompanying discomfort.
          </p>
          <textarea
            id="q1-symptoms"
            className="form-textarea"
            rows={6}
            placeholder="e.g., I have had a persistent dull headache behind my right eye, along with slight nausea and sensitivity to bright light..."
            value={formData.currentSymptoms}
            onChange={(e) => update('currentSymptoms', e.target.value)}
            autoFocus
          />
        </div>
      );

    case 2: {
      const options = [
        'Today',
        'A few days ago',
        'A few weeks ago',
        'More than a month ago',
        "I'm not sure"
      ];
      return (
        <div>
          <label className="form-label">
            When did you first notice it? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Select the timeframe that best describes the onset of your symptoms.
          </p>
          <div className="options-grid">
            {options.map((opt) => (
              <div
                key={opt}
                className={`option-card ${formData.whenNoticed === opt ? 'selected' : ''}`}
                onClick={() => update('whenNoticed', opt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('whenNoticed', opt); }}
              >
                <div className="option-indicator">
                  {formData.whenNoticed === opt && <div className="option-indicator-dot" />}
                </div>
                <span>{opt}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 3: {
      const options = [
        'Constantly',
        'Sometimes',
        'At specific times',
        'Only during certain activities',
        "I'm not sure"
      ];
      return (
        <div>
          <label className="form-label">
            How often does it happen? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Indicate how frequently you experience this sensation.
          </p>
          <div className="options-grid">
            {options.map((opt) => (
              <div
                key={opt}
                className={`option-card ${formData.frequency === opt ? 'selected' : ''}`}
                onClick={() => update('frequency', opt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('frequency', opt); }}
              >
                <div className="option-indicator">
                  {formData.frequency === opt && <div className="option-indicator-dot" />}
                </div>
                <span>{opt}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label className="form-label" htmlFor="q3-tell-more">
              Tell us more <span className="form-label-optional">(optional)</span>
            </label>
            <input
              id="q3-tell-more"
              type="text"
              className="form-input"
              placeholder="e.g., Occurs 2-3 times an hour, usually lasting about 15 minutes each time..."
              value={formData.frequencyDetails}
              onChange={(e) => update('frequencyDetails', e.target.value)}
            />
          </div>
        </div>
      );
    }

    case 4: {
      const timingOptions = [
        'Morning',
        'Afternoon',
        'Evening',
        'Night',
        'After eating',
        'During activity',
        'While resting',
        'Other',
        "I'm not sure"
      ];
      const selected = Array.isArray(formData.timingOptions) ? formData.timingOptions : [];

      return (
        <div>
          <label className="form-label">
            When does it usually happen? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Select all relevant times or situations that apply.
          </p>
          <div className="options-grid options-grid-sm">
            {timingOptions.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <div
                  key={opt}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('timingOptions', opt)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleArrayItem('timingOptions', opt); }}
                >
                  <div className="option-checkbox-indicator">
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {selected.includes('Other') && (
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label" htmlFor="q4-timing-other">
                Specify other time / situation:
              </label>
              <input
                id="q4-timing-other"
                type="text"
                className="form-input"
                placeholder="e.g., When waking up, after looking at screens for prolonged periods..."
                value={formData.timingOther}
                onChange={(e) => update('timingOther', e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label" htmlFor="q4-timing-details">
              Additional timing details <span className="form-label-optional">(optional)</span>
            </label>
            <input
              id="q4-timing-details"
              type="text"
              className="form-input"
              placeholder="e.g., Noticeably worse in colder rooms or after stressful meetings..."
              value={formData.timingDetails}
              onChange={(e) => update('timingDetails', e.target.value)}
            />
          </div>
        </div>
      );
    }

    case 5: {
      const suggestionChips = [
        'Disrupts sleep / waking up at night',
        'Difficult to concentrate at work/study',
        'Limits physical activity or walking',
        'Affects appetite or eating',
        'Mild impact, but bothersome'
      ];

      return (
        <div>
          <label className="form-label" htmlFor="q5-impact">
            How is it affecting you? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Explain how this issue affects your daily activities, sleep, eating, work, studies, or physical movement.
          </p>

          <textarea
            id="q5-impact"
            className="form-textarea"
            rows={5}
            placeholder="e.g., It makes it difficult to sleep on my right side. By afternoon, the discomfort makes it hard to focus on work..."
            value={formData.dailyImpact}
            onChange={(e) => update('dailyImpact', e.target.value)}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Quick Suggestions (click to add):
            </span>
            <div className="quick-chips">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => {
                    const current = formData.dailyImpact ? `${formData.dailyImpact}. ${chip}` : chip;
                    update('dailyImpact', current);
                  }}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 6: {
      const options = ['Yes', 'No', "I'm not sure"];
      return (
        <div>
          <label className="form-label">
            Have you experienced this before? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Let your doctor know whether this is a recurring condition.
          </p>
          <div className="options-grid">
            {options.map((opt) => (
              <div
                key={opt}
                className={`option-card ${formData.experiencedBefore === opt ? 'selected' : ''}`}
                onClick={() => update('experiencedBefore', opt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('experiencedBefore', opt); }}
              >
                <div className="option-indicator">
                  {formData.experiencedBefore === opt && <div className="option-indicator-dot" />}
                </div>
                <span>{opt}</span>
              </div>
            ))}
          </div>

          {formData.experiencedBefore === 'Yes' && (
            <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.2s ease-in' }}>
              <label className="form-label" htmlFor="q6-prev-details">
                Tell us about the previous occurrence:
              </label>
              <textarea
                id="q6-prev-details"
                className="form-textarea"
                rows={4}
                placeholder="e.g., I had a similar symptom about 6 months ago. It resolved after about a week with rest..."
                value={formData.previousDetails}
                onChange={(e) => update('previousDetails', e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    case 7: {
      const options = ['Yes', 'No', "I'm not sure"];
      const prescribeOptions = ['Yes', 'No', "I'm not sure"];
      const helpOptions = ['Yes', 'No', "I'm not sure"];

      return (
        <div>
          <label className="form-label">
            Have you taken anything for it? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Include prescription or over-the-counter medicine, home remedies, or supplements.
          </p>
          <div className="options-grid">
            {options.map((opt) => (
              <div
                key={opt}
                className={`option-card ${formData.takenMedication === opt ? 'selected' : ''}`}
                onClick={() => update('takenMedication', opt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('takenMedication', opt); }}
              >
                <div className="option-indicator">
                  {formData.takenMedication === opt && <div className="option-indicator-dot" />}
                </div>
                <span>{opt}</span>
              </div>
            ))}
          </div>

          {formData.takenMedication === 'Yes' && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--cs-surface-muted)', padding: '1.25rem', borderRadius: 'var(--cs-radius-md)', border: '1px solid var(--cs-border)' }}>
              <div>
                <label className="form-label" htmlFor="q7-med-name">
                  What did you take?
                </label>
                <input
                  id="q7-med-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Paracetamol 500mg, Ibuprofen, Antacid"
                  value={formData.medicationName}
                  onChange={(e) => update('medicationName', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Was it prescribed by a doctor?
                </label>
                <div className="options-grid options-grid-sm" style={{ marginTop: '0.375rem' }}>
                  {prescribeOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`option-card ${formData.medicationPrescribed === opt ? 'selected' : ''}`}
                      onClick={() => update('medicationPrescribed', opt)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('medicationPrescribed', opt); }}
                    >
                      <div className="option-indicator">
                        {formData.medicationPrescribed === opt && <div className="option-indicator-dot" />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="q7-med-timing">
                  When did you take it?
                </label>
                <input
                  id="q7-med-timing"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Yesterday at bedtime, Once this morning with food"
                  value={formData.medicationTiming}
                  onChange={(e) => update('medicationTiming', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Did it seem to help?
                </label>
                <div className="options-grid options-grid-sm" style={{ marginTop: '0.375rem' }}>
                  {helpOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`option-card ${formData.medicationHelped === opt ? 'selected' : ''}`}
                      onClick={() => update('medicationHelped', opt)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') update('medicationHelped', opt); }}
                    >
                      <div className="option-indicator">
                        {formData.medicationHelped === opt && <div className="option-indicator-dot" />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="medical-notice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong>Important Clinical Notice:</strong> CareSync does not provide medication advice, dosage guidance, or drug recommendations. Always consult your qualified healthcare practitioner before taking or modifying any medication.
            </div>
          </div>
        </div>
      );
    }

    case 8: {
      return (
        <div>
          <label className="form-label" htmlFor="q8-regular-meds">
            Are you currently taking any regular medicines?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            List any daily prescription drugs, maintenance medications, vitamins, or supplements.
          </p>

          <textarea
            id="q8-regular-meds"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Multivitamin daily, Metformin 500mg once daily..."
            value={formData.regularMedicines}
            onChange={(e) => update('regularMedicines', e.target.value)}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Quick Select:
            </span>
            <div className="quick-chips">
              <button
                type="button"
                className={`quick-chip-btn ${formData.regularMedicines === 'None' ? 'active' : ''}`}
                onClick={() => update('regularMedicines', 'None')}
              >
                None
              </button>
              <button
                type="button"
                className={`quick-chip-btn ${formData.regularMedicines === "I'm not sure" ? 'active' : ''}`}
                onClick={() => update('regularMedicines', "I'm not sure")}
              >
                I'm not sure
              </button>
            </div>
          </div>
        </div>
      );
    }

    case 9: {
      return (
        <div>
          <label className="form-label" htmlFor="q9-conditions">
            Do you have any existing medical conditions relevant to this?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            For example: asthma, high blood pressure, diabetes, thyroid conditions, migraines, or prior surgeries.
          </p>

          <textarea
            id="q9-conditions"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Mild asthma, seasonal migraines..."
            value={formData.existingConditions}
            onChange={(e) => update('existingConditions', e.target.value)}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Quick Select:
            </span>
            <div className="quick-chips">
              <button
                type="button"
                className={`quick-chip-btn ${formData.existingConditions === 'None' ? 'active' : ''}`}
                onClick={() => update('existingConditions', 'None')}
              >
                None
              </button>
              <button
                type="button"
                className={`quick-chip-btn ${formData.existingConditions === "I'm not sure" ? 'active' : ''}`}
                onClick={() => update('existingConditions', "I'm not sure")}
              >
                I'm not sure
              </button>
            </div>
          </div>
        </div>
      );
    }

    case 10: {
      return (
        <div>
          <label className="form-label" htmlFor="q10-allergies">
            Do you have any known allergies?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            List any allergies to medications (e.g. penicillin), food items, latex, or environmental factors.
          </p>

          <textarea
            id="q10-allergies"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Penicillin (causes rash), Peanuts..."
            value={formData.knownAllergies}
            onChange={(e) => update('knownAllergies', e.target.value)}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Quick Select:
            </span>
            <div className="quick-chips">
              <button
                type="button"
                className={`quick-chip-btn ${formData.knownAllergies === 'None' ? 'active' : ''}`}
                onClick={() => update('knownAllergies', 'None')}
              >
                None
              </button>
              <button
                type="button"
                className={`quick-chip-btn ${formData.knownAllergies === "I'm not sure" ? 'active' : ''}`}
                onClick={() => update('knownAllergies', "I'm not sure")}
              >
                I'm not sure
              </button>
            </div>
          </div>
        </div>
      );
    }

    case 11: {
      return (
        <div>
          <label className="form-label">
            Do you have any related medical reports or documents?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Attach lab test results, previous prescriptions, imaging reports, or doctor notes. (Optional)
          </p>

          {!formData.attachedDocument ? (
            <label className="file-dropzone" htmlFor="report-upload-input" style={{ display: 'block' }}>
              <input
                id="report-upload-input"
                type="file"
                style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    onFileSelect({
                      name: file.name,
                      size: file.size,
                      type: file.type || 'Document'
                    });
                  }
                }}
              />
              <div className="file-dropzone-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--cs-text-main)' }}>
                Click to attach a document or report
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.25rem' }}>
                Supports PDF, DOC, JPG, PNG (Max 25MB)
              </div>
            </label>
          ) : (
            <div className="file-preview-card">
              <div className="file-info">
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--cs-primary-light)', color: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="file-name">{formData.attachedDocument.name}</div>
                  <div className="file-meta">
                    {(formData.attachedDocument.size / 1024).toFixed(1)} KB • Attached
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={onFileRemove}
              >
                Remove
              </button>
            </div>
          )}

          <div style={{ marginTop: '0.875rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)' }}>
              Note: Medical file analysis is scheduled for future updates. You may attach a document now for record keeping or skip this step.
            </span>
          </div>
        </div>
      );
    }

    case 12: {
      return (
        <div>
          <label className="form-label" htmlFor="q12-other-notes">
            Anything else you think the doctor should know?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.75rem' }}>
            Any questions you want to ask, lifestyle changes, recent travel, family history, or specific concerns.
          </p>

          <textarea
            id="q12-other-notes"
            className="form-textarea"
            rows={6}
            placeholder="e.g., I would like to know if this could be related to recent dietary changes, and whether I need blood tests..."
            value={formData.additionalNotes}
            onChange={(e) => update('additionalNotes', e.target.value)}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Quick Note:
            </span>
            <div className="quick-chips">
              <button
                type="button"
                className="quick-chip-btn"
                onClick={() => update('additionalNotes', 'Nothing else at this time.')}
              >
                Nothing else at this time
              </button>
              <button
                type="button"
                className="quick-chip-btn"
                onClick={() => {
                  const current = formData.additionalNotes 
                    ? `${formData.additionalNotes}\n- Please advise if diagnostic testing is needed.` 
                    : '- Please advise if diagnostic testing is needed.';
                  update('additionalNotes', current);
                }}
              >
                + Ask about diagnostic tests
              </button>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
