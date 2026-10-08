import React from 'react';

export default function Dashboard({
  activePatient,
  patients,
  onSelectPatient,
  onStartDoctorVisit,
  onNavigate,
  onUploadReportClick,
  onAddMedicationClick
}) {
  if (!activePatient) {
    return (
      <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h2>No Active Patient Selected</h2>
        <p style={{ color: 'var(--cs-text-muted)', marginTop: '0.5rem' }}>
          Please select or add a patient profile to view the dashboard.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={() => onNavigate('/patients')}
        >
          Manage Patients
        </button>
      </div>
    );
  }

  // Determine greeting based on local time
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
  else if (hour >= 17) timeGreeting = 'Good evening';

  const firstName = activePatient.fullName ? activePatient.fullName.split(' ')[0] : 'Patient';

  // Patient-specific counts derived strictly from patient data (No fake numbers!)
  const conditionsText = activePatient.existingConditions?.trim() || '';
  const conditionsCount = conditionsText && conditionsText.toLowerCase() !== 'none'
    ? conditionsText.split(/[,;\n]+/).filter(c => c.trim().length > 0).length
    : 0;

  const allergiesText = activePatient.knownAllergies?.trim() || '';
  const allergiesCount = allergiesText && allergiesText.toLowerCase() !== 'none'
    ? allergiesText.split(/[,;\n]+/).filter(a => a.trim().length > 0).length
    : 0;

  const medicationsList = Array.isArray(activePatient.medications) ? activePatient.medications : [];
  const reportsList = Array.isArray(activePatient.reports) ? activePatient.reports : [];
  const doctorVisitsList = Array.isArray(activePatient.doctorVisits) ? activePatient.doctorVisits : [];

  return (
    <div className="dashboard-container">
      {/* Personalized Greeting Header */}
      <div className="dashboard-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.18)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <span>Viewing Patient Profile: <strong>{activePatient.fullName}</strong> ({activePatient.relationship})</span>
        </div>
        <h1 className="dashboard-hero-title">
          {timeGreeting}, {firstName}
        </h1>
        <p className="dashboard-hero-sub">
          Your health information, organized and easier to understand.
        </p>
      </div>

      {/* Health Overview Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)', marginBottom: '1rem' }}>
          Health Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Conditions */}
          <div className="cs-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cs-text-light)', letterSpacing: '0.05em' }}>
              Conditions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-primary)', marginTop: '0.375rem' }}>
              {conditionsCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
              {conditionsCount > 0 ? (conditionsText.length > 35 ? `${conditionsText.substring(0, 35)}...` : conditionsText) : 'None recorded'}
            </div>
          </div>

          {/* Allergies */}
          <div className="cs-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cs-text-light)', letterSpacing: '0.05em' }}>
              Allergies
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: allergiesCount > 0 ? 'var(--cs-danger)' : 'var(--cs-text-main)', marginTop: '0.375rem' }}>
              {allergiesCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
              {allergiesCount > 0 ? (allergiesText.length > 35 ? `${allergiesText.substring(0, 35)}...` : allergiesText) : 'None recorded'}
            </div>
          </div>

          {/* Medications */}
          <div className="cs-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cs-text-light)', letterSpacing: '0.05em' }}>
              Medications
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-accent)', marginTop: '0.375rem' }}>
              {medicationsList.length}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
              {medicationsList.length > 0 ? `${medicationsList.length} active prescription(s)` : '0 recorded'}
            </div>
          </div>

          {/* Reports */}
          <div className="cs-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cs-text-light)', letterSpacing: '0.05em' }}>
              Reports
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)', marginTop: '0.375rem' }}>
              {reportsList.length}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
              {reportsList.length > 0 ? `${reportsList.length} document(s) uploaded` : '0 uploaded'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Two Primary Features) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Action 1: PREPARE FOR MY DOCTOR VISIT */}
          <div className="cs-card cs-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1.5px solid var(--cs-primary-border)' }}>
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--cs-primary-light)', color: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 9v4" />
                  <path d="M10 11h4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
                PREPARE FOR MY DOCTOR VISIT
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Organize symptoms and relevant information into a doctor-ready summary.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={onStartDoctorVisit}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                {activePatient.draftDoctorVisit ? 'Continue Doctor Visit' : 'Start Visit Prep'}
              </button>
            </div>
          </div>

          {/* Action 2: UNDERSTAND MY MEDICAL INFORMATION */}
          <div className="cs-card cs-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--cs-accent-light)', color: 'var(--cs-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
                UNDERSTAND MY MEDICAL INFORMATION
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Upload a medical document and understand the information in it.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => onNavigate('/medical-info')}
              >
                Upload & Understand Document &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Data Sections: Medications & Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* CURRENT MEDICATIONS */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
              Current Medications
            </h3>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onAddMedicationClick}
            >
              + Add
            </button>
          </div>

          {medicationsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'var(--cs-surface-muted)', borderRadius: '8px', border: '1px dashed var(--cs-border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--cs-text-light)' }}>No medications recorded.</p>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                style={{ marginTop: '0.75rem' }}
                onClick={onAddMedicationClick}
              >
                Record Medication
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {medicationsList.slice(0, 3).map((med) => (
                <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--cs-surface-muted)', borderRadius: '8px', border: '1px solid var(--cs-border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--cs-text-main)' }}>
                      {med.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.125rem' }}>
                      {med.dosage} • {med.frequency}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-muted)' }}>
                    {med.prescribedBy || 'Prescribed'}
                  </span>
                </div>
              ))}
              {medicationsList.length > 3 && (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate('/medications')}
                >
                  View all {medicationsList.length} medications
                </button>
              )}
            </div>
          )}
        </div>

        {/* RECENT REPORTS */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
              Recent Reports
            </h3>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onUploadReportClick}
            >
              + Upload
            </button>
          </div>

          {reportsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'var(--cs-surface-muted)', borderRadius: '8px', border: '1px dashed var(--cs-border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--cs-text-light)' }}>No medical reports yet.</p>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                style={{ marginTop: '0.75rem' }}
                onClick={onUploadReportClick}
              >
                Upload Medical Report
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reportsList.slice(0, 3).map((rep) => (
                <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--cs-surface-muted)', borderRadius: '8px', border: '1px solid var(--cs-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cs-primary)" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rep.title || rep.fileName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)' }}>{rep.fileSize} • {rep.uploadedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
              {reportsList.length > 3 && (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate('/reports')}
                >
                  View all {reportsList.length} reports
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DOCTOR VISIT SUMMARIES (FOR THIS PATIENT) */}
      {doctorVisitsList.length > 0 && (
        <div className="cs-card" style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cs-text-main)', marginBottom: '1rem' }}>
            Doctor Visit Summaries for {firstName}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {doctorVisitsList.map((visit) => (
              <div key={visit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: 'var(--cs-surface-muted)', borderRadius: '8px', border: '1px solid var(--cs-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--cs-text-main)' }}>
                    Visit Prepared on {visit.createdAt}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
                    <strong>Main Concern:</strong> {visit.summary?.mainConcern || 'General review'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      localStorage.setItem('caresync_active_summary', JSON.stringify(visit.summary));
                      onNavigate('/doctor-visit/summary');
                    }}
                  >
                    View Summary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAMILY SECTION (SWITCH ACTIVE PATIENT) */}
      <div className="cs-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
              Your Family
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.125rem' }}>
              Switch active profile to manage health records for each member
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onNavigate('/patients')}
          >
            + Add Patient
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {patients.map((p) => {
            const isSelected = p.id === activePatient.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPatient(p.id)}
                role="button"
                tabIndex={0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid var(--cs-primary)' : '1px solid var(--cs-border)',
                  background: isSelected ? 'var(--cs-primary-light)' : 'var(--cs-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--cs-primary)' : 'var(--cs-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {p.fullName ? p.fullName.charAt(0) : 'P'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--cs-text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {p.fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--cs-primary)' : 'var(--cs-text-light)', fontWeight: 500 }}>
                    {p.relationship === 'Self' ? 'Me' : p.relationship} {isSelected && '• Active'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
