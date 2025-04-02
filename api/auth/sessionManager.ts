// src/api/auth/sessionManager.ts
import { saveItem, getItem, removeItem } from './storage';
import { saveAccessToken, removeAccessToken, isTokenValid, refreshToken } from './tokenManager';
import apiClient from './api.client';
import { User, AuthResponse } from '../types';

// Constants
const USER_DATA_KEY = 'user_data';
const SESSION_TIMESTAMP_KEY = 'session_last_active';

/**
 * Initiates a new user session 
 * Stores user data and token after successful login/signup
 */
export const startSession = async (response: AuthResponse): Promise<void> => {
  try {
    // Save the session token
    await saveAccessToken(response.sessionId);
    
    // Save user data
    await saveItem(USER_DATA_KEY, JSON.stringify(response.user));
    
    // Set session timestamp
    await updateSessionTimestamp();
    
    console.log('Session started successfully');
  } catch (error) {
    console.error('Failed to start session:', error);
    throw new Error('Failed to start user session');
  }
};

/**
 * Ends the current user session (logout)
 */
export const endSession = async (): Promise<void> => {
  try {
    // Try to call the logout endpoint but don't block on failure
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn('Logout API call failed, continuing with local logout');
    }
    
    // Remove all session data regardless of API call success
    await removeAccessToken();
    await removeItem(USER_DATA_KEY);
    await removeItem(SESSION_TIMESTAMP_KEY);
    
    console.log('Session ended successfully');
  } catch (error) {
    console.error('Error during session cleanup:', error);
    throw new Error('Failed to properly end the session');
  }
};

/**
 * Retrieves the current user's data from storage
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await getItem(USER_DATA_KEY);
    if (!userData) return null;
    
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Updates user data in storage
 */
export const updateUserData = async (userData: User): Promise<void> => {
  await saveItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Checks if the user has an active session
 */
export const hasActiveSession = async (): Promise<boolean> => {
  const tokenValid = await isTokenValid();
  const user = await getCurrentUser();
  
  return tokenValid && user !== null;
};

/**
 * Updates the timestamp of the last session activity
 */
export const updateSessionTimestamp = async (): Promise<void> => {
  await saveItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
};

/**
 * Checks if the session is stale (inactive for too long)
 * @param maxAgeMinutes Maximum session age in minutes (defaults to 30 days)
 */
export const isSessionStale = async (maxAgeMinutes = 43200): Promise<boolean> => {
  const timestamp = await getItem(SESSION_TIMESTAMP_KEY);
  
  if (!timestamp) return true;
  
  const lastActive = parseInt(timestamp, 10);
  const now = Date.now();
  const maxAgeMs = maxAgeMinutes * 60 * 1000;
  
  return now - lastActive > maxAgeMs;
};

/**
 * Attempts to restore a previous session
 * Returns true if successful, false otherwise
 */
export const restoreSession = async (): Promise<boolean> => {
  try {
    // First check if we have a valid token
    const tokenValid = await isTokenValid();
    
    if (!tokenValid) {
      // Try to refresh the token if it's invalid
      const newToken = await refreshToken();
      if (!newToken) {
        return false;
      }
    }
    
    // Check if we have user data
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }
    
    // Check if the session is stale
    const isStale = await isSessionStale();
    if (isStale) {
      await endSession();
      return false;
    }
    
    // Update the session timestamp
    await updateSessionTimestamp();
    
    return true;
  } catch (error) {
    console.error('Error restoring session:', error);
    return false;
  }
};