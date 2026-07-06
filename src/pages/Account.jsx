import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const { user, isAdmin, logout } = useAuth();

  if (!user) {
    return (
      <div className="acct-page">
        <div className="acct-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Not signed in</h2>
          <p>Sign in to view your account details.</p>
          <Link to="/login" className="acct-btn">Sign In</Link>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
      title: 'My Orders',
      desc: 'View and track your orders',
      to: '/orders'
    },
    ...(isAdmin() ? [{
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
      title: 'Admin Dashboard',
      desc: 'Manage store and products',
      to: '/admin'
    }] : []),
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
      title: 'Help & Support',
      desc: 'Get help with your orders',
      to: '#'
    }
  ];

  return (
    <div className="acct-page">
      <div className="acct-profile-card">
        <div className="acpt-cover" />
        <div className="acpt-body">
          <div className="acpt-avatar-wrap">
            <div className="acct-avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            {user.role === 'admin' && <span className="acpt-badge">Admin</span>}
          </div>
          <h1>{user.name}</h1>
          <p className="acpt-email">{user.email}</p>
        </div>
      </div>

      <div className="acct-section-label">Quick Access</div>
      <div className="acct-grid">
        {quickLinks.map((link, i) => (
          <Link key={i} to={link.to} className="acct-card">
            <div className="acct-card-icon">{link.icon}</div>
            <div className="acct-card-body">
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="acct-arrow">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        ))}
      </div>

      <div className="acct-section-label">Account Details</div>
      <div className="acct-details-card">
        <div className="acct-detail-row">
          <span className="acct-detail-label">Full Name</span>
          <span className="acct-detail-value">{user.name}</span>
        </div>
        <div className="acct-detail-row">
          <span className="acct-detail-label">Email</span>
          <span className="acct-detail-value">{user.email}</span>
        </div>
        <div className="acct-detail-row">
          <span className="acct-detail-label">Account Type</span>
          <span className="acct-detail-value" style={{ textTransform: 'capitalize' }}>{user.role || 'User'}</span>
        </div>
        <div className="acct-detail-row">
          <span className="acct-detail-label">Member Since</span>
          <span className="acct-detail-value">2024</span>
        </div>
      </div>

      <button className="acct-logout" onClick={logout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>
  );
};

export default Account;
