import api from '../api/client';

export const healthMetricService = {
  getByPetId: async (petId, options = {}) => {
    const params = new URLSearchParams({ petId, ...options }).toString();
    const response = await api.get(`/health-metrics?${params}`);
    return response.data;
  },
  create: async (metricData) => {
    const response = await api.post('/health-metrics', metricData);
    return response.data;
  },
  getRecent: async (petId, limit = 10) => {
    const response = await api.get(`/health-metrics/recent/${petId}?limit=${limit}`);
    return response.data;
  },
};

export const dietLogService = {
  getByPetId: async (petId, options = {}) => {
    const params = new URLSearchParams({ petId, ...options }).toString();
    const response = await api.get(`/diet-logs?${params}`);
    return response.data;
  },
  create: async (dietData) => {
    const response = await api.post('/diet-logs', dietData);
    return response.data;
  },
  getDaily: async (petId, date) => {
    const response = await api.get(`/diet-logs/daily/${petId}?date=${date}`);
    return response.data;
  },
};

export const activityLogService = {
  getByPetId: async (petId, options = {}) => {
    const params = new URLSearchParams({ petId, ...options }).toString();
    const response = await api.get(`/activity-logs?${params}`);
    return response.data;
  },
  create: async (activityData) => {
    const response = await api.post('/activity-logs', activityData);
    return response.data;
  },
  getWeekly: async (petId) => {
    const response = await api.get(`/activity-logs/weekly/${petId}`);
    return response.data;
  },
};

export const medicalHistoryService = {
  getByPetId: async (petId) => {
    const response = await api.get(`/medical-history?petId=${petId}`);
    return response.data;
  },
  create: async (recordData) => {
    const response = await api.post('/medical-history', recordData);
    return response.data;
  },
};

export const healthAlertService = {
  getByPetId: async (petId) => {
    const response = await api.get(`/health-alerts?petId=${petId}`);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/health-alerts/${id}/read`);
    return response.data;
  },
  resolve: async (id) => {
    const response = await api.put(`/health-alerts/${id}/resolve`);
    return response.data;
  },
};

export default {
  healthMetricService,
  dietLogService,
  activityLogService,
  medicalHistoryService,
  healthAlertService,
};