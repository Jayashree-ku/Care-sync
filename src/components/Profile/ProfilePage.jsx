import React, { useState } from 'react';

export default function ProfilePage({ activePatient, onUpdateProfile, onBackToDashboard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: activePatient.fullName || '',
    relationship: activePatient.relationship || 'Self',
    dateOfBirth: activePatient.dateOfBirth || '',
    gender: activePatient.gender || 'Not specified',
    phone: activePatient.phone || '',
    bloodGroup: activePatient.bloodGroup || 'Not specified',
    knownAllergies: activePatient.knownAllergies || '',
    existingConditions: activePatient.existingConditions || '',
    currentMedications: activePatient.currentMedications || '',
    emergencyContactName: activePatient.emergencyContactName || '',
    emergencyContactPhone: activePatient.emergencyContactPhone || '',
    emergencyContactRelationship: activePatient.emergencyContactRelationship || '',
    preferredDoctor: activePatient.preferredDoctor || '',
    doctorPhone: activePatient.doctorPhone || '',
    preferredLanguage: activePatient.preferredLanguage || 'English'
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(activePatient.id, formData);
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cs-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Patient Profile
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>
            {activePatient.fullName}
          </h1>
          <span style={{ fontSize: '0.875rem', color: 'var(--cs-text-light)' }}>
            Relationship: <strong>{activePatient.relationship}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToDashboard}
          >
            &larr; Dashboard
          </button>
          {!isEditing ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--cs-primary-light)', border: '1px solid var(--cs-primary-border)', color: 'var(--cs-primary-hover)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {successMsg}
        </div>
      )}

      {isEditing ? (
        <div className="cs-card">
          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--cs-primary)' }}>
              Edit Profile Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
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
                <label className="form-label">Gender</label>
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
                <label className="form-label">Blood Group</label>
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
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <textarea
                name="knownAllergies"
                rows={2}
                className="form-textarea"
                value={formData.knownAllergies}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Existing Medical Conditions</label>
              <textarea
                name="existingConditions"
                rows={2}
                className="form-textarea"
                value={formData.existingConditions}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Regular Medications</label>
              <textarea
                name="currentMedications"
                rows={2}
                className="form-textarea"
                value={formData.currentMedications}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input
                  name="emergencyContactName"
                  type="text"
                  className="form-input"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Phone</label>
                <input
                  name="emergencyContactPhone"
                  type="tel"
                  className="form-input"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Doctor</label>
                <input
                  name="preferredDoctor"
                  type="text"
                  className="form-input"
                  value={formData.preferredDoctor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="cs-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cs-primary)', marginBottom: '1rem' }}>
              General Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span className="patient-info-title">Full Name</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.fullName}</div>
              </div>
              <div>
                <span className="patient-info-title">Relationship</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.relationship}</div>
              </div>
              <div>
                <span className="patient-info-title">Date of Birth</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.dateOfBirth || 'Not specified'}</div>
              </div>
              <div>
                <span className="patient-info-title">Gender / Sex</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.gender || 'Not specified'}</div>
              </div>
              <div>
                <span className="patient-info-title">Blood Group</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.bloodGroup || 'Not specified'}</div>
              </div>
              <div>
                <span className="patient-info-title">Preferred Language</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.preferredLanguage || 'English'}</div>
              </div>
            </div>
          </div>

          <div className="cs-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cs-primary)', marginBottom: '1rem' }}>
              Clinical History & Safety Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="patient-info-title">Known Allergies</span>
                <div style={{ marginTop: '0.25rem', fontWeight: 500 }}>
                  {activePatient.knownAllergies || 'None recorded'}
                </div>
              </div>
              <div>
                <span className="patient-info-title">Existing Medical Conditions</span>
                <div style={{ marginTop: '0.25rem', fontWeight: 500 }}>
                  {activePatient.existingConditions || 'None recorded'}
                </div>
              </div>
              <div>
                <span className="patient-info-title">Current Regular Medications</span>
                <div style={{ marginTop: '0.25rem', fontWeight: 500 }}>
                  {activePatient.currentMedications || 'None recorded'}
                </div>
              </div>
            </div>
          </div>

          <div className="cs-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cs-primary)', marginBottom: '1rem' }}>
              Emergency & Healthcare Contacts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span className="patient-info-title">Emergency Contact</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.emergencyContactName || 'Not specified'}</div>
              </div>
              <div>
                <span className="patient-info-title">Emergency Phone</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.emergencyContactPhone || 'Not specified'}</div>
              </div>
              <div>
                <span className="patient-info-title">Preferred Doctor</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{activePatient.preferredDoctor || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
