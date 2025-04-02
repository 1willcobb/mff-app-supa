// app/_layout.tsx (or .js)

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider } from "@/api/auth/authContext"; // Import your AuthProvider

// --- Import global styles ---
import "./global.css";
import Index from "./(root)";
import { Button } from "react-native";

// --- Modified Root Layout Component ---
export default function RootLayout() {
  const router = useRouter();
  return (
    // Wrap everything with the AuthProvider
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="(root)/index" options={{ headerTitle: "home", headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
