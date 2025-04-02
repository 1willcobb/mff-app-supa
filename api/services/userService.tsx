// src/api/services/userService.ts
import apiClient from '../api.client';
import { User, UserCredentials, UserRegistration } from '../types/user.types';

export const userService = {
  login: async (credentials: UserCredentials): Promise<{ user: User, sessionId: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: UserRegistration): Promise<{ user: User, sessionId: string }> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User>): Promise<User> => {
    // Handle image upload with form data if needed
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'avatar' && data.avatar?.uri) {
        formData.append('avatar', {
          uri: data.avatar.uri,
          type: 'image/jpeg',
          name: 'profile-image.jpg'
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    const response = await apiClient.patch('/profile/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  }
};