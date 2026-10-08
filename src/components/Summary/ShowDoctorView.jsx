import React from 'react';

export default function ShowDoctorView({ summary, onExitDoctorMode }) {
  const isAllergyPresent = summary.allergies && summary.allergies !== 'None' && summary.allergies !== 'None reported';

  return (
    <div className="doctor-mode-screen">
      {/* Distraction-free top bar */}
      <div className="doctor-mode-topbar">
        <div>
          <div className="doctor-mode-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Clinical Presentation Mode
          </div>
          <h1 className="doctor-mode-doc-title">Patient Intake Summary</h1>
          <div style={{ fontSize: '0.9375rem', color: '#475569', marginTop: '0.25rem' }}>
            Patient: <strong>{summary.patientInfo.fullName}</strong> • Age: <strong>{summary.patientInfo.age}</strong> • Gender: <strong>{summary.patientInfo.gender}</strong> • Date: <strong>{summary.patientInfo.datePrepared}</strong>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExitDoctorMode}
          style={{ fontWeight: 600 }}
        >
          &times; Exit Doctor Mode
        </button>
      </div>

      {/* Structured clinical cards */}
      <div className="doctor-mode-grid">
        {/* Chief Complaint / Main Concern */}
        <div className="doctor-mode-card priority">
          <div className="doctor-mode-label" style={{ color: '#0f766e' }}>
            Primary Concern / Chief Complaint
          </div>
          <div className="doctor-mode-val" style={{ fontWeight: 600 }}>
            {summary.mainConcern}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.9375rem', color: '#334155', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Onset:</strong> {summary.whenStarted}
            </div>
            <div>
              <strong>Frequency:</strong> {summary.patternFrequency.frequency}
              {summary.patternFrequency.details ? ` (${summary.patternFrequency.details})` : ''}
            </div>
          </div>
        </div>

        {/* Clinical Safety: Allergies & Current Medications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className={`doctor-mode-card ${isAllergyPresent ? 'alert' : ''}`}>
            <div className="doctor-mode-label" style={{ color: isAllergyPresent ? '#b91c1c' : '#334155' }}>
              Allergies
            </div>
            <div className="doctor-mode-val" style={{ fontWeight: isAllergyPresent ? 700 : 500, color: isAllergyPresent ? '#b91c1c' : '#0f172a' }}>
              {summary.allergies}
            </div>
          </div>

          <div className="doctor-mode-card">
            <div className="doctor-mode-label">
              Regular / Current Medications
            </div>
            <div className="doctor-mode-val">
              {summary.currentMedications}
            </div>
          </div>
        </div>

        {/* Existing Medical Conditions */}
        <div className="doctor-mode-card">
          <div className="doctor-mode-label">
            Existing Conditions & Relevant History
          </div>
          <div className="doctor-mode-val">
            {summary.existingConditions}
          </div>
        </div>

        {/* Timing & Circumstances */}
        <div className="doctor-mode-card">
          <div className="doctor-mode-label">
            Timing & Occurrence Patterns
          </div>
          <div className="doctor-mode-val">
            {summary.whenItOccurs.timings.join(', ')}
            {summary.whenItOccurs.additionalDetails && (
              <span style={{ display: 'block', fontSize: '0.9375rem', color: '#475569', marginTop: '0.375rem' }}>
                Note: {summary.whenItOccurs.additionalDetails}
              </span>
            )}
          </div>
        </div>

        {/* Effect on Daily Life */}
        <div className="doctor-mode-card">
          <div className="doctor-mode-label">
            Functional Impact / Daily Activities
          </div>
          <div className="doctor-mode-val" style={{ whiteSpace: 'pre-wrap' }}>
            {summary.effectOnDailyLife}
          </div>
        </div>

        {/* Prior Occurrences & Interventions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="doctor-mode-card">
            <div className="doctor-mode-label">
              Prior Occurrence
            </div>
            <div className="doctor-mode-val">
              {summary.previousOccurrence.experienced}
              {summary.previousOccurrence.details && (
                <div style={{ fontSize: '0.9375rem', color: '#475569', marginTop: '0.375rem' }}>
                  {summary.previousOccurrence.details}
                </div>
              )}
            </div>
          </div>

          <div className="doctor-mode-card">
            <div className="doctor-mode-label">
              Self-Medication / Interventions Tried
            </div>
            <div className="doctor-mode-val">
              {summary.medicationInfo.takenAnything === 'Yes' && summary.medicationInfo.details ? (
                <div>
                  <strong>{summary.medicationInfo.details.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
                    Prescribed: {summary.medicationInfo.details.prescribed} • Taken: {summary.medicationInfo.details.whenTaken} • Effect: {summary.medicationInfo.details.helped}
                  </div>
                </div>
              ) : (
                summary.medicationInfo.takenAnything
              )}
            </div>
          </div>
        </div>

        {/* Related Documents & Additional Notes */}
        {(summary.relatedDocuments || (summary.additionalInformation && summary.additionalInformation !== 'None provided')) && (
          <div className="doctor-mode-card">
            <div className="doctor-mode-label">
              Additional Notes & Documents
            </div>
            {summary.relatedDocuments && (
              <div style={{ marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                <strong>Attached Record:</strong> {summary.relatedDocuments.fileName} ({summary.relatedDocuments.fileSize})
              </div>
            )}
            {summary.additionalInformation && summary.additionalInformation !== 'None provided' && (
              <div className="doctor-mode-val" style={{ whiteSpace: 'pre-wrap' }}>
                {summary.additionalInformation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clinical footer disclaimer */}
      <div className="doctor-mode-footer">
        CareSync Patient Intake Document • Generated from patient-reported history • Not a clinical diagnostic record
      </div>
    </div>
  );
}
