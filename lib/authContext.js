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
          const response = await apiClient.get("/user/login", {
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

  // signup function
  const signup = async (name, email, password, username) => {
    console.log("Signing up...");
    try {
      setIsLoading(true);
      const response = await apiClient.post("/user", { name, email, password, username });

      console.log("Signup response:", response);

      if (response.status === 200 && response.data.token) {
        await saveSession(response.data.token);
        if (response.data.user) {
          setAuthUser(response.data.user);
          setIsAuthenticated(true);
          console.log("User signed up successfully:", response.data.user);
          return response.data.user;
        }
      }
    } catch (error) {
      console.log("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  }


  // Login function
  const login = async (email, password) => {
    console.log("Logging in...");
    try {
      setIsLoading(true);
      const response = await apiClient.post("/user/verifylogin", { email, password });
      

      if (response.status === 200 && response.data.token) {
        await saveSession(response.data.token);
        if (response.data.user) {
          setAuthUser(response.data.user);
          setIsAuthenticated(true);
        }
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
    <AuthContext.Provider value={{ authUser, isAuthenticated, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
