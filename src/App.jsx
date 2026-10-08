import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuestionnaireContainer from './components/Questionnaire/QuestionnaireContainer';
import SummaryView from './components/Summary/SummaryView';
import ShowDoctorView from './components/Summary/ShowDoctorView';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import PatientsPage from './components/Patients/PatientsPage';
import ProfilePage from './components/Profile/ProfilePage';
import MedicationsPage from './components/Medications/MedicationsPage';
import ReportsPage from './components/Reports/ReportsPage';
import MedicalInfoPage from './components/MedicalInfo/MedicalInfoPage';

import {
  initializeFamilyStore,
  getAuthUser,
  isUserLoggedIn,
  loginUser,
  signupUser,
  logoutUser,
  getPatients,
  getActivePatient,
  setActivePatientId,
  addPatient,
  updatePatient,
  addPatientMedication,
  removePatientMedication,
  addPatientReport,
  removePatientReport,
  savePatientDoctorVisit
} from './data/familyStore';

import { generateDoctorVisitSummary } from './utils/summaryGenerator';

function getNormalizedRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    return hash.startsWith('/') ? hash : `/${hash}`;
  }
  const pathname = window.location.pathname;
  if (pathname.includes('/doctor-visit/summary')) return '/doctor-visit/summary';
  if (pathname.includes('/doctor-visit')) return '/doctor-visit';
  if (pathname.includes('/login')) return '/login';
  if (pathname.includes('/signup')) return '/signup';
  if (pathname.includes('/patients')) return '/patients';
  if (pathname.includes('/medications')) return '/medications';
  if (pathname.includes('/reports')) return '/reports';
  if (pathname.includes('/profile')) return '/profile';
  if (pathname.includes('/medical-info')) return '/medical-info';
  return '/';
}

export default function App() {
  // Initialize storage seeds once on mount
  useEffect(() => {
    initializeFamilyStore();
  }, []);

  // Authentication & session state
  const [isLoggedIn, setIsLoggedIn] = useState(() => isUserLoggedIn());
  const [authUser, setAuthUser] = useState(() => getAuthUser());

  // Family & Patients state
  const [patients, setPatients] = useState(() => getPatients());
  const [activePatient, setActivePatient] = useState(() => getActivePatient());

  // Route state
  const [currentPath, setCurrentPath] = useState(() => {
    const route = getNormalizedRoute();
    if (!isUserLoggedIn() && route !== '/signup') {
      return '/login';
    }
    return route;
  });

  // Active Doctor Visit Summary
  const [activeSummary, setActiveSummary] = useState(() => {
    try {
      const saved = localStorage.getItem('caresync_active_summary');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Show Doctor Presentation Mode
  const [isShowDoctorMode, setIsShowDoctorMode] = useState(false);

  // Sync route with browser history and hash change
  useEffect(() => {
    const handleRouteSync = () => {
      const route = getNormalizedRoute();
      if (!isLoggedIn && route !== '/signup') {
        setCurrentPath('/login');
      } else {
        setCurrentPath(route);
      }
    };
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [isLoggedIn]);

  // Listen to custom patient changed event
  useEffect(() => {
    const handlePatientChanged = () => {
      setPatients(getPatients());
      setActivePatient(getActivePatient());
    };
    window.addEventListener('caresync_patient_changed', handlePatientChanged);
    return () => window.removeEventListener('caresync_patient_changed', handlePatientChanged);
  }, []);

  const navigateTo = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ----------------- Auth Handlers -----------------

  const handleLogin = (email, password, rememberMe) => {
    const result = loginUser(email, password, rememberMe);
    if (result.success) {
      setIsLoggedIn(true);
      setAuthUser(result.user);
      setPatients(getPatients());
      setActivePatient(getActivePatient());
      navigateTo('/');
    }
  };

  const handleSignup = (accountData, patientData) => {
    const result = signupUser(accountData, patientData);
    setIsLoggedIn(true);
    setAuthUser(result.user);
    setPatients(getPatients());
    setActivePatient(result.patient);
    navigateTo('/');
  };

  const handleSignOut = () => {
    logoutUser();
    setIsLoggedIn(false);
    setAuthUser(null);
    navigateTo('/login');
  };

  // ----------------- Patient Handlers -----------------

  const handleSelectPatient = (patientId) => {
    setActivePatientId(patientId);
    const updatedPatients = getPatients();
    setPatients(updatedPatients);
    const found = updatedPatients.find(p => p.id === patientId);
    setActivePatient(found || updatedPatients[0]);

    // Reset current active summary so Dad doesn't see Mom's summary
    setActiveSummary(null);
    localStorage.removeItem('caresync_active_summary');

    navigateTo('/');
  };

  const handleAddPatient = (patientFormData) => {
    const newPatient = addPatient(patientFormData);
    const updated = getPatients();
    setPatients(updated);
    setActivePatient(newPatient);
    navigateTo('/patients');
  };

  const handleUpdateProfile = (patientId, updatedFields) => {
    updatePatient(patientId, updatedFields);
    const updated = getPatients();
    setPatients(updated);
    const current = updated.find(p => p.id === patientId);
    setActivePatient(current || updated[0]);
  };

  const handleAddMedication = (patientId, medication) => {
    addPatientMedication(patientId, medication);
    const updated = getPatients();
    setPatients(updated);
    setActivePatient(updated.find(p => p.id === patientId));
  };

  const handleRemoveMedication = (patientId, medicationId) => {
    removePatientMedication(patientId, medicationId);
    const updated = getPatients();
    setPatients(updated);
    setActivePatient(updated.find(p => p.id === patientId));
  };

  const handleAddReport = (patientId, report) => {
    addPatientReport(patientId, report);
    const updated = getPatients();
    setPatients(updated);
    setActivePatient(updated.find(p => p.id === patientId));
  };

  const handleRemoveReport = (patientId, reportId) => {
    removePatientReport(patientId, reportId);
    const updated = getPatients();
    setPatients(updated);
    setActivePatient(updated.find(p => p.id === patientId));
  };

  // ----------------- Doctor Visit Handlers -----------------

  const handleStartDoctorVisit = () => {
    navigateTo('/doctor-visit');
  };

  const handleGenerateDoctorVisitSummary = (formData) => {
    if (!activePatient) return;
    const summary = generateDoctorVisitSummary(formData, activePatient);
    savePatientDoctorVisit(activePatient.id, summary, formData);

    setActiveSummary(summary);
    try {
      localStorage.setItem('caresync_active_summary', JSON.stringify(summary));
    } catch (e) {}

    const updated = getPatients();
    setPatients(updated);
    setActivePatient(updated.find(p => p.id === activePatient.id));

    navigateTo('/doctor-visit/summary');
  };

  // ----------------- Presentation Mode -----------------

  if (isShowDoctorMode && activeSummary) {
    return (
      <ShowDoctorView
        summary={activeSummary}
        onExitDoctorMode={() => setIsShowDoctorMode(false)}
      />
    );
  }

  // ----------------- Unauthenticated Views -----------------

  if (!isLoggedIn) {
    if (currentPath === '/signup') {
      return (
        <SignupPage
          onSignupSuccess={handleSignup}
          onNavigateToLogin={() => navigateTo('/login')}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleLogin}
        onNavigateToSignup={() => navigateTo('/signup')}
      />
    );
  }

  // ----------------- Authenticated Layout -----------------

  return (
    <div className="app-container">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        activePatient={activePatient}
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onSignOut={handleSignOut}
        authUser={authUser}
      />

      <main className="main-content">
        {/* DASHBOARD */}
        {currentPath === '/' && (
          <Dashboard
            activePatient={activePatient}
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onStartDoctorVisit={handleStartDoctorVisit}
            onNavigate={navigateTo}
            onUploadReportClick={() => navigateTo('/reports')}
            onAddMedicationClick={() => navigateTo('/medications')}
          />
        )}

        {/* FAMILY / PATIENTS MANAGEMENT */}
        {currentPath === '/patients' && (
          <PatientsPage
            patients={patients}
            activePatientId={activePatient?.id}
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* PROFILE */}
        {currentPath === '/profile' && activePatient && (
          <ProfilePage
            activePatient={activePatient}
            onUpdateProfile={handleUpdateProfile}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* MEDICATIONS */}
        {currentPath === '/medications' && activePatient && (
          <MedicationsPage
            activePatient={activePatient}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* REPORTS */}
        {currentPath === '/reports' && activePatient && (
          <ReportsPage
            activePatient={activePatient}
            onAddReport={handleAddReport}
            onRemoveReport={handleRemoveReport}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* UNDERSTAND MEDICAL INFORMATION */}
        {currentPath === '/medical-info' && activePatient && (
          <MedicalInfoPage
            activePatient={activePatient}
            onAddReport={handleAddReport}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* PREPARE FOR DOCTOR VISIT */}
        {currentPath === '/doctor-visit' && activePatient && (
          <QuestionnaireContainer
            activePatient={activePatient}
            onGenerateSummary={handleGenerateDoctorVisitSummary}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* DOCTOR VISIT SUMMARY */}
        {currentPath === '/doctor-visit/summary' && activeSummary && (
          <SummaryView
            summary={activeSummary}
            onShowDoctor={() => setIsShowDoctorMode(true)}
            onEditSummary={() => navigateTo('/doctor-visit')}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* SUMMARY FALLBACK */}
        {currentPath === '/doctor-visit/summary' && !activeSummary && (
          <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              No Summary Available for {activePatient?.fullName || 'Current Patient'}
            </h2>
            <p style={{ color: 'var(--cs-text-muted)', marginBottom: '1.5rem' }}>
              Please complete the doctor visit questionnaire to generate a summary.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo('/doctor-visit')}
            >
              Start Doctor Visit Prep
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
