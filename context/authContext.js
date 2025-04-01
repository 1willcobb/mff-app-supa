import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { saveSession } from "@/api.client"; // Adjust path

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on app start
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("sessionToken");

      if (token) {
        try {
          const response = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            setAuthUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log("Session expired or invalid.");
          await AsyncStorage.removeItem("sessionToken");
          setAuthUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/login", { email, password });

      if (response.status === 200 && response.data.token) {
        await saveSession(response.data.token);
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem("sessionToken");
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authUser, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
