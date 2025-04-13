import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => API.post('/register', userData);
export const login = (credentials) => API.post('/login', credentials);
export const applyLeave = (leaveData) => API.post('/leaves', leaveData);
export const getEmployeeLeaves = () => API.get('/leaves/employee');
export const getAdminLeaves = (params) => API.get('/leaves/admin', { params });
export const updateLeaveStatus = (id, statusData) => API.patch(`/leaves/${id}`, statusData);