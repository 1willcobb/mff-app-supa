import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const User = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>User {username}</Text>
    </View>
  );
};

export default User;
