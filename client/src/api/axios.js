import axios from 'axios';
import toast from 'react-hot-toast';
import i18n from '../i18n/config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method === 'get') {
      const currentLanguage = i18n.language || 'en';
      config.params = {
        ...config.params,
        lang: currentLanguage
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;