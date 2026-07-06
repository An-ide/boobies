import React from 'react';
import { Link } from 'react-router-dom';

const PolicyPage = ({ title, children }) => (
  <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px 60px' }}>
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', textDecoration: 'none', marginBottom: 24 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </Link>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 24px', letterSpacing: '-0.03em' }}>{title}</h1>
    <div style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

const LastUpdated = () => (
  <p style={{ fontSize: 13, color: '#aaa', marginTop: 32, borderTop: '1px solid #eee', paddingTop: 20 }}>Last updated: July 2026</p>
);

export { PolicyPage, LastUpdated };
