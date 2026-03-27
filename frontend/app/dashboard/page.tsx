'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/component/auth/hooks/use-auth';

export default function Dashboard() {
  const { SignOut, profiles, isLoadingProfiles, isProfilesForbidden } = useAuth();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
      setDate(now.toISOString().slice(0, 10));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const g = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 5000);
    return () => clearInterval(g);
  }, []);

  return (
    <>
      <div className="app">
        <div className="noise" />

        {/* TOPBAR */}
        <header className="topbar flex flex-row justify-between">
          <div></div>
          <div className="topbar-right">
            <div className="live-indicator">
              <div className="live-dot" />
              LIVE
            </div>
            <div className="time-display">{date} — {time}</div>
            <div className="operator-badge" onClick={SignOut} style={{ cursor: 'pointer' }}>OUT ▾</div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '800px' }}>
            <div className="panel-header">
              <span className="panel-title">SYSTEM_PROFILES</span>
              {isLoadingProfiles && <span className="loader-mini">LOADING...</span>}
            </div>
            
            {isLoadingProfiles ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                FETCHING_SYSTEM_DATA...
              </div>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles?.map((profile: any) => (
                    <tr key={profile.id}>
                      <td>{profile.first_name} {profile.last_name}</td>
                      <td style={{ color: '#aaff00', opacity: 0.7 }}>{profile.email}</td>
                      <td>
                        <span className={`status-badge ${profile.role?.toLowerCase()}`}>
                          {profile.role?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {isProfilesForbidden && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
                        ACCESS_DENIED: INSUFFICIENT_PRIVILEGES
                      </td>
                    </tr>
                  )}
                  {(!profiles || profiles.length === 0) && !isProfilesForbidden && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>NO_PROFILES_FOUND</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer" style={{ marginTop: 'auto' }}>
          <span className="footer-copy">©2024 KINETIC_BRUTALIST_INFRASTRUCTURE · GEO_LOC: [REDACTED]</span>
        </footer>
      </div>
    </>
  );
}