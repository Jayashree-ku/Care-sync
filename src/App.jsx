import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuestionnaireContainer from './components/Questionnaire/QuestionnaireContainer';
import SummaryView from './components/Summary/SummaryView';
import ShowDoctorView from './components/Summary/ShowDoctorView';
import { getPatientProfile } from './data/defaultPatient';
import {
  loadQuestionnaireData,
  clearQuestionnaireData
} from './data/questionnaireData';
import { generateDoctorVisitSummary } from './utils/summaryGenerator';

function getNormalizedRoute() {
  // Check hash first (ideal for GitHub Pages public hosting)
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    return hash.startsWith('/') ? hash : `/${hash}`;
  }

  const pathname = window.location.pathname;
  if (pathname.includes('/doctor-visit/summary')) {
    return '/doctor-visit/summary';
  }
  if (pathname.includes('/doctor-visit')) {
    return '/doctor-visit';
  }
  return '/';
}

export default function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState(() => getNormalizedRoute());

  // Patient profile
  const [patientProfile] = useState(() => getPatientProfile());

  // Questionnaire data & draft tracking
  const [hasDraft, setHasDraft] = useState(() => {
    const data = loadQuestionnaireData();
    return Boolean(data.currentSymptoms && data.currentSymptoms.trim());
  });

  // Summary state
  const [generatedSummary, setGeneratedSummary] = useState(() => {
    try {
      const saved = localStorage.getItem('caresync_active_summary');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved summary', e);
    }
    return null;
  });

  // Show Doctor presentation mode
  const [isShowDoctorMode, setIsShowDoctorMode] = useState(false);

  // Sync route with browser history and hashchange
  useEffect(() => {
    const handleRouteSync = () => {
      setCurrentPath(getNormalizedRoute());
    };
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const navigateTo = (path) => {
    // Set both hash and pushState so that it works seamlessly both on GitHub Pages and local server
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDoctorVisit = () => {
    navigateTo('/doctor-visit');
  };

  const handleResetDraft = () => {
    if (window.confirm('Are you sure you want to clear your current answers and start fresh?')) {
      clearQuestionnaireData();
      localStorage.removeItem('caresync_active_summary');
      setGeneratedSummary(null);
      setHasDraft(false);
      navigateTo('/doctor-visit');
    }
  };

  const handleGenerateSummary = (formData) => {
    const summary = generateDoctorVisitSummary(formData, patientProfile);
    setGeneratedSummary(summary);
    try {
      localStorage.setItem('caresync_active_summary', JSON.stringify(summary));
    } catch (e) {
      console.error('Failed to store summary', e);
    }
    navigateTo('/doctor-visit/summary');
  };

  const handleEditSummary = () => {
    navigateTo('/doctor-visit');
  };

  // If in Show Doctor Mode, render pure clinical distraction-free view
  if (isShowDoctorMode && generatedSummary) {
    return (
      <ShowDoctorView
        summary={generatedSummary}
        onExitDoctorMode={() => setIsShowDoctorMode(false)}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        patientProfile={patientProfile}
      />

      <main className="main-content">
        {currentPath === '/' && (
          <Dashboard
            onStartDoctorVisit={handleStartDoctorVisit}
            patientProfile={patientProfile}
            hasExistingDraft={hasDraft}
            onResetDraft={handleResetDraft}
          />
        )}

        {currentPath === '/doctor-visit' && (
          <QuestionnaireContainer
            onGenerateSummary={handleGenerateSummary}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {currentPath === '/doctor-visit/summary' && generatedSummary && (
          <SummaryView
            summary={generatedSummary}
            onShowDoctor={() => setIsShowDoctorMode(true)}
            onEditSummary={handleEditSummary}
            onBackToDashboard={() => navigateTo('/')}
          />
        )}

        {/* Fallback if user lands on /doctor-visit/summary without existing summary */}
        {currentPath === '/doctor-visit/summary' && !generatedSummary && (
          <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              No Summary Available Yet
            </h2>
            <p style={{ color: 'var(--cs-text-muted)', marginBottom: '1.5rem' }}>
              Please answer the doctor visit questionnaire to generate your summary.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo('/doctor-visit')}
            >
              Start Questionnaire
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
