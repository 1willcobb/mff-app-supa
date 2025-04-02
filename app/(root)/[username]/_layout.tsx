import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserLayout = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>UserLayout {username}</Text>
    </View>
  );
};

export default UserLayout;
