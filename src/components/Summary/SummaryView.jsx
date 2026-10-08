import React, { useState } from 'react';

export default function SummaryView({
  summary,
  onShowDoctor,
  onEditSummary,
  onBackToDashboard
}) {
  const [toastMessage, setToastMessage] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleShare = () => {
    // Generate text representation for clipboard sharing
    const textLines = [
      'CARESYNC - DOCTOR VISIT SUMMARY',
      '==================================',
      `Patient: ${summary.patientInfo.fullName} (${summary.patientInfo.age}, ${summary.patientInfo.gender})`,
      `Date Prepared: ${summary.patientInfo.datePrepared}`,
      '',
      'MAIN CONCERN:',
      summary.mainConcern,
      '',
      'WHEN IT STARTED:',
      summary.whenStarted,
      '',
      'PATTERN / FREQUENCY:',
      summary.patternFrequency.frequency + (summary.patternFrequency.details ? ` (${summary.patternFrequency.details})` : ''),
      '',
      'WHEN IT OCCURS:',
      summary.whenItOccurs.timings.join(', ') + (summary.whenItOccurs.additionalDetails ? ` - Details: ${summary.whenItOccurs.additionalDetails}` : ''),
      '',
      'EFFECT ON DAILY LIFE:',
      summary.effectOnDailyLife,
      '',
      'PREVIOUS OCCURRENCE:',
      summary.previousOccurrence.experienced + (summary.previousOccurrence.details ? ` - ${summary.previousOccurrence.details}` : ''),
      '',
      'MEDICATION INFORMATION:',
      summary.medicationInfo.takenAnything === 'Yes' && summary.medicationInfo.details
        ? `Took: ${summary.medicationInfo.details.name} (Prescribed: ${summary.medicationInfo.details.prescribed}, When: ${summary.medicationInfo.details.whenTaken}, Helped: ${summary.medicationInfo.details.helped})`
        : summary.medicationInfo.takenAnything,
      '',
      'CURRENT MEDICATIONS:',
      summary.currentMedications,
      '',
      'EXISTING CONDITIONS:',
      summary.existingConditions,
      '',
      'ALLERGIES:',
      summary.allergies,
      '',
      'RELATED DOCUMENTS:',
      summary.relatedDocuments ? `${summary.relatedDocuments.fileName} (${summary.relatedDocuments.fileSize})` : 'None attached',
      '',
      'ADDITIONAL INFORMATION:',
      summary.additionalInformation,
      '',
      '----------------------------------',
      'Disclaimer: This summary is generated from information provided by the patient. It is intended to help communicate information to a healthcare professional. It is not a diagnosis or medical advice.'
    ];

    const shareContent = textLines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareContent)
        .then(() => {
          showToast('Summary copied to clipboard!');
        })
        .catch(() => {
          showToast('Failed to copy to clipboard.');
        });
    } else {
      showToast('Clipboard sharing not supported on this browser.');
    }
  };

  const handleDownloadPdfClick = () => {
    // Per instructions: "The Download PDF button can initially be a placeholder if PDF generation is not implemented yet. Do NOT automatically download a PDF."
    setShowPdfModal(true);
  };

  return (
    <div className="summary-view-container">
      {/* Toast */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* PDF Modal Dialog */}
      {showPdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="cs-card" style={{ maxWidth: '500px', width: '100%', boxShadow: 'var(--cs-shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--cs-primary-light)', color: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Download PDF</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)' }}>Printable medical report summary</p>
              </div>
            </div>

            <p style={{ fontSize: '0.9375rem', color: 'var(--cs-text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              You can save this summary as a clean clinical PDF using your browser's Print dialog by selecting <strong>Save as PDF</strong> as the destination.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPdfModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowPdfModal(false);
                  window.print();
                }}
              >
                Open Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Summary Sheet */}
      <div className="summary-sheet">
        {/* Header Banner */}
        <div className="summary-header-banner">
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            CareSync Patient Record
          </span>
          <h1 className="summary-header-title">Doctor Visit Summary</h1>
          <p className="summary-header-sub">
            Prepared from the information you provided.
          </p>
        </div>

        {/* Action Buttons Bar */}
        <div className="summary-actions-bar">
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onShowDoctor}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
              Show Doctor
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onEditSummary}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit Summary
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShare}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownloadPdfClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* Summary Content Body */}
        <div className="summary-body">
          {/* 1. PATIENT INFORMATION */}
          <section className="summary-section">
            <div className="summary-section-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Patient Information
            </div>
            <div className="patient-info-grid">
              <div className="patient-info-item">
                <span className="patient-info-title">Full Name</span>
                <span className="patient-info-val">{summary.patientInfo.fullName}</span>
              </div>
              <div className="patient-info-item">
                <span className="patient-info-title">Age / Gender</span>
                <span className="patient-info-val">{summary.patientInfo.age} • {summary.patientInfo.gender}</span>
              </div>
              <div className="patient-info-item">
                <span className="patient-info-title">Date Prepared</span>
                <span className="patient-info-val">{summary.patientInfo.datePrepared}</span>
              </div>
              <div className="patient-info-item">
                <span className="patient-info-title">Blood Group</span>
                <span className="patient-info-val">{summary.patientInfo.bloodGroup}</span>
              </div>
            </div>
          </section>

          {/* 2. MAIN CONCERN */}
          <section className="summary-section">
            <div className="summary-section-label">Main Concern</div>
            <div className="summary-section-content" style={{ fontSize: '1.0625rem', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
              {summary.mainConcern}
            </div>
          </section>

          {/* 3. WHEN IT STARTED */}
          <section className="summary-section">
            <div className="summary-section-label">When It Started</div>
            <div className="summary-section-content">
              <span className="summary-badge-pill">{summary.whenStarted}</span>
            </div>
          </section>

          {/* 4. PATTERN / FREQUENCY */}
          <section className="summary-section">
            <div className="summary-section-label">Pattern / Frequency</div>
            <div className="summary-section-content">
              <span className="summary-badge-pill">{summary.patternFrequency.frequency}</span>
              {summary.patternFrequency.details && (
                <p style={{ marginTop: '0.5rem', color: 'var(--cs-text-muted)' }}>
                  <strong>Details:</strong> {summary.patternFrequency.details}
                </p>
              )}
            </div>
          </section>

          {/* 5. WHEN IT OCCURS */}
          <section className="summary-section">
            <div className="summary-section-label">When It Occurs</div>
            <div className="summary-section-content">
              <div>
                {summary.whenItOccurs.timings.map((time, idx) => (
                  <span key={idx} className="summary-badge-pill">{time}</span>
                ))}
              </div>
              {summary.whenItOccurs.additionalDetails && (
                <p style={{ marginTop: '0.5rem', color: 'var(--cs-text-muted)' }}>
                  <strong>Additional Timing Details:</strong> {summary.whenItOccurs.additionalDetails}
                </p>
              )}
            </div>
          </section>

          {/* 6. EFFECT ON DAILY LIFE */}
          <section className="summary-section">
            <div className="summary-section-label">Effect on Daily Life</div>
            <div className="summary-section-content" style={{ whiteSpace: 'pre-wrap' }}>
              {summary.effectOnDailyLife}
            </div>
          </section>

          {/* 7. PREVIOUS OCCURRENCE */}
          <section className="summary-section">
            <div className="summary-section-label">Previous Occurrence</div>
            <div className="summary-section-content">
              <span className="summary-badge-pill">{summary.previousOccurrence.experienced}</span>
              {summary.previousOccurrence.details && (
                <p style={{ marginTop: '0.5rem', color: 'var(--cs-text-muted)', whiteSpace: 'pre-wrap' }}>
                  <strong>Previous occurrence history:</strong> {summary.previousOccurrence.details}
                </p>
              )}
            </div>
          </section>

          {/* 8. MEDICATION INFORMATION */}
          <section className="summary-section">
            <div className="summary-section-label">Medication Information</div>
            <div className="summary-section-content">
              <p><strong>Taken anything for this symptom:</strong> {summary.medicationInfo.takenAnything}</p>
              {summary.medicationInfo.details && (
                <div style={{ marginTop: '0.75rem', background: 'var(--cs-surface-muted)', padding: '1rem', borderRadius: 'var(--cs-radius-md)', border: '1px solid var(--cs-border)' }}>
                  <p><strong>Medication name:</strong> {summary.medicationInfo.details.name}</p>
                  <p style={{ marginTop: '0.375rem' }}><strong>Prescribed by doctor:</strong> {summary.medicationInfo.details.prescribed}</p>
                  <p style={{ marginTop: '0.375rem' }}><strong>When taken:</strong> {summary.medicationInfo.details.whenTaken}</p>
                  <p style={{ marginTop: '0.375rem' }}><strong>Reported effect / relief:</strong> {summary.medicationInfo.details.helped}</p>
                </div>
              )}
            </div>
          </section>

          {/* 9. CURRENT MEDICATIONS */}
          <section className="summary-section">
            <div className="summary-section-label">Current Medications</div>
            <div className="summary-section-content" style={{ whiteSpace: 'pre-wrap' }}>
              {summary.currentMedications}
            </div>
          </section>

          {/* 10. EXISTING CONDITIONS */}
          <section className="summary-section">
            <div className="summary-section-label">Existing Conditions</div>
            <div className="summary-section-content" style={{ whiteSpace: 'pre-wrap' }}>
              {summary.existingConditions}
            </div>
          </section>

          {/* 11. ALLERGIES */}
          <section className="summary-section">
            <div className="summary-section-label">Allergies</div>
            <div className="summary-section-content">
              {summary.allergies !== 'None' && summary.allergies !== 'None reported' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: 'var(--cs-danger-light)', border: '1px solid var(--cs-danger-border)', borderRadius: '6px', color: 'var(--cs-danger)', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{summary.allergies}</span>
                </div>
              ) : (
                <span className="summary-badge-pill">{summary.allergies}</span>
              )}
            </div>
          </section>

          {/* 12. RELATED DOCUMENTS */}
          <section className="summary-section">
            <div className="summary-section-label">Related Documents</div>
            <div className="summary-section-content">
              {summary.relatedDocuments ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.875rem', background: 'var(--cs-surface-muted)', border: '1px solid var(--cs-border)', borderRadius: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style={{ fontWeight: 600 }}>{summary.relatedDocuments.fileName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)' }}>({summary.relatedDocuments.fileSize})</span>
                </div>
              ) : (
                <span style={{ color: 'var(--cs-text-muted)' }}>No documents attached</span>
              )}
            </div>
          </section>

          {/* 13. ADDITIONAL INFORMATION */}
          <section className="summary-section">
            <div className="summary-section-label">Additional Information</div>
            <div className="summary-section-content" style={{ whiteSpace: 'pre-wrap' }}>
              {summary.additionalInformation}
            </div>
          </section>
        </div>
      </div>

      {/* Safety Disclaimer at Bottom */}
      <div className="safety-disclaimer-box">
        <div className="safety-disclaimer-title">Safety Disclaimer</div>
        <p className="safety-disclaimer-text">
          This summary is generated from information provided by the patient. It is intended to help communicate information to a healthcare professional. It is not a diagnosis or medical advice.
        </p>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToDashboard}
        >
          &larr; Return to Dashboard
        </button>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onEditSummary}
        >
          Edit Answers
        </button>
      </div>
    </div>
  );
}
