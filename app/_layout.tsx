import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider } from "@/utils/authContext";

// --- Import global styles ---
import "./global.css";
import { TouchableOpacity, View } from "react-native";
import LogoutButton from "@/components/logoutButton";
import ControlBar from "@/components/ControlBar";

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
            options={{
              headerTitle: "home",
              headerShown: true,
              headerRight: () => <LogoutButton />,
            }}
          />
          <Stack.Screen name="sign-in" />
        </Stack>

        <ControlBar />
      </ThemeProvider>
   </AuthProvider>
  );
}
