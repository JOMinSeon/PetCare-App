import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = ''; // TODO: Get from storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const petService = {
  getPets: () => api.get('/pets'),
  getPet: (id) => api.get(`/pets/${id}`),
  createPet: (data) => api.post('/pets', data),
};

export const healthService = {
  getMetrics: (params) => api.get('/health-metrics', { params }),
  createMetric: (data) => api.post('/health-metrics', data),
  getStats: (params) => api.get('/health-metrics/stats', { params }),
};

export const dietService = {
  getLogs: (params) => api.get('/diet-logs', { params }),
  createLog: (data) => api.post('/diet-logs', data),
};

export const activityService = {
  getLogs: (params) => api.get('/activity-logs', { params }),
  createLog: (data) => api.post('/activity-logs', data),
};

export const dashboardService = {
  getDashboard: () => api.get('/users/dashboard'),
};

export default api;
