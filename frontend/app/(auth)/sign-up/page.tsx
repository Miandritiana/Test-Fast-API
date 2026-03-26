'use client';

import { useAuth } from '@/component/auth/hooks/use-auth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as React from 'react';
import * as z from 'zod';
import { getFormSchemaSignUp } from '@/lib/validations';

const formSchemaSignUp = getFormSchemaSignUp();

export default function SignUp() {
  const [time, setTime] = useState('');
  const [glitch, setGlitch] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // Error state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  const { SignUp, isSignUp, error: apiError } = useAuth();
  const [validation, setValidation] = React.useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setValidation(null);

    const result = formSchemaSignUp.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      await SignUp({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      setValidation("Account initialized successfully. Redirecting...");
    } catch (err) {
      // API error is handled by useAuth and exposed via apiError
      console.error("Sign up failed:", err);
    }
  }


  return (
    <>

      <div className="page">
        <div className="noise" />

        <main className="main">
          {/* LEFT */}
          <div className="left">
            <div className="logo">ATYPIQUE_</div>
            <div className="logo-sub">KINETIC_BRUTALIST_INFRASTRUCTURE</div>

            <div className="media-grid">
              <div className="media-block media-block-main">
                {/* Server image placeholder — swap with real <Image> */}
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5" />
                    <rect x="8" y="26" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5" />
                    <rect x="8" y="44" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5" />
                    <circle cx="50" cy="14" r="2" fill="#aaff00" />
                    <circle cx="50" cy="32" r="2" fill="#333" />
                    <circle cx="50" cy="50" r="2" fill="#333" />
                  </svg>
                </div>
                <div className="encrypted-badge">ENCRYPTED_NODE_01</div>
              </div>

              <div className="media-block media-block-accent">
                <span className="percent-text">99%</span>
              </div>

              <div className="media-block media-block-proto">
                <span className="proto-line">PROTOCOL: <span className="proto-val">DELTA-9</span></span>
                <span className="proto-line">STATUS: <span className="proto-val">READY</span></span>
                <span className="proto-line">UPTIME: <span className="proto-val">99.9%</span></span>
              </div>

              <div className="media-block media-block-scan">
                <div className="scan-lines" />
                <div className="scan-bar" />
              </div>
            </div>

            <div className="left-bottom">
              <div className="collective-text">JOIN THE KINETIC<br />COLLECTIVE.</div>
              <div className="terminal-icon">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <polyline points="1,3 6,7 1,11" stroke="#aaff00" strokeWidth="1.5" fill="none" />
                  <line x1="8" y1="11" x2="17" y2="11" stroke="#aaff00" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="section-label">OPERATOR ONBOARDING</div>

            <h1 className={`form-title${glitch ? ' glitch' : ''}`}>
              INITIALIZE_ACCOUNT
            </h1>

            <p className="form-desc">
              Synchronize your identity with the Atypique digital infrastructure.
            </p>

            <form className="form" onSubmit={onSubmit}>
              {apiError && (
                <div className="error-message mb-4 p-2 border border-red-500 bg-red-500/10 text-red-500 text-xs uppercase tracking-widest font-bold">
                  {apiError}
                </div>
              )}
              {validation && (
                <div className="success-message mb-4 p-2 border border-[#aaff00] bg-[#aaff00]/10 text-[#aaff00] text-xs uppercase tracking-widest font-bold animate-pulse">
                  {validation}
                </div>
              )}

              <div className="field">
                <label className="field-label uprecase">First name</label>
                <input
                  className={`field-input ${errors.first_name ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="OPERATOR NAME"
                  autoComplete="off"
                  disabled={isSignUp}
                />
                {errors.first_name && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.first_name}</span>}
              </div>


              <div className="field">
                <label className="field-label uprecase">Last Name</label>
                <input
                  className={`field-input ${errors.last_name ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="OPERATOR NAME"
                  autoComplete="off"
                  disabled={isSignUp}
                />
                {errors.last_name && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.last_name}</span>}
              </div>

              <div className="field">
                <label className="field-label">NETWORK_IDENTITY (EMAIL)</label>
                <input
                  className={`field-input ${errors.email ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="IDENTITY@NETWORK.LABS"
                  autoComplete="off"
                  disabled={isSignUp}
                />
                {errors.email && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.email}</span>}
              </div>

              <div className="field">
                <label className="field-label upercase">Password</label>
                <input
                  className={`field-input ${errors.password ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="············"
                  disabled={isSignUp}
                />
                {errors.password && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.password}</span>}
              </div>

              <div className="field">
                <label className="field-label upercase">Confirm Password</label>
                <input
                  className={`field-input ${errors.passwordConfirm ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="············"
                  disabled={isSignUp}
                />
                {errors.passwordConfirm && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.passwordConfirm}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isSignUp}>
                {isSignUp ? (
                  <span className="flex items-center justify-center">
                    INITIALIZING...
                    <span className="loading-spinner ml-2"></span>
                  </span>
                ) : (
                  <>
                    ESTABLISH CONNECTION
                    <span className="submit-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="reauth-row flex flex-row items-center justify-center">
              ALREADY AN OPERATOR?&nbsp;
              <Link href="/sign-in" className="m-0">
                RE_AUTHENTICATE
              </Link>
            </div>

            <div className="geo-info">
              LOCAL_TIME: {time}<br />
              GEO_LOC: [REDACTED]
            </div>
          </div>
        </main>

        <footer className="footer">
          <span className="footer-copy">©2024 KINETIC_BRUTALIST_INFRASTRUCTURE</span>
          <nav className="footer-links">
            <a className="footer-link">PROTOCOL</a>
            <a className="footer-link">TERMINAL</a>
            <a className="footer-link">ENCRYPTION</a>
          </nav>
        </footer>
      </div>
    </>
  );
}