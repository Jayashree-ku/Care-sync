import React, { useState } from 'react';

export default function ReportsPage({
  activePatient,
  onAddReport,
  onRemoveReport,
  onBackToDashboard
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    category: 'Lab Report',
    fileName: '',
    fileSize: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const reports = Array.isArray(activePatient.reports) ? activePatient.reports : [];

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setReportData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!reportData.fileName) {
      setError('Please select a document file to attach.');
      return;
    }

    onAddReport(activePatient.id, reportData);
    setShowUploadModal(false);
    setReportData({
      title: '',
      category: 'Lab Report',
      fileName: '',
      fileSize: '',
      notes: ''
    });
    setError('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cs-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Patient Records
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>
            Medical Reports for {activePatient.fullName}
          </h1>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Lab tests, imaging results, and clinical documents for this patient.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToDashboard}
          >
            &larr; Dashboard
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            + Upload Report
          </button>
        </div>
      </div>

      {showUploadModal && (
        <div className="cs-card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Upload Medical Document</h3>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="validation-message" style={{ marginBottom: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Document Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Annual Blood Panel, Chest X-Ray Report"
                value={reportData.title}
                onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={reportData.category}
                  onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Imaging / Radiology">Imaging / Radiology</option>
                  <option value="Doctor Notes">Doctor Notes</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select File <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  type="file"
                  className="form-input"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {reportData.fileName && (
              <div style={{ background: 'var(--cs-surface-muted)', padding: '0.625rem 0.875rem', borderRadius: '6px', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid var(--cs-border)' }}>
                Selected: <strong>{reportData.fileName}</strong> ({reportData.fileSize})
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Clinical Notes <span className="form-label-optional">(optional)</span></label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g., Fasting blood test results from Dr. Mitchell"
                value={reportData.notes}
                onChange={(e) => setReportData({ ...reportData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save to Patient Records
              </button>
            </div>
          </form>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '50%', background: 'var(--cs-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cs-text-light)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>No medical reports yet.</h3>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            No clinical documents or test reports are currently attached for {activePatient.fullName}.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '1.25rem' }}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Medical Report
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map((rep) => (
            <div key={rep.id} className="cs-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--cs-primary-light)', color: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
                    {rep.title || rep.fileName}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.125rem' }}>
                    {rep.category} • {rep.fileSize} • Uploaded {rep.uploadedAt}
                  </div>
                  {rep.notes && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.25rem' }}>
                      {rep.notes}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={() => onRemoveReport(activePatient.id, rep.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
