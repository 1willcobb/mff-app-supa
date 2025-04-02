// src/api/auth/authContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import apiClient from "./api.client";
import { 
  startSession, 
  endSession, 
  restoreSession, 
  getCurrentUser, 
  updateUserData 
} from "./sessionManager";
import { User, UserCredentials, UserRegistration, AuthResponse } from "../types";
import { router } from "expo-router";

// Define the Auth Context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (data: UserRegistration) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Define the Auth Context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (data: UserRegistration) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user session on app start
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const sessionActive = await restoreSession();
        
        if (sessionActive) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", { 
        email, 
        password 
      });

      if (response.data.user && response.data.sessionId) {
        await startSession(response.data);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: UserRegistration): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<AuthResponse>("/auth/signup", data);

      if (response.data.user && response.data.sessionId) {
        await startSession(response.data);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await endSession();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
      router.push("/sign-in"); // Redirect to sign-in page
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      // Make API call to update user data on the server
      const response = await apiClient.put<User>(`/user/id/${user.id}`, userData);
      
      // Update local user data
      const updatedUser = { ...user, ...response.data };
      await updateUserData(updatedUser);
      setUser(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};