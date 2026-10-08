import React, { useState } from 'react';

export default function PatientsPage({
  patients,
  activePatientId,
  onSelectPatient,
  onAddPatient,
  onBackToDashboard
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'Mother',
    dateOfBirth: '',
    gender: 'Not specified',
    phone: '',
    bloodGroup: 'Not specified',
    knownAllergies: '',
    existingConditions: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    preferredDoctor: '',
    doctorPhone: '',
    preferredLanguage: 'English'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter the patient full name.');
      return;
    }
    if (!formData.dateOfBirth) {
      setError('Please enter the date of birth.');
      return;
    }

    onAddPatient(formData);
    setShowAddForm(false);
    // Reset form
    setFormData({
      fullName: '',
      relationship: 'Mother',
      dateOfBirth: '',
      gender: 'Not specified',
      phone: '',
      bloodGroup: 'Not specified',
      knownAllergies: '',
      existingConditions: '',
      currentMedications: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      preferredDoctor: '',
      doctorPhone: '',
      preferredLanguage: 'English'
    });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>Family & Patients</h1>
          <p style={{ color: 'var(--cs-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage health records individually for each member of your family.
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
              + Add Patient
            </button>
          )}
        </div>
      </div>

      {showAddForm ? (
        <div className="cs-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Family Member</h2>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="validation-message" style={{ marginBottom: '1.25rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cs-primary)', marginBottom: '0.75rem' }}>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                  <input
                    name="fullName"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Radha Kumar"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                  <select
                    name="relationship"
                    className="form-input"
                    value={formData.relationship}
                    onChange={handleChange}
                  >
                    <option value="Self">Self</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender / Sex <span className="form-label-optional">(optional)</span></label>
                  <select
                    name="gender"
                    className="form-input"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Not specified">Not specified</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--cs-border)', paddingTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cs-primary)', marginBottom: '0.75rem' }}>
                Health Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Blood Group <span className="form-label-optional">(optional)</span></label>
                  <select
                    name="bloodGroup"
                    className="form-input"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="Not specified">Not specified</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Known Allergies <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="knownAllergies"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Sulfa drugs, Peanuts, None..."
                    value={formData.knownAllergies}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Existing Medical Conditions <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="existingConditions"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Hypertension, Diabetes, None..."
                    value={formData.existingConditions}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Current Regular Medications <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="currentMedications"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Amlodipine 5mg daily, None..."
                    value={formData.currentMedications}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--cs-border)', paddingTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cs-primary)', marginBottom: '0.75rem' }}>
                Emergency & Doctor Contacts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="emergencyContactName"
                    type="text"
                    className="form-input"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="emergencyContactPhone"
                    type="tel"
                    className="form-input"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="emergencyContactRelationship"
                    type="text"
                    className="form-input"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred / Family Doctor <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="preferredDoctor"
                    type="text"
                    className="form-input"
                    value={formData.preferredDoctor}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Phone <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="doctorPhone"
                    type="tel"
                    className="form-input"
                    value={formData.doctorPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Language <span className="form-label-optional">(optional)</span></label>
                  <input
                    name="preferredLanguage"
                    type="text"
                    className="form-input"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                className="btn btn-primary btn-lg"
              >
                Save Patient Profile
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Patient List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {patients.map((patient) => {
          const isActive = patient.id === activePatientId;
          const medCount = Array.isArray(patient.medications) ? patient.medications.length : 0;
          const reportCount = Array.isArray(patient.reports) ? patient.reports.length : 0;
          const visitCount = Array.isArray(patient.doctorVisits) ? patient.doctorVisits.length : 0;

          return (
            <div
              key={patient.id}
              className="cs-card"
              style={{
                border: isActive ? '2px solid var(--cs-primary)' : '1px solid var(--cs-border)',
                background: isActive ? 'var(--cs-primary-light)' : 'var(--cs-surface)',
                position: 'relative'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--cs-primary)',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  Active Patient
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--cs-primary)' : 'var(--cs-accent)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.125rem',
                  fontWeight: 700
                }}>
                  {patient.fullName ? patient.fullName.charAt(0) : 'P'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>
                    {patient.fullName}
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--cs-text-light)', fontWeight: 500 }}>
                    {patient.relationship} • {patient.gender || 'Not specified'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--cs-border)', textAlign: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-primary)' }}>{medCount}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>Meds</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-accent)' }}>{reportCount}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>Reports</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cs-text-main)' }}>{visitCount}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--cs-text-light)', textTransform: 'uppercase' }}>Visits</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--cs-text-muted)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>DOB:</strong> {patient.dateOfBirth || 'Not specified'}</div>
                <div><strong>Allergies:</strong> {patient.knownAllergies || 'None'}</div>
                <div><strong>Conditions:</strong> {patient.existingConditions || 'None'}</div>
              </div>

              {isActive ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem' }}
                    onClick={onBackToDashboard}
                  >
                    Open Dashboard
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.5rem' }}
                  onClick={() => onSelectPatient(patient.id)}
                >
                  Switch to {patient.fullName.split(' ')[0]}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
