import React from 'react';

export default function QuestionStep({
  step,
  formData,
  onChange,
  onFileSelect,
  onFileRemove,
  validationError
}) {
  const update = (field, value) => {
    onChange(field, value);
  };

  const toggleArrayItem = (field, item) => {
    const current = Array.isArray(formData[field]) ? formData[field] : [];
    if (item === "I'm not sure") {
      // If user clicks "I'm not sure", clear other selections or toggle
      if (current.includes("I'm not sure")) {
        update(field, []);
      } else {
        update(field, ["I'm not sure"]);
      }
      return;
    }

    // If selecting any regular timing option, remove "I'm not sure"
    const filtered = current.filter(i => i !== "I'm not sure");
    if (filtered.includes(item)) {
      update(field, filtered.filter(i => i !== item));
    } else {
      update(field, [...filtered, item]);
    }
  };

  switch (step) {
    // ----------------------------------------------------
    // QUESTION 1 (Required)
    // ----------------------------------------------------
    case 1:
      return (
        <div>
          <label className="form-label" htmlFor="q1-symptoms">
            What are you currently experiencing? <span style={{ color: 'var(--cs-danger)' }}>*</span>
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Describe what you are feeling in your own words (e.g., location, sensation such as sharp or dull, severity, and any other symptoms).
          </p>
          <textarea
            id="q1-symptoms"
            className="form-textarea"
            rows={6}
            placeholder="e.g., Persistent dull headache behind my right eye, accompanied by mild dizziness and sensitivity to light..."
            value={formData.currentSymptoms}
            onChange={(e) => update('currentSymptoms', e.target.value)}
            autoFocus
          />
        </div>
      );

    // ----------------------------------------------------
    // QUESTION 2 (Required)
    // ----------------------------------------------------
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
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Select the timeframe when you first noticed these symptoms.
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

    // ----------------------------------------------------
    // QUESTION 3
    // ----------------------------------------------------
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
            How often does it happen?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Choose how frequently this occurs.
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
              placeholder="e.g., Usually happens 2 to 3 times a day and lasts about 20 minutes each time..."
              value={formData.frequencyDetails}
              onChange={(e) => update('frequencyDetails', e.target.value)}
            />
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // QUESTION 4
    // ----------------------------------------------------
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
            When does it usually happen?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Select any times or activities when you notice this happening.
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
                placeholder="e.g., Immediately upon waking, when working under fluorescent lighting..."
                value={formData.timingOther}
                onChange={(e) => update('timingOther', e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label" htmlFor="q4-timing-details">
              Additional details <span className="form-label-optional">(optional)</span>
            </label>
            <input
              id="q4-timing-details"
              type="text"
              className="form-input"
              placeholder="e.g., Seems to get worse towards the end of a work shift..."
              value={formData.timingDetails}
              onChange={(e) => update('timingDetails', e.target.value)}
            />
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // QUESTION 5
    // ----------------------------------------------------
    case 5:
      return (
        <div>
          <label className="form-label" htmlFor="q5-impact">
            How is it affecting you?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            You can mention how this affects your daily activities, sleep, eating, work, studies, or physical movement.
          </p>

          <textarea
            id="q5-impact"
            className="form-textarea"
            rows={6}
            placeholder="e.g., It wakes me up during the night. During the day, it makes it difficult to concentrate on reading or computer work..."
            value={formData.dailyImpact}
            onChange={(e) => update('dailyImpact', e.target.value)}
          />

          <div style={{ marginTop: '0.875rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>
              Suggestions (click to add):
            </span>
            <div className="quick-chips">
              {[
                'Disrupts my sleep',
                'Hard to focus on work/study',
                'Limits physical activities',
                'Affects my appetite',
                'No significant daily disruption'
              ].map((chip) => (
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

    // ----------------------------------------------------
    // QUESTION 6
    // ----------------------------------------------------
    case 6: {
      const options = ['Yes', 'No', "I'm not sure"];
      return (
        <div>
          <label className="form-label">
            Have you experienced this before?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Indicate whether you have had a similar episode in the past.
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
            <div style={{ marginTop: '1.5rem' }}>
              <label className="form-label" htmlFor="q6-prev-details">
                Tell us about the previous occurrence.
              </label>
              <textarea
                id="q6-prev-details"
                className="form-textarea"
                rows={4}
                placeholder="e.g., I had this about 4 months ago. It lasted around 3 days and resolved on its own after getting rest..."
                value={formData.previousDetails}
                onChange={(e) => update('previousDetails', e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    // ----------------------------------------------------
    // QUESTION 7
    // ----------------------------------------------------
    case 7: {
      const options = ['Yes', 'No', "I'm not sure"];
      const prescribeOptions = ['Yes', 'No', "I'm not sure"];
      const helpOptions = ['Yes', 'No', "I'm not sure"];

      return (
        <div>
          <label className="form-label">
            Have you taken anything for it?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Include any over-the-counter medicine, remedies, or prescriptions you took for this symptom.
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
                  placeholder="e.g., Yesterday afternoon, Once this morning with breakfast"
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
              <strong>Important Notice:</strong> CareSync does not provide medication recommendations, dosage advice, treatment advice, or diagnosis. Always consult your healthcare professional before taking or modifying any medication.
            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // QUESTION 8
    // ----------------------------------------------------
    case 8:
      return (
        <div>
          <label className="form-label" htmlFor="q8-regular-meds">
            Are you currently taking any regular medicines?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            List any daily prescription drugs, maintenance medications, vitamins, or supplements.
          </p>

          <textarea
            id="q8-regular-meds"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Daily multivitamin, Blood pressure medicine..."
            value={formData.regularMedicines}
            onChange={(e) => update('regularMedicines', e.target.value)}
          />

          <div style={{ marginTop: '0.875rem' }}>
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

    // ----------------------------------------------------
    // QUESTION 9
    // ----------------------------------------------------
    case 9:
      return (
        <div>
          <label className="form-label" htmlFor="q9-conditions">
            Do you have any existing medical conditions relevant to this?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            For example: asthma, diabetes, high blood pressure, thyroid issues, or previous surgeries.
          </p>

          <textarea
            id="q9-conditions"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Mild asthma, seasonal migraines..."
            value={formData.existingConditions}
            onChange={(e) => update('existingConditions', e.target.value)}
          />

          <div style={{ marginTop: '0.875rem' }}>
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

    // ----------------------------------------------------
    // QUESTION 10
    // ----------------------------------------------------
    case 10:
      return (
        <div>
          <label className="form-label" htmlFor="q10-allergies">
            Do you have any known allergies?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            List any allergies to medications (such as penicillin), food items, latex, or environmental allergens.
          </p>

          <textarea
            id="q10-allergies"
            className="form-textarea"
            rows={4}
            placeholder="e.g., Penicillin (causes rash), Peanuts, None..."
            value={formData.knownAllergies}
            onChange={(e) => update('knownAllergies', e.target.value)}
          />

          <div style={{ marginTop: '0.875rem' }}>
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

    // ----------------------------------------------------
    // QUESTION 11
    // ----------------------------------------------------
    case 11:
      return (
        <div>
          <label className="form-label">
            Do you have any related medical reports or documents?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Optional: Attach any lab reports, doctor prescriptions, or test results. This file is kept locally on your device and is not analyzed or uploaded to any server.
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
                Click to select a document or report
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.25rem' }}>
                PDF, JPG, PNG, DOC (Kept on local device)
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
                    {(formData.attachedDocument.size / 1024).toFixed(1)} KB • Attached locally
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
        </div>
      );

    // ----------------------------------------------------
    // QUESTION 12
    // ----------------------------------------------------
    case 12:
      return (
        <div>
          <label className="form-label" htmlFor="q12-other-notes">
            Anything else you think the doctor should know?
          </label>
          <p className="form-helper" style={{ marginBottom: '0.875rem' }}>
            Questions you want to ask, lifestyle changes, recent travel, family history, or any other details.
          </p>

          <textarea
            id="q12-other-notes"
            className="form-textarea"
            rows={6}
            placeholder="e.g., Any specific questions you would like answered during your consultation..."
            value={formData.additionalNotes}
            onChange={(e) => update('additionalNotes', e.target.value)}
          />

          <div style={{ marginTop: '0.875rem' }}>
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
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
