import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserStats = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>UserStats {username}</Text>
    </View>
  );
};

export default UserStats;
