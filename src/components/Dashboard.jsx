import React from 'react';

export default function Dashboard({ onStartDoctorVisit, patientProfile, hasExistingDraft, onResetDraft }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem' }}>
          <span>Healthcare Communication Assistant</span>
        </div>
        <h1 className="dashboard-hero-title">Welcome to CareSync</h1>
        <p className="dashboard-hero-sub">
          Organize your health concerns, track symptoms, and communicate clearly and effectively with your healthcare providers.
        </p>
      </div>

      {/* Main Feature Highlight */}
      <div className="dashboard-primary-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '600px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cs-primary)' }}>
              Primary Feature
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cs-text-main)', marginTop: '0.25rem' }}>
              Prepare for My Doctor Visit
            </h2>
            <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Answer a few questions to organize what you're experiencing into a clear summary you can share with a doctor.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {hasExistingDraft && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onResetDraft}
                title="Clear current answers and start a new consultation questionnaire"
              >
                Start Fresh
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartDoctorVisit}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              {hasExistingDraft ? 'Continue Doctor Visit' : 'Start'}
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--cs-border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--cs-primary-light)', color: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>12 Guided Steps</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.125rem' }}>Structured questionnaire for complete history</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--cs-accent-light)', color: 'var(--cs-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Clinical Summary</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.125rem' }}>Organized medical sections for easy review</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Show Doctor Mode</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.125rem' }}>Distraction-free screen for clinical consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Secondary Details */}
      <div className="dashboard-grid-cards">
        <div className="cs-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cs-text-main)', marginBottom: '0.75rem' }}>
            Patient Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--cs-text-light)' }}>Name:</span>
              <span style={{ fontWeight: 600 }}>{patientProfile?.fullName || 'Not specified'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--cs-text-light)' }}>Age:</span>
              <span style={{ fontWeight: 600 }}>{patientProfile?.age || 'Not specified'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--cs-text-light)' }}>Gender:</span>
              <span style={{ fontWeight: 600 }}>{patientProfile?.gender || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="cs-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cs-text-main)', marginBottom: '0.75rem' }}>
            Consultation Best Practices
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--cs-text-muted)', lineHeight: 1.6 }}>
            <li>Be as specific as possible regarding when symptoms began.</li>
            <li>List any over-the-counter medications you tried.</li>
            <li>Note any allergies so your doctor can prescribe safely.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
