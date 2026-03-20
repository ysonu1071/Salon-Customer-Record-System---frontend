import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('salon_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      localStorage.setItem('salon_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('salon_auth_user');
    }
  }, [user]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      setUser(data);
      showNotification('Registration successful!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data);
      showNotification('Login successful!');
      return true;
    } catch (error) {
      showNotification(error.response?.data?.message || 'Invalid email or password', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, register, login, logout,
      notification, showNotification, closeNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
};


