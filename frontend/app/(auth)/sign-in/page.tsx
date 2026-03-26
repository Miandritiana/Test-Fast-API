'use client';

import { useAuth } from '@/component/auth/hooks/use-auth';
import Link from 'next/dist/client/link';
import { useState, useEffect } from 'react';
import { getFormSchemaSignIn } from '@/lib/validations';
import * as z from 'zod';

const formSchemaSignIn = getFormSchemaSignIn();

export default function SignIn() {
  const [time, setTime] = useState('');
  const [glitch, setGlitch] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const BOOT_SEQUENCE = [
    'LOADING KERNEL...',
    'VERIFYING NODE INTEGRITY...',
    'ESTABLISHING SECURE TUNNEL...',
    'READY.',
  ];

  useEffect(() => {
    const tick = () => setTime(new Date().toTimeString().slice(0, 8));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
        setTimeout(next, 380);
      }
    };
    setTimeout(next, 400);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { SignInWithPassword, isSignInWithPassword, error: apiError } = useAuth();

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

    const result = formSchemaSignIn.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      await SignInWithPassword({ 
        email: formData.email, 
        password: formData.password 
      });
    } catch (err) {
      // API error is handled by useAuth and exposed via apiError
      console.error("Sign in failed:", err);
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

            <div className="status-grid">
              <div className="rack-block">
                <div className="rack-art">
                  {[80, 45, 90, 30, 70, 55, 85, 40].map((fill, i) => (
                    <div
                      key={i}
                      className="rack-unit"
                      style={{ ['--fill' as string]: `${fill}%` }}
                    />
                  ))}
                </div>
                <div className="rack-badge">ENCRYPTED_NODE_01</div>
              </div>

              <div className="uptime-block">
                <span className="uptime-number">99%</span>
                <span className="uptime-label">UPTIME</span>
              </div>

              <div className="proto-block">
                <div>PROTOCOL: <span className="proto-val">DELTA-9</span></div>
                <div>STATUS: <span className="proto-val">READY</span></div>
                <div>UPTIME: <span className="proto-val">99.9%</span></div>
              </div>

              <div className="boot-block">
                {bootLines.map((line, i) => (
                  <div key={i} className="boot-line">&gt; {line}</div>
                ))}
                {bootLines.length < BOOT_SEQUENCE.length && (
                  <span className="cursor-blink" />
                )}
              </div>
            </div>

            <div className="left-bottom">
              <div className="collective-text">JOIN THE KINETIC<br />COLLECTIVE.</div>
              <div className="terminal-icon">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <polyline points="1,3 6,7 1,11" stroke="#aaff00" strokeWidth="1.5" fill="none"/>
                  <line x1="8" y1="11" x2="17" y2="11" stroke="#aaff00" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="section-label">OPERATOR AUTHENTICATION</div>

            <h1 className={`form-title${glitch ? ' glitch' : ''}`}>
              RE_AUTHENTICATE
            </h1>

            <p className="form-desc">
              Verify your credentials to access the Atypique digital infrastructure.
            </p>

            <form className="form" onSubmit={onSubmit}>
              {apiError && (
                <div className="error-message mb-4 p-2 border border-red-500 bg-red-500/10 text-red-500 text-xs uppercase tracking-widest font-bold">
                  {apiError}
                </div>
              )}

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
                  disabled={isSignInWithPassword}
                />
                {errors.email && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.email}</span>}
              </div>

              <div className="field">
                <label className="field-label">ACCESS_KEY</label>
                <input
                  className={`field-input ${errors.password ? 'border-red-500 bg-red-500/5' : ''}`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="············"
                  disabled={isSignInWithPassword}
                />
                {errors.password && <span className="error-text text-red-500 text-[10px] uppercase mt-1 block">{errors.password}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isSignInWithPassword}>
                {isSignInWithPassword ? (
                  <span className="flex items-center justify-center">
                    AUTHENTICATING...
                    <span className="loading-spinner ml-2"></span>
                  </span>
                ) : (
                  <>
                    ESTABLISH CONNECTION
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="register-row flex flex-row items-center justify-center">
              NEW OPERATOR?&nbsp;
                <Link href="/sign-up" className="m-0">
                    INITIALIZE_ACCOUNT
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