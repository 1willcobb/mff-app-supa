// src/api/auth/tokenManager.ts
import { saveItem, getItem, removeItem } from './storage';
import axios from 'axios';

// Constants
const ACCESS_TOKEN_KEY = 'user_access_token';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Token Types
interface DecodedToken {
  exp: number;
  userId: string;
  username: string;
  role: string;
}

/**
 * Saves the access token to secure storage
 */
export const saveAccessToken = async (token: string): Promise<void> => {
  await saveItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Retrieves the access token from secure storage
 */
export const getAccessToken = async (): Promise<string | null> => {
  return await getItem(ACCESS_TOKEN_KEY);
};

/**
 * Removes the access token from secure storage
 */
export const removeAccessToken = async (): Promise<void> => {
  await removeItem(ACCESS_TOKEN_KEY);
};

/**
 * Checks if the current token is valid (exists and not expired)
 */
export const isTokenValid = async (): Promise<boolean> => {
  const token = await getAccessToken();
  
  if (!token) {
    return false;
  }
  
  try {
    // Simple expiration check if the token is a JWT
    // This is a basic check without a library to keep dependencies minimal
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload) as DecodedToken;
    
    // Check if token is expired (with a 10-second buffer)
    return decoded.exp * 1000 > Date.now() + 10000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

/**
 * Attempts to refresh the access token using the refresh endpoint
 * Note: This requires your backend to support token refresh
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return null;
    }
    
    // Call your refresh token endpoint
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.accessToken) {
      await saveAccessToken(response.data.accessToken);
      return response.data.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    await removeAccessToken();
    return null;
  }
};