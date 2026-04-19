import api from '../api/client';

export const reminderService = {
  getAll: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },
  create: async (reminderData) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },
  update: async (id, reminderData) => {
    const response = await api.put(`/reminders/${id}`, reminderData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.put(`/reminders/${id}/complete`);
    return response.data;
  },
};

export const appointmentService = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },
};

export default { reminderService, appointmentService };