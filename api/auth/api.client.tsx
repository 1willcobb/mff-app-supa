// src/api/api.client.tsx
import axios, { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { getAccessToken } from './tokenManager';

// Configure base API settings
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.11.169:3000/api'; // wills local computer

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Platform': Platform.OS
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add any other dynamic headers if needed
    // config.headers['Device-ID'] = await getDeviceId();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common error scenarios
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error - no server response');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle unauthorized errors (401)
    if (error.response.status === 401) {
      // This is handled by the Auth context in most cases
      // but you could emit an event here that other parts of the app can listen to
      console.warn('Unauthorized API request');
      // For example: EventEmitter.emit('auth:unauthorized');
    }
    
    // Handle server errors (500)
    if (error.response.status >= 500) {
      console.error('Server error', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;