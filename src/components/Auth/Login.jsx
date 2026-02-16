import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in</h1>
          <p className="auth-subtitle">to continue to your account</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              required
              placeholder="Email address"
              className={touched.email && !formData.email ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={() => handleBlur('password')}
              required
              placeholder="Password"
              className={touched.password && !formData.password ? 'error' : ''}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
          <Link to="/" className="back-link">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;