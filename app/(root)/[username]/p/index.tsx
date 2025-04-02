import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const userPosts = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>userPosts {username}</Text>
    </View>
  );
};

export default userPosts;
