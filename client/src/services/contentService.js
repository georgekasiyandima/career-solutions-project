import api from '../config/api';

export const contentService = {
  getAll: () => api.get('/api/content'),
  getSeoReport: (id) => api.get(`/api/content/${id}/seo-report`),
  update: (id, data) => api.put(`/api/content/${id}`, data),
  delete: (id) => api.delete(`/api/content/${id}`),
}; 