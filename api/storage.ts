// src/api/storage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export async function saveItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem(key, value);
    }
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      return await AsyncStorage.getItem(key);
    }
  }
  
  return null;
}

export async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.removeItem(key);
    }
  }
}