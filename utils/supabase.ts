// import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a custom storage object that handles SSR gracefully
const ExpoStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      // During SSR, AsyncStorage might throw
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // No-op during SSR
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // No-op during SSR
    }
  }
};

// We need to create the client lazily to avoid SSR issues
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Function to get or create the Supabase client
export const getSupabase = () => {
  if (supabaseClient === null) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: ExpoStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,  // Changed from detectSessionUrl to the correct property name
      },
    });
  }
  
  return supabaseClient;
};

// Default export for backward compatibility
export default getSupabase();

// Custom hook to use Supabase safely in components
export const useSupabaseClient = () => {
  const [client, setClient] = React.useState<ReturnType<typeof createClient> | null>(null);
  
  React.useEffect(() => {
    // Only run on the client side
    setClient(getSupabase());
  }, []);
  
  return client;
};