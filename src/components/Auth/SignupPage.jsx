import React, { useState } from 'react';

export default function SignupPage({ onSignupSuccess, onNavigateToLogin }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1: Account
  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Step 2: Primary Patient Profile
  const [patientData, setPatientData] = useState({
    fullName: '',
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
    preferredLanguage: 'English',
    preferredDoctor: ''
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!accountData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!accountData.email.trim() || !accountData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!accountData.password || accountData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Prepopulate patient full name & phone
    setPatientData(prev => ({
      ...prev,
      fullName: prev.fullName || accountData.fullName,
      phone: prev.phone || accountData.phone
    }));

    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteSignup = (e) => {
    e.preventDefault();
    if (!patientData.fullName.trim()) {
      setError('Please enter the patient full name.');
      return;
    }
    if (!patientData.dateOfBirth) {
      setError('Please enter the date of birth.');
      return;
    }

    onSignupSuccess(accountData, patientData);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="cs-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 9v4" />
              <path d="M10 11h4" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>Create Your CareSync Account</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--cs-text-muted)', marginTop: '0.375rem' }}>
            {step === 1 ? 'Step 1 of 2: Family Account Details' : 'Step 2 of 2: Primary Patient Profile'}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: 'var(--cs-primary)' }} />
            <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: step === 2 ? 'var(--cs-primary)' : 'var(--cs-border)' }} />
          </div>
        </div>

        {error && (
          <div className="validation-message" style={{ marginBottom: '1.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep}>
            <div className="form-group">
              <label className="form-label" htmlFor="su-fullname">Full Name <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
              <input
                id="su-fullname"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="e.g., Jayashree K U"
                value={accountData.fullName}
                onChange={handleAccountChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="su-email">Email Address <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  id="su-email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="su-phone">Phone Number <span className="form-label-optional">(optional)</span></label>
                <input
                  id="su-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={accountData.phone}
                  onChange={handleAccountChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="su-pass">Password <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  id="su-pass"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={accountData.password}
                  onChange={handleAccountChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="su-cpass">Confirm Password <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  id="su-cpass"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={accountData.confirmPassword}
                  onChange={handleAccountChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Next: Primary Patient Profile &rarr;
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignup}>
            <div style={{ background: 'var(--cs-primary-light)', border: '1px solid var(--cs-primary-border)', padding: '0.875rem 1rem', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--cs-primary-hover)', marginBottom: '1.5rem' }}>
              <strong>Primary Patient:</strong> As the account holder, you are also registered as the primary patient. You can easily add and manage family members once your account is created.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pt-name">Patient Full Name <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  id="pt-name"
                  name="fullName"
                  type="text"
                  className="form-input"
                  value={patientData.fullName}
                  onChange={handlePatientChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pt-dob">Date of Birth <span style={{ color: 'var(--cs-danger)' }}>*</span></label>
                <input
                  id="pt-dob"
                  name="dateOfBirth"
                  type="date"
                  className="form-input"
                  value={patientData.dateOfBirth}
                  onChange={handlePatientChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pt-gender">Gender / Sex <span className="form-label-optional">(optional)</span></label>
                <select
                  id="pt-gender"
                  name="gender"
                  className="form-input"
                  value={patientData.gender}
                  onChange={handlePatientChange}
                >
                  <option value="Not specified">Not specified</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pt-blood">Blood Group <span className="form-label-optional">(optional)</span></label>
                <select
                  id="pt-blood"
                  name="bloodGroup"
                  className="form-input"
                  value={patientData.bloodGroup}
                  onChange={handlePatientChange}
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

              <div className="form-group">
                <label className="form-label" htmlFor="pt-lang">Preferred Language <span className="form-label-optional">(optional)</span></label>
                <input
                  id="pt-lang"
                  name="preferredLanguage"
                  type="text"
                  className="form-input"
                  placeholder="e.g., English"
                  value={patientData.preferredLanguage}
                  onChange={handlePatientChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pt-allergies">Known Allergies <span className="form-label-optional">(optional)</span></label>
              <input
                id="pt-allergies"
                name="knownAllergies"
                type="text"
                className="form-input"
                placeholder="e.g., Penicillin, Peanuts, None..."
                value={patientData.knownAllergies}
                onChange={handlePatientChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pt-cond">Existing Medical Conditions <span className="form-label-optional">(optional)</span></label>
              <input
                id="pt-cond"
                name="existingConditions"
                type="text"
                className="form-input"
                placeholder="e.g., Asthma, Migraines, None..."
                value={patientData.existingConditions}
                onChange={handlePatientChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pt-meds">Current Regular Medications <span className="form-label-optional">(optional)</span></label>
              <input
                id="pt-meds"
                name="currentMedications"
                type="text"
                className="form-input"
                placeholder="e.g., Daily Vitamin D, None..."
                value={patientData.currentMedications}
                onChange={handlePatientChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pt-em-name">Emergency Contact Name <span className="form-label-optional">(optional)</span></label>
                <input
                  id="pt-em-name"
                  name="emergencyContactName"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Ramesh Kumar"
                  value={patientData.emergencyContactName}
                  onChange={handlePatientChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pt-em-phone">Emergency Phone <span className="form-label-optional">(optional)</span></label>
                <input
                  id="pt-em-phone"
                  name="emergencyContactPhone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={patientData.emergencyContactPhone}
                  onChange={handlePatientChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pt-em-rel">Relationship <span className="form-label-optional">(optional)</span></label>
                <input
                  id="pt-em-rel"
                  name="emergencyContactRelationship"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Parent / Spouse"
                  value={patientData.emergencyContactRelationship}
                  onChange={handlePatientChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pt-doc">Preferred / Family Doctor <span className="form-label-optional">(optional)</span></label>
              <input
                id="pt-doc"
                name="preferredDoctor"
                type="text"
                className="form-input"
                placeholder="e.g., Dr. Sarah Mitchell"
                value={patientData.preferredDoctor}
                onChange={handlePatientChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
              >
                Complete Registration & Go to Dashboard
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--cs-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--cs-text-muted)' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              style={{ background: 'none', border: 'none', color: 'var(--cs-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
