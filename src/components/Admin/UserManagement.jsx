import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, updateUserStatus } from '../../utils/api';
import { LoadingSpinner } from '../Common';
import './UserManagement.css';

const Icons = {
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Block: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  Unlock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/>
    </svg>
  ),
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTarget, setStatusTarget] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateUserStatus(statusTarget.id, !statusTarget.active);
      setStatusTarget(null);
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && user.isActive) ||
      (filter === 'inactive' && !user.isActive);
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="um">
      <div className="um-header">
        <div className="um-header-left">
          <Link to="/admin" className="um-back-btn">
            <Icons.ArrowLeft />
          </Link>
          <div>
            <h1>User Management</h1>
            <p className="um-header-sub">{users.length} registered users</p>
          </div>
        </div>
      </div>

      <div className="um-toolbar">
        <div className="um-search">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="um-filters">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              className={`um-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Blocked'}
            </button>
          ))}
        </div>
      </div>

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="um-user-cell">
                    <div className="um-user-avatar" style={{
                      background: user.role === 'admin'
                        ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                        : 'linear-gradient(135deg, #6b7280, #9ca3af)'
                    }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="um-user-name">{user.name}</span>
                  </div>
                </td>
                <td className="um-email-cell">{user.email}</td>
                <td>
                  <span className={`um-role-badge ${user.role}`}>
                    <Icons.Shield />
                    {user.role}
                  </span>
                </td>
                <td className="um-date-cell">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                </td>
                <td>
                  <span className={`um-status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td>
                  <button
                    className={`um-action-btn ${user.isActive ? 'block' : 'unblock'}`}
                    onClick={() => setStatusTarget({ id: user.id, active: user.isActive, name: user.name })}
                  >
                    {user.isActive ? <Icons.Block /> : <Icons.Unlock />}
                    {user.isActive ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <div className="um-empty">
          <p>No users match your search.</p>
        </div>
      )}

      {statusTarget && (
        <div className="um-overlay" onClick={() => setStatusTarget(null)}>
          <div className="um-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="um-confirm-icon" style={{ background: statusTarget.active ? '#fef2f2' : '#ecfdf5', color: statusTarget.active ? '#dc2626' : '#059669' }}>
              {statusTarget.active ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/>
                </svg>
              )}
            </div>
            <h3>{statusTarget.active ? 'Block User' : 'Unblock User'}</h3>
            <p>Are you sure you want to {statusTarget.active ? 'block' : 'unblock'} <strong>{statusTarget.name}</strong>?</p>
            <div className="um-confirm-actions">
              <button className="um-confirm-cancel" onClick={() => setStatusTarget(null)}>Cancel</button>
              <button className={`um-confirm-btn ${statusTarget.active ? 'block' : 'unblock'}`} onClick={handleStatusConfirm}>
                {statusTarget.active ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
