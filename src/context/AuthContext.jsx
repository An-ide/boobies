import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    if (userData) {
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = async (userData) => {
    const result = await registerUser(userData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
      window.history.go(1);
    };
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};