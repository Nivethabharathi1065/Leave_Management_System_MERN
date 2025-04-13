import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';

axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [authInfo, setAuthInfo] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    return { token, user, isAuthenticated: !!token };
  });

  useEffect(() => {
    if (authInfo.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authInfo.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authInfo.token]);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthInfo({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthInfo({ token: null, user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authInfo, login, logout }}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              authInfo.isAuthenticated ? (
                authInfo.user.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/employee" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee" element={
              authInfo.isAuthenticated && authInfo.user?.role === 'employee' ? 
                <EmployeeDashboard /> : <Navigate to="/login" />
            } />
            <Route path="/admin" element={
              authInfo.isAuthenticated && authInfo.user?.role === 'admin' ? 
                <AdminDashboard /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;