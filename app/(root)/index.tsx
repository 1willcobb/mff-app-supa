import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useAuth } from "@/api/auth/authContext"; // Import your AuthProvider
import SignIn from "@/app/sign-in";
import Explore from "@/app/(root)/(tabs)/explore";
import { useRouter } from "expo-router";

const Stack = createStackNavigator();

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return null; // You can replace this with a loading spinner
  }

  return (
    <View className="flex flex-col h-full bg-white">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
