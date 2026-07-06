import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const Icons = {
  Package: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  ShoppingBag: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Dollar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Grid: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  Truck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/>
      <line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const stats = [
    { label: 'Total Products', value: '124', icon: <Icons.Package />, color: '#4f46e5', bgColor: '#eef2ff' },
    { label: 'Total Orders', value: '289', icon: <Icons.ShoppingBag />, color: '#059669', bgColor: '#ecfdf5' },
    { label: 'Total Users', value: '542', icon: <Icons.Users />, color: '#d97706', bgColor: '#fffbeb' },
    { label: 'Revenue', value: '$45,289', icon: <Icons.Dollar />, color: '#dc2626', bgColor: '#fef2f2' },
  ];

  const adminModules = [
    {
      id: 'products',
      title: 'Product Management',
      icon: <Icons.Grid />,
      description: 'Add, edit, and manage products',
      path: '/admin/products'
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: <Icons.ShoppingBag />,
      description: 'View, process, and track orders',
      path: '/admin/orders'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: <Icons.Users />,
      description: 'Manage customers and permissions',
      path: '/admin/users'
    },
    {
      id: 'store',
      title: 'Back to Store',
      icon: <Icons.ArrowRight />,
      description: 'Return to main website',
      path: '/'
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dash-header">
        <div className="admin-dash-header-left">
          <div className="admin-dash-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1>Admin Dashboard</h1>
            <p className="admin-dash-greeting">Welcome back, <strong>{user?.name}</strong></p>
          </div>
        </div>
        <button
          className="admin-dash-logout-btn"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <Icons.LogOut />
          Sign Out
        </button>
      </div>

      <div className="admin-dash-stats">
        {stats.map((stat, index) => (
          <div key={index} className="admin-dash-stat-card">
            <div className="admin-dash-stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-dash-stat-body">
              <span className="admin-dash-stat-value">{stat.value}</span>
              <span className="admin-dash-stat-label">{stat.label}</span>
            </div>
            <div className="admin-dash-stat-trend" style={{ background: stat.bgColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span style={{ color: stat.color }}>+12%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dash-section">
        <h2>Quick Access</h2>
        <div className="admin-dash-modules">
          {adminModules.map(module => (
            <Link
              key={module.id}
              to={module.path}
              className="admin-dash-module-card"
            >
              <div className="admin-dash-module-icon">
                {module.icon}
              </div>
              <div className="admin-dash-module-body">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <div className="admin-dash-module-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-dash-section">
        <h2>Recent Activity</h2>
        <div className="admin-dash-activity">
          <div className="admin-dash-activity-item">
            <div className="admin-dash-activity-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Icons.Plus />
            </div>
            <div className="admin-dash-activity-body">
              <span>New product added: "Premium Running Shoes"</span>
              <small>2 minutes ago</small>
            </div>
          </div>
          <div className="admin-dash-activity-item">
            <div className="admin-dash-activity-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Icons.Truck />
            </div>
            <div className="admin-dash-activity-body">
              <span>Order #ORD-005 has been shipped</span>
              <small>1 hour ago</small>
            </div>
          </div>
          <div className="admin-dash-activity-item">
            <div className="admin-dash-activity-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Icons.UserPlus />
            </div>
            <div className="admin-dash-activity-body">
              <span>New user registered: john.doe@email.com</span>
              <small>3 hours ago</small>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="admin-dash-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="admin-dash-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-dash-modal-icon">
              <Icons.LogOut />
            </div>
            <h3>Confirm Sign Out</h3>
            <p>Are you sure you want to sign out of the admin panel?</p>
            <div className="admin-dash-modal-actions">
              <button
                className="admin-dash-modal-btn admin-dash-modal-btn--secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="admin-dash-modal-btn admin-dash-modal-btn--primary"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
