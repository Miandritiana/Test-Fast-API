'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SignUp() {
  const [time, setTime] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [glitch, setGlitch] = useState(false);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0d0d;
          color: #e0e0e0;
          font-family: 'Space Mono', monospace;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
          background: #0d0d0d;
          position: relative;
          overflow: hidden;
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          position: relative;
          z-index: 1;
        }

        /* LEFT PANEL */
        .left {
          padding: 48px 48px 48px 48px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #222;
        }

        .logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2.6rem;
          color: #aaff00;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #555;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 60px;
        }

        .media-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 8px;
          flex: 1;
        }

        .media-block {
          position: relative;
          overflow: hidden;
          background: #111;
        }

        .media-block-main {
          grid-column: 1;
          grid-row: 1;
          aspect-ratio: 4/3;
          background: #111;
        }

        .media-block-accent {
          grid-column: 2;
          grid-row: 1;
          background: #aaff00;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 4/3;
        }

        .percent-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 3.5rem;
          color: #0d0d0d;
          line-height: 1;
        }

        .media-block-proto {
          grid-column: 1;
          grid-row: 2;
          padding: 14px;
          border: 1px solid #222;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #666;
          line-height: 1.8;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 140px;
          position: relative;
        }

        .proto-line { color: #888; }
        .proto-val { color: #aaff00; }

        .media-block-scan {
          grid-column: 2;
          grid-row: 2;
          background: #0a0a0a;
          overflow: hidden;
          min-height: 140px;
          position: relative;
        }

        .scan-lines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(170, 255, 0, 0.03) 2px,
            rgba(170, 255, 0, 0.03) 4px
          );
        }

        .scan-bar {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: rgba(170, 255, 0, 0.4);
          animation: scanMove 2.5s linear infinite;
          box-shadow: 0 0 8px rgba(170,255,0,0.6);
        }

        @keyframes scanMove {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .encrypted-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #aaff00;
          color: #0d0d0d;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          padding: 3px 8px;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .server-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          filter: grayscale(1);
        }

        .left-bottom {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .collective-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: #e0e0e0;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .terminal-icon {
          width: 42px;
          height: 42px;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaff00;
          font-size: 1rem;
        }

        /* RIGHT PANEL */
        .right {
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #555;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .section-label::before {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: #aaff00;
        }

        .form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 3rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 12px;
        }

        .form-title.glitch {
          animation: glitchAnim 0.15s steps(2) forwards;
        }

        @keyframes glitchAnim {
          0%   { text-shadow: 2px 0 #aaff00, -2px 0 #ff0055; clip-path: inset(0 0 80% 0); }
          25%  { text-shadow: -2px 0 #aaff00, 2px 0 #ff0055; clip-path: inset(40% 0 40% 0); }
          50%  { text-shadow: 2px 0 #ff0055, -2px 0 #aaff00; clip-path: inset(60% 0 20% 0); }
          100% { text-shadow: none; clip-path: inset(0); }
        }

        .form-desc {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .form { display: flex; flex-direction: column; gap: 20px; }

        .field { display: flex; flex-direction: column; gap: 6px; }

        .field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #555;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .field-input {
          background: #111;
          border: 1px solid #2a2a2a;
          color: #e0e0e0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          padding: 14px 16px;
          outline: none;
          letter-spacing: 1px;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }

        .field-input::placeholder { color: #3a3a3a; }

        .field-input:focus {
          border-color: #aaff00;
          background: #141414;
        }

        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 4px;
        }

        .checkbox-row input[type="checkbox"] {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid #333;
          background: #111;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          position: relative;
          transition: border-color 0.2s;
        }

        .checkbox-row input[type="checkbox"]:checked {
          background: #aaff00;
          border-color: #aaff00;
        }

        .checkbox-row input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 4px; top: 1px;
          width: 5px; height: 9px;
          border: 2px solid #0d0d0d;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }

        .checkbox-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #555;
          line-height: 1.6;
        }

        .checkbox-label a {
          color: #e0e0e0;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }

        .submit-btn {
          background: #aaff00;
          color: #0d0d0d;
          border: none;
          padding: 18px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.15s, transform 0.1s;
          margin-top: 8px;
        }

        .submit-btn:hover { background: #ccff33; }
        .submit-btn:active { transform: scale(0.99); }

        .submit-arrow {
          font-size: 1.1rem;
          font-weight: 400;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0 16px;
        }

        .divider-line { flex: 1; height: 1px; background: #222; }

        .divider-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #444;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .alt-gateways {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .gateway-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #777;
          padding: 13px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: border-color 0.2s, color 0.2s;
        }

        .gateway-btn:hover { border-color: #aaff00; color: #aaff00; }

        .reauth-row {
          text-align: center;
          margin-top: 24px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #444;
          letter-spacing: 1px;
        }

        .reauth-row a {
          color: #aaff00;
          text-decoration: none;
          letter-spacing: 1px;
          cursor: pointer;
        }

        /* FOOTER */
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 48px;
          border-top: 1px solid #1a1a1a;
          position: relative;
          z-index: 1;
        }

        .footer-copy {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #333;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #444;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover { color: #aaff00; }

        .geo-info {
          position: absolute;
          bottom: 16px;
          right: 48px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: #2a2a2a;
          text-align: right;
          line-height: 1.8;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .main { grid-template-columns: 1fr; }
          .left { border-right: none; border-bottom: 1px solid #222; }
          .right { padding: 40px 32px; }
        }
      `}</style>

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
                    <rect x="8" y="8" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5"/>
                    <rect x="8" y="26" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5"/>
                    <rect x="8" y="44" width="48" height="12" rx="1" stroke="#333" strokeWidth="1.5"/>
                    <circle cx="50" cy="14" r="2" fill="#aaff00"/>
                    <circle cx="50" cy="32" r="2" fill="#333"/>
                    <circle cx="50" cy="50" r="2" fill="#333"/>
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
                  <polyline points="1,3 6,7 1,11" stroke="#aaff00" strokeWidth="1.5" fill="none"/>
                  <line x1="8" y1="11" x2="17" y2="11" stroke="#aaff00" strokeWidth="1.5"/>
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

            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="field">
                <label className="field-label uprecase">First name</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="OPERATOR NAME"
                  autoComplete="off"
                />
              </div>

              
              <div className="field">
                <label className="field-label uprecase">Last Name</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="OPERATOR NAME"
                  autoComplete="off"
                />
              </div>

              <div className="field">
                <label className="field-label">NETWORK_IDENTITY (EMAIL)</label>
                <input
                  className="field-input"
                  type="email"
                  placeholder="IDENTITY@NETWORK.LABS"
                  autoComplete="off"
                />
              </div>

              <div className="field">
                <label className="field-label upercase">Password</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="············"
                />
              </div>

              <button type="submit" className="submit-btn">
                ESTABLISH CONNECTION
                <span className="submit-arrow">→</span>
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