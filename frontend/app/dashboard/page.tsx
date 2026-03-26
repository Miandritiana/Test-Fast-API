'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/component/auth/hooks/use-auth';

const mockActivity = [
  { id: 'TXN_8821', type: 'AUTH', status: 'SUCCESS', node: 'NODE_07', time: '23:44:01' },
  { id: 'TXN_8820', type: 'SYNC', status: 'PENDING', node: 'NODE_12', time: '23:43:55' },
  { id: 'TXN_8819', type: 'WRITE', status: 'SUCCESS', node: 'NODE_03', time: '23:43:48' },
  { id: 'TXN_8818', type: 'READ', status: 'FAILED', node: 'NODE_99', time: '23:43:32' },
  { id: 'TXN_8817', type: 'AUTH', status: 'SUCCESS', node: 'NODE_07', time: '23:43:10' },
  { id: 'TXN_8816', type: 'SYNC', status: 'SUCCESS', node: 'NODE_12', time: '23:42:59' },
];

const nodes = [
  { id: 'NODE_01', uptime: 99.9, load: 72, status: 'ONLINE' },
  { id: 'NODE_03', uptime: 98.2, load: 45, status: 'ONLINE' },
  { id: 'NODE_07', uptime: 99.1, load: 88, status: 'ONLINE' },
  { id: 'NODE_12', uptime: 94.5, load: 31, status: 'DEGRADED' },
  { id: 'NODE_99', uptime: 0, load: 0, status: 'OFFLINE' },
];

export default function Dashboard() {
  const { SignOut } = useAuth();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [uptime, setUptime] = useState(0);
  const [packets, setPackets] = useState(482910);
  const [glitch, setGlitch] = useState(false);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
      setDate(now.toISOString().slice(0, 10));
      setUptime((u) => u + 1);
      setPackets((p) => p + Math.floor(Math.random() * 12));
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

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <>
      <div className="app">
        <div className="noise" />

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <div className="logo">ATYPIQUE_</div>
              <div className="logo-sub">KINETIC_BRUTALIST_INFRASTRUCTURE</div>
            </div>
            <nav className="nav-tabs">
              {['OVERVIEW', 'NODES', 'LOGS', 'ENCRYPTION'].map((tab) => (
                <button
                  key={tab}
                  className={`nav-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
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
        <main className="content">

          {/* STAT CARDS */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">NETWORK_UPTIME</div>
              <div className={`stat-value accent${glitch ? ' glitch' : ''}`}>{formatUptime(uptime)}</div>
              <div className="stat-sub">SESSION_ACTIVE</div>
              <div className="stat-delta up">↑ STABLE</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PACKETS_PROCESSED</div>
              <div className="stat-value">{packets.toLocaleString()}</div>
              <div className="stat-sub">DELTA_9 PROTOCOL</div>
              <div className="stat-delta up">↑ +12/s</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">NODES_ONLINE</div>
              <div className="stat-value warn">3 / 5</div>
              <div className="stat-sub">1 DEGRADED · 1 OFFLINE</div>
              <div className="stat-delta down">↓ DEGRADED</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">AUTH_FAILURES</div>
              <div className="stat-value danger">7</div>
              <div className="stat-sub">LAST 24H WINDOW</div>
              <div className="stat-delta down">↑ +3</div>
            </div>
          </div>

          {/* MID ROW */}
          <div className="mid-row">
            {/* ACTIVITY */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">RECENT_ACTIVITY</span>
                <button className="panel-action">VIEW_ALL →</button>
              </div>
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>TXN_ID</th>
                    <th>TYPE</th>
                    <th>NODE</th>
                    <th>STATUS</th>
                    <th>TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {mockActivity.map((row) => (
                    <tr key={row.id}>
                      <td style={{ color: '#aaa' }}>{row.id}</td>
                      <td>{row.type}</td>
                      <td style={{ color: '#aaff00', opacity: 0.7 }}>{row.node}</td>
                      <td>
                        <span className={`status-badge ${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NODE STATUS */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">NODE_STATUS</span>
                <button className="panel-action">REFRESH</button>
              </div>
              <div className="node-list">
                {nodes.map((node) => (
                  <div className="node-row" key={node.id}>
                    <div className={`node-dot ${node.status.toLowerCase()}`} />
                    <div className="node-id">{node.id}</div>
                    <div className="node-bar-wrap">
                      <div
                        className={`node-bar-fill${node.status === 'DEGRADED' ? ' warn' : node.status === 'OFFLINE' ? ' off' : ''}`}
                        style={{ width: `${node.load}%` }}
                      />
                    </div>
                    <div className="node-pct">{node.load}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="bottom-row">
            {/* THROUGHPUT CHART */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">THROUGHPUT_24H</span>
                <button className="panel-action">EXPORT</button>
              </div>
              <div className="mini-chart">
                <div className="chart-bars">
                  {[38, 55, 72, 48, 90, 65, 82, 44, 70, 58, 95, 61, 77, 50, 88, 42, 66, 79, 53, 84, 47, 91, 69, 75].map((h, i) => (
                    <div className="chart-bar" key={i} style={{ height: '100%' }}>
                      <div className="chart-bar-fill" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SYSTEM LOG */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">SYSTEM_LOG</span>
                <button className="panel-action">CLEAR</button>
              </div>
              <div className="log-list">
                {[
                  { t: '23:44:01', msg: 'AUTH_OK: OPERATOR_01 verified', cls: 'ok' },
                  { t: '23:43:55', msg: 'SYNC: NODE_12 latency elevated', cls: 'warn' },
                  { t: '23:43:48', msg: 'WRITE: NODE_03 — 2.1MB committed', cls: '' },
                  { t: '23:43:32', msg: 'ERR: NODE_99 connection timeout', cls: 'err' },
                  { t: '23:43:10', msg: 'AUTH_OK: OPERATOR_01 session renewed', cls: 'ok' },
                ].map((entry, i) => (
                  <div className="log-entry" key={i}>
                    <div className="log-time">{entry.t}</div>
                    <div className={`log-msg ${entry.cls}`}>{entry.msg}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ENCRYPTION PANEL */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">ENCRYPTION_STATUS</span>
              </div>
              <div className="enc-grid">
                <div className="enc-item">
                  <div className="enc-label">PROTOCOL</div>
                  <div className="enc-val">DELTA-9</div>
                </div>
                <div className="enc-item">
                  <div className="enc-label">CIPHER</div>
                  <div className="enc-val">AES-256</div>
                </div>
                <div className="enc-item">
                  <div className="enc-label">KEY_ROTATION</div>
                  <div className="enc-val">04:12:33</div>
                </div>
                <div className="enc-item">
                  <div className="enc-label">INTEGRITY</div>
                  <div className="enc-val">SHA-512</div>
                </div>
                <div className="enc-item" style={{ gridColumn: '1/-1' }}>
                  <div className="enc-label">TUNNEL_STATUS</div>
                  <div className="enc-val">ACTIVE · SECURED</div>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-copy">©2024 KINETIC_BRUTALIST_INFRASTRUCTURE · GEO_LOC: [REDACTED]</span>
          <div className="footer-right">
            <a className="footer-link">PROTOCOL</a>
            <a className="footer-link">TERMINAL</a>
            <a className="footer-link">ENCRYPTION</a>
          </div>
        </footer>
      </div>
    </>
  );
}