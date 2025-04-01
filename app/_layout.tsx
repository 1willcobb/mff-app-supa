// app/_layout.tsx (or .js)

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from "@/context/authContext"; // Import your AuthProvider


// --- Import global styles ---
import "./global.css";
import Index from './(root)';


// --- Modified Root Layout Component ---
export default function RootLayout() {
  return (
    // Wrap everything with the AuthProvider
    <AuthProvider>
      {/* Use a helper component to access context AFTER provider is mounted */}
      <Index />
    </AuthProvider>
  );
}
