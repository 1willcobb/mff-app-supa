import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const saveSession = async (token: string) => {
  await SecureStore.setItemAsync("userToken", token);
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    if (response.status === 200 && response.data.token) {
      await saveSession(response.data.token);
    }
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const signUp = async (
  fullName: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/auth/signup", {
      fullName,
      username,
      email,
      password,
    });
    if (response.status === 201 && response.data.token) {
      await saveSession(response.data.token);
    }
    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export default apiClient;
