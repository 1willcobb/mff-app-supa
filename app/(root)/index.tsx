import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useAuth } from "@/context/authContext"; // Import your AuthProvider
import explore from "@/app/(root)/(tabs)/explore";
import SignIn from "@/app/sign-in";

const Stack = createStackNavigator();

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // You can replace this with a loading spinner
  }

  return (
    <View className="flex flex-col h-full bg-white">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Explore" component={explore} />
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </View>
  );
}
