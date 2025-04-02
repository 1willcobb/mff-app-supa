import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserStatsFollowing = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>
        UserStatsFollowing
        {username}
      </Text>
    </View>
  );
};

export default UserStatsFollowing;
