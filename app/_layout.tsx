// app/_layout.tsx (or .js)

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Or react-native-keychain
import { Text } from 'react-native'; // Adjust based on your UI library

// --- Import your API client and storage helpers ---
// Adjust the path based on your project structure
import apiClient, { getSession, saveSession, clearSession } from '@/api.client';

// --- Import a loading component ---
// Adjust the path based on your project structure
let LoadingIndicator = console.log("LoadingIndicator not implemented, using console.log");

// --- Import global styles ---
import "./global.css";

// --- Define TypeScript Types (Optional but Recommended) ---
interface User {
  id: string;
  email: string;
  username: string;
  // Add other user properties you need
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (sessionId: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

// --- Create Auth Context ---
const AuthContext = createContext<AuthContextType | null>(null);

// --- Custom Hook to use Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Auth Provider Component ---
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // Expo Router hooks for navigation logic
  const segments = useSegments(); // Gets the current route segments, e.g., ['(app)', 'home']
  const router = useRouter();   // Hook for programmatic navigation

  // --- Check Authentication Status on App Load ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); // Ensure loading is true at the start
      try {
        const sessionId = await getSession(); // Check secure storage
        if (sessionId) {
          console.log('AuthProvider: Found session ID, validating...');
          // Validate session by fetching user profile
          // Assumes apiClient has interceptor to add the session ID header
          try {
            const response = await apiClient.get<User>('/profile/me'); // Expect User type
            if (response.status === 200 && response.data) {
              console.log('AuthProvider: Session valid.');
              setUser(response.data);
              setIsAuthenticated(true);
            } else {
               // Should be caught by 401 interceptor typically
              console.log('AuthProvider: Session validation returned non-200.');
              await clearSession(); // Clean up invalid stored session
              setIsAuthenticated(false);
              setUser(null);
            }
          } catch (error: any) {
            // Likely a 401 Unauthorized or network error
            // The Axios interceptor should ideally handle 401s and call clearSession
            console.log('AuthProvider: Session validation API error:', error.message);
            setIsAuthenticated(false);
            setUser(null);
             // Explicitly clear session here if interceptor might not have run (e.g. network error)
            if (error.response?.status !== 401) { // Avoid double-clearing if interceptor did it
                await clearSession();
            }
          }
        } else {
          console.log('AuthProvider: No session ID found in storage.');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Error during initial auth check:', error);
        setIsAuthenticated(false); // Ensure false state on error
        setUser(null);
      } finally {
        console.log("AuthProvider: Auth check finished.");
        setIsLoading(false); // Finished loading
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Navigation Effect ---
  // This effect runs when auth state or route segments change to handle redirection
  useEffect(() => {
    if (isLoading) {
      return; // Don't navigate until the auth check is complete
    }

    const inAuthGroup = segments[0] === '(auth)'; // Are we in auth routes like /login?

    console.log(`AuthProvider Nav Check: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, inAuthGroup=${inAuthGroup}, segments=${segments}`);

    if (!isAuthenticated && !inAuthGroup) {
      // If not logged in AND not already in the auth section, redirect to login
      console.log('AuthProvider: Redirecting to login screen.');
      router.replace('/sign-in'); // Adjust to your login route
    } else if (isAuthenticated && inAuthGroup) {
      // If logged in AND somehow in the auth section (e.g., pressed back button after login), redirect to main app
      console.log('AuthProvider: Redirecting to app home screen.');
      router.replace('/'); // Adjust to your main app route (e.g., '/(app)/home' or '/')
    }
     // If isAuthenticated && !inAuthGroup -> do nothing, user is logged in and in the app
     // If !isAuthenticated && inAuthGroup -> do nothing, user is logged out and in the auth section

  }, [isAuthenticated, isLoading, segments, router]); // Re-run when these change


  // --- Memoized Auth Functions ---
  const login = useMemo(() => async (sessionId: string, userData: User) => {
    await saveSession(sessionId);
    setUser(userData);
    setIsAuthenticated(true);
    // Navigation will be handled by the useEffect above
    // Optionally force navigation: router.replace('/');
    console.log("AuthProvider: User logged in.");
  }, [router]); // Include router if you add explicit navigation here

  const logout = useMemo(() => async () => {
     console.log("AuthProvider: Logging out...");
     // Optional: Call backend logout endpoint - errors likely handled by interceptor
     try { await apiClient.post('/auth/logout'); } catch (e) { console.warn("Backend logout failed:", e) }
    await clearSession();
    setUser(null);
    setIsAuthenticated(false);
     // Navigation will be handled by the useEffect above
     // Optionally force navigation: router.replace('/(auth)/login');
     console.log("AuthProvider: User logged out.");
  }, [router]); // Include router if you add explicit navigation here

  // Provide the auth state and functions to the children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Modified Root Layout Component ---
export default function RootLayout() {
  return (
    // Wrap everything with the AuthProvider
    <AuthProvider>
      {/* Use a helper component to access context AFTER provider is mounted */}
      <LayoutContent />
    </AuthProvider>
  );
}

// --- Helper Component to Consume Context ---
function LayoutContent() {
  const { isLoading } = useAuth(); // Consume the context here

  if (isLoading) {
    // Show loading indicator while checking session
    return <Text>Loading...</Text>; // Replace with your LoadingIndicator component
  }

  // Once loading is complete, render the main navigation stack
  // The AuthProvider's useEffect will handle redirection logic
  return (
      <Stack screenOptions={{ headerShown: false }}>
          {/* Define your screen groups */}
          {/* Expo router uses these to determine which layout file applies */}
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Add other top-level screens like modals if needed */}
          {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
  );
}