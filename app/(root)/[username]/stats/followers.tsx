import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserStatsFollowers = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>
        UserStatsFollowers
        {username}
      </Text>
    </View>
  );
};

export default UserStatsFollowers;
