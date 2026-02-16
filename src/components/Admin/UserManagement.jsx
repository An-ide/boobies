import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, updateUserStatus } from '../../utils/api';
import { LoadingSpinner } from '../Common';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'unblock' : 'block'} this user?`)) {
      return;
    }

    try {
      await updateUserStatus(userId, newStatus);
      await loadUsers();
      alert(`User ${newStatus ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && user.isActive) || 
      (filter === 'inactive' && !user.isActive);
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-management">
      <div className="admin-header">
        <h1>User Management</h1>
        <Link to="/admin" className="back-link">
          Back to Dashboard
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Blocked
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
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
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className={`status-btn ${user.isActive ? 'block' : 'unblock'}`}
                      onClick={() => handleStatusChange(user.id, user.isActive)}
                    >
                      {user.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;