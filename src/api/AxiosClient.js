import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('📤 Request to:', config.url, '| Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.warn('🔑 Token expired, redirecting to login');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden - Token validation failed or insufficient permissions');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
