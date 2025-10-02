import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Get Salesforce access token
  getToken: async () => {
    try {
      const response = await api.post('/auth/get-token');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get access token');
    }
  },

  // Login user with email/password
  login: async (email, password, accessToken) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        accessToken
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }
};

export default api;
