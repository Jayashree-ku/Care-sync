import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onNavigateToSignup }) {
  const [email, setEmail] = useState('jayashree@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    onLoginSuccess(email, password, rememberMe);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordMsg('For this hackathon prototype, your account is stored locally. You may log in directly with any email or use the Demo button below.');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div className="cs-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 9v4" />
              <path d="M10 11h4" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>Welcome to CareSync</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--cs-text-muted)', marginTop: '0.375rem' }}>
            Family Health Management & Clinical Communication
          </p>
        </div>

        {error && (
          <div className="validation-message" style={{ marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {forgotPasswordMsg && (
          <div style={{ background: 'var(--cs-accent-light)', border: '1px solid #bae6fd', color: '#0369a1', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {forgotPasswordMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
              <a href="#forgot" onClick={handleForgotPassword} style={{ fontSize: '0.8125rem', color: 'var(--cs-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--cs-primary)' }}
            />
            <label htmlFor="remember-me" style={{ fontSize: '0.875rem', color: 'var(--cs-text-muted)', cursor: 'pointer' }}>
              Remember me on this browser
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            Sign In to CareSync
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--cs-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--cs-text-muted)' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              style={{ background: 'none', border: 'none', color: 'var(--cs-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
