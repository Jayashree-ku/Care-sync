import React, { useState } from 'react';

export default function MedicationsPage({
  activePatient,
  onAddMedication,
  onRemoveMedication,
  onBackToDashboard
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [medData, setMedData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const medications = Array.isArray(activePatient.medications) ? activePatient.medications : [];

  const handleSave = (e) => {
    e.preventDefault();
    if (!medData.name.trim()) {
      setError('Please enter the medication name.');
      return;
    }

    onAddMedication(activePatient.id, medData);
    setShowAddForm(false);
    setMedData({
      name: '',
      dosage: '',
      frequency: '',
      prescribedBy: '',
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
            Medications for {activePatient.fullName}
          </h1>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Active prescriptions and regular medications for this profile.
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
          {!showAddForm && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Add Medication
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="cs-card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Record Medication</h3>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="validation-message" style={{ marginBottom: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Medication Name <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Amlodipine, Paracetamol"
                  value={medData.name}
                  onChange={(e) => setMedData({ ...medData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dosage <span className="form-label-optional">(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 5mg, 500mg"
                  value={medData.dosage}
                  onChange={(e) => setMedData({ ...medData, dosage: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Frequency <span className="form-label-optional">(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Once daily in morning"
                  value={medData.frequency}
                  onChange={(e) => setMedData({ ...medData, frequency: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescribed By <span className="form-label-optional">(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Dr. Sarah Mitchell"
                  value={medData.prescribedBy}
                  onChange={(e) => setMedData({ ...medData, prescribedBy: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Instructions <span className="form-label-optional">(optional)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Take with food"
                value={medData.notes}
                onChange={(e) => setMedData({ ...medData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Medication
              </button>
            </div>
          </form>
        </div>
      )}

      {medications.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '50%', background: 'var(--cs-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cs-text-light)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>No medications recorded</h3>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            No prescription or regular medications are currently listed for {activePatient.fullName}.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '1.25rem' }}
            onClick={() => setShowAddForm(true)}
          >
            + Add Medication
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {medications.map((med) => (
            <div key={med.id} className="cs-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
                  {med.name}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
                  <strong>Dosage:</strong> {med.dosage || 'Not specified'} • <strong>Frequency:</strong> {med.frequency || 'Regular'}
                </div>
                {med.prescribedBy && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', marginTop: '0.25rem' }}>
                    Prescribed by: {med.prescribedBy}
                  </div>
                )}
                {med.notes && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginTop: '0.25rem' }}>
                    Note: {med.notes}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={() => onRemoveMedication(activePatient.id, med.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
