import React from 'react';

export default function Navbar({ currentPath, onNavigate, patientProfile }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
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
          <span className="brand-tag">Clinical Portal</span>
        </a>

        <div className="nav-actions">
          <button 
            type="button"
            className={`btn btn-sm ${currentPath === '/' ? 'btn-secondary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/')}
            style={{ fontWeight: 600 }}
          >
            Dashboard
          </button>
          <button 
            type="button"
            className={`btn btn-sm ${currentPath.startsWith('/doctor-visit') ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onNavigate('/doctor-visit')}
          >
            Doctor Visit
          </button>
          
          <div className="user-badge" title="Active Patient Profile">
            <div className="user-avatar">
              {patientProfile?.fullName ? patientProfile.fullName.charAt(0) : 'P'}
            </div>
            <span>{patientProfile?.fullName || 'Patient'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
