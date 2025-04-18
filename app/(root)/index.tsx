import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";

import { useAuth } from "@/utils/authContext"; // Import your AuthProvider
import SignIn from "@/app/sign-in";
import Explore from "@/app/(root)/(tabs)/explore";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import ControlBar from "@/components/ControlBar";

const Stack = createStackNavigator();

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(); // Call the logout function from the auth context
    router.push("/sign-in"); // Redirect to the sign-in page
  };

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner
  }

  return (
    <View className="flex flex-col h-full bg-white">
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerRight() {
            const router = useRouter();
            return (
              <TouchableOpacity
                onPress={handleLogout}
                style={{ marginRight: 10 }}
              >
                logout
              </TouchableOpacity>
            );
          },
        }}
      >
        {user ? (
          <Stack.Screen
            name="./app/(root)/(tabs)/explore"
            component={Explore}
            options={{ headerTitle: "explore" }}
          />
        ) : (
          <Stack.Screen name="sign-in" component={SignIn} />
        )}
      </Stack.Navigator>
    </View>
  );
}
