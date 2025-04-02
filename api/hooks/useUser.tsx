// src/api/hooks/useUser.ts
import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { userService } from "../services/userService";
import { saveSession, clearSession } from "../auth/api.client";
import { User, UserCredentials, UserRegistration } from "../types/user.types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: UserCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.login(credentials);
      await saveSession(response.sessionId);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: UserRegistration) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.register(data);
      await saveSession(response.sessionId);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Try to call the logout endpoint but don't block on failure
      try {
        await userService.logout();
      } catch (e) {
        console.warn("Logout API call failed, continuing with local logout");
      }

      await clearSession();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await userService.getProfile();
      setUser(userData);
      return userData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchProfile,
  };
}
