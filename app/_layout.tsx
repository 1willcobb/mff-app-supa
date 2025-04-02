import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/api/auth/authContext"; // Import your AuthProvider

// --- Import global styles ---
import "./global.css";
import { TouchableOpacity } from "react-native";
import LogoutButton from "@/components/logoutButton";

// --- Modified Root Layout Component ---
export default function RootLayout() {

  return (
    // Wrap everything with the AuthProvider
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen
            name="(root)/index"
            options={{ headerTitle: "home", headerShown: false }}
          />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
        <LogoutButton />
      </ThemeProvider>
    </AuthProvider>
  );
}
