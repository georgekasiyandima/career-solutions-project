import axios from 'axios';
import {API_BASE_URL, API_ENDPOINTS} from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_range: string;
  job_type: string;
  experience_level: string;
  skills: string[];
  benefits: string[];
  contact_email: string;
  contact_phone: string;
  application_deadline: string;
  status: 'active' | 'inactive' | 'filled';
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  location?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  skills?: string[];
  company?: string;
  status?: string;
}

export interface JobApplication {
  job_id: number;
  cover_letter: string;
  resume_url?: string;
  portfolio_url?: string;
  references?: string[];
}

export const jobService = {
  getJobs: async (filters?: JobFilters, page = 1, limit = 10) => {
    const params = {page, limit, ...filters};
    const response = await api.get(API_ENDPOINTS.JOBS, {params});
    return response.data;
  },

  getJob: async (id: number) => {
    const response = await api.get(API_ENDPOINTS.JOB_DETAILS.replace(':id', id.toString()));
    return response.data;
  },

  applyForJob: async (jobId: number, application: JobApplication) => {
    const response = await api.post(
      API_ENDPOINTS.APPLY_JOB.replace(':id', jobId.toString()),
      application
    );
    return response.data;
  },

  saveJob: async (jobId: number) => {
    const response = await api.post(API_ENDPOINTS.SAVE_JOB.replace(':id', jobId.toString()));
    return response.data;
  },

  unsaveJob: async (jobId: number) => {
    const response = await api.delete(API_ENDPOINTS.SAVE_JOB.replace(':id', jobId.toString()));
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved');
    return response.data;
  },

  getAppliedJobs: async () => {
    const response = await api.get('/jobs/applied');
    return response.data;
  },

  searchJobs: async (query: string, filters?: JobFilters) => {
    const params = {q: query, ...filters};
    const response = await api.get(API_ENDPOINTS.SEARCH_JOBS, {params});
    return response.data;
  },

  getJobRecommendations: async () => {
    const response = await api.get('/jobs/recommendations');
    return response.data;
  },

  getJobStats: async () => {
    const response = await api.get('/jobs/stats');
    return response.data;
  },
}; 