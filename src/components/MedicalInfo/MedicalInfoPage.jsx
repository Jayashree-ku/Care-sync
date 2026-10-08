import React, { useState } from 'react';

export default function MedicalInfoPage({ activePatient, onAddReport, onBackToDashboard }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [docCategory, setDocCategory] = useState('Lab Report');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        rawSize: file.size,
        type: file.type
      });
      setSaveSuccess(false);
    }
  };

  const handleSaveToPatient = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    onAddReport(activePatient.id, {
      title: selectedFile.name.replace(/\.[^/.]+$/, ''),
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      category: docCategory,
      notes: notes
    });

    setSaveSuccess(true);
    setSelectedFile(null);
    setNotes('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cs-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clinical Document Analysis
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>
            Understand My Medical Information
          </h1>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Upload a medical document and understand the information in it for <strong>{activePatient.fullName}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToDashboard}
        >
          &larr; Dashboard
        </button>
      </div>

      {saveSuccess && (
        <div style={{ background: 'var(--cs-primary-light)', border: '1px solid var(--cs-primary-border)', color: 'var(--cs-primary-hover)', padding: '0.875rem 1.25rem', borderRadius: '8px', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          ✓ Document successfully saved to <strong>{activePatient.fullName}</strong>&apos;s medical records!
        </div>
      )}

      <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Attach Document for {activePatient.fullName}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', marginBottom: '1.25rem' }}>
          Select lab reports, imaging results, discharge summaries, or clinical prescriptions to associate with this patient&apos;s health profile.
        </p>

        {!selectedFile ? (
          <label className="file-dropzone" htmlFor="med-info-file-input" style={{ display: 'block' }}>
            <input
              id="med-info-file-input"
              type="file"
              style={{ display: 'none' }}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="file-dropzone-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cs-text-main)' }}>
              Click to select a medical document
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.25rem' }}>
              PDF, JPG, PNG, DOC (Kept on local device)
            </div>
          </label>
        ) : (
          <div style={{ background: 'var(--cs-surface-muted)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--cs-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--cs-accent-light)', color: 'var(--cs-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{selectedFile.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)' }}>{selectedFile.size} • Attached</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={() => setSelectedFile(null)}
              >
                Change File
              </button>
            </div>

            <form onSubmit={handleSaveToPatient}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Imaging / Radiology">Imaging / Radiology</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Doctor Consultation Notes">Doctor Consultation Notes</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Notes for {activePatient.fullName.split(' ')[0]}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Follow up required with physician"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Save Document to {activePatient.fullName}&apos;s Profile
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="medical-notice">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <strong>Architecture Prepared:</strong> Document records are isolated per patient. When AI PDF analysis is integrated in the next release, medical summaries and extracted metrics will automatically bind directly to {activePatient.fullName}&apos;s clinical profile.
        </div>
      </div>
    </div>
  );
}
