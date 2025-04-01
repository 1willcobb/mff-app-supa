import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Your backend URL
// For iOS simulator: typically http://localhost:PORT
// For Android emulator: typically http://10.0.2.2:PORT
// Use your machine's network IP if testing on a physical device on the same network
const API_BASE_URL = 'http://localhost:3000/api'; // CHANGE PORT IF NEEDED
const SESSION_ID_KEY = 'userSessionId'; // Key for storing session ID

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Request Interceptor ---
// Add the session ID to outgoing requests if available
apiClient.interceptors.request.use(
  async (config) => {
    const sessionId = await SecureStore.getItemAsync(SESSION_ID_KEY);
    if (sessionId) {
      // Add the session ID as a Cookie header
      // The default cookie name for express-session is 'connect.sid'
      // Ensure this matches if you changed the 'name' option in express-session config
      config.headers['Cookie'] = `connect.sid=${sessionId}`;
      console.log('Attaching session cookie:', `connect.sid=${sessionId}`);
    } else {
        console.log('No session ID found in storage.');
    }
    // You might also need 'Content-Type' for POST/PUT requests
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Optional: Handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    console.error('API Error:', status, error.response?.data?.message);

    // If 401 Unauthorized, session likely expired or invalid
    if (status === 401 && !originalRequest._retry) { // Avoid retry loops
      console.log('Received 401 Unauthorized. Logging out.');
      originalRequest._retry = true; // Mark request to avoid retrying infinitely

      // --- Trigger Logout Logic ---
      // Clear stored session ID
      await SecureStore.deleteItemAsync(SESSION_ID_KEY);

      // You'll need a way to signal the UI to update
      // This often involves:
      // 1. Updating global state (React Context, Redux, Zustand etc.)
      // 2. Navigating the user to the Login screen
      // Example (using a hypothetical auth context):
      // authContext.logout(); // This function would handle state updates & navigation

      // You might want to inform the user
      alert('Your session has expired. Please log in again.');

      // Reject the promise to prevent the original calling function from proceeding
      return Promise.reject(error);
    }

    // For other errors, just pass them along
    return Promise.reject(error);
  }
);


// --- Helper function to save session ---
export const saveSession = async (sessionId: any) => {
  try {
    await SecureStore.setItemAsync(SESSION_ID_KEY, sessionId);
    console.log('Session ID saved successfully.');
  } catch (error) {
    console.error('Failed to save session ID:', error);
  }
};

// --- Helper function to clear session ---
export const clearSession = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_ID_KEY);
    console.log('Session ID cleared successfully.');
  } catch (error) {
    console.error('Failed to clear session ID:', error);
  }
};

// --- Helper function to check if session exists (on app start) ---
export const getSession = async () => {
    try {
        return await SecureStore.getItemAsync(SESSION_ID_KEY);
    } catch (error) {
        console.error('Failed to get session ID:', error);
        return null;
    }
}


export default apiClient;