import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const stats = [
    { label: 'Total Products', value: '124', icon: '📦', color: '#4f46e5' },
    { label: 'Total Orders', value: '289', icon: '📋', color: '#10b981' },
    { label: 'Total Users', value: '542', icon: '👥', color: '#f59e0b' },
    { label: 'Revenue', value: '$45,289', icon: '💰', color: '#ef4444' },
  ];

  const adminModules = [
    {
      id: 'products',
      title: 'Product Management',
      icon: '📦',
      description: 'Add, edit, and manage products',
      path: '/admin/products'
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: '📋',
      description: 'View, process, and track orders',
      path: '/admin/orders'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: '👥',
      description: 'Manage customers and permissions',
      path: '/admin/users'
    },
    {
      id: 'store',
      title: 'Back to Store',
      icon: '🏪',
      description: 'Return to main website',
      path: '/'
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="greeting">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, <strong>{user?.name}</strong> 👋</p>
          </div>
          <button 
            className="logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="modules-section">
        <h2>Quick Access</h2>
        <div className="modules-grid">
          {adminModules.map(module => (
            <Link 
              key={module.id} 
              to={module.path} 
              className="module-card"
            >
              <div className="module-icon">{module.icon}</div>
              <div className="module-content">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <div className="module-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">➕</div>
            <div className="activity-text">
              <span>New product added: "Premium Running Shoes"</span>
              <small>2 minutes ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-text">
              <span>Order #ORD-005 has been shipped</span>
              <small>1 hour ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-text">
              <span>New user registered: john.doe@email.com</span>
              <small>3 hours ago</small>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;