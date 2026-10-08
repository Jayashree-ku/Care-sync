import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({
  currentPath,
  onNavigate,
  activePatient,
  patients,
  onSelectPatient,
  onSignOut,
  _authUser
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePatientClick = (patientId) => {
    onSelectPatient(patientId);
    setIsDropdownOpen(false);
  };

  const handleAddPatientClick = () => {
    setIsDropdownOpen(false);
    onNavigate('/patients');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <a 
          href="/" 
          className="brand-link" 
          onClick={(e) => { 
            e.preventDefault(); 
            onNavigate('/'); 
          }}
        >
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 9v4" />
              <path d="M10 11h4" />
            </svg>
          </div>
          <span className="brand-name">CareSync</span>
          <span className="brand-tag">Family Health</span>
        </a>

        {/* Global Patient Switcher */}
        {activePatient && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.45rem 0.875rem',
                background: 'var(--cs-primary-light)',
                border: '1.5px solid var(--cs-primary)',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--cs-primary-hover)',
                transition: 'all 0.15s ease'
              }}
              title="Switch active patient/family member"
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'var(--cs-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {activePatient.fullName ? activePatient.fullName.charAt(0) : 'P'}
              </div>
              <span>
                Patient: <strong style={{ color: 'var(--cs-text-main)' }}>{activePatient.fullName}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)', marginLeft: '0.375rem', fontWeight: 500 }}>
                  ({activePatient.relationship})
                </span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '280px',
                background: '#ffffff',
                border: '1px solid var(--cs-border)',
                borderRadius: '12px',
                boxShadow: 'var(--cs-shadow-xl)',
                padding: '0.75rem',
                zIndex: 100
              }}>
                <div style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--cs-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  My Family
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {patients.map((p) => {
                    const isSelected = p.id === activePatient.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePatientClick(p.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.625rem 0.75rem',
                          background: isSelected ? 'var(--cs-primary-light)' : 'transparent',
                          border: isSelected ? '1px solid var(--cs-primary-border)' : '1px solid transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isSelected ? 'var(--cs-primary)' : 'var(--cs-accent)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {p.fullName ? p.fullName.charAt(0) : 'P'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cs-text-main)' }}>
                              {p.fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)' }}>
                              {p.relationship === 'Self' ? 'Me' : p.relationship}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cs-primary)" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--cs-border)' }}>
                  <button
                    type="button"
                    onClick={handleAddPatientClick}
                    className="btn btn-sm btn-outline-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    + Add Patient
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <div className="nav-actions">
          <button 
            type="button"
            className={`btn btn-sm ${currentPath === '/' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/')}
            style={{ fontWeight: 600 }}
          >
            Dashboard
          </button>

          <button 
            type="button"
            className={`btn btn-sm ${currentPath.startsWith('/doctor-visit') ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/doctor-visit')}
            style={{ fontWeight: 600 }}
          >
            Doctor Visit
          </button>

          <button 
            type="button"
            className={`btn btn-sm ${currentPath === '/medications' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/medications')}
            style={{ fontWeight: 600 }}
          >
            Medications
          </button>

          <button 
            type="button"
            className={`btn btn-sm ${currentPath === '/reports' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/reports')}
            style={{ fontWeight: 600 }}
          >
            Reports
          </button>

          <button 
            type="button"
            className={`btn btn-sm ${currentPath === '/profile' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/profile')}
            style={{ fontWeight: 600 }}
          >
            Profile
          </button>

          {/* Sign Out */}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onSignOut}
            title="Sign out of CareSync"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
