import React, { createContext, useContext, useState, useEffect } from 'react';
import { bankApi } from '../api/bankApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('apexbank_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('apexbank_user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await bankApi.login(email, password);
    setToken(data.token);
    setUser({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
    });
    localStorage.setItem('apexbank_token', data.token);
    localStorage.setItem('apexbank_user', JSON.stringify({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
    }));
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await bankApi.register(fullName, email, password);
    setToken(data.token);
    setUser({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
    });
    localStorage.setItem('apexbank_token', data.token);
    localStorage.setItem('apexbank_user', JSON.stringify({
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
    }));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('apexbank_token');
    localStorage.removeItem('apexbank_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
