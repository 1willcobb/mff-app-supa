// src/api/api.client.ts
import axios, { AxiosRequestConfig } from 'axios';
import { getItem, saveItem, removeItem } from './storage';
import { Alert, Platform } from 'react-native';

const API_URL = 'https://localhost:3000'; // Replace with your API URL
const SESSION_KEY = 'user_session';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Platform': Platform.OS
  },
  timeout: 10000 // 10 seconds timeout
});

// Token management
export const saveSession = async (sessionId: string): Promise<void> => {
  await saveItem(SESSION_KEY, sessionId);
};

export const getSession = async (): Promise<string | null> => {
  return await getItem(SESSION_KEY);
};

export const clearSession = async (): Promise<void> => {
  await removeItem(SESSION_KEY);
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const sessionId = await getSession();
    if (sessionId) {
      config.headers['Authorization'] = `Bearer ${sessionId}`;
    }
    
    // Add network info or device info if needed
    // config.headers['Device-ID'] = await getDeviceId();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Network Error',
          'Unable to connect to the server. Please check your internet connection.'
        );
      }
      return Promise.reject(new Error('Network error'));
    }
    
    // Handle unauthorized errors (401)
    if (error.response.status === 401) {
      await clearSession();
      // You could trigger navigation to login screen here
      // or use an event emitter to handle this globally
    }
    
    // Handle server errors (500)
    if (error.response.status >= 500) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Server Error',
          'Something went wrong on our end. Please try again later.'
        );
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;